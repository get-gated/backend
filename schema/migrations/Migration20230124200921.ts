import { Migration } from '@mikro-orm/migrations';

export class Migration20230124200921 extends Migration {

  async up(): Promise<void> {
    this.addSql('delete from "notification_push_receipts"');
    this.addSql('alter table "notification_push_receipts" add column "external_receipt_id" varchar(255) not null;');
  }

}
