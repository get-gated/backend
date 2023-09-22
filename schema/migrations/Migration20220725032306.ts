import { Migration } from '@mikro-orm/migrations';

export class Migration20220725032306 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_thread_moves" add column "move_acknowledged" bool null;');
    this.addSql('drop index "service_provider_thread_moves_history_id_index";');
    this.addSql('alter table "service_provider_thread_moves" drop column "history_id";');
  }

}
