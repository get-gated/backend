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
  AuthType,
  OauthReturnRequestDto,
  SpecialRole,
} from '@app/modules/auth';
import { CommandBus } from '@nestjs/cqrs';
import { Request, Response } from 'express';
import { LoggerService } from '@app/modules/logger';
import { Counter, Metric, TelemetryService } from '@app/modules/telemetry';
import { IAuthResponse } from '@app/modules/auth/auth.types';
import { RedirectResponse } from '@nestjs/core/router/router-response-controller';

import { SignupCommand } from './signup.command';

const route = 'user/auth/signup';
@Controller()
export class SignupHttpController {
  static route = route;

  static routeRedirect = `${route}/redirect`;

  constructor(
    private commandBus: CommandBus,
    private authProvider: AuthProviderService,
    private authAdapter: AuthAdapter,
    private log: LoggerService,
    private readonly telemetry: TelemetryService,
  ) {
    this.signupSuccessCounter = this.telemetry.getMetricCounter(
      Metric.SignupSuccess,
      {
        description: 'Successful User Signups',
      },
    );
    this.signupErrorCounter = this.telemetry.getMetricCounter(
      Metric.SignupError,
      {
        description: 'Errored User Signups',
      },
    );
  }

  private signupSuccessCounter: Counter;

  private signupErrorCounter: Counter;

  @Get(SignupHttpController.routeRedirect)
  @Allow(SpecialRole.Unauthenticated)
  async googleOauthReturn(
    @Query() params: OauthReturnRequestDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<void> {
    let error;
    let authToken;

    let providerUser: IAuthResponse | undefined;

    try {
      const provider = this.authAdapter.getProviderFromState(params.state);
      providerUser = await this.authProvider.adapters[provider].auth(
        request,
        response,
        SignupHttpController.routeRedirect,
        params,
      );

      if (providerUser.insufficientScopes) {
        error = providerUser.insufficientScopes;
      } else {
        const defaultNonprofitId = this.authAdapter.getNonprofitFromState(
          params.state,
        );
        const referralCode = request.cookies['referral-code'];
        authToken = await this.commandBus.execute(
          new SignupCommand(providerUser, defaultNonprofitId, referralCode),
        );
      }
    } catch (e) {
      error = e;
      this.log.error({ error: e }, 'Error signing up user');
    }

    if (providerUser) {
      if (error) {
        this.signupErrorCounter.add(1, {
          emailAddress: providerUser.emailAddress,
        });
      } else {
        this.signupSuccessCounter.add(1, {
          emailAddress: providerUser.emailAddress,
        });
      }
    }

    this.authAdapter.clientRedirect(
      response,
      params.state,
      authToken,
      error,
      providerUser?.sub,
    );
  }

  @Post(SignupHttpController.route)
  @Allow(SpecialRole.Unauthenticated)
  async getSignupUrl(
    @Body() data: AuthRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ url: string }> {
    const url = await this.authProvider.adapters[data.provider].authUrl(
      response,
      SignupHttpController.routeRedirect,
      AuthType.Signup,
      data,
    );

    return { url };
  }

  @Get(SignupHttpController.route)
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
      SignupHttpController.routeRedirect,
      AuthType.Signup,
      data,
    );

    return { url, statusCode: 302 };
  }
}
