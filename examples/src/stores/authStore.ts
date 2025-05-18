import {create} from "zustand";
import {persist} from "zustand/middleware";
import {expires, ExpiryType} from "../../../src/expires";
import {refreshToken} from "../services/auth";
import {AuthStatus, AuthState} from "../types";

type AuthActions = {
    reset: () => void;
}

type AuthStore = AuthState & AuthActions;

async function refresh(): Promise<Partial<AuthStore>> {
    const store = useAuthStore.getState();
    if (store.refreshToken) {
        const response = await refreshToken(store.refreshToken)
        return {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiry: Date.now() + 60 * 1000,
            authStatus: AuthStatus.AUTHENTICATED,
        }
    }

    return {authStatus: AuthStatus.UNAUTHENTICATED};
}

const initialState: AuthState = {
    accessToken: '',
    refreshToken: '',
    expiry: 0,
    authStatus: AuthStatus.UNAUTHENTICATED,
}

function partialize(state: AuthState) {
    return state
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
                // TODO Reset does not cancel the timeout in expires
                reset: () => set(initialState)
            }),
            {expiry: 'expiry', expiryType: ExpiryType.StoreKey, onExpiry: refresh}
        ),
    {
        name: 'authStore',
        partialize: partialize,
    },
    )
);
