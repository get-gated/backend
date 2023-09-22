import { Migration } from '@mikro-orm/migrations';

export class Migration20220324165519 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "gatekeeper_trainings" alter column "username" type varchar(2048);');
    this.addSql('alter table "gatekeeper_trainings" alter column "domain" type varchar(2048);');

  }

}
