import React, { useEffect, useState } from 'react';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { 
    Box, 
    Avatar, 
    Typography, 
    Button, 
    Card, 
    CardContent, 
    Container,
    Grid,
    Paper,
    Snackbar,
    IconButton
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

export function Home() {
    const resetAuthStore = useAuthStore(state => state.reset);
    const tokenExpiry = useAuthStore(state => state.expiry);
    const numRefreshes = useAuthStore(state => state.numRefreshes);
    const user = useUserStore();

    const [showRefreshSnackbar, setShowRefreshSnackbar] = useState(false);
    const [timeToTokenExpiryMs, setTimeToTokenExpiryMs] = useState(tokenExpiry - Date.now());

    function handleLogout() {
        resetAuthStore();
        user.reset();
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeToTokenExpiryMs(tokenExpiry - Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, [tokenExpiry]);

    useEffect(() => {
        setShowRefreshSnackbar(numRefreshes > 0);
    }, [numRefreshes]);

    const closeSnackbarButton = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setShowRefreshSnackbar(false)}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    )

    const timeToTokenExpiryPretty = `${Math.round(timeToTokenExpiryMs / 1000)}s`;

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                        <Avatar
                            src={user.image}
                            alt={`${user.firstName} ${user.lastName}`}
                            sx={{ width: 80, height: 80, mb: 2 }}
                        />
                        <Typography variant="h4" component="h1" gutterBottom>
                            Welcome, {user.firstName}!
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            (Time to token expiry: {timeToTokenExpiryPretty})
                        </Typography>
                    </Box>
                    
                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="text.secondary">Username:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body1">{user.username}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="text.secondary">Email:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body1">{user.email}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="body2" color="text.secondary">Full name:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="body1">{user.firstName} {user.lastName}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    
                    <Box display="flex" justifyContent="center">
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Box>
                </Paper>
            </Box>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={showRefreshSnackbar}
                autoHideDuration={6000}
                onClose={() => setShowRefreshSnackbar(false)}
                message="Token refreshed"
                action={closeSnackbarButton}
            />
        </Container>
    );
}