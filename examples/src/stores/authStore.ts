import {create} from "zustand";
// import {persist} from "zustand/middleware/persist";
import {expires, ExpiryType} from "../../../src/expires";
import {refreshToken} from "../services/auth";
import {AuthState, AuthStatus} from "../types";


async function refresh(): Promise<Partial<AuthState>> {
    const store = useAuthStore.getState();
    if (store.refreshToken) {
        const response = await refreshToken(store.refreshToken)
        return {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiry: Date.now() + 60 * 1000,
            authStatus: AuthStatus.AUTHENTICATED
        }
    }
    return {authStatus: AuthStatus.UNAUTHENTICATED};
}

export const useAuthStore = create<AuthState>()(
    // persist(
        expires(
            (set) => ({
                accessToken: '',
                refreshToken: '',
                expiry: 0,
                authStatus: AuthStatus.UNAUTHENTICATED,
                actions: {
                    set: (authState) => set(authState)
                }
            }),
            {expiry: 'expiry', expiryType: ExpiryType.StoreKey, onExpiry: refresh}
        ),
    // {name: 'authStore'}
    // )
);