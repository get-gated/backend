/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnyEntity,
  EventArgs,
  EventSubscriber,
  FlushEventArgs,
} from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import { CryptoService } from '@app/modules/crypto';
import { EntityClass } from '@mikro-orm/core/typings';
import { ConfigType } from '@nestjs/config';

import DbConfig from './db.config';

@Injectable()
export class EntitySubscriber implements EventSubscriber {
  constructor(
    private cryptoService: CryptoService,
    em: EntityManager,
    @Inject(DbConfig.KEY) private config: ConfigType<typeof DbConfig>,
  ) {
    em.getEventManager().registerSubscriber(this);
  }

  private sensitive: Record<string | number, any> = {};

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public registerSensitiveFields(
    entityName: string | number,
    fields: any,
  ): void {
    this.sensitive[entityName] = fields;
  }

  private async processFields(
    entity: EntityClass<any> | AnyEntity,
    func: (
      fieldName: string,
      entity: EntityClass<any> | AnyEntity,
    ) => Promise<any>,
  ): Promise<void> {
    if (!this.config.enableCrypto) return;

    const fields = this.sensitive[entity.constructor.name];
    if (!fields) return;

    await Promise.all(
      fields.map(async (field: string) => {
        if (!(entity as any)[field]) return;
        return func(field, entity);
      }),
    );
  }

  async onInit(args: EventArgs<any>): Promise<void> {
    if (!args.entity) return;
    return this.processFields(args.entity, async (fieldName, entity) => {
      // eslint-disable-next-line no-param-reassign
      (entity as any)[fieldName] = await this.cryptoService.decrypt(
        (entity as any)[fieldName],
      );
    });
  }

  async onFlush(args: FlushEventArgs): Promise<void> {
    const changes = args.uow.getChangeSets();

    await Promise.all(
      changes.map(async (cs) =>
        this.processFields(cs.entity, async (fieldName, entity) => {
          // eslint-disable-next-line no-param-reassign
          (entity as any)[fieldName] = await this.cryptoService.encrypt(
            (entity as any)[fieldName],
          );
          args.uow.recomputeSingleChangeSet(entity);
        }),
      ),
    );
  }
}
