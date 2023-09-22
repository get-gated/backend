export class CryptoRequestCorrupted extends Error {
  static code = 'CRYPTO_REQUEST_CORRUPTED';

  constructor(type: 'Decrypt' | 'Encrypt') {
    super(`${type} request corrupted in transit`);
  }
}
