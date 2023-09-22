import { Migration } from '@mikro-orm/migrations';

export class Migration20220119173953 extends Migration {

  async up(): Promise<void> {
    this.addSql(`alter table "challenge_templates" add column "name" varchar(255) not null default '';`);

    this.addSql(`alter table "gatekeeper_patterns" add column "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP;`);
    this.addSql('alter table "gatekeeper_patterns" drop constraint if exists "gatekeeper_patterns_description_check";');
    this.addSql('alter table "gatekeeper_patterns" alter column "description" type text using ("description"::text);');
    this.addSql('alter table "gatekeeper_patterns" alter column "description" drop not null;');
    this.addSql('alter table "gatekeeper_patterns" drop column "created_by";');

  }

}
