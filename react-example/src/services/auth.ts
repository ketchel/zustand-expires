import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";
import {AuthStatus} from "../../types";

type RefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
}

const expiresInMins = 2;

export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const jsonBody = JSON.stringify({
        refreshToken: refreshToken,
        expiresInMins: expiresInMins,
    })

    return await authFetch('refresh', jsonBody)
}

export async function login(username: string, password: string) {
    const jsonBody = JSON.stringify({
        username: username,
        password: password,
        expiresInMins: expiresInMins,
    });

    const userAndAuthData = await authFetch('login', jsonBody);
    if (userAndAuthData.authStatus === AuthStatus.FAILED) {
        return false;
    }

    useUserStore.setState({
        id: userAndAuthData.id,
        username: userAndAuthData.username,
        firstName: userAndAuthData.firstName,
        lastName: userAndAuthData.lastName,
        email: userAndAuthData.email,
        image: userAndAuthData.image,
    })
    useAuthStore.setState({
        accessToken: userAndAuthData.accessToken,
        refreshToken: userAndAuthData.refreshToken,
        expiry: userAndAuthData.expiry,
        authStatus: userAndAuthData.authStatus,
    });

    return true;
}

async function authFetch(endpoint: string, jsonBody: string) {
    try {
        const response = await fetch(`https://dummyjson.com/auth/${endpoint}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: jsonBody,
        })

        if (!response.ok) {
            return {authStatus: AuthStatus.FAILED}
        }

        const data = await response.json()
        return {
            ...data,
            expiry: Date.now() + expiresInMins * 60 * 1000,
            authStatus: AuthStatus.AUTHENTICATED,
        }
    }
    catch {
        return {authStatus: AuthStatus.FAILED}
    }
}