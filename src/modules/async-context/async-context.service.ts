import { Injectable } from '@nestjs/common';
import { AsyncContext } from '@nestjs-steroids/async-context';

interface Context {
  userId?: string;
  connectionId?: string;
  anonymousId?: string; // used for interactions prior to a user record is created
}

@Injectable()
export class AsyncContextService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private ac: AsyncContext<keyof Context, any>) {}

  public register(initial?: Context): void {
    this.ac.register();

    if (initial) {
      Object.entries(initial).forEach(([key, value]) =>
        this.ac.set(key as keyof Context, value),
      );
    }
  }

  public getAll(): Context {
    const asyncContext: Context = {};
    this.ac.forEach((val, key) => {
      asyncContext[key] = val;
    });
    return asyncContext;
  }

  public set(key: keyof Context, value: unknown): void {
    this.ac.set(key, value);
  }

  public get(key: keyof Context): string | undefined {
    return this.ac.get(key);
  }
}
