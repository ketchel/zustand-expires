import {AuthState, AuthStatus, UserData} from "../types";

type RefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
}

const expiresInMins = 1;

export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const jsonBody = JSON.stringify({
        refreshToken: refreshToken,
        expiresInMins: 1,
    })

    return await authFetch('refresh', jsonBody)
}

export async function login(username: string, password: string): Promise<UserData> {
    const jsonBody = JSON.stringify({
        username: username,
        password: password,
        expiresInMins: expiresInMins,
    })

    return await authFetch('login', jsonBody)
}

async function authFetch(endpoint: string, jsonBody: string) {
    try {
        const response = await fetch(`https://dummyjson.com/auth/${endpoint}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: jsonBody,
        })

        return await response.json()
    }
    catch {
    }
}