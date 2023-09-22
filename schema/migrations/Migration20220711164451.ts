import { Migration } from '@mikro-orm/migrations';

export class Migration20220711164451 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_connections" add column "deleted_at" timestamptz(0) null, add column "updated_at" timestamptz(0) null;');
  }

}
