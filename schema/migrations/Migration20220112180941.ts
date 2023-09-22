import { Migration } from '@mikro-orm/migrations';

export class Migration20220112180941 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "notification_user_settings" ("id" uuid not null, "user_id" uuid not null, "email" varchar(255) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "notification_user_settings" add constraint "notification_user_settings_pkey" primary key ("id");');
    this.addSql('create index "notification_user_settings_user_id_index" on "notification_user_settings" ("user_id");');

    this.addSql('create table "notification_tx_emails" ("id" uuid not null, "user_id" uuid null, "transaction" text check ("transaction" in (\'FIRST_DONATION\', \'FIRST_EXPECTED\', \'FIRST_CHALLENGE\', \'CONNECTION_STOPPED\', \'CONNECTION_RESUMED\', \'CONNECTION_READY\', \'USER_JOINED\', \'RECEIPT_DONATION\', \'RECEIPT_DONATION\', \'RECEIPT_REPLY\')) not null, "to_address" varchar(255) not null, "to_name" varchar(255) not null, "sent_at" timestamptz(0) not null, "variables" jsonb not null);');
    this.addSql('alter table "notification_tx_emails" add constraint "notification_tx_emails_pkey" primary key ("id");');
    this.addSql('create index "notification_tx_emails_user_id_index" on "notification_tx_emails" ("user_id");');
    this.addSql('create index "notification_tx_emails_transaction_index" on "notification_tx_emails" ("transaction");');
    this.addSql('create index "notification_tx_emails_sent_at_index" on "notification_tx_emails" ("sent_at");');

    this.addSql('create table "users" ("id" uuid not null, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "joined_at" timestamptz(0) not null, "roles" text[] not null);');
    this.addSql('alter table "users" add constraint "users_pkey" primary key ("id");');

    this.addSql('create table "challenge_nonprofit_categories" ("id" uuid not null, "name" varchar(255) not null, "description" text not null, "parent_category_id" uuid null);');
    this.addSql('alter table "challenge_nonprofit_categories" add constraint "challenge_nonprofit_categories_pkey" primary key ("id");');

    this.addSql('create table "challenge_nonprofits" ("id" uuid not null, "name" varchar(255) not null, "description" text not null, "category_id" uuid not null, "logo" varchar(1000) null, "is_default" bool not null);');
    this.addSql('alter table "challenge_nonprofits" add constraint "challenge_nonprofits_pkey" primary key ("id");');

    this.addSql('create table "challenge_user_settings" ("id" uuid not null, "user_id" uuid not null, "nonprofit_id" uuid not null, "updated_at" timestamptz(0) not null, "minimum_donation" money not null, "signature" text not null);');
    this.addSql('alter table "challenge_user_settings" add constraint "challenge_user_settings_pkey" primary key ("id");');

    this.addSql('create table "challenge_templates" ("id" uuid not null, "body" text not null, "is_enabled" bool not null, "greeting_block" text not null, "lead_block" text not null, "donate_block" text not null, "expected_block" text not null, "signature_block" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "challenge_templates" add constraint "challenge_templates_pkey" primary key ("id");');

    this.addSql('create table "challenge_connection_settings" ("id" uuid not null, "connection_id" uuid not null, "user_id" uuid not null, "template_id" uuid null, "mode" text check ("mode" in (\'SEND\', \'DRAFT\', \'DISABLE\')) not null, "updated_at" timestamptz(0) not null, "greeting_block" text null, "lead_block" text null, "donate_block" text null, "expected_block" text null, "signature_block" text null);');
    this.addSql('alter table "challenge_connection_settings" add constraint "challenge_connection_settings_pkey" primary key ("id");');
    this.addSql('create index "challenge_connection_settings_connection_id_index" on "challenge_connection_settings" ("connection_id");');

    this.addSql('create table "challenges" ("id" uuid not null, "user_id" uuid not null, "connection_id" uuid not null, "thread_id" varchar(255) not null, "message_id" varchar(255) not null, "action" text check ("action" in (\'PRESENT\', \'WITHHOLD\')) not null, "withhold_reason" text check ("withhold_reason" in (\'\')) null, "template_id" uuid not null, "nonprofit_id" uuid not null, "to" varchar(255) not null, "body" text not null, "created_at" timestamptz(0) not null, "mode" text check ("mode" in (\'SEND\', \'DRAFT\', \'DISABLE\')) not null, "sent_message_id" uuid null);');
    this.addSql('alter table "challenges" add constraint "challenges_pkey" primary key ("id");');
    this.addSql('create index "challenges_user_id_index" on "challenges" ("user_id");');
    this.addSql('create index "challenges_thread_id_index" on "challenges" ("thread_id");');

    this.addSql('create table "challenge_interactions" ("id" uuid not null, "challenge_id" uuid not null, "interaction" text check ("interaction" in (\'CLICKED\', \'OPENED\', \'DONATED\', \'EXPECTED\', \'USER_REPLIED\')) not null, "payment_id" uuid not null, "donation_amount" int4 not null, "user_reply_message_id" varchar(255) not null, "performed_at" timestamptz(0) not null);');
    this.addSql('alter table "challenge_interactions" add constraint "challenge_interactions_pkey" primary key ("id");');

    this.addSql('create table "gatekeeper_allowed_threads" ("id" uuid not null, "thread_id" uuid not null, "allowed_at" timestamptz(0) not null, "reason" text check ("reason" in (\'USER_PARTICIPATING\', \'ALLOWED_STARTED\')) not null);');
    this.addSql('alter table "gatekeeper_allowed_threads" add constraint "gatekeeper_allowed_threads_pkey" primary key ("id");');
    this.addSql('create index "gatekeeper_allowed_threads_thread_id_index" on "gatekeeper_allowed_threads" ("thread_id");');

    this.addSql('create table "gatekeeper_trainings" ("id" uuid not null, "user_id" uuid not null, "username" varchar(255) null, "domain" varchar(255) not null, "rule" text check ("rule" in (\'ALLOW\', \'GATE\', \'MUTE\', \'IGNORE\')) not null, "origin" text check ("origin" in (\'ADMIN_APP\', \'SENT_EMAIL\', \'RECEIVED_EMAIL\', \'CALENDAR\', \'PATTERN\', \'USER_INBOX\', \'USER_APP\', \'INITIAL_DEFAULTS\')) not null, "created_at" timestamptz(0) not null);');
    this.addSql('alter table "gatekeeper_trainings" add constraint "gatekeeper_trainings_pkey" primary key ("id");');
    this.addSql('create index "gatekeeper_trainings_user_id_index" on "gatekeeper_trainings" ("user_id");');
    this.addSql('create index "gatekeeper_trainings_username_index" on "gatekeeper_trainings" ("username");');
    this.addSql('create index "gatekeeper_trainings_domain_index" on "gatekeeper_trainings" ("domain");');

    this.addSql('create table "gatekeeper_patterns" ("id" uuid not null, "name" varchar(255) not null, "description" text not null, "expression" varchar(255) not null, "created_by" varchar(255) not null, "rule" text check ("rule" in (\'ALLOW\', \'GATE\', \'MUTE\', \'IGNORE\')) not null, "created_at" timestamptz(0) not null, "deleted_at" timestamptz(0) null);');
    this.addSql('alter table "gatekeeper_patterns" add constraint "gatekeeper_patterns_pkey" primary key ("id");');

    this.addSql('create table "gatekeeper_decisions" ("id" uuid not null, "user_id" uuid not null, "connection_id" uuid not null, "email_address" varchar(255) not null, "message_id" uuid not null, "thread_id" uuid not null, "enforced_training_id" uuid null, "enforced_pattern_id" uuid null, "allowed_thread_id" uuid null, "verdict" text check ("verdict" in (\'ADDRESS_ALLOWED\', \'ADDRESS_GATED\', \'ADDRESS_MUTED\', \'ADDRESS_ON_THREAD\', \'DOMAIN_ALLOWED\', \'DOMAIN_GATED\', \'DOMAIN_MUTED\', \'PATTERN_ALLOWED\', \'PATTERN_GATED\', \'PATTERN_MUTED\', \'CALENDAR_INVITE_IGNORE\', \'MAILING_LIST_IGNORE\', \'SENDER_UNKNOWN_GATED\')) not null, "ruling" text check ("ruling" in (\'ALLOW\', \'GATE\', \'MUTE\', \'IGNORE\')) not null, "decided_at" timestamptz(0) not null);');
    this.addSql('alter table "gatekeeper_decisions" add constraint "gatekeeper_decisions_pkey" primary key ("id");');
    this.addSql('create index "gatekeeper_decisions_user_id_index" on "gatekeeper_decisions" ("user_id");');

    this.addSql('create table "payment" ("id" uuid not null, "provider" text check ("provider" in (\'Stripe\')) not null, "external_id" varchar(128) null, "amount" int4 not null);');
    this.addSql('alter table "payment" add constraint "payment_pkey" primary key ("id");');
    this.addSql('alter table "payment" add constraint "payment_external_id_unique" unique ("external_id");');

    this.addSql('create table "service_provider_nylas_webhooks" ("id" uuid not null, "external_id" varchar(255) not null, "callback_url" varchar(255) not null, "triggers" varchar(255) not null);');
    this.addSql('alter table "service_provider_nylas_webhooks" add constraint "service_provider_nylas_webhooks_pkey" primary key ("id");');

    this.addSql('create table "service_provider_connections" ("id" uuid not null, "user_id" uuid not null, "email_address" varchar(255) not null, "aliases" text[] null default \'{}\', "provider_user_id" varchar(255) not null, "external_access_token" varchar(255) not null, "external_account_id" varchar(255) not null, "provider" text check ("provider" in (\'GOOGLE\')) not null, "provider_token" varchar(255) not null, "status" text check ("status" in (\'RUNNING\', \'STOPPED\', \'INVALID\', \'INITIALIZING\', \'PROVISIONED\')) not null, "created_at" timestamptz(0) not null, "is_activated" bool not null, "gated_label_id" varchar(255) not null, "expected_label_id" varchar(255) not null, "donated_label_id" varchar(255) not null);');
    this.addSql('alter table "service_provider_connections" add constraint "service_provider_connections_pkey" primary key ("id");');
    this.addSql('create index "service_provider_connections_email_address_index" on "service_provider_connections" ("email_address");');
    this.addSql('create index "service_provider_connections_provider_user_id_index" on "service_provider_connections" ("provider_user_id");');
    this.addSql('create index "service_provider_connections_external_account_id_index" on "service_provider_connections" ("external_account_id");');

    this.addSql('create table "service_provider_connection_logs" ("id" uuid not null, "connection_id" uuid not null, "status" text check ("status" in (\'RUNNING\', \'STOPPED\', \'INVALID\', \'INITIALIZING\', \'PROVISIONED\')) not null, "created_at" timestamptz(0) not null);');
    this.addSql('alter table "service_provider_connection_logs" add constraint "service_provider_connection_logs_pkey" primary key ("id");');

    this.addSql('create table "service_provider_threads" ("id" uuid not null, "connection_id" uuid not null, "labels" text[] not null, "is_starred" bool not null, "is_unread" bool not null, "user_id" uuid not null, "external_thread_id" varchar(255) not null, "participants" jsonb not null, "first_message_at" timestamptz(0) not null, "last_message_at" timestamptz(0) not null, "last_received_at" timestamptz(0) not null, "last_sent_at" timestamptz(0) not null);');
    this.addSql('alter table "service_provider_threads" add constraint "service_provider_threads_pkey" primary key ("id");');
    this.addSql('create index "service_provider_threads_external_thread_id_index" on "service_provider_threads" ("external_thread_id");');

    this.addSql('create table "service_provider_messages" ("id" uuid not null, "connection_id" uuid not null, "labels" text[] not null, "is_starred" bool not null, "is_unread" bool not null, "user_id" uuid not null, "thread_id" uuid not null, "external_message_id" varchar(255) not null, "to" jsonb not null, "from" jsonb not null, "cc" jsonb not null, "bcc" jsonb not null, "reply_to" jsonb not null, "user_participant_of" text check ("user_participant_of" in (\'to\', \'cc\', \'bcc\', \'from\', \'unknown\')) not null, "type" text check ("type" in (\'sent\', \'received\')) not null, "received_at" timestamptz(0) not null, "was_sent_by_system" bool not null);');
    this.addSql('alter table "service_provider_messages" add constraint "service_provider_messages_pkey" primary key ("id");');
    this.addSql('create index "service_provider_messages_external_message_id_index" on "service_provider_messages" ("external_message_id");');

    this.addSql('create table "service_provider_thread_moves" ("id" uuid not null, "connection_id" uuid not null, "thread_id" uuid not null, "destination" text check ("destination" in (\'inbox\', \'all\', \'trash\', \'archive\', \'drafts\', \'sent\', \'spam\', \'important\', \'✨ Gated\', \'👋 Expected\', \'💌 Donation\')) not null, "external_label_ids" text[] not null, "created_at" timestamptz(0) not null);');
    this.addSql('alter table "service_provider_thread_moves" add constraint "service_provider_thread_moves_pkey" primary key ("id");');

    this.addSql('create table "service_provider_connection_syncs" ("id" uuid not null, "connection_id" uuid not null, "target_depth" timestamptz(0) not null, "last_depth" timestamptz(0) null, "started_at" timestamptz(0) not null, "page_token" varchar(255) null, "type" text check ("type" in (\'SENT\')) not null, "finished_at" timestamptz(0) null);');
    this.addSql('alter table "service_provider_connection_syncs" add constraint "service_provider_connection_syncs_pkey" primary key ("id");');

    this.addSql('alter table "challenge_nonprofit_categories" add constraint "challenge_nonprofit_categories_parent_category_id_foreign" foreign key ("parent_category_id") references "challenge_nonprofit_categories" ("id") on update cascade on delete set null;');

    this.addSql('alter table "challenge_nonprofits" add constraint "challenge_nonprofits_category_id_foreign" foreign key ("category_id") references "challenge_nonprofit_categories" ("id") on update cascade;');

    this.addSql('alter table "challenge_user_settings" add constraint "challenge_user_settings_nonprofit_id_foreign" foreign key ("nonprofit_id") references "challenge_nonprofits" ("id") on update cascade;');

    this.addSql('alter table "challenge_connection_settings" add constraint "challenge_connection_settings_template_id_foreign" foreign key ("template_id") references "challenge_templates" ("id") on update cascade on delete set null;');

    this.addSql('alter table "challenges" add constraint "challenges_template_id_foreign" foreign key ("template_id") references "challenge_templates" ("id") on update cascade;');
    this.addSql('alter table "challenges" add constraint "challenges_nonprofit_id_foreign" foreign key ("nonprofit_id") references "challenge_nonprofits" ("id") on update cascade;');

    this.addSql('alter table "challenge_interactions" add constraint "challenge_interactions_challenge_id_foreign" foreign key ("challenge_id") references "challenges" ("id") on update cascade;');

    this.addSql('alter table "service_provider_connection_logs" add constraint "service_provider_connection_logs_connection_id_foreign" foreign key ("connection_id") references "service_provider_connections" ("id") on update cascade;');

    this.addSql('alter table "service_provider_threads" add constraint "service_provider_threads_connection_id_foreign" foreign key ("connection_id") references "service_provider_connections" ("id") on update cascade;');

    this.addSql('alter table "service_provider_messages" add constraint "service_provider_messages_connection_id_foreign" foreign key ("connection_id") references "service_provider_connections" ("id") on update cascade;');
    this.addSql('alter table "service_provider_messages" add constraint "service_provider_messages_thread_id_foreign" foreign key ("thread_id") references "service_provider_threads" ("id") on update cascade;');

    this.addSql('alter table "service_provider_thread_moves" add constraint "service_provider_thread_moves_connection_id_foreign" foreign key ("connection_id") references "service_provider_connections" ("id") on update cascade;');
    this.addSql('alter table "service_provider_thread_moves" add constraint "service_provider_thread_moves_thread_id_foreign" foreign key ("thread_id") references "service_provider_threads" ("id") on update cascade;');

    this.addSql('alter table "service_provider_connection_syncs" add constraint "service_provider_connection_syncs_connection_id_foreign" foreign key ("connection_id") references "service_provider_connections" ("id") on update cascade;');
  }

}
