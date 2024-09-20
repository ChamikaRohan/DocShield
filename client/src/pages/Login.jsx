import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, Link } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import Logo_Information_Security from '../assets/Logo_Information_Security.png';

const formFieldStyles = {
  label: { color: 'teal' },
  input: {
    color: 'teal',
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
};

const LoginForm = ({ handleLogin, email, setEmail, password, setPassword, loading }) => {
  return (
    <form onSubmit={handleLogin}>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputLabelProps={{ style: formFieldStyles.label }}
        InputProps={{ sx: formFieldStyles.input }}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputLabelProps={{ style: formFieldStyles.label }}
        InputProps={{ sx: formFieldStyles.input }}
      />
      <Box textAlign="right" mb={2}>
        <Link href="/forgotpw" underline="hover" sx={{ color: 'teal' }}>
          Forgot Password?
        </Link>
      </Box>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          backgroundColor: 'teal',
          color: '#fff',
          width: '80%',
          maxWidth: '300px',
          display: 'block',
          mx: 'auto',
          borderRadius: 2,
        }}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Sign-in failed');
        setSuccess('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} alignItems="center" justifyContent="center" minHeight="100vh">
        {/* Left Section: Logo and App Description */}
        <Grid item xs={12} md={6} display="flex" flexDirection="column" alignItems="center">
          <Box mb={4}>
            <img src={Logo_Information_Security} alt="Doc Shield Logo" style={{ width: '200px' }} />
          </Box>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: '#388e3c', fontWeight: 'bold' }}>
            Welcome to DocShield !
          </Typography>
          <Typography variant="body1" align="center" sx={{ maxWidth: '400px', color: 'teal' }}>
          Your trusted and secure way to share documents with peace of mind! Doc Shield provides a reliable way to transfer your documents, ensuring protection for sensitive contracts, legal papers, confidential reports and many more...
          </Typography>
        </Grid>

        {/* Right Section: Login Form */}
        <Grid item xs={12} md={6}>
          <Box
            padding="24px"
            border="3px solid #388e3c"
            borderRadius="8px"
            boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
            sx={{ backgroundColor: 'white' }}
          >
            {/* User Icon */}
            <Box display="flex" justifyContent="center" mb={2}>
              <AccountCircle fontSize="large" sx={{ fontSize: 85, color: 'teal' }} />
            </Box>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: 'teal' }}>
              USER LOGIN
            </Typography>

            {/* Error/Success Messages */}
            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success.main" align="center" sx={{ mb: 2 }}>
                {success}
              </Typography>
            )}

            <LoginForm
              handleLogin={handleLogin}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
            />

            {/* New User? Sign Up Link */}
            <Box mt={2} textAlign="center">
              <Typography variant="body2" sx={{ color: 'teal' }}>
                New user?{' '}
                <Link href="/signup" underline="hover" sx={{ color: 'teal' }}>
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
