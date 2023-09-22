import { Migration } from '@mikro-orm/migrations';

export class Migration20220816142310 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "gatekeeper_decisions_message_id_index" on "gatekeeper_decisions" ("message_id");');
  }

}
