import { SetMetadata } from '@nestjs/common';

export const JobToken = '__GATED_JOB__';

export const Job = (jobName: string): ReturnType<typeof SetMetadata> =>
  SetMetadata(JobToken, jobName);
