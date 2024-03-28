import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Container, Box, Paper } from '@mui/material';
import { useNavigate,useLocation } from 'react-router-dom';
import glimpassLogo from "../assets/glimpassLogo.png"
import logoGif from "../assets/logoGif.gif"
import LoadingSpinner from './LoadingSpinner'; // Assuming your Loading component is in the same directory
import * as apiService from '../apiService'; // Adjust the import path as necessary


import { GoogleLogin } from 'react-google-login';

import { gapi } from 'gapi-script';
const Login = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const navigate = useNavigate();

  const [showGif, setShowGif] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [googleEmail, setGoogleEmail] = useState(null);
  const [googleName, setGoogleName] = useState(null);

  
  const handleOrientation = (event) => {
    // Implement your logic for orientation changes
    console.log(event.alpha, event.beta, event.gamma);
  };

  const handleMotion = (event) => {
    // Implement your logic for motion changes
    console.log(event.accelerationIncludingGravity.x, event.accelerationIncludingGravity.y, event.accelerationIncludingGravity.z);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGif(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const [marketDirected, setMarketDirected] = useState(null);
  const [goTo, setGoTo] = useState(null);
  const location = useLocation();
  useEffect(() => {
    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const nodeId = queryParams.get('nodeId');
    setGoTo(queryParams.get('goTo'));
    setMarketDirected(queryParams.get('marketDirected'));

    if (nodeId) {
      sessionStorage.setItem('currentLocation', `nodes/${nodeId}`);
      
      const requestSensorPermissions = async () => {
        if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
          try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === "granted") {
              window.addEventListener("deviceorientation", handleOrientation);
              window.addEventListener("devicemotion", handleMotion);
            }
          } catch (error) {
            console.error("Sensor permission request error:", error);
          }
        } else {
          // Automatically add listeners if permissions are not required (non-iOS 13+ browsers)
          window.addEventListener("deviceorientation", handleOrientation);
          window.addEventListener("devicemotion", handleMotion);
        }
      };

      // Call the function to request permissions and setup event listeners
      requestSensorPermissions();
    }

    // Cleanup function to remove event listeners when the component unmounts or nodeId changes
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [location.search]); // Depend on location.search so this effect runs anytime the query parameters change



  useEffect(() => {
    // Check if session storage exists
    const userId = sessionStorage.getItem('_id');
    if (userId) {
      // If it does, redirect to the market page
      navigate('/markets');
    }
  }, [navigate]);



  const handleLogin = async () => {
    // Determine if email is from Google or manual input
    const emailToCheck = googleEmail || email;
    setIsLoading(true);
    setLoadingText('Checking if you\'re registered...');

    // const response = await fetch('https://app.glimpass.com/user/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: emailToCheck }),
    // });

    
    const response = await apiService.login(emailToCheck);
    const data = await response.data;
    setIsLoading(false);

    if (data && data._id) { // If user exists
      sessionStorage.setItem('_id', data._id);
      sessionStorage.setItem('email', data.email);
      sessionStorage.setItem('name', data.name);
      if(goTo && goTo.toLowerCase() === 'parking' && marketDirected){
        navigate("/searchVehicle", {
          state: {
            market: marketDirected
          }})
      }
      else{
        navigate('/markets');
      }
    } else { // If user does not exist
      if(googleName)
        {
          handleRegister(emailToCheck, googleName);
        }
      else{
        setIsEmailSubmitted(true);
      }
    }
  };

  const handleRegister = async (emailToRegister, nameToRegister) => {
    setIsLoading(true);
    setLoadingText('Registering...');

    // const response = await fetch('https://app.glimpass.com/user/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: emailToRegister, name: nameToRegister }),
    // });


const response = await apiService.registerUser(emailToRegister, nameToRegister);
    const data = await response.data;
    setIsLoading(false);

    if (data && data[0] && data[0].user) {
      sessionStorage.setItem('_id', data[0].user._id);
      sessionStorage.setItem('email', data[0].user.email);
      sessionStorage.setItem('name', data[0].user.name);
      navigate('/markets');
    }
  };

  const handleContinue = () => {
    if (!isEmailSubmitted && email) {
      handleLogin();
    } else if (isEmailSubmitted && name) {
      handleRegister(email, name);
    }
  };


  const responseGoogle = (response) => {
    if (response.error) {
      console.error('Google sign-in error:', response.error);
    } else {
      console.log('Google sign-in success:', response);
      const { email, name, imageUrl } = response.profileObj;
      setGoogleEmail(email);
      
      setGoogleName(name);

      sessionStorage.setItem('imageUrl', imageUrl);
      // setTimeout(() => handleLogin(), 100);
    }
  };

  useEffect(() => {
    if (googleEmail && googleName) {
      handleLogin(googleEmail, googleName);
    }
  }, [googleEmail, googleName]); // Dependency array

  
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: "861745707029-dtgh9bdhksivrg2rshpe71ugpr9k21hk.apps.googleusercontent.com",
        scope: 'email',
      });
    }
  
    gapi.load('client:auth2', start);
  }, []);
  

  return (
    <>
    {showGif ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <img src={logoGif} alt="Loading..." />
        </div>
      ) : isLoading ? (
        <>
         <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
    >
      {/* Replace CircularProgress with your custom spinner */}
      <div><LoadingSpinner /></div>
      <h3>Hold On!</h3>
      <h4>{loadingText}</h4>
    </Box>
    </>
      ) : (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', borderRadius: '15px' }}>
        <Box display="flex" flexDirection="column" alignItems="center">

        <img src={glimpassLogo} alt="Logo" style={{ maxWidth: '170px', height: 'auto', marginBottom: '20px' }} />
         
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
            <br></br>
            <hr></hr>
            <GoogleLogin
    clientId="861745707029-dtgh9bdhksivrg2rshpe71ugpr9k21hk.apps.googleusercontent.com" // Replace with your Google Client ID
    buttonText="Continue with Google"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
    cookiePolicy={'single_host_origin'}
    style={{ marginTop: '20px' }}
  />
          </Box>
   
        </Box>
      </Paper>
    </Container>
    
    )}


    </>
  );
};

export default Login;