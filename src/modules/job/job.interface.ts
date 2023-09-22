export interface IJob {
  run: () => Promise<void>;
}
