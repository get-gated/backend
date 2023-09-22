import { Migration } from '@mikro-orm/migrations';

export class Migration20221129183259 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_network_connections" alter column "gated_user_id" drop not null;');
  }

}
