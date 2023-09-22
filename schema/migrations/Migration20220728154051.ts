import { Migration } from '@mikro-orm/migrations';

export class Migration20220728154051 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "gatekeeper_trainings_username_domain_index" on "gatekeeper_trainings" ("username", "domain");');
  }

}
