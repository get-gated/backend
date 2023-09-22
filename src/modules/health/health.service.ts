import { createLightship, Lightship } from 'lightship';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  BeaconContext,
  BeaconController,
  ShutdownHandler,
} from 'lightship/dist/src/types';

import LightshipConfig from './health.config';

/**
 * @name HealthService
 * @description
 * The health service is a thin wrapper of lightship
 * to expose health/readiness/liveness probes.
 * This is used by k8s to determine app health
 * and when traffic should be routed to it.
 * https://github.com/gajus/lightship
 */
export class HealthService {
  private lightship: Lightship;

  constructor(
    @Inject(LightshipConfig.KEY) config: ConfigType<typeof LightshipConfig>,
  ) {
    this.lightship = createLightship(config.lightship);
  }

  public registerShutdownHandler(shutdownHandler: ShutdownHandler): void {
    return this.lightship.registerShutdownHandler(shutdownHandler);
  }

  public createBeacon(context?: BeaconContext): BeaconController {
    return this.lightship.createBeacon(context);
  }

  public signalReady(): void {
    this.lightship.signalReady();
  }

  public shutdown(): Promise<void> {
    return this.lightship.shutdown();
  }

  public isShuttingDown(): boolean {
    return this.lightship.isServerShuttingDown();
  }
}
