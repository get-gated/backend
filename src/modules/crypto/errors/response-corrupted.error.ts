export class CryptoResponseCorrupted extends Error {
  static code = 'CRYPTO_RESPONSE_CORRUPTED';

  constructor(type: 'Decrypt' | 'Encrypt') {
    super(`${type} response corrupted in transit`);
  }
}
