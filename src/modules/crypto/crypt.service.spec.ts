import { Test, TestingModule } from '@nestjs/testing';
import { KeyManagementServiceClient } from '@google-cloud/kms';
import CryptoConfig from '@app/modules/crypto/crypto.config';
import { CryptoResponseCorrupted } from '@app/modules/crypto/errors/response-corrupted.error';
import { LoggerService } from '@app/modules/logger';

import { CryptoService } from './crypto.service';

const keyPath = 'kms/key/path';

const kmsMock = {
  cryptoKeyPath: jest.fn().mockReturnValue(keyPath),
  encrypt: jest.fn(),
  decrypt: jest.fn(),
};

const crc32c = '123';
const mockCheckCrc32c = jest.fn();

describe('CryptoService', () => {
  const compileModule = async (configMock: any): Promise<CryptoService> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        { provide: LoggerService, useValue: console },
        { provide: CryptoConfig.KEY, useValue: configMock },
        { provide: KeyManagementServiceClient, useValue: kmsMock },
      ],
    }).compile();

    return module.get<CryptoService>(CryptoService);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', async () => {
    const service = await compileModule({ kms: {} });
    expect(service).toBeDefined();
  });

  describe('When enabled', () => {
    let service: CryptoService;
    beforeEach(async () => {
      service = await compileModule({ enabled: true, kms: {} });
    });
    describe('Encrypt', () => {
      const plainText = 'test';

      const ciphertext = Buffer.from(plainText);

      it('should use kms and validated crc32c', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (service as any).checkCrc32c = mockCheckCrc32c;
        kmsMock.encrypt.mockReturnValueOnce([
          {
            ciphertext,
            ciphertextCrc32c: { value: crc32c },
            verifiedPlaintextCrc32c: true,
          },
        ]);
        const expectedKmsPayload = {
          name: keyPath,
          plaintext: Buffer.from(plainText),
        };

        await service.encrypt(plainText);
        const encryptArg = kmsMock.encrypt.mock.calls[0][0];
        expect(encryptArg).toMatchObject(expectedKmsPayload);
        expect(mockCheckCrc32c).toBeCalledWith(ciphertext, crc32c, 'Encrypt');
      });

      it('should throw if crc32c is not performed by kms', async () => {
        kmsMock.encrypt.mockReturnValueOnce([
          {
            ciphertext,
            ciphertextCrc32c: { value: crc32c },
            verifiedPlaintextCrc32c: false,
          },
        ]);

        await expect(service.encrypt(plainText)).rejects.toThrowError(
          CryptoResponseCorrupted,
        );
      });

      it('should throw if crc32c fails', async () => {
        kmsMock.encrypt.mockReturnValueOnce([
          {
            ciphertext,
            ciphertextCrc32c: { value: crc32c },
            verifiedPlaintextCrc32c: true,
          },
        ]);
      });
    });

    describe('Decrypt', () => {
      const plaintext = 'my decoded value';
      const ciphertext = Buffer.from(plaintext).toString('base64');

      it('should use kms and validated crc32c', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (service as any).checkCrc32c = mockCheckCrc32c;
        kmsMock.decrypt.mockReturnValueOnce([
          {
            plaintext,
            plaintextCrc32c: { value: crc32c },
            verifiedPlaintextCrc32c: true,
          },
        ]);
        const expectedKmsPayload = {
          name: keyPath,
          ciphertext: Buffer.from(ciphertext, 'base64'),
        };

        await service.decrypt(ciphertext);
        const decryptArg = kmsMock.decrypt.mock.calls[0][0];
        expect(decryptArg).toMatchObject(expectedKmsPayload);
        expect(mockCheckCrc32c).toBeCalledWith(plaintext, crc32c, 'Decrypt');
      });
    });
  });

  describe('When not enabled', () => {
    it('should use base64 opaque-ness and not kms', async () => {
      const service = await compileModule({
        enabled: false,
        kms: {},
      });
      const plainText = 'test';
      const encryptResult = await service.encrypt(plainText);
      expect(kmsMock.encrypt).not.toBeCalled();

      const decryptResult = await service.decrypt(encryptResult);
      expect(kmsMock.decrypt).not.toBeCalled();
      expect(plainText).toEqual(decryptResult);
    });
  });
});
