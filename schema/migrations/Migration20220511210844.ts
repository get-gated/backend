import { Migration } from '@mikro-orm/migrations';

export class Migration20220511210844 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "personalization" jsonb null;');
  }

}
