import { Migration } from '@mikro-orm/migrations';

export class Migration20221123173059 extends Migration {

  async up(): Promise<void> {

    this.addSql('create table "user_network_connections" ("id" uuid not null, "user_id" uuid not null, "name" varchar(255) not null, "avatar" varchar(255) null, "external_identifier" varchar(255) not null, "gated_user_id" uuid not null, "met_with_gated" bool not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) null);');
    this.addSql('alter table "user_network_connections" add constraint "user_network_connections_pkey" primary key ("id");');
    this.addSql('create index "user_network_connections_user_id_index" on "user_network_connections" ("user_id");');
    this.addSql('create index "user_network_connections_external_identifier_index" on "user_network_connections" ("external_identifier");');

    this.addSql('alter table "challenge_nonprofits" add column "slug" varchar(1000) null;');
    this.addSql('create index "challenge_nonprofits_slug_index" on "challenge_nonprofits" ("slug");');

    this.addSql('alter table "user_network_connections" add constraint "user_network_connections_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;');
    this.addSql('alter table "user_network_connections" add constraint "user_network_connections_gated_user_id_foreign" foreign key ("gated_user_id") references "users" ("id") on update cascade;');

  }

}
