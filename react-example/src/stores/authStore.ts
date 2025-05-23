import {create} from "zustand";
import {persist} from "zustand/middleware";
import {expires, ExpiryType} from "../../../src/expires";
import {refreshToken, expiresInMins} from "../services/auth";
import {AuthStatus, AuthState} from "../../types";

type AuthActions = {
    reset: () => void;
}

type AuthStore = AuthState & AuthActions;

async function refresh(): Promise<Partial<AuthStore>> {
    const store = useAuthStore.getState();
    if (store.refreshToken) {
        console.log('Refreshing token')
        const response = await refreshToken(store.refreshToken)
        return {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiry: Date.now() + expiresInMins * 60 * 1000,
            numRefreshes: store.numRefreshes + 1,
            authStatus: AuthStatus.AUTHENTICATED,
        }
    }

    return {authStatus: AuthStatus.UNAUTHENTICATED};
}

const initialState: AuthState = {
    accessToken: '',
    refreshToken: '',
    expiry: 0,
    numRefreshes: 0,
    authStatus: AuthStatus.UNAUTHENTICATED,
}

function partialize(state: AuthState) {
    // Only persist authenticated state
    if (state.authStatus === AuthStatus.AUTHENTICATED) {
        return state
    }
    
    return initialState
}

export const useAuthStore = create<AuthStore>()(
    persist(
        expires(
            (set) => ({
                ...initialState,
                reset: () => set(initialState)
            }),
            {expiry: 'expiry', expiryType: ExpiryType.StoreKey, onExpiry: refresh, buffer: 5 * 1000}
        ),
    {
        name: 'authStore',
        partialize: partialize,
    },
    )
);
