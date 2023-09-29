// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Button, TextField, Typography, Container, Box, Paper } from '@mui/material';
// import styled from '@emotion/styled';


// const StyledLink = styled(Link)`
//     text-decoration: none;
//     color: inherit;
//     &:hover {
//         text-decoration: underline;
//     }
// `;

// const Login = () => {
//     const navigate = useNavigate();

//     const handleLogin = (e) => {
//         e.preventDefault();
//         navigate('/markets');
//     }

//     return (
//         <Container component="main" maxWidth="xs">
//             <Paper elevation={3} style={{ padding: '20px', borderRadius: '15px' }}>
//                 <Box display="flex" flexDirection="column" alignItems="center">
//                     <Typography component="h1" variant="h5">
//                         Login
//                     </Typography>
//                     <form onSubmit={handleLogin} style={{ width: '100%', marginTop: '20px' }}>
//                         <TextField
//                             variant="outlined"
//                             margin="normal"
//                             required
//                             fullWidth
//                             id="email"
//                             label="Email Address"
//                             name="email"
//                             autoComplete="email"
//                             autoFocus
//                         />
//                         <TextField
//                             variant="outlined"
//                             margin="normal"
//                             required
//                             fullWidth
//                             name="password"
//                             label="Password"
//                             type="password"
//                             id="password"
//                             autoComplete="current-password"
//                         />
//                         <Button
//                             type="submit"
//                             fullWidth
//                             variant="contained"
//                             color="primary"
//                             style={{ marginTop: '20px' }}
//                         >
//                             Login
//                         </Button>
//                         <Box mt={2} textAlign="center">
//                             <Typography variant="body2">
//                                 If you're not registered, <StyledLink to="/register">register yourself</StyledLink>.
//                             </Typography>
//                         </Box>
//                     </form>
//                 </Box>
//             </Paper>
//         </Container>
//     );
// }

// export default Login;
import React, { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const navigate = useNavigate();
  const handleContinue = () => {
    if (!isEmailSubmitted && email) {
      setIsEmailSubmitted(true);
    } else if (isEmailSubmitted && name) {
      // Handle login
      console.log('Logging in:', { email, name });
      navigate('/markets');
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
