export enum AuthStatus {
    AUTHENTICATED='authenticated',
    UNAUTHENTICATED='unauthenticated',
    FAILED='failed',
}

export type AuthState = {
    accessToken: string;
    refreshToken: string;
    expiry: number;
    authStatus: AuthStatus;
    actions: AuthActions;
}

type AuthActions = {
    set: (authState: AuthState) => void;
}

// DummyJson gives a lot more properties than this, but this is just an example
export type UserData = {
    id: string,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    gender: string,
    image: string
}