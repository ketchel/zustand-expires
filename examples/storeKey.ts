import {create} from "zustand";
import {expires, ExpiryType} from "../src/expires";

/**
 * A store that expires according to a key in the store
 */

type State = {
    count: number;
    expiry: number;
    actions: Actions;
};

type Actions = {
    increment: () => void;
}

const interval = 3*1000;
function reset(): Partial<State> {
    return {count: 0, expiry: Date.now() + interval};
}

const useSimpleExpiringStore = create<State>(
    expires((set) => ({
            count: 0,
            expiry: Date.now() + interval,
            actions: {
                increment: () => set(state => ({count: state.count + 1})),
            }
        }),
        {expiry: 'expiry', expiryType: ExpiryType.StoreKey, onExpiry: reset }
    ));
