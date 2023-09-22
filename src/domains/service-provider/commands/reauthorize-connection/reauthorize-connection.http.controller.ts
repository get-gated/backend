import {
  Body,
  Controller,
  Get,
  Post,
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
  AuthRequestDto,
  AuthResponseDto,
  AuthType,
  OauthReturnRequestDto,
  Role,
  User,
} from '@app/modules/auth';
import { Request, Response } from 'express';
import { UtilsService } from '@app/modules/utils';
import { IAuthResponse } from '@app/modules/auth/auth.types';
import { RedirectResponse } from '@nestjs/core/router/router-response-controller';

import { mapProviderUtil } from '../../map-provider.util';

import { ReauthorizeConnectionCommand } from './reauthorize-connection.command';

const route = 'connection/reauthorize';
@Controller()
export class ReauthorizeConnectionHttpController {
  static route = route;

  static routeRedirect = `${route}/redirect`;

  constructor(
    private commandBus: CommandBus,
    private utils: UtilsService,
    private authProvider: AuthProviderService,
    private authAdapter: AuthAdapter,
  ) {}

  @Get(ReauthorizeConnectionHttpController.routeRedirect)
  @Allow(Role.User)
  async oauthReturn(
    @Query() params: OauthReturnRequestDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @User() { userId }: AuthedUser,
  ): Promise<void> {
    const provider = this.authAdapter.getProviderFromState(params.state);
    let error;
    let providerUser: IAuthResponse | undefined;
    try {
      providerUser = await this.authProvider.adapters[provider].auth(
        request,
        response,
        ReauthorizeConnectionHttpController.routeRedirect,
        params,
      );

      const userEmail = this.utils.normalizeEmail(
        providerUser.emailAddress,
      ).email;

      if (providerUser.insufficientScopes) {
        error = providerUser.insufficientScopes;
      } else {
        await this.commandBus.execute(
          new ReauthorizeConnectionCommand(
            userId,
            providerUser.sub,
            mapProviderUtil(providerUser.provider),
            providerUser.refreshToken,
            userEmail,
          ),
        );
      }
    } catch (e) {
      error = e;
    }

    this.authAdapter.clientRedirect(
      response,
      params.state,
      undefined,
      error,
      providerUser?.sub,
    );
  }

  @Post(ReauthorizeConnectionHttpController.route)
  @Allow(Role.User)
  async reauthorizeUrl(
    @Body() data: AuthRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const url = await this.authProvider.adapters[data.provider].authUrl(
      response,
      ReauthorizeConnectionHttpController.routeRedirect,
      AuthType.InboxAccess,
      data,
    );

    return { url };
  }

  @Get(ReauthorizeConnectionHttpController.route)
  @Allow(Role.User)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
  @Redirect()
  async signupUrlRedirect(
    @Query() data: AuthRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RedirectResponse> {
    const url = await this.authProvider.adapters[data.provider].authUrl(
      response,
      ReauthorizeConnectionHttpController.routeRedirect,
      AuthType.InboxAccess,
      data,
    );

    return { url, statusCode: 302 };
  }
}
