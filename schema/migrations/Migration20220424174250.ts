import { Migration } from '@mikro-orm/migrations';

export class Migration20220424174250 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_connections" add column "is_disabled" bool null; update "service_provider_connections" set "is_disabled" = false; alter table "service_provider_connections" alter column "is_disabled" set not null;');
    this.addSql('alter table "service_provider_aliases" add column "is_imported" bool null;');
  }

}
