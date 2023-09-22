import { Migration } from '@mikro-orm/migrations';

export class Migration20220701140910 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_messages" drop column "user_participant_of";');
  }

}
