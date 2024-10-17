import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Grid, Link } from '@mui/material';
import Logo_Information_Security from '../assets/Logo_Information_Security.png';
import { Toaster, toast } from 'react-hot-toast';

const SignUpPage = () => {
  const serverURL = import.meta.env.VITE_SERVER_BASE_URL;
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Validation function for email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle input change for all form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle private key download
  const downloadPrivateKey = (privateKey) => {
    const element = document.createElement("a");
    const file = new Blob([privateKey], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "private_key.pem";
    document.body.appendChild(element);
    element.click();
  };

  // Handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Input validations
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    if (!isValidEmail(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (formData.password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    // Send sign up request
    try {
      const response = await fetch(`${serverURL}/api/user/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        downloadPrivateKey(data.private_key);
        toast.success('Sign Up successfully!', { duration: 1500 });
        toast(
          "Please save your private key securely. It will not be shown again!",
          {
            duration: 6000,
          }
        );
        setTimeout(()=>{
          navigate("/signin");
        }, 1600);
      } else {
        setMessage({ type: 'error', text: data.error || "Something went wrong, please try again." });
        toast.error('Sign Up unsuccessfull!', { duration: 1500 });
        toast.error(`${data.error}`, { duration: 1500 });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "Something went wrong, please try again." });
      toast.error('Sign Up unsuccessfull!', { duration: 1500 });
      toast.error(`${data.error}`, { duration: 1500 });
    }
  };

  // Shared input styles
  const inputStyles = {
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: 'teal' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'teal' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'teal' },
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} alignItems="center" justifyContent="center" minHeight="100vh">
        {/* Left Section: Logo and App Description */}
        <Grid item xs={12} md={6} display="flex" flexDirection="column" alignItems="center">
          <Box mb={4}>
            <img src={Logo_Information_Security} alt="Logo" style={{ width: '200px' }} />
          </Box>
          <Typography variant="h4" align="center" gutterBottom style={{ color: '#388e3c', fontWeight: 'bold' }}>
            Welcome to DocShield !
          </Typography>
          <Typography variant="body1" align="center" style={{ maxWidth: '400px', color: 'teal' }}>
          Your trusted and secure way to share documents with peace of mind! Doc Shield provides a reliable way to transfer your documents, ensuring protection for sensitive contracts, legal papers, confidential reports and many more...
          </Typography>
        </Grid>

        {/* Right Section: Sign Up Form */}
        <Grid item xs={12} md={6}>
          <Box padding="24px" border="3px solid #388e3c" borderRadius="8px" boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)" sx={{ backgroundColor: 'white' }}>
            <Typography variant="h4" align="center" gutterBottom style={{ color: 'teal' }}>
              CREATE ACCOUNT
            </Typography>

            <form onSubmit={handleSignUp}>
              {['first_name', 'last_name', 'email', 'password'].map((field, idx) => (
                <TextField
                  key={idx}
                  label={field.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                  type={field.includes('password') ? 'password' : 'text'}
                  name={field}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  value={formData[field]}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: 'teal' } }}
                  InputProps={{ style: { color: 'teal' }, sx: inputStyles }}
                />
              ))}

              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputLabelProps={{ style: { color: 'teal' } }}
                InputProps={{ style: { color: 'teal' }, sx: inputStyles }}
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
                Sign Up
              </Button>
            </form>
            {/* New User? Sign Up Link */}
            <Box mt={2} textAlign="center">
              <Typography variant="body2" sx={{ color: 'teal' }}>
                Already have an account?{' '}
                <Link href="/signin" underline="hover" sx={{ color: 'teal' }}>
                  Sign In
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

export default SignUpPage;
