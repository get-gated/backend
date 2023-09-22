import { Request, Response } from 'express';
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
import { IAuthResponse } from '@app/modules/auth/auth.types';
import { LoggerService } from '@app/modules/logger';
import { RedirectResponse } from '@nestjs/core/router/router-response-controller';

import { mapProviderUtil } from '../../map-provider.util';

import { AddConnectionCommand } from './add-connection.command';

const route = 'connection';
@Controller()
export class AddConnectionHttpController {
  static route = route;

  static routeRedirect = `${route}/redirect`;

  constructor(
    private commandBus: CommandBus,
    private authProvider: AuthProviderService,
    private authAdapter: AuthAdapter,
    private log: LoggerService,
  ) {}

  @Get(AddConnectionHttpController.routeRedirect)
  @Allow(Role.User)
  async googleOauthReturn(
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
        AddConnectionHttpController.routeRedirect,
        params,
      );

      if (providerUser.insufficientScopes) {
        error = providerUser.insufficientScopes;
      } else {
        await this.commandBus.execute(
          new AddConnectionCommand(
            userId,
            providerUser.sub,
            mapProviderUtil(providerUser.provider),
            providerUser.refreshToken,
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

  @Post(AddConnectionHttpController.route)
  @Allow(Role.User)
  async addProvider(
    @Body() data: AuthRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const url = await this.authProvider.adapters[data.provider].authUrl(
      response,
      AddConnectionHttpController.routeRedirect,
      AuthType.InboxAccess,
      data,
    );

    return { url };
  }

  @Get(AddConnectionHttpController.route)
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
  async addProviderRedurect(
    @Query() data: AuthRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RedirectResponse> {
    const url = await this.authProvider.adapters[data.provider].authUrl(
      response,
      AddConnectionHttpController.routeRedirect,
      AuthType.InboxAccess,
      data,
    );

    return { url, statusCode: 302 };
  }
}
