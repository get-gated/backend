import { Migration } from '@mikro-orm/migrations';

export class Migration20220329202739 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "service_provider_messages_user_id_index" on "service_provider_messages" ("user_id");');
  }

}
