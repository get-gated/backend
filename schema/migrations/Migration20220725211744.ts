import { Migration } from '@mikro-orm/migrations';

export class Migration20220725211744 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "service_provider_connections" add column "train_as_gated_label_id" varchar(255) null, add column "train_as_allowed_label_id" varchar(255) null;');

    this.addSql('alter table "service_provider_thread_moves" drop constraint if exists "service_provider_thread_moves_destination_check";');
    this.addSql('alter table "service_provider_thread_moves" alter column "destination" type text using ("destination"::text);');
    this.addSql('alter table "service_provider_thread_moves" add constraint "service_provider_thread_moves_destination_check" check ("destination" in (\'inbox\', \'all\', \'trash\', \'archive\', \'drafts\', \'sent\', \'spam\', \'important\', \'Gated\', \'Expected\', \'Donation\', \'TrainAsGated\', \'TrainAsAllowed\'));');
  }

}
