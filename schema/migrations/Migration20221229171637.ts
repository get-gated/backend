import { Migration } from '@mikro-orm/migrations';

export class Migration20221229171637 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "challenges_connection_id_to_normalized_created_at_index" on "challenges" ("connection_id", "to_normalized", "created_at");');

    this.addSql('create index "challenges_message_id_index" on "challenges" ("message_id");');
  }

}
