import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, Paper } from '@mui/material';
import styled from '@emotion/styled';


const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    &:hover {
        text-decoration: underline;
    }
`;

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/shops');
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px', borderRadius: '15px' }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <form onSubmit={handleLogin} style={{ width: '100%', marginTop: '20px' }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '20px' }}
                        >
                            Login
                        </Button>
                        <Box mt={2} textAlign="center">
                            <Typography variant="body2">
                                If you're not registered, <StyledLink to="/register">register yourself</StyledLink>.
                            </Typography>
                        </Box>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
}

export default Login;
