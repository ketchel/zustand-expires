import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import {login} from "../services/auth";

export function Login() {
    // Local state
    const [username, setUsername] = useState('emilys');
    const [password, setPassword] = useState('emilyspass');
    const [didLoginFail, setDidLoginFail] = useState(false);

    const handleLogin = () => {
        if (username === '' || password === '') {
            return;
        }

        login(username, password).then((success) => {
            setDidLoginFail(!success);
        });
    };

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <TextField
                    error={didLoginFail}
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setDidLoginFail(false)}
                />
                <TextField
                    error={didLoginFail}
                    helperText={didLoginFail? 'Invalid username or password' : ''}
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setDidLoginFail(false)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleLogin}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Login
                </Button>
            </Box>
        </Container>
    );
}