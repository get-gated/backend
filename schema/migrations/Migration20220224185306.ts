import { Migration } from '@mikro-orm/migrations';

export class Migration20220224185306 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_messages" add column "is_mailing_list" bool not null default false;');
  }

}
