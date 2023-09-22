import { Migration } from '@mikro-orm/migrations';

export class Migration20220225144115 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "gatekeeper_decisions" add column "overruling_made" text check ("overruling_made" in (\'USER_ON_BCC_MUTE\')) null;');
  }

}
