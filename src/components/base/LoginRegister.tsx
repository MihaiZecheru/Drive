import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Tabs,
  Tab,
  Divider,
  IconButton,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import API from '../../database/API';
import { useNavigate } from 'react-router-dom';
import useInfoModal from './useInfoModal';
import supabase from '../../database/supabase-config';

const LoginRegister: React.FC = () => {
  const [tabsValue, setTabsValue] = useState<number>(0);
  const navigate = useNavigate();
  const showInfoModal = useInfoModal();

  const loginEmailRef = React.createRef<HTMLInputElement>();
  const loginPasswordRef = React.createRef<HTMLInputElement>();

  const registerEmailRef = React.createRef<HTMLInputElement>();
  const registerPasswordRef = React.createRef<HTMLInputElement>();
  const registerConfirmPasswordRef = React.createRef<HTMLInputElement>();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  const handleRegister = () => {
    const email: string | undefined = registerEmailRef.current?.value;
    const password: string | undefined = registerPasswordRef.current?.value;
    const confirmPassword: string | undefined = registerConfirmPasswordRef.current?.value;
    
    if (!email || email.length === 0) {
      showInfoModal('Failed to register', 'Email field cannot be empty');
      return;
    }

    if (!password) {
      showInfoModal('Failed to register', 'Password field cannot be empty');
      return;
    }

    if (!confirmPassword) {
      showInfoModal('Failed to register', 'Confirm password field cannot be empty');
      return;
    }

    if (password.length < 8) {
      showInfoModal('Failed to register', 'Password must be at least 8 characters long');
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      showInfoModal('Failed to register', 'Password must contain at least one letter and one number');
      return;
    }

    if (password !== confirmPassword) {
      showInfoModal('Failed to register', 'Passwords do not match');
      return;
    }

    API.RegisterUserAsync(email, password).then(async (successful: boolean) => {
      if (successful) {
        navigate('/home');
      } else {
        showInfoModal('Failed to register', 'Internal server error. Please contact the developer.');
      }
    }).catch((error: Error) => {
      if (error.message === "User already registered") {
        showInfoModal('Failed to register', 'User already registered. Try the login instead');
        return;
      } else {
        showInfoModal('Failed to register', 'Internal server error. Please contact the developer.');
      }
    });
  };

  const handleLogin = () => {
    const email: string | undefined = loginEmailRef.current?.value;
    const password: string | undefined = loginPasswordRef.current?.value;

    if (!email || email.length === 0) {
      loginEmailRef.current?.focus();
      return;
    }

    if (!password || password.length === 0) {
      loginPasswordRef.current?.focus();
      return;
    }

    API.LoginUserAsync(email, password).then((successful: boolean) => {
      if (successful) {
        navigate('/home');
      } else {
        showInfoModal('Login failed', 'Email or password is incorrect');
      }
    }).catch((error: Error) => {
      showInfoModal('Login failed', 'Internal server error. Please contact the developer.');
    });
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: {
      redirectTo: 'https://drive.mzecheru.com/home' }
    });

    if (error) {
      showInfoModal('Failed to sign in with Google', error.message);
    }
  };

  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github', options: {
      redirectTo: 'https://drive.mzecheru.com/home' }
    });
    
    if (error) {
      showInfoModal('Failed to sign in with GitHub', error.message);
    }
  };

  const signInWithDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'discord', options: {
      redirectTo: 'https://drive.mzecheru.com/home' }
    });

    if (error) {
      showInfoModal('Failed to sign in with Discord', error.message);
    }
  };

  const iconButtonStyles = {
    backgroundColor: '#f5f5f5',
    borderRadius: '50%',
    width: 56,
    height: 56,
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
    marginRight: '1rem'
  };

  return (
    <div className="center-of-screen">
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" align="center">
            {tabsValue === 0 ? 'Login' : 'Register'} to Drive
          </Typography>

          <Tabs value={tabsValue} onChange={handleChange} centered>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          <Box component="div" sx={{ mt: 2 }}>
            {tabsValue === 0 ? (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Email Address"
                  autoComplete="email"
                  autoFocus
                  inputRef={loginEmailRef}
                  onKeyDown={ (e) => {
                    if (e.key === 'Enter' && loginEmailRef.current?.value?.length !== 0)
                      loginPasswordRef.current?.focus();
                    }
                  }
                />
                <TextField
                  variant="outlined"
                  margin="normal" 
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  inputRef={loginPasswordRef}
                  onKeyDown={ (e) => {
                      if (loginEmailRef.current?.value?.length === 0) {
                        loginEmailRef.current?.focus();
                      } else if (e.key === 'Enter' && loginPasswordRef.current?.value?.length !== 0) {
                        handleLogin();
                      }
                    }
                  }
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </>
            ) : (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Email Address"
                  autoComplete="email"
                  inputRef={ registerEmailRef }
                  onKeyDown={ (e) => {
                    if (e.key === 'Enter' && registerEmailRef.current?.value?.length !== 0)
                      registerPasswordRef.current?.focus();
                    }
                  }
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  inputRef={ registerPasswordRef }
                  onKeyDown={ (e) => {
                    if (e.key === 'Enter' && registerPasswordRef.current?.value?.length !== 0)
                      registerConfirmPasswordRef.current?.focus();
                    }
                  }
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                  inputRef={ registerConfirmPasswordRef }
                  onKeyDown={ (e) => {
                      if (registerEmailRef.current?.value?.length === 0) {
                        registerEmailRef.current?.focus();
                      } else if (registerPasswordRef.current?.value?.length === 0) {
                        registerPasswordRef.current?.focus();
                      } else if (e.key === 'Enter' && registerConfirmPasswordRef.current?.value?.length !== 0) {
                        handleRegister();
                      }
                    }
                  }
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleRegister}
                >
                  Register
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1rem' }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="body1" sx={{ mx: 2 }}>
              OR
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <IconButton
              color="primary"
              sx={iconButtonStyles}
              onClick={signInWithGoogle}
            >
              <GoogleIcon />
            </IconButton>

            <IconButton
              color="primary"
              sx={iconButtonStyles}
              onClick={signInWithGithub}
            >
              <GitHubIcon />
            </IconButton>

            <IconButton
              color="primary"
              sx={{ ...iconButtonStyles, marginRight: 0 }}
              onClick={signInWithDiscord}
            >
              <svg width="24" height="24" viewBox="0 0 71 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60.1045 13.8978C55.5792 11.8214 50.7265 10.2916 45.6527 9.41542C45.5603 9.39851 45.468 9.44077 45.4204 9.52529C44.7963 10.6353 44.105 12.0834 43.6209 13.2216C38.1637 12.4046 32.7345 12.4046 27.3892 13.2216C26.905 12.0581 26.1886 10.6353 25.5617 9.52529C25.5141 9.44359 25.4218 9.40133 25.3294 9.41542C20.2584 10.2888 15.4057 11.8186 10.8776 13.8978C10.8384 13.9147 10.8048 13.9429 10.7825 13.9795C1.57795 27.7309 -0.943561 41.1443 0.293408 54.3914C0.299005 54.4562 0.335386 54.5182 0.385761 54.5576C6.45866 59.0174 12.3413 61.7249 18.1147 63.5195C18.2071 63.5477 18.305 63.5139 18.3638 63.4378C19.7295 61.5728 20.9469 59.6063 21.9907 57.5383C22.0523 57.4172 21.9935 57.2735 21.8676 57.2256C19.9366 56.4931 18.0979 55.6 16.3292 54.5858C16.1893 54.5041 16.1781 54.304 16.3068 54.2082C16.679 53.9293 17.0513 53.6391 17.4067 53.3461C17.471 53.2926 17.5606 53.2813 17.6362 53.3151C29.2558 58.6202 41.8354 58.6202 53.3179 53.3151C53.3935 53.2785 53.4831 53.2898 53.5502 53.3433C53.9057 53.6363 54.2779 53.9293 54.6529 54.2082C54.7816 54.304 54.7732 54.5041 54.6333 54.5858C52.8646 55.6197 51.0259 56.4931 49.0921 57.2228C48.9662 57.2707 48.9102 57.4172 48.9718 57.5383C50.038 59.6034 51.2554 61.5699 52.5959 63.435C52.6519 63.5139 52.7526 63.5477 52.845 63.5195C58.6464 61.7249 64.529 59.0174 70.6019 54.5576C70.6551 54.5182 70.6887 54.459 70.6943 54.3942C72.1747 39.0791 68.2147 25.7757 60.1968 13.9823C60.1772 13.9429 60.1437 13.9147 60.1045 13.8978ZM23.7259 46.3253C20.2276 46.3253 17.3451 43.1136 17.3451 39.1693C17.3451 35.225 20.1717 32.0133 23.7259 32.0133C27.308 32.0133 30.1626 35.2532 30.1066 39.1693C30.1066 43.1136 27.28 46.3253 23.7259 46.3253ZM47.3178 46.3253C43.8196 46.3253 40.9371 43.1136 40.9371 39.1693C40.9371 35.225 43.7636 32.0133 47.3178 32.0133C50.9 32.0133 53.7545 35.2532 53.6986 39.1693C53.6986 43.1136 50.9 46.3253 47.3178 46.3253Z" fill="#5865F2"/>
              </svg>
            </IconButton>

          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default LoginRegister;
