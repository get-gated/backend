import { Migration } from '@mikro-orm/migrations';

export class Migration20220324133140 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_sent_received" alter column "username" type varchar(2048);');
    this.addSql('alter table "service_provider_sent_received" alter column "domain" type varchar(2048);');
  }

}
