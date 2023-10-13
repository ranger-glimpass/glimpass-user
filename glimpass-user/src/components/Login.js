import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Container, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if session storage exists
    const userId = sessionStorage.getItem('_id');
    if (userId) {
      // If it does, redirect to the shops page
      navigate('/markets');
    }
  }, [navigate]);

  
   const handleLogin = async () => {
  //   const response = await fetch('https://app.glimpass.com/user/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email }),
  //   });
  //   const data = await response.json();
  //   if (data) {
      
  //   console.log(data,"data")
  //     sessionStorage.setItem('_id', data._id);
  //     sessionStorage.setItem('email', data.email);
  //     sessionStorage.setItem('name', data.name);
  //     navigate('/markets');
  //   } else {
       setIsEmailSubmitted(true);
  //   }
    };

  const handleRegister = async () => {
    // const response = await fetch('https://app.glimpass.com/user/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, name }),
    // });
    // const data = await response.json();
    // console.log(data,"register")
    // sessionStorage.setItem('_id', data[0].user._id);
    // sessionStorage.setItem('email', data[0].user.email);
    // sessionStorage.setItem('name', data[0].user.name);
    
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('name', name);
    navigate('/markets');
  };

  const handleContinue = () => {
    if (!isEmailSubmitted && email) {
      handleLogin();
    } else if (isEmailSubmitted && name) {
      handleRegister();
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '15px' }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box width="100%" marginTop="20px">
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus={!isEmailSubmitted}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEmailSubmitted}
            />
            {isEmailSubmitted && (
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '20px' }}
              onClick={handleContinue}
            >
              {isEmailSubmitted ? 'Login' : 'Continue'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;