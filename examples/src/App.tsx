import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuthStore } from './stores/authStore';
import { AuthStatus } from './types';
import { Login } from "./components/Login";
import { Home } from "./components/Home";

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export default function App() {
    const authStatus = useAuthStore(state => state.authStatus);

    let page;
    if (authStatus === AuthStatus.UNAUTHENTICATED) {
        page = <Login />;
    }
    else if (authStatus === AuthStatus.AUTHENTICATED) {
        page = <Home />;
    }
    else {
        page = <div>Invalid auth status</div>;
    }

    return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {page}
            </ThemeProvider>
    );
}