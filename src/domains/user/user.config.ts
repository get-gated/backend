import { registerAs } from '@nestjs/config';
import { envOrFail } from '@app/modules/utils';

interface UserConfig {
  avatarBucket: string;
  oldSystemUrl?: string;
  userTaskPendingThresholdHours: number;
}

export default registerAs(
  'user',
  (): UserConfig => ({
    avatarBucket: envOrFail('USER_AVATAR_BUCKET'),
    oldSystemUrl: process.env.OLD_SYSTEM_URL,
    userTaskPendingThresholdHours: Number(
      process.env.USER_TASK_PENDING_THRESHOLD_HOURS ?? 28,
    ),
  }),
);
