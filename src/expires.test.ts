import { create } from 'zustand';
import { expires, ExpiryType } from './expires';

interface TestState {
  count: number;
  increment?: () => void;
  expiryTime?: number;
  setExpiryTime?: (time: number) => void;
}

beforeAll(() => {
  jest.useFakeTimers();
});

const advanceTimers = async (ms: number) => {
  jest.advanceTimersByTime(ms);
  // Wait for promises to resolve
  await Promise.resolve();
}

// it('Should handle interval expiry', async () => {
//   const onExpiry = jest.fn().mockReturnValue({ count: 0 });
//   const useStore = create<TestState>(
//     expires(
//       (set) => ({
//         count: 1,
//         increment: () => set((state) => ({ count: state.count + 1 })),
//       }),
//       {
//         expiry: 1000,
//         expiryType: ExpiryType.Interval,
//         onExpiry,
//       }
//     )
//   );

//   expect(useStore.getState().count).toBe(1);
//   await advanceTimers(2000);
//   expect(onExpiry).toHaveBeenCalled();
//   expect(useStore.getState().count).toBe(0);
// });

// it('Should handle timestamp expiry', async () => {
//   const onExpiry = jest.fn().mockReturnValue({ count: 0 });
//   const useStore = create<TestState>(
//     expires(
//       (set) => ({
//         count: 1,
//         increment: () => set((state) => ({ count: state.count + 1 })),
//       }),
//       {
//         expiry: Date.now() + 1000,
//         expiryType: ExpiryType.Timestamp,
//         onExpiry,
//       }
//     )
//   );

//   expect(useStore.getState().count).toBe(1);
//   await advanceTimers(1000);
//   expect(onExpiry).toHaveBeenCalled();
//   expect(useStore.getState().count).toBe(0);
// });

// it('Should handle store key expiry', async () => {
//   const onExpiry = jest.fn().mockReturnValue({ count: 0 });
//   const useStore = create<TestState>(
//     expires(
//       (set) => ({
//         count: 1,
//         expiryTime: Date.now() + 1000,
//         setExpiryTime: (time: number) => set({ expiryTime: time }),
//       }),
//       {
//         expiry: 'expiryTime',
//         expiryType: ExpiryType.StoreKey,
//         onExpiry,
//       }
//     )
//   );

//   expect(useStore.getState().count).toBe(1);
//   await advanceTimers(1000);
//   expect(onExpiry).toHaveBeenCalled();
//   expect(useStore.getState().count).toBe(0);
// });

// it('Should handle buffer time', async () => {
//   const onExpiry = jest.fn().mockReturnValue({ count: 0 });
//   const useStore = create<TestState>(
//     expires(
//       (set) => ({
//         count: 1,
//         increment: () => set((state) => ({ count: state.count + 1 })),
//       }),
//       {
//         expiry: 1000,
//         expiryType: ExpiryType.Interval,
//         onExpiry,
//         buffer: 200,
//       }
//     )
//   );

//   expect(useStore.getState().count).toBe(1);
//   await advanceTimers(800);
//   expect(onExpiry).toHaveBeenCalled();
//   expect(useStore.getState().count).toBe(0);
// });

it('Should reschedule expiry when store key changes', async () => {
  const onExpiry = jest.fn().mockReturnValue({ count: 0 });
  const useStore = create<TestState>(
    expires(
      (set) => ({
        count: 1,
        expiryTime: Date.now() + 1000,
        setExpiryTime: (time: number) => set({ expiryTime: time }),
      }),
      {
        expiry: 'expiryTime',
        expiryType: ExpiryType.StoreKey,
        onExpiry,
      }
    )
  );

  expect(useStore.getState().count).toBe(1);
  useStore.getState().setExpiryTime!(Date.now() + 2000);
  jest.advanceTimersByTime(1000);
  expect(onExpiry).not.toHaveBeenCalled();
  // await advanceTimers(1000);
  // expect(onExpiry).toHaveBeenCalled();
  // expect(useStore.getState().count).toBe(0);
});