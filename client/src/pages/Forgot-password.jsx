import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid } from '@mui/material';
import Logo_Information_Security from '../assets/Logo_Information_Security.png'; 

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please provide your email.');
      return;
    }

    console.log({ email });
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
          <Typography variant="h4" component="h2" align="center" gutterBottom style={{ color: '#388e3c', fontWeight: 'bold' }}>
            Welcome to DOC SHIELD!
          </Typography>
          <Typography variant="body1" align="center" style={{ maxWidth: '400px', color: 'teal' }}>
            Doc Shield offers a trusted and secure way to transfer your documents with peace of mind. Whether you're managing sensitive contracts, legal papers, or confidential reports, our platform is designed to keep your files protected from unauthorized access.
          </Typography>
        </Grid>

        {/* Right Section: Forgot Password Form */}
        <Grid item xs={12} md={6}>
          <Box padding="24px" border="3px solid #388e3c" borderRadius="8px" boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)" sx={{ backgroundColor: 'white' }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" style={{ color: 'teal' }}>
              FORGOT PASSWORD
            </Typography>

            {error && (
              <Typography color="error" align="center" style={{ marginBottom: '16px', color: 'red' }}>
                {error}
              </Typography>
            )}

            <form onSubmit={handleForgotPassword}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputLabelProps={{
                    style: { color: 'teal' }, // Color of the label text
                    }}
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
              

              <Button type="submit"
                variant="contained"
                fullWidth
                style={{ marginTop: '16px', backgroundColor: 'teal', color: '#fff',
                width: '80%', 
                maxWidth: '300px', 
                display: 'block',
                margin: '16px auto', 
                borderRadius: '9px', }}>
                Reset Password
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ForgotPasswordPage;
