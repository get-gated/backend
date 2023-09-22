import { gmail_v1 } from 'googleapis';
import { Maybe } from '@app/modules/utils';

import { HistoryMessage, LabelId, ListHistoryResponse } from './types';
import { mapGmailHistoryToHistoryMessage } from './mappers';

export interface FetchHistoryFn {
  (
    client: gmail_v1.Gmail,
    startHistoryId: string,
    labelId?: LabelId,
    pageToken?: string,
  ): Promise<ListHistoryResponse>;
}

export class HistoryCursor {
  private nextPageToken: Maybe<string>;

  constructor(
    public client: gmail_v1.Gmail,
    private startHistoryId: string,
    private fetchHistory: FetchHistoryFn,
    private labelId?: LabelId,
    private initialPage?: gmail_v1.Schema$ListHistoryResponse,
  ) {
    this.nextPageToken = initialPage?.nextPageToken;
  }

  public get hasNext(): boolean {
    return !!(this.initialPage?.history?.length || this.nextPageToken);
  }

  public async next(): Promise<Maybe<HistoryMessage[]>> {
    const page = this.initialPage;
    if (page?.history) {
      this.nextPageToken = page.nextPageToken;
      const result = mapGmailHistoryToHistoryMessage(
        this.initialPage?.history ?? [],
      );
      this.initialPage = undefined;
      return result;
    }

    if (this.nextPageToken) {
      const result = await this.fetchHistory(
        this.client,
        this.startHistoryId,
        this.labelId,
        this.nextPageToken,
      );
      this.nextPageToken = result.data?.nextPageToken;
      return mapGmailHistoryToHistoryMessage(result.data.history ?? []);
    }
    return null;
  }
}
