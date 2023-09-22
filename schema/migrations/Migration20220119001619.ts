import { Migration } from '@mikro-orm/migrations';

export class Migration20220119001619 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_connections" drop column "aliases";');
    this.addSql('create table "service_provider_aliases" ("id" uuid not null, "connection_id" uuid not null, "alias" varchar(255) not null, "created_at" timestamptz(0) not null, "update_at" timestamptz(0) not null, "enabled" bool not null);');
    this.addSql('alter table "service_provider_aliases" add constraint "service_provider_aliases_pkey" primary key ("id");');
    this.addSql('alter table "service_provider_aliases" add constraint "service_provider_aliases_connection_id_foreign" foreign key ("connection_id") references "service_provider_connections" ("id") on update cascade;');
  }

}
