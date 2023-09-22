import { IJob } from '@app/modules/job/job.interface';

export class JobService {
  private jobs: { [key: string]: IJob } = {};

  public registerJob(name: string, instance: IJob): void {
    if (this.jobs[name]) {
      throw new Error(`Job already registered for name '${name}'`);
    }
    this.jobs[name] = instance;
  }

  public async run(name: string): Promise<void> {
    const job = this.jobs[name];
    if (!job) {
      throw new Error(`No job registered with name '${name}'`);
    }
    await job.run();
  }
}
