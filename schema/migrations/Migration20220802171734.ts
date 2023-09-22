import { Migration } from '@mikro-orm/migrations';

export class Migration20220802171734 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "challenge_nonprofits" drop constraint if exists "challenge_nonprofits_external_id_check";');
    this.addSql('alter table "challenge_nonprofits" alter column "external_id" type varchar(255) using ("external_id"::varchar(255));');
    this.addSql('alter table "challenge_nonprofits" alter column "external_id" drop not null;');
    this.addSql('alter table "challenge_nonprofits" drop constraint if exists "challenge_nonprofits_ein_check";');
    this.addSql('alter table "challenge_nonprofits" alter column "ein" type varchar(255) using ("ein"::varchar(255));');
    this.addSql('alter table "challenge_nonprofits" alter column "ein" drop not null;');
    this.addSql('alter table "challenge_nonprofits" drop constraint if exists "challenge_nonprofits_url_check";');
    this.addSql('alter table "challenge_nonprofits" alter column "url" type varchar(255) using ("url"::varchar(255));');
    this.addSql('alter table "challenge_nonprofits" alter column "url" drop not null;');
  }

}
