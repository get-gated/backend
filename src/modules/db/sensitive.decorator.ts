import { SetMetadata } from '@nestjs/common';

export const SensitiveFieldToken = '__SENSITIVE_FIELD_TOKEN__';

/**
 * @name @Sensitive()
 * Decorator for use on Entity fields which
 * instructs the db module to encrypt the contents of the field
 * prior to persisting.
 * Field is auto decrypted on fetching.
 * @constructor
 */
export const Sensitive =
  () => (target: any, key?: string, descriptor?: any) => {
    const fields =
      Reflect.getMetadata(SensitiveFieldToken, target.constructor) || [];
    fields.push(key);

    SetMetadata(SensitiveFieldToken, fields)(
      target.constructor,
      key ?? '',
      descriptor,
    );
  };
