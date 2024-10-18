import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';

import Logo_Information_Security from '../assets/Logo_Information_Security.png';


const pages = ['Inbox', 'Compose', 'SignOut'];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate(); 

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
    
    // Ensure navigation works
    if (page === 'Inbox') {
      navigate('/inbox');
    } else if (page === 'Compose') {
      navigate('/compose');
    } else if (page === 'SignOut') {
      localStorage.removeItem("access_token"); 
      navigate('/');
  }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <img src={Logo_Information_Security} alt="" style={{ width: '50px', height: 'auto' }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 3,
              ml: 4,
              display: { xs: 'none', md: 'flex' },
              fontWeight: '1000',
              letterSpacing: '.2rem',
              color: 'Teal',
              textDecoration: 'none',
              fontFamily: 'lato',
              textTransform: 'uppercase',
              fontSize: '14px',
            }}
          >
            Welcome
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 25,
              display: { xs: 'none', md: 'flex' },
              fontWeight: '900',
              letterSpacing: '.2rem',
              color: '#FF7F50',
              textDecoration: 'none',
              fontFamily: 'lato',
              textTransform: 'uppercase',
              fontSize: '15px',
            }}
          >
            Sandunika!
          </Typography>

          {/* Normal buttons for large screens */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'right' }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page)}
                sx={{
                  my: 2,
                  color: 'Teal',
                  display: 'block',
                  ml: 5,
                  fontWeight: '550',
                  letterSpacing: '0.1rem',
                  position: 'relative',
                  transition: 'color 0.3s ease',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '0',
                    height: '2px',
                    bottom: 0,
                    left: 0,
                    backgroundColor: 'teal',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover': {
                    color: 'Teal',
                    '&::after': {
                      width: '100%',
                    },
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Responsive hamburger menu for small screens */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'right' }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 3,
              ml: 4,
              display: { xs: 'none', md: 'flex' },
              fontWeight: '1000',
              letterSpacing: '.2rem',
              color: 'Teal',
              textDecoration: 'none',
              fontFamily: 'lato',
              textTransform: 'uppercase',
              fontSize: '14px',
            }}
          >
            Welcome
          </Typography>
            <IconButton
              size="large"
              aria-label="open menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ color: 'teal' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
         
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
