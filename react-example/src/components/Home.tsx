import React, { useEffect, useState } from 'react';
import { useUserStore } from '../stores/userStore';
import { useAuthStore, expiresInMins } from '../stores/authStore';
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
    Snackbar
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';

export function Home() {
    const resetAuthStore = useAuthStore(state => state.reset);
    const tokenExpiry = useAuthStore(state => state.expiry);
    const user = useUserStore();

    function handleLogout() {
        resetAuthStore();
        user.reset();
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                        <Avatar
                            src={user.image}
                            alt={`${user.firstName} ${user.lastName}`}
                            sx={{ width: 80, height: 80, mb: 2 }}
                        />
                        <Typography variant="h4" component="h1" gutterBottom>
                            Welcome, {user.firstName}!
                        </Typography>
                    </Box>
                    
                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        User Information
                                    </Typography>
                                </Grid>
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
        </Container>
    );
}