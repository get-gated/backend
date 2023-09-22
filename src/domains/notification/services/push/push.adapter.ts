import { ExpoPushMessage } from 'expo-server-sdk';

export interface PushData {
  [key: string]: any;
}
export type PushProps = Pick<ExpoPushMessage, 'body' | 'data' | 'badge'> & {
  tokens: string[];
};

export type PushError =
  | 'DeviceNotRegistered'
  | 'InvalidCredentials'
  | 'MessageTooBig'
  | 'MessageRateExceeded';

interface ProcessReceiptResponseItem {
  receiptId: string;
  error?: PushError;
}
export type ProcessReceiptResponse = ProcessReceiptResponseItem[];

interface PushResponseItem extends Omit<PushProps, 'tokens'> {
  error: PushError | void;
  receiptId?: string;
  token: string;
}

export type PushResponse = PushResponseItem[];

export abstract class PushAdapter {
  abstract push(props: PushProps): Promise<PushResponse>;

  abstract validateToken(token: string): Promise<boolean>;

  abstract processReceipts(
    receiptIds: string[],
  ): Promise<ProcessReceiptResponse>;
}
