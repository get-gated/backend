import { gmail_v1 } from 'googleapis';

import { MalformedMessageError } from '../../../../errors/malformed-message.error';

import { GmailMessage, GmailMessageWithPayload, HasId } from './types';

export function isQuotaError(error: any): boolean {
  return (
    error.code === 403 &&
    error.errors?.find((e: any) => e.reason === 'rateLimitExceeded')
  );
}

export function isMessageWithPayload(
  message: gmail_v1.Schema$Message,
): message is GmailMessageWithPayload {
  return !!(message.id && message.payload);
}

export function hasId(
  msg: gmail_v1.Schema$Message,
): msg is HasId<GmailMessage> {
  return !!msg.id;
}

export function validateHasId(
  msg: gmail_v1.Schema$Message,
): HasId<GmailMessage> {
  if (!hasId(msg)) {
    throw new MalformedMessageError(msg, 'message does not contain an id');
  }
  return msg;
}
