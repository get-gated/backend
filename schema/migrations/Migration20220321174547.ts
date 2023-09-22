import { Migration } from '@mikro-orm/migrations';

export class Migration20220321174547 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_sent_received" drop constraint "service_provider_sent_received_user_id_external_message_id_user";');
    this.addSql('alter table "service_provider_sent_received" add constraint "external_message_signature" unique ("user_id", "external_message_id", "username", "domain");');
  }

}
