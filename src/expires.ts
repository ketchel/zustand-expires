import { StateCreator, StoreMutatorIdentifier } from 'zustand';

/**
 * Tells the middleware how to interpret the expiry value
 *  @param Interval - The store will call onExpiry every `expiry` milliseconds
 *  @param Timestamp - The store will call onExpiry at the timestamp `expiry` (in milliseconds)
 *  @param StoreKey - The same as `Timestamp` but the timestamp is taken from the provided store key
 */
export enum ExpiryType {
    Interval = 'interval',
    Timestamp = 'timestamp',
    StoreKey = 'key'
}

/**
 * Options for the expires middleware
 *  @param expiry - The expiry value. Either a number of milliseconds, a timestamp in milliseconds, or a store key
 *  @param expiryType - How to interpret the expiry value. Defaults to `Interval`
 *  @param onExpiry - A function that returns a partial state that will be merged into the store when the store expires
 *  @param buffer - A buffer in milliseconds. `onExpire` will be called `buffer` milliseconds before the actual expiry
 */
export type ExpiresOptions<T extends object> = {
  expiry: number | keyof T;
  expiryType: ExpiryType;
  onExpiry: () => Partial<T> | Promise<Partial<T>>;
  buffer?: number;
};

export type Expires = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  options?: ExpiresOptions<T>
) => StateCreator<T, Mps, Mcs>;

type ExpiresImpl = <T extends object>(f: StateCreator<T, [], []>, options: ExpiresOptions<T>) => StateCreator<T, [], []>;

const expiresImpl: ExpiresImpl = (f, options) => (set, get, store) => {
    let timeoutId: NodeJS.Timeout;

    const { expiry, expiryType = ExpiryType.Interval, onExpiry, buffer = 0 } = options;

    const timeUntilStoreExpires = () => {
      switch (expiryType) {
          case ExpiryType.Interval:
            return expiry as number;
          case ExpiryType.Timestamp:
            return (expiry as number) - Date.now();
          case ExpiryType.StoreKey:
            const state = get()
            if (state && expiry in state) {
                return (state[expiry]) - Date.now();
            }
            return 0;
      }
    }

    const scheduleExpiry = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const timeout = timeUntilStoreExpires() - buffer
      if (timeout <= 0) {
          return;
      }

      timeoutId = setTimeout(async () => {
        const partial = await onExpiry();
        set(partial);
        scheduleExpiry();
      }, timeout);
    }

    if (expiryType !== ExpiryType.StoreKey) {
        scheduleExpiry();
        return f(set, get, store);
    }

    // If we try to schedule the timeout right away the state will be undefined
    // Therefore, we'll start it on the first set or get
    const onGet: typeof get = (...args) => {
        if (timeoutId === undefined) {
            scheduleExpiry();
        }
        return get(...args);
    };

    // If the expiry is a store key, we need to reschedule the expiry whenever the key changes
    const onSet: typeof set = (partial, replace) => {
        if (expiry in partial) {
            scheduleExpiry();
        }
        set(partial, replace);
    }

    store.getState = onGet;
    store.setState = onSet;

    return f(onSet, onGet, store);
};

export const expires = expiresImpl as Expires
