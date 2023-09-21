import React from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box, Paper } from '@mui/material';

const Register = () => {
    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: '20px', borderRadius: '15px' }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <form style={{ width: '100%', marginTop: '20px' }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="mobile"
                            label="Mobile No."
                            name="mobile"
                            autoComplete="tel"
                            type="tel"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
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
                            autoComplete="new-password"
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="confirm-password"
                            label="Confirm Password"
                            type="password"
                            id="confirm-password"
                            autoComplete="new-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={{ marginTop: '20px' }}
                        >
                            Register
                        </Button>
                        <Box mt={2} textAlign="center">
                            <Typography variant="body2">
                                Already registered? <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
                            </Typography>
                        </Box>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
}

export default Register;
