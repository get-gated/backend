import { Migration } from '@mikro-orm/migrations';

export class Migration20220301134229 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_thread_moves" drop column "external_label_ids";');
  }

}
