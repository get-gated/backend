import { Migration } from '@mikro-orm/migrations';

export class Migration20220726203948 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_connections" add column "last_history_processed_at" timestamptz(0) null;');
  }

}
