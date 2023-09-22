import * as crc32c from 'fast-crc32c';
import { KeyManagementServiceClient } from '@google-cloud/kms';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { LoggerService } from '../logger';

import { CryptoResponseCorrupted } from './errors';
import CryptoConfig from './crypto.config';

@Injectable()
export class CryptoService {
  constructor(
    private kmsClient: KeyManagementServiceClient,
    @Inject(CryptoConfig.KEY) private config: ConfigType<typeof CryptoConfig>,
    private log: LoggerService,
  ) {
    this.keyName = this.kmsClient.cryptoKeyPath(
      config.kms.projectId,
      config.kms.location,
      config.kms.keyRingId,
      config.kms.keyId,
    );
    this.cache = new Map<string, string>();
  }

  private readonly cache: Map<string, string>;

  private readonly keyName: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private checkCrc32c(
    compare: any,
    expectedValue: any,
    type: 'Encrypt' | 'Decrypt',
  ): void {
    if (crc32c.calculate(compare) !== Number(expectedValue)) {
      throw new CryptoResponseCorrupted(type);
    }
  }

  public async encrypt(plainText: string): Promise<string> {
    const plainTextBuffer = Buffer.from(plainText);

    if (!this.config.enabled) {
      return plainTextBuffer.toString('base64');
    }

    const plainTextCrc32c = crc32c.calculate(plainTextBuffer);
    const [encryptResponse] = await this.kmsClient.encrypt({
      name: this.keyName,
      plaintext: plainTextBuffer,
      plaintextCrc32c: {
        value: plainTextCrc32c,
      },
    });

    const cipherText = encryptResponse.ciphertext;

    if (!encryptResponse.verifiedPlaintextCrc32c) {
      throw new CryptoResponseCorrupted('Encrypt');
    }

    this.checkCrc32c(
      cipherText,
      encryptResponse.ciphertextCrc32c?.value,
      'Encrypt',
    );

    return Buffer.from(cipherText ?? '').toString('base64');
  }

  public async decrypt(cipherText: string, cache = true): Promise<string> {
    if (this.cache.has(cipherText)) {
      return this.cache.get(cipherText) as string;
    }
    const cipherBuffer = Buffer.from(cipherText, 'base64');
    if (!this.config.enabled) {
      return cipherBuffer.toString('utf8');
    }
    const cipherTextCrc32c = crc32c.calculate(cipherBuffer);

    let decryptResponse;
    try {
      [decryptResponse] = await this.kmsClient.decrypt({
        name: this.keyName,
        ciphertext: cipherBuffer,
        ciphertextCrc32c: {
          value: cipherTextCrc32c,
        },
      });
    } catch (error) {
      this.log.error(
        { keyName: this.keyName, error },
        `Error occurred while decrypting cipherText`,
      );
      throw error;
    }

    this.checkCrc32c(
      decryptResponse.plaintext,
      decryptResponse.plaintextCrc32c?.value,
      'Decrypt',
    );

    const result = Buffer.from(
      decryptResponse.plaintext?.toString() ?? '',
    ).toString('utf8');

    if (cache) {
      this.cache.set(cipherText, result);
    }

    return result;
  }
}
