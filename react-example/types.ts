export enum AuthStatus {
    AUTHENTICATED='authenticated',
    UNAUTHENTICATED='unauthenticated',
    FAILED='failed',
}

export type AuthState = {
    accessToken: string;
    refreshToken: string;
    expiry: number;
    numRefreshes: number;
    authStatus: AuthStatus;
}

// DummyJson gives a lot more properties than this, but this is just an example
export type UserState = {
    id: string,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    image: string
}