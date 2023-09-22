import { Migration } from '@mikro-orm/migrations';

export class Migration20221217204320 extends Migration {

  async up(): Promise<void> {

    this.addSql('alter table "challenge_injected_messages" drop constraint if exists "challenge_injected_messages_responding_to_check";');
    this.addSql('alter table "challenge_injected_messages" alter column "responding_to" type text using ("responding_to"::text);');
    this.addSql('alter table "challenge_injected_messages" add constraint "challenge_injected_messages_responding_to_check" check ("responding_to" in (\'CLICKED\', \'OPENED\', \'DONATED\', \'EXPECTED\', \'USER_REPLIED\', \'USER_EXPECTED_CONSENT_GRANTED\', \'USER_EXPECTED_CONSENT_DENIED\'));');

    this.addSql('alter table "challenge_interactions" drop constraint if exists "challenge_interactions_interaction_check";');
    this.addSql('alter table "challenge_interactions" alter column "interaction" type text using ("interaction"::text);');
    this.addSql('alter table "challenge_interactions" add constraint "challenge_interactions_interaction_check" check ("interaction" in (\'CLICKED\', \'OPENED\', \'DONATED\', \'EXPECTED\', \'USER_REPLIED\', \'USER_EXPECTED_CONSENT_GRANTED\', \'USER_EXPECTED_CONSENT_DENIED\'));');
  }

}
