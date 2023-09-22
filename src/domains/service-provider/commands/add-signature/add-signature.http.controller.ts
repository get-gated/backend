import { Request, Response } from 'express';
import {
  Controller,
  Get,
  Query,
  Redirect,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Allow,
  AuthAdapter,
  AuthedUser,
  AuthProviderService,
  AuthType,
  OauthReturnRequestDto,
  Role,
  User,
} from '@app/modules/auth';
import { IAuthResponse } from '@app/modules/auth/auth.types';
import { LoggerService } from '@app/modules/logger';
import { RedirectResponse } from '@nestjs/core/router/router-response-controller';

import { mapProviderUtil } from '../../map-provider.util';

import { AddSignatureCommand } from './add-signature.command';
import { AddSignatureRequestDto } from './add-signature.request.dto';

interface AdditionalServerState {
  signature: string;
}

const route = 'signature';
@Controller()
export class AddSignatureHttpController {
  static route = route;

  static routeRedirect = `${route}/redirect`;

  constructor(
    private commandBus: CommandBus,
    private authProvider: AuthProviderService,
    private authAdapter: AuthAdapter,
    private log: LoggerService,
  ) {}

  @Get(AddSignatureHttpController.routeRedirect)
  @Allow(Role.User)
  async googleOauthReturn(
    @Query() params: OauthReturnRequestDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @User() { userId }: AuthedUser,
  ): Promise<void> {
    const provider = this.authAdapter.getProviderFromState(params.state);
    let error;
    let providerUser: IAuthResponse<any> | undefined;
    try {
      providerUser = await this.authProvider.adapters[
        provider
      ].auth<AdditionalServerState>(
        request,
        response,
        AddSignatureHttpController.routeRedirect,
        params,
      );

      if (providerUser.insufficientScopes) {
        error = providerUser.insufficientScopes;
      } else {
        await this.commandBus.execute(
          new AddSignatureCommand(
            userId,
            providerUser.sub,
            mapProviderUtil(providerUser.provider),
            providerUser.refreshToken,
            providerUser.serverState.signature,
            providerUser.emailAddress,
          ),
        );
      }
    } catch (e) {
      error = e;
      this.log.warn({ error: e }, 'Error adding connection');
    }

    this.authAdapter.clientRedirect(
      response,
      params.state,
      undefined,
      error,
      providerUser?.sub,
    );
  }

  @Get(AddSignatureHttpController.route)
  @Allow(Role.User)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      skipMissingProperties: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
  @Redirect()
  async addSignatureRedirect(
    @Query() data: AddSignatureRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RedirectResponse> {
    const { signature, ...authRequest } = data;
    const url = await this.authProvider.adapters[data.provider].authUrl(
      response,
      AddSignatureHttpController.routeRedirect,
      AuthType.Signature,
      authRequest,
      { signature },
    );

    return { url, statusCode: 302 };
  }
}
