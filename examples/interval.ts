import {create} from "zustand";
import {expires, ExpiryType} from "../src/expires";

/**
 * A simple store that resets itself on a regular interval
 */

type State = {
    count: number;
    actions: Actions;
};

type Actions = {
    increment: () => void;
}

function reset(): Partial<State> {
    return {count: 0};
}

const expiry = 3*1000;
const useSimpleExpiringStore = create<State>(
    expires((set) => ({
            count: 0,
            actions: {
                increment: () => set(state => ({count: state.count + 1})),
            }
        }),
        {expiry: expiry, expiryType: ExpiryType.Interval, onExpiry: reset }
    ));
