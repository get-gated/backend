import { Migration } from '@mikro-orm/migrations';

export class Migration20221129204321 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "notification_user_settings" add column "is_deleted" bool, add column "deleted_at" timestamptz(0);');
  }

}
