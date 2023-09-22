import { Migration } from '@mikro-orm/migrations';

export class Migration20221116234432 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_tasks" drop constraint if exists "user_tasks_task_check";');
    this.addSql('alter table "user_tasks" drop constraint if exists "user_tasks_resolution_check";');
    this.addSql('alter table "user_tasks" alter column "task" type text using ("task"::text);');
    this.addSql('alter table "user_tasks" add constraint "user_tasks_task_check" check ("task" in (\'CHOOSE_NONPROFIT\', \'TRAIN_DOMAINS\', \'INBOX_BASICS\', \'CONNECT_FIRST_ACCOUNT\', \'REVIEW_ALLOW_LIST\', \'TAKE_TOUR\'));');
    this.addSql('alter table "user_tasks" add constraint "user_tasks_resolution_check\" check ("resolution" in (\'COMPLETED\', \'DISMISSED\', \'PENDING\'));');

    this.addSql('alter table "notification_tx_emails" drop constraint if exists "notification_tx_emails_transaction_check";');
    this.addSql('alter table "notification_tx_emails" alter column "transaction" type text using ("transaction"::text);');
    this.addSql('alter table "notification_tx_emails" add constraint "notification_tx_emails_transaction_check" check ("transaction" in (\'FIRST_DONATION\', \'FIRST_EXPECTED\', \'FIRST_CONNECTION_READY\', \'DONATION_RECEIVED\', \'CONNECTION_STOPPED\', \'CONNECTION_RESUMED\', \'CONNECTION_READY\', \'CONNECTION_REMOVED\', \'RECEIPT_DONATION\', \'RECEIPT_EXPECTED\', \'ACCOUNT_REMOVED\', \'PENDING_FIRST_CONNECTION\'));');
  }

}
