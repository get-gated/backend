import { Migration } from '@mikro-orm/migrations';

export class Migration20220120162755 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_aliases" rename column "update_at" to "updated_at";');
  }

}
