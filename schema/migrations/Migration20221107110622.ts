import { Migration } from '@mikro-orm/migrations';

export class Migration20221107110622 extends Migration {

  async up(): Promise<void> {
	this.addSql('create index "service_provider_thread_moves_thread_id_idx" on "service_provider_thread_moves" ("thread_id");')
  }

}
