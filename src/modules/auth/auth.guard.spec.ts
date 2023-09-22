import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { trace } from '@opentelemetry/api';
import { Role, SpecialRole } from '@app/modules/auth/auth.enums';
import { UtilsService } from '@app/modules/utils';
import { LoggerService } from '@app/modules/logger';

import { getRequest } from './utils/get-req.util';
import { AuthGuard } from './auth.guard';

jest.mock('@opentelemetry/api');
const getSpanMock = {
  setAttribute: jest.fn(),
};
getSpanMock.setAttribute.mockReturnValue(getSpanMock);
(trace.getSpan as jest.Mock).mockReturnValue(getSpanMock);

jest.mock('./utils/get-req.util');
const getRequestMock = getRequest as jest.Mock;
getRequestMock.mockReturnValue({ headers: {}, cookies: {} });

const reflectorMock = {
  getAllAndOverride: jest.fn(),
};

const ctx = <ExecutionContext>(<unknown>{
  getHandler: jest.fn(),
  getClass: jest.fn,
});
const utilMock = {
  assignUserDataToLogger: jest.fn(),
};

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: Reflector, useValue: reflectorMock },
        { provide: LoggerService, useValue: console },
        { provide: UtilsService, useValue: utilMock },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  afterEach(() => {
    reflectorMock.getAllAndOverride.mockReset();
    getRequestMock.mockRestore();
  });

  const canActivate = async (
    userRoles: Role[] | undefined,
    expected: boolean,
  ): Promise<void> => {
    getRequestMock.mockReturnValueOnce({
      user: { roles: userRoles },
    });
    const result = await guard.canActivate(ctx);
    expect(result).toEqual(expected);
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should block all by default', async () => {
    await canActivate([Role.Admin], false);
    await canActivate([Role.User], false);
    await canActivate(undefined, false);
  });

  it('should allow admins', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue([Role.Admin]);

    await canActivate([Role.Admin], true);
    await canActivate([Role.User], false);
    await canActivate(undefined, false);
  });

  it('should allow users', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue([Role.User]);

    await canActivate([Role.Admin], false);
    await canActivate([Role.User], true);
    await canActivate(undefined, false);
  });

  it('should allow all authenticated', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue([
      SpecialRole.AllAuthenticated,
    ]);

    await canActivate([Role.Admin], true);
    await canActivate([Role.User], true);
    await canActivate(undefined, false);
  });

  it('should allow all, even unauthenticated', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue([
      SpecialRole.Unauthenticated,
    ]);

    await canActivate([Role.Admin], true);
    await canActivate([Role.User], true);
    await canActivate(undefined, true);
  });

  it('should support multiple roles', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue([Role.Admin, Role.User]);

    await canActivate([Role.Admin], true);
    await canActivate([Role.User], true);
    await canActivate(undefined, false);
  });
});
