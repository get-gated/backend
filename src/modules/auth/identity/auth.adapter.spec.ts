import { Test, TestingModule } from '@nestjs/testing';
import { AuthAdapter } from '@app/modules/auth/identity/auth.adapter';
import { getAuth } from 'firebase-admin/auth';
import AuthConfig from '@app/modules/auth/auth.config';
import { Role } from '@app/modules/auth/auth.enums';
import { RequestWithUser } from '@app/modules/auth/auth.guard';
import { LoggerService } from '@app/modules/logger';
import { AuthService } from '@app/modules/auth/auth.service';

jest.mock('firebase-admin');
jest.mock('firebase-admin/auth');

const getAuthMock = getAuth as jest.Mock;
const authMock = {
  verifyIdToken: jest.fn(),
};
getAuthMock.mockReturnValue({
  tenantManager: () => ({
    authForTenant: () => authMock,
  }),
});

describe('AuthAdapter', () => {
  let service: AuthAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthAdapter,
        {
          provide: AuthConfig.KEY,
          useValue: { firebase: {}, tenant: 'test' },
        },
        { provide: LoggerService, useValue: console },
        { provide: AuthService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthAdapter>(AuthAdapter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should allow admins to impersonate users', async () => {
    const userId = '123';
    authMock.verifyIdToken.mockResolvedValueOnce({
      uid: 'external-id',
      roles: [Role.Admin],
    });
    const req = {
      get(header: string) {
        if (header === 'x-gated-request-for-user') return userId;
      },
    };

    const user = await service.verifyAuthorization(
      'test',
      <RequestWithUser>req,
    );
    expect(user?.userId).toEqual(userId);
    expect(user?.roles[0]).toEqual(Role.User);
  });

  it('should not allow non-admins to impersonate users', async () => {
    const userId = '123';
    const uid = 'external-id';
    authMock.verifyIdToken.mockResolvedValueOnce({
      uid,
      roles: [Role.User],
    });
    const req = {
      get(header: string) {
        if (header === 'x-gated-request-for-user') return userId;
      },
    };

    const user = await service.verifyAuthorization(
      'test',
      <RequestWithUser>req,
    );
    expect(user?.userId).toEqual(uid);
    expect(user?.roles[0]).toEqual(Role.User);
  });
});
