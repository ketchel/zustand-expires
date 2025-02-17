import React from 'react';
import {useAuthStore} from './stores/authStore';
import {AuthStatus} from './types';
import {Login} from "./components/Login";
import {Home} from "./components/Home";
import {Error} from "./components/Error";

export default function App() {
    const authStatus = useAuthStore(state => state.authStatus);

    switch (authStatus) {
        case AuthStatus.UNAUTHENTICATED:
            return <Login />;
        case AuthStatus.AUTHENTICATED:
            return <Home />;
        case AuthStatus.FAILED:
            return <Error />;
        default:
            return <div>Something went wrong...</div>;
    }

}