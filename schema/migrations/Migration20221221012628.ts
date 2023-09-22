import { Migration } from '@mikro-orm/migrations';

export class Migration20221221012628 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_messages" add column "is_automated" bool null;');
  }

}
