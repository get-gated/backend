import { Migration } from '@mikro-orm/migrations';

export class Migration20220719190906 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "service_provider_thread_moves_connection_id_thread_id_index" on "service_provider_thread_moves" ("connection_id", "thread_id");');
  }

}
