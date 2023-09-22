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
import {
  Allow,
  AuthAdapter,
  AuthProviderService,
  AuthRequestDto,
  AuthResponseDto,
  AuthType,
  OauthReturnRequestDto,
  SpecialRole,
} from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { Request, Response } from 'express';
import { IAuthResponse } from '@app/modules/auth/auth.types';
import { RedirectResponse } from '@nestjs/core/router/router-response-controller';

import { LoginCommand } from './login.command';

const route = 'user/auth/login';
@Controller()
export class LoginHttpController {
  static route = route;

  static routeRedirect = `${route}/redirect`;

  constructor(
    private commandBus: CommandBus,
    private authProvider: AuthProviderService,
    private authAdapter: AuthAdapter,
  ) {}

  @Get(LoginHttpController.routeRedirect)
  @Allow(SpecialRole.Unauthenticated)
  async googleOauthReturn(
    @Query() params: OauthReturnRequestDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<void> {
    const provider = this.authAdapter.getProviderFromState(params.state);
    let error;
    let authToken;
    let providerUser: IAuthResponse | undefined;
    try {
      providerUser = await this.authProvider.adapters[provider].auth(
        request,
        response,
        LoginHttpController.routeRedirect,
        params,
      );

      authToken = await this.commandBus.execute(new LoginCommand(providerUser));
    } catch (e) {
      error = e;
    }

    this.authAdapter.clientRedirect(
      response,
      params.state,
      authToken,
      error,
      providerUser?.sub,
    );
  }

  @Post(LoginHttpController.route)
  @Allow(SpecialRole.Unauthenticated)
  async login(
    @Body() data: AuthRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const url = await this.authProvider.adapters[data.provider].authUrl(
      response,
      LoginHttpController.routeRedirect,
      AuthType.Login,
      data,
    );

    return { url };
  }

  @Get(LoginHttpController.route)
  @Allow(SpecialRole.Unauthenticated)
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
      LoginHttpController.routeRedirect,
      AuthType.Login,
      data,
    );

    return { url, statusCode: 302 };
  }
}
