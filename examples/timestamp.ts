import {create} from "zustand";
import {expires, ExpiryType} from "../src/expires";
import {sleep} from "./utils/sleep";
import assert = require("node:assert");

/**
 * A simple store that resets itself after a certain time.
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

const expiry = Date.now() + 3*1000;

const useSimpleExpiringStore = create<State>(
    expires((set) => ({
        count: 0,
        actions: {
            increment: () => set(state => ({count: state.count + 1})),
        }
    }),
        {expiry: expiry, expiryType: ExpiryType.Timestamp, onExpiry: reset }
));

const getState = useSimpleExpiringStore.getState;
const increment = getState().actions.increment;

async function test() {
    const counts: number[] = [];
    while (Date.now() < expiry + 1000) {
        counts.push(getState().count);
        // console.log(counts)
        increment();
        await sleep(1);
    }

    return counts
}

test().then((counts) => {
    const numZeros = counts.filter((c) => c === 0).length;
    assert(numZeros >= 2);
    assert(numZeros < counts.length);
    console.log("PASS")
})
