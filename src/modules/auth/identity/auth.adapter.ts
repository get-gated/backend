// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response } from 'express';
import * as fbAdmin from 'firebase-admin';
import { auth } from 'firebase-admin';
// eslint-disable-next-line import/no-unresolved
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AuthCookie, Role } from '@app/modules/auth';
import AuthConfig from '@app/modules/auth/auth.config';
import { UserInterface } from '@app/interfaces/user/user.interface';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { LoggerService } from '@app/modules/logger';
import { ExpiredTokenException } from '@app/modules/auth/errors/token-expired.error';
import { AuthService } from '@app/modules/auth/auth.service';

import { Provider } from '../auth.enums';

import TenantAwareAuth = auth.TenantAwareAuth;

export interface AuthedUser {
  userId: string;
  roles: Role[];
  firstName: string;
  lastName: string;
}

export class BadOauthStateError extends RuntimeException {
  static code = 'BAD_OAUTH_STATE';

  constructor() {
    super('Bad OAuth State');
  }
}

export class AuthAdapter {
  private auth: TenantAwareAuth;

  constructor(
    private log: LoggerService,
    @Inject(AuthConfig.KEY) private config: ConfigType<typeof AuthConfig>,
    private authService: AuthService,
  ) {
    const options: fbAdmin.AppOptions = {};
    if (config.firebase.serviceAccountCertPath) {
      options.credential = fbAdmin.credential.cert(
        config.firebase.serviceAccountCertPath,
      );
    }

    fbAdmin.initializeApp(options);

    this.auth = getAuth().tenantManager().authForTenant(config.tenant);
  }

  public isAdmin(userEmailAddress: string): boolean {
    return userEmailAddress.split('@').pop() === this.config.adminDomain;
  }

  public getProviderFromState(state: string): Provider {
    const decodedState = this.authService.decodeState(state);
    return decodedState.server.provider;
  }

  public getNonprofitFromState(state: string): string | undefined {
    const decodedState = this.authService.decodeState(state);
    return decodedState.server.defaultNonprofitId;
  }

  public async getAuthenticationToken(userId: string): Promise<string> {
    try {
      const user = await this.auth.getUser(userId);
      const token = await this.auth.createCustomToken(
        userId,
        user.customClaims,
      );

      return token;
    } catch (error) {
      this.log.error({ error });
      throw error;
    }
  }

  public async verifyAuthorization(
    token: string,
    req: Request,
  ): Promise<AuthedUser | undefined> {
    try {
      let credential;

      // allow a valid serialized AuthUser payload to be used in a test environment
      try {
        credential = await this.auth.verifyIdToken(token);
      } catch (error) {
        if ((error as any).code === 'auth/id-token-expired') {
          throw new ExpiredTokenException();
        }
        if (this.config.allowClear) {
          credential = JSON.parse(token);
        }
      }

      if (!credential) {
        this.log.warn({ token }, 'Auth token verified to undefined value');
        return;
      }

      /**
       * For some reason accessing `Role` here
       * invalidates the class signatures and breaks
       * NestJS DI. For now, roles are referenced by
       * enum string values to circumvent this.
       * TODO: research why and fix
       */
      const user = 'user'; // Role.User;
      const admin = 'admin'; // Role.Admin;

      const isAdmin = credential.roles?.includes(admin); // todo: consider scoping to an admin-app audience (jwt aud) instead
      const reqForUser = isAdmin && req.get('x-gated-request-for-user');

      return {
        userId: reqForUser || credential.uid,
        roles: reqForUser ? [user] : credential.roles,
        firstName: credential.firstName,
        lastName: credential.lastName,
      };
    } catch (error) {
      if (!(error instanceof ExpiredTokenException)) {
        this.log.error({ error }, 'Error processing verifying authorization');
      }
      throw error;
    }
  }

  public async createUser(
    user: UserInterface,
    emailAddress?: string,
  ): Promise<any> {
    await this.auth.createUser({
      uid: user.userId,
    });

    await this.updateUser(user, emailAddress);
  }

  public async updateUser(
    user: UserInterface,
    emailAddress?: string,
  ): Promise<void> {
    const properties: { [key: string]: string } = {
      displayName: user.fullName,
    };
    if (user.avatar) {
      properties.avatar = user.avatar;
    }
    if (emailAddress) {
      properties.email = emailAddress;
    }
    await Promise.all([
      this.auth.updateUser(user.userId, properties),
      this.auth.setCustomUserClaims(user.userId, {
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      }),
    ]);
  }

  public async getUserIdByProviderUserId(
    providerId: Provider,
    providerUserId: string,
  ): Promise<string | void> {
    const getUserResponse = await this.auth.getUsers([
      { providerId, providerUid: providerUserId },
    ]);

    const user = getUserResponse.users[0];
    return user?.uid;
  }

  public async addProviderToUser(
    userId: string,
    provider: Provider,
    providerUserId: string,
  ): Promise<UserRecord> {
    return this.auth.updateUser(userId, {
      providerToLink: {
        providerId: provider,
        uid: providerUserId,
      },
    });
  }

  public async removeProviderFromUser(
    userId: string,
    providerUserId: string,
  ): Promise<UserRecord> {
    // todo: validate this supports multiple federated providers of the same type
    const user = await this.auth.getUser(userId);

    const unlink = user.providerData.find(
      (item) => item.uid === providerUserId,
    );

    return this.auth.updateUser(userId, {
      providersToUnlink: [unlink?.providerId ?? ''],
    });
  }

  public async deleteUser(userId: string): Promise<void> {
    await this.auth.deleteUser(userId);
  }

  public clientRedirect(
    res: Response,
    state: string,
    authToken?: string,
    error?: any,
    loginHint?: string,
  ): void {
    const { client, server } = this.authService.decodeState(state);

    this.authService.redirectUrlIsAllowed(server.redirect);

    const url = new URL(server.redirect);

    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);

    if (client) {
      res.cookie(AuthCookie.State, client, { expires });
    }

    if (authToken) {
      res.cookie(AuthCookie.CustomToken, authToken, { expires });
    }

    if (error) {
      res.cookie(AuthCookie.Error, error.code || 'unknown', { expires });
    }

    if (loginHint) {
      res.cookie(AuthCookie.LoginHint, loginHint, { expires });
    }

    res.redirect(url.toString());
  }
}
