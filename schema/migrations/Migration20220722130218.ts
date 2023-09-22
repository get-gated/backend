import { Migration } from '@mikro-orm/migrations';

export class Migration20220722130218 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_connections" add column "last_history_id" varchar(255) null;');
  }

}
