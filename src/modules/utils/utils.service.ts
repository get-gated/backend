import * as crypto from 'crypto';

import * as jwt from 'jsonwebtoken';
import { SaveOptions, Storage } from '@google-cloud/storage';
import * as mimeTypes from 'mime-types';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Provider } from '@app/interfaces/service-provider/service-provider.enums';
import { ParticipantInterface } from '@app/interfaces/service-provider/participant.interface';
import { LoggerService } from '@app/modules/logger';

import AppConfig from '../../app.config';

interface DeconstructedEmail {
  username: string;
  domain: string;
}

interface JWTOptions {
  data: Record<string, unknown>;
  exp?: number;
}

// const NONE = / /;
const PLUS_ONLY = /\+.*$/;
const PLUS_AND_DOT = /\.|\+.*$/g;

const normalizeableProviders: Record<string, RegExp> = {
  [Provider.Google]: PLUS_AND_DOT,
  // [Provider.Outlook]: PLUS_ONLY,
  // [Provider.Exchange]: PLUS_ONLY,
  // [Provider.Yahoo]: NONE,
  // [Provider.Office365]: PLUS_ONLY,
};

const normalizeProviderAlias: Record<string, string> = {
  'googlemail.com': 'gmail.com',
};

const domainToProvider: Record<string, string> = {
  'gmail.com': Provider.Google,
  // 'outlook.com': Provider.Outlook,
  // 'yahoo.com': Provider.Yahoo,
};

@Injectable()
export class UtilsService {
  private cloudStorageUrl = 'https://storage.googleapis.com/';

  private basePath: string;

  constructor(
    @Inject(AppConfig.KEY) private appConfig: ConfigType<typeof AppConfig>,
    private log: LoggerService,
  ) {
    this.basePath = `${this.appConfig.public.protocol}://${this.appConfig.public.domain}`;

    const { apiBaseRoute } = this.appConfig;

    if (apiBaseRoute) {
      this.basePath += `/${apiBaseRoute}`;
    }
  }

  public deconstructEmailAddress(address: string): DeconstructedEmail {
    const parts = address.split('@');
    return { username: parts[0], domain: parts[1] };
  }

  public createHash(value: string): string {
    const md5sum = crypto.createHash('md5');
    md5sum.update(value);
    return md5sum.digest('hex');
  }

  public jwtSign(
    data: Record<string, unknown>,
    secret: string,
    expiration?: number,
  ): string {
    const jwtOptions: JWTOptions = {
      data,
    };

    if (typeof expiration === 'number') {
      jwtOptions.exp = expiration;
    }

    return jwt.sign(jwtOptions, secret);
  }

  public jwtVerify(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }

  public timeInMs(val: number): any {
    return {
      secs() {
        return val * 1000;
      },
      mins() {
        return val * 1000 * 60;
      },
      hrs() {
        return val * 1000 * 60 * 60;
      },
      days() {
        return val * 1000 * 60 * 60 * 24;
      },
    };
  }

  public formatCurrency(amountInCents: string | number): string {
    const num = Number(amountInCents) / 100;
    return new Intl.NumberFormat(`en-US`, {
      currency: `USD`,
      style: 'currency',
    }).format(num);
  }

  public apiUrl(pathname: string): URL {
    const url = new URL(`${this.basePath}/${pathname}`);
    return url;
  }

  public normalizeEmail(
    email: string,
    provider?: Provider,
  ): {
    username: string;
    domain: string;
    email: string;
    isCustomDomain: boolean;
  } {
    const normalized = email.toLowerCase();

    let [username, domain] = normalized.split(/@/);

    const aliasFor = normalizeProviderAlias[domain];
    if (aliasFor) {
      domain = aliasFor;
    }

    let regex;

    if (!provider) {
      const domainProvider = domainToProvider[domain];
      regex = normalizeableProviders[domainProvider];
    } else {
      regex = normalizeableProviders[provider];
    }

    if (!regex) {
      regex = PLUS_ONLY;
    }

    username = username.replace(regex, '');

    return {
      username,
      domain,
      email: `${username}@${domain}`,
      isCustomDomain: domain !== 'gmail.com', // todo: improve
    };
  }

  public isEmailInParticipants(
    // eslint-disable-next-line default-param-last
    participants: ParticipantInterface[] = [],
    emails: string[],
    provider: Provider,
  ): boolean {
    try {
      const norm = (item: string): string =>
        this.normalizeEmail(item, provider).email;
      const normList = participants.map((p) => norm(p.emailAddress));
      const normEmails = emails.map(norm);

      const intersection = normEmails.filter((item) => normList.includes(item));

      return intersection.length > 0;
    } catch (error) {
      this.log.warn(
        { error, participants, emails },
        'Unable to determine if email is in participants',
      );
      return false;
    }
  }

  public getAddressesFromParticipants(
    participants: ParticipantInterface[],
  ): string[] {
    return participants.map((item) => item.emailAddress);
  }

  public isPrivateEmailDomain(domain: string): boolean {
    // todo: make this better. Potentially something like: https://www.npmjs.com/package/free-email-domains
    return !(domainToProvider[domain] || normalizeProviderAlias[domain]);
  }

  private base64MimeType(encoded: string): string | null {
    let result = null;
    if (typeof encoded !== 'string') {
      return result;
    }
    const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mime && mime.length) {
      // eslint-disable-next-line prefer-destructuring
      result = mime[1];
    }
    return result;
  }

  private getExtensionByMimeType(mime: string): string | false {
    return mimeTypes.extension(mime);
  }

  public async uploadFile(
    base64: string,
    fileName: string,
    bucketPath: string,
  ): Promise<string> {
    const storage = new Storage();

    const bucketPathParts = bucketPath.split('/');
    const bucketName = bucketPathParts.shift();
    const bucket = storage.bucket(bucketName ?? '');
    const mime = this.base64MimeType(base64);
    const extension = this.getExtensionByMimeType(mime ?? '');
    const file = bucket.file(
      `${bucketPathParts.join('/')}/${fileName}.${extension}`,
    );

    const fileOptions: SaveOptions = {
      public: true,
      resumable: false,
      metadata: { contentType: mime },
      validation: false,
    };

    const base64EncodedString = base64.replace(/^data:\w+\/\w+;base64,/, '');
    const fileBuffer = Buffer.from(base64EncodedString, 'base64');
    await file.save(fileBuffer, fileOptions);

    return this.cloudStorageUrl.concat(bucketName ?? '', '/', file.name);
  }

  public isBase64(value: string): boolean {
    return value.substring(0, 5) === 'data:';
  }
}
