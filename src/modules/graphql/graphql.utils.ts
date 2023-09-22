import { QueryOrder } from '@mikro-orm/core';

import { Pagination } from './interfaces/graphql-connection.interface';

export const graphqlUtils = {
  decodeCursor(cursor: string): string {
    return Buffer.from(cursor, 'base64').toString('utf8');
  },

  encodeCursor(value: string | void): string {
    if (!value) return '';
    return Buffer.from(value, 'utf-8').toString('base64');
  },

  paginationToPg(pagination: Pagination = {}): {
    cursorValue?: string;
    order: QueryOrder;
    limit?: number;
  } {
    let cursorValue;
    let order: QueryOrder;
    let limit;
    if (pagination.after) {
      cursorValue = this.decodeCursor(pagination.after);
    } else if (pagination.before) {
      cursorValue = this.decodeCursor(pagination.before);
    }

    if (pagination.first) {
      limit = pagination.first;
    } else if (pagination.last) {
      limit = pagination.last;
    }

    if (pagination.first || pagination.after) {
      order = QueryOrder.ASC;
    } else {
      order = QueryOrder.DESC;
    }

    return { cursorValue, order, limit };
  },
};
