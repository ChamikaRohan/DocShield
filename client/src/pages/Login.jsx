import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, Checkbox, FormControlLabel, Link } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import Logo_Information_Security from '../assets/Logo_Information_Security.png';

const LoginPage = () => {
  const serverURL = import.meta.env.VITE_SERVER_BASE_URL;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${serverURL}/api/user/signin-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', 
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message);
        setError('');
        setLoading(false);
        console.log(success);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Sign-in failed');
        setSuccess('');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setSuccess('');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} alignItems="center" justifyContent="center" minHeight="100vh">
        {/* Left Section: Logo and App Description */}
        <Grid item xs={12} md={6} display="flex" flexDirection="column" alignItems="center">
          <Box mb={4}>
            {/* App Logo */}
            <img src={Logo_Information_Security} alt="" style={{ width: '200px' }} />
          </Box>
          <Typography variant="h4" component="h2" align="center" gutterBottom style={{ color: '#388e3c', fontWeight :'bold' }}>
            Welcome to DOC SHIELD!
          </Typography>
          <Typography variant="body1" align="center" style={{ maxWidth: '400px', color: 'teal' }}>
          Doc Shield offers a trusted and secure way to transfer your documents with peace of mind. Whether you're managing sensitive contracts, legal papers, or confidential reports, our platform is designed to keep your files protected from unauthorized access.
          </Typography>
        </Grid>

        {/* Right Section: Login Form */}
        <Grid item xs={12} md={6}>
          <Box
            padding="24px"
            border="3px solid #388e3c"
            borderRadius="8px"
            boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
            sx={{ backgroundColor: 'white' }} // Light green background
          >
            {/* User Icon */}
            <Box display="flex" justifyContent="center" mb={2}>
              <AccountCircle fontSize="large" style={{ fontSize: 85, color: 'teal' }} />
            </Box>

            <Typography variant="h4" component="h1" gutterBottom align="center" style={{ color: 'teal' }}>
              USER LOGIN
            </Typography>

            {error && (
              <Typography color="error" align="center" style={{ marginBottom: '16px', color: 'red' }}>
                {error}
              </Typography>
            )}
            {(success) && (
              <Typography color="error" align="center" style={{ marginBottom: '16px', color: 'green' }}>
                {success}
              </Typography>
            )}

            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputLabelProps={{ style: { color: 'teal' } }}
                InputProps={{
                  style: { color: 'teal' },
                  sx: {
                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'teal',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'teal',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'teal',
                    },
                  },
                }}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{ style: { color: 'teal' } }}
                InputProps={{
                  style: { color: 'teal' },
                  sx: {
                    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'teal',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'teal',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'teal',
                    },
                  },
                }}
              />

              {/* Forgot Password Link */}
              <Box textAlign="right" mb={2}>
                <Link href="/forgotpw" underline="hover" style={{ color: 'teal' }}>
                  Forgot Password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                style={{ marginTop: '16px', backgroundColor: 'teal', color: '#fff',
                width: '80%', 
                maxWidth: '300px', 
                display: 'block',
                margin: '16px auto', 
                borderRadius: '9px',
                 }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            {/* New User? Sign Up Link */}
            <Box mt={2} textAlign="center">
              <Typography variant="body2" style={{ color: 'teal' }}>
                New user?{' '}
                <Link href="/signup" underline="hover" style={{ color: 'teal' }}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
