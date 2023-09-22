import { Migration } from '@mikro-orm/migrations';

export class Migration20220815174522 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "service_provider_gmail_history_external_history_id_external_message_id_index" on "service_provider_gmail_history" ("external_history_id", "external_message_id");');
  }

}
