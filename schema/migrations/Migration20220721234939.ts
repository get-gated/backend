import { Migration } from '@mikro-orm/migrations';

export class Migration20220721234939 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_connections" add column "managed_by" text check ("managed_by" in (\'NYLAS\', \'INTERNAL\')) not null default \'NYLAS\';');
  }

}
