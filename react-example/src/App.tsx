import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuthStore } from './stores/authStore';
import { AuthStatus } from '../types';
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { Card, CardContent, IconButton, Link, Typography, SvgIcon } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

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

            {/* Library name */}
            <Card sx={{ position: 'absolute', top: '10px', left: '10px', borderRadius: '20px' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Typography sx={{ opacity: 0.8 }}>zustand-expires</Typography>
                </CardContent>
            </Card>

            {/* NPM and GitHub links */}
            <Card sx={{ position: 'absolute', top: '10px', right: '10px', borderRadius: '20px' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <IconButton size="small" onClick={() => window.open('https://www.npmjs.com/package/zustand-expires', '_blank')}>
                        <SvgIcon>
                            {/* NPM logo */}
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="540px" height="210px" viewBox="0 0 18 7">
                                <path fill="#CB3837" d="M0,0h18v6H9v1H5V6H0V0z M1,5h2V2h1v3h1V1H1V5z M6,1v5h2V5h2V1H6z M8,2h1v2H8V2z M11,1v4h2V2h1v3h1V2h1v3h1V1H11z"/>
                                <polygon fill="#FFFFFF" points="1,5 3,5 3,2 4,2 4,5 5,5 5,1 1,1 "/>
                                <path fill="#FFFFFF" d="M6,1v5h2V5h2V1H6z M9,4H8V2h1V4z"/>
                                <polygon fill="#FFFFFF" points="11,1 11,5 13,5 13,2 14,2 14,5 15,5 15,2 16,2 16,5 17,5 17,1 "/>
                            </svg>
                        </SvgIcon>
                    </IconButton>
                    <IconButton size="small" onClick={() => window.open('https://github.com/josh-mckenzie/zustand-expires', '_blank')}>
                        <GitHubIcon />
                    </IconButton>
                </CardContent>
            </Card>

            {page}

            <Typography sx={{ textAlign: 'center', mt: 2 }}>
                Mock endpoints provided by <Link href="https://dummyjson.com" target="_blank">dummyjson.com</Link>
            </Typography>
        </ThemeProvider>
    );
}