import {create} from "zustand";
import {expires, ExpiryType} from "../src/expires";
import {sleep} from "./utils/sleep";
import assert = require("node:assert");

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

const getState = useSimpleExpiringStore.getState;
const increment = getState().actions.increment;

const startTime = Date.now();

async function test() {
    const counts: number[] = [];
    while (Date.now() < startTime + 2*interval + 1000) {
        counts.push(getState().count);
        console.log(counts);
        increment();
        await sleep(1);
    }

    return counts
}

test().then((counts) => {
    const numZeros = counts.filter((c) => c === 0).length;
    assert(numZeros > 2);
    assert(numZeros < counts.length);
    console.log("PASS")
})
