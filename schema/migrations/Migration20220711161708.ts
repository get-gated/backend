import { Migration } from '@mikro-orm/migrations';

export class Migration20220711161708 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_connection_logs" add column "is_activated" bool null;');
  }

}
