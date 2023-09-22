import { Migration } from '@mikro-orm/migrations';

export class Migration20220727152243 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "service_provider_connections_last_history_processed_at_index" on "service_provider_connections" ("last_history_processed_at");');
  }

}
