import * as Bluebird from 'bluebird';
import { Maybe } from '@app/modules/utils';

// eslint-disable-next-line @typescript-eslint/ban-types, no-use-before-define
const buckets: WeakMap<Object, Bucket> = new WeakMap<Object, Bucket>();

let running = true;

class Reservation {
  units: number;

  timestamp: bigint;

  disposer: () => unknown;

  constructor(units: number, disposer: () => unknown) {
    this.units = units;
    this.timestamp = process.hrtime.bigint();
    this.disposer = disposer;
  }

  public clear(): void {
    this.disposer();
  }
}

interface ReservationRequest {
  units: number;
  resolve: (value: Reservation) => void;
}

class Bucket {
  private reservationsWindow: Set<Reservation> = new Set<Reservation>();

  private max = 0;

  private reservationQueue: ReservationRequest[] = [];

  private watching = false;

  constructor(max: number) {
    this.max = max;
  }

  private scan(): number {
    const startTime = process.hrtime.bigint() - BigInt(1000 * 1e6);
    let total = 0;
    this.reservationsWindow.forEach((reservation) => {
      if (reservation.timestamp < startTime) {
        this.reservationsWindow.delete(reservation);
        return;
      }
      total += reservation.units;
    });
    return total;
  }

  private getReservation(units: number): Maybe<Reservation> {
    const total = this.scan();
    if (total + units < this.max) {
      const reservation = new Reservation(units, () => {
        this.clear(reservation);
      });
      this.reservationsWindow.add(reservation);
      return reservation;
    }
    return null;
  }

  public stop(): void {
    this.watching = false;
  }

  private watch(): void {
    if (this.watching) {
      return;
    }
    this.watching = true;
    const work = (): void => {
      if (this.reservationQueue[0]) {
        const request = this.reservationQueue[0];
        const reservation = this.getReservation(request.units);
        if (reservation) {
          this.reservationQueue.shift();
          request.resolve(reservation);
        }
      } else {
        this.watching = false;
        return;
      }
      if (running) {
        setTimeout(work);
      }
    };

    if (running) {
      setTimeout(work);
    }
  }

  public request(units: number): Promise<Reservation> {
    if (units > this.max) {
      throw new Error(
        `unable to reserve units beyond the maximum of ${this.max}, requested units: ${units}`,
      );
    }

    let resolve: ReservationRequest['resolve'] | undefined;
    const reservationPromise = new Promise<Reservation>((resolver) => {
      resolve = resolver;
    });
    const reservationRequest: ReservationRequest = {
      units,
      resolve: resolve as ReservationRequest['resolve'],
    };

    this.reservationQueue.push(reservationRequest);

    this.watch();

    return reservationPromise;
  }

  clear(reservation: Reservation): void {
    this.reservationsWindow.delete(reservation);
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
function getBucket(clientId: Object): Bucket {
  if (buckets.has(clientId)) {
    return buckets.get(clientId) as Bucket;
  }
  const bucket = new Bucket(102);
  buckets.set(clientId, bucket);
  return bucket;
}

/**
 * Creates a "reservation" that is resolved when there are enough quota units available in the current window. Clients should await the reservation before performing
 * subsequent requesets. Reservations are resolved in requested order.
 *
 * @param {Object} clientId - An Object that will used as reference for weak reference. Ensure a strong reference is maintained to this value until no longer needed.
 * @param units
 * @returns A Reservation.
 */
export async function reserve(
  // eslint-disable-next-line @typescript-eslint/ban-types
  clientId: Object,
  units: number,
): Promise<Reservation> {
  const bucket = getBucket(clientId);
  return bucket.request(units);
}

/**
 * Executes the given function once a quota reservation becomes available.
 *
 * @param {Object} clientId - An Object that will used as a weak reference for managing reservations per unique user client. Ensure a strong reference is maintained to this value until no longer needed.
 */
export async function withReservation<
  T extends (res: Reservation) => Promise<unknown>,
  // eslint-disable-next-line @typescript-eslint/ban-types
>(clientId: Object, units: number, fn: T): Promise<Awaited<ReturnType<T>>> {
  const reservation = await reserve(clientId, units);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const reservationDisposer = Bluebird.resolve(reservation).disposer(() => {
    reservation.clear();
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Bluebird.using(reservationDisposer, fn) as Promise<
    Awaited<ReturnType<T>>
  >;
}

process.on('beforeExit', () => {
  running = false;
});
