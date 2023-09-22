import { Migration } from '@mikro-orm/migrations';

export class Migration20230126211836 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "service_provider_messages_user_id_type_was_sent_by_system_index" on "service_provider_messages" ("user_id", "type", "was_sent_by_system");');

    this.addSql('create index "service_provider_messages_to_cc_bcc_index" on "service_provider_messages" using gin ("to" jsonb_path_ops, "cc" jsonb_path_ops, "bcc" jsonb_path_ops);');
  }

}
