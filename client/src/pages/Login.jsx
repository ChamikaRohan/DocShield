import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, Link } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from 'react-hot-toast';
import Logo_Information_Security from '../assets/Logo_Information_Security.png';

const LoginPage = () => {
  const serverURL = import.meta.env.VITE_SERVER_BASE_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false); // New state to track OTP step
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${serverURL}/api/user/signin-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();

        const OTPresponse = await fetch(`${serverURL}/api/user/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        setOtpStep(true); 

        if (OTPresponse.ok) {
          setOtpStep(true);
          toast.success('OTP sent to your email!', { duration: 5500 });
        } else {
          const errorData = await OTPresponse.json();
          toast.error(errorData.error || 'Failed to send OTP', { duration: 1500 });
        }

      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Sign-in failed', { duration: 1500 });
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.', { duration: 1500 });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${serverURL}/api/user/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Sign In successful!', { duration: 1500 });
        setTimeout(() => {
          navigate('/compose');
        }, 1500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'OTP verification failed', { duration: 1500 });
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.', { duration: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} alignItems="center" justifyContent="center" minHeight="100vh">
        <Grid item xs={12} md={6} display="flex" flexDirection="column" alignItems="center">
          <Box mb={4}>
            <img src={Logo_Information_Security} alt="Doc Shield Logo" style={{ width: '200px' }} />
          </Box>
          <Typography variant="h4" align="center" gutterBottom sx={{ color: '#388e3c', fontWeight: 'bold' }}>
            Welcome to DocShield!
          </Typography>
          <Typography variant="body1" align="center" sx={{ maxWidth: '400px', color: 'teal' }}>
            Your trusted and secure way to share documents with peace of mind! 
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box padding="24px" border="3px solid #388e3c" borderRadius="8px" sx={{ backgroundColor: 'white' }}>
            <Box display="flex" justifyContent="center" mb={2}>
              <AccountCircle fontSize="large" sx={{ fontSize: 85, color: 'teal' }} />
            </Box>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: 'teal' }}>
              {otpStep ? 'Enter OTP' : 'USER LOGIN'}
            </Typography>
            {!otpStep ? (
              <form onSubmit={handleLogin}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputLabelProps={{ style: { color: 'teal' } }}
                  InputProps={{ sx: { color: 'teal' } }}
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
                  InputProps={{ sx: { color: 'teal' } }}
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, backgroundColor: 'teal' }} disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpVerification}>
                <TextField
                  label="OTP"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  InputLabelProps={{ style: { color: 'teal' } }}
                  InputProps={{ sx: { color: 'teal' } }}
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, backgroundColor: 'teal' }} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </form>
            )}
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
      <Toaster position="top-center" reverseOrder={false} />
    </Container>
  );
};

export default LoginPage;
