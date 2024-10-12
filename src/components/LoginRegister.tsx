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
} from '@mui/material';
import API from '../database/API';
import { useNavigate } from 'react-router-dom';
import InfoModal, { InfoModalState } from './InfoModal';

const LoginRegister: React.FC = () => {
  const [tabsValue, setTabsValue] = useState<number>(0);
  const navigate = useNavigate();

  const loginEmailRef = React.createRef<HTMLInputElement>();
  const loginPasswordRef = React.createRef<HTMLInputElement>();

  const registerEmailRef = React.createRef<HTMLInputElement>();
  const registerPasswordRef = React.createRef<HTMLInputElement>();
  const registerConfirmPasswordRef = React.createRef<HTMLInputElement>();

  // There's only one modal on this page: an InfoModal for showing errors
  const [modalState, setModalState] = useState<InfoModalState | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  function ShowModal(title: string, message: string) {
    setModalState({ open: true, title, message });
  }

  const handleRegister = () => {
    const email: string | undefined = registerEmailRef.current?.value;
    const password: string | undefined = registerPasswordRef.current?.value;
    const confirmPassword: string | undefined = registerConfirmPasswordRef.current?.value;
    
    if (!email || email.length === 0) {
      ShowModal('Failed to register', 'Email field cannot be empty');
      return;
    }

    if (!password) {
      ShowModal('Failed to register', 'Password field cannot be empty');
      return;
    }

    if (!confirmPassword) {
      ShowModal('Failed to register', 'Confirm password field cannot be empty');
      return;
    }

    if (password.length < 8) {
      ShowModal('Failed to register', 'Password must be at least 8 characters long');
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      ShowModal('Failed to register', 'Password must contain at least one letter and one number');
      return;
    }

    if (password !== confirmPassword) {
      ShowModal('Failed to register', 'Passwords do not match');
      return;
    }

    API.RegisterUserAsync(email, password).then((successful: boolean) => {
      if (successful) {
        navigate('/home');
      } else {
        ShowModal('Failed to register', 'Internal server error. Please contact the developer.');
      }
    }).catch((error: Error) => {
      if (error.message === "User already registered") {
        ShowModal('Failed to register', 'User already registered. Try the login instead');
        return;
      } else {
        ShowModal('Failed to register', 'Internal server error. Please contact the developer.');
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
        ShowModal('Login failed', 'Email or password is incorrect');
      }
    }).catch((error: Error) => {
      ShowModal('Login failed', 'Internal server error. Please contact the developer.');
    });
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
        </Paper>
      </Container>

      <InfoModal
        state={ modalState }
        onClose={ () => setModalState(null) }
      />
    </div>
  );
};

export default LoginRegister;
