import { Migration } from '@mikro-orm/migrations';

export class Migration20230208191850 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "service_provider_nylas_webhooks" cascade;');
  }

}
