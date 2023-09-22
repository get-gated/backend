import { Migration } from '@mikro-orm/migrations';

export class Migration20220307224017 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_connections" alter column "external_access_token" type varchar(2048);');
    this.addSql('alter table "service_provider_connections" alter column "provider_token" type varchar(2048);');

    this.addSql('alter table "users" alter column "avatar" type varchar(2048);');
  }

}
