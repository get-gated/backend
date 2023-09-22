import { Inject, Injectable } from '@nestjs/common';
import pino, { Level, Logger } from 'pino';
import { ConfigType } from '@nestjs/config';
import { AsyncContextService } from '@app/modules/async-context/async-context.service';
import { TelemetryService } from '@app/modules/telemetry';

import LoggerConfig from './logger.config';

@Injectable()
export class LoggerService {
  constructor(
    private ac: AsyncContextService,
    @Inject(LoggerConfig.KEY) config: ConfigType<typeof LoggerConfig>,
    private tracing: TelemetryService,
  ) {
    this.logger = pino(config.pino);
  }

  private logger: Logger;

  trace(message: any, ...args: any[]): void {
    this.call('trace', message, ...args);
  }

  verbose(message: any, ...args: any[]): void {
    this.call('trace', message, ...args);
  }

  debug(message: any, ...args: any[]): void {
    this.call('debug', message, ...args);
  }

  info(message: any, ...args: any[]): void {
    this.call('info', message, ...args);
  }

  log(message: any, ...args: any[]): void {
    this.call('info', message, ...args);
  }

  warn(message: any, ...args: any[]): void {
    this.call('warn', message, ...args);
  }

  error(message: any, ...args: any[]): void {
    this.call('error', message, ...args);
  }

  fatal(message: any, ...args: any[]): void {
    this.call('fatal', message, ...args);
  }

  private getObject(
    level: Level,
    message: any,
    ...optionalParams: any[]
  ): Record<string, any> {
    // optionalParams contains extra params passed to logger
    // context name is the last item
    const objArg: Record<string, any> = {};

    let params: any[] = [];
    if (optionalParams.length !== 0) {
      params = optionalParams.slice(0, -1);
    }

    if (typeof message === 'object') {
      if (message instanceof Error) {
        objArg.error = message;
      } else {
        Object.assign(objArg, message);
        if (optionalParams[0]) {
          Object.assign(objArg, { message: optionalParams[0] });
        }
      }
      return objArg;
    }
    if (this.isWrongExceptionsHandlerContract(level, message, params)) {
      objArg.error = new Error(message);
      // eslint-disable-next-line prefer-destructuring
      objArg.error.stack = params[0];
      return objArg;
    }

    objArg.message = message;
    return objArg;
  }

  private call(level: Level, message: any, ...optionalParams: any[]): void {
    const objArg = this.getObject(level, message, ...optionalParams);
    try {
      Object.assign(objArg, this.ac.getAll(), this.tracing.getContext());
    } catch (err) {
      // when starting up, asynccontext is not registered and will throw errors
      // ignore this
    }

    this.logger[level](objArg);
  }

  /**
   * Unfortunately built-in (not only) `^.*Exception(s?)Handler$` classes call `.error`
   * method with not supported contract:
   *
   * - ExceptionsHandler
   * @see https://github.com/nestjs/nest/blob/35baf7a077bb972469097c5fea2f184b7babadfc/packages/core/exceptions/base-exception-filter.ts#L60-L63
   *
   * - ExceptionHandler
   * @see https://github.com/nestjs/nest/blob/99ee3fd99341bcddfa408d1604050a9571b19bc9/packages/core/errors/exception-handler.ts#L9
   *
   * - WsExceptionsHandler
   * @see https://github.com/nestjs/nest/blob/9d0551ff25c5085703bcebfa7ff3b6952869e794/packages/websockets/exceptions/base-ws-exception-filter.ts#L47-L50
   *
   * - RpcExceptionsHandler @see https://github.com/nestjs/nest/blob/9d0551ff25c5085703bcebfa7ff3b6952869e794/packages/microservices/exceptions/base-rpc-exception-filter.ts#L26-L30
   *
   * - all of them
   * @see https://github.com/search?l=TypeScript&q=org%3Anestjs+logger+error+stack&type=Code
   */
  private isWrongExceptionsHandlerContract(
    level: Level,
    message: any,
    params: any[],
  ): params is [string] {
    return (
      level === 'error' &&
      typeof message === 'string' &&
      params.length === 1 &&
      typeof params[0] === 'string' &&
      /\n\s*at /.test(params[0])
    );
  }
}
