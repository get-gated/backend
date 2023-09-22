import { Migration } from '@mikro-orm/migrations';

export class Migration20220801045510 extends Migration {

  async up(): Promise<void> {

    this.addSql('create index "gatekeeper_trainings_created_at_index" on "gatekeeper_trainings" ("created_at");');

    this.addSql('create index "service_provider_messages_received_at_index" on "service_provider_messages" ("received_at");');

    this.addSql('create index "service_provider_thread_moves_created_at_index" on "service_provider_thread_moves" ("created_at");');

  }

}
