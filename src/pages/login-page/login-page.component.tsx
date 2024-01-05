import React, { Component, Suspense, useState, useEffect } from 'react';
import { useNavigate, } from 'react-router-dom';
import '../login-page/login-page.style.css';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { DotSpinner } from '@uiball/loaders';
import Snackbar from '@mui/material/Snackbar';
import { UserType } from '../../models/user.model';
import Button from '@mui/material/Button/Button';

const LoginPage: React.FC = () => {

  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const navigate = useNavigate();

  var authService = AuthService.getInstance();
  var userService = UserService.getInstance();

  const handleLogin = async (event: any) => {
    event.preventDefault();
    setIsLogging(true);
    var loginSuccess = await authService.login(identifier, password);

    if (loginSuccess) {
      var user = await userService.getMe();
      if (user.type === UserType.admin || user.type === UserType.supervisor || user.type === UserType.operator) {

        localStorage.setItem('userType', user.type === UserType.admin ? 'admin' : user.type === UserType.supervisor ? 'supervisor' : 'operator');
        navigate('/home');
      }
      else {
        localStorage.clear();
        setSnackbarMessage("vous n'êtes pas autorisé");
        setShowSnackbar(true);
      }
      setIsLogging(false);
    }
    else {
      setIsLogging(false);
      setSnackbarMessage('Échec de la connexion');
      setShowSnackbar(true);
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {

    setShowSnackbar(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

    if (event.key === 'Enter') {
      handleLogin(event);
    }
  };

  const handleAutoLogin = async () => {
    if (localStorage.getItem('isLogged') === 'true' && localStorage.getItem('jwt') !== '' && localStorage.getItem('jwt') !== undefined) {
      let currentUser = await userService.getMe();
      if (!currentUser.isBlocked) {
        localStorage.setItem('userType', currentUser.type === UserType.admin ? 'admin' : currentUser.type === UserType.supervisor ? 'supervisor' : 'operator');
        navigate('/home');
      } else {
        localStorage.clear();
      }

    }
    setIsLoading(false);
  }

  useEffect(() => {
    handleAutoLogin();
  }, []);


  return isLoading ? (<div style={{
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <DotSpinner
      size={40}
      speed={0.9}
      color="black"
    />
  </div>) : (
    <div className='login-container'>
      <div className='login-border'>
        <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Se connecter</h2>
        <TextField
          label="Nom d'utilisateur ou email"
          onChange={(event) => {
            setIdentifier(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          maxRows={1}
        />
        <FormControl variant="outlined" >
          <InputLabel htmlFor="outlined-adornment-password" >Password</InputLabel>
          <OutlinedInput
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            onKeyDown={handleKeyDown}
            autoFocus={true}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Mot de passe"
          />
        </FormControl>
        <Button variant="outlined" onClick={handleLogin} style={{ backgroundColor: 'teal' }}>Connecter</Button>

      </div>
      <div style={{
        width: '80px',
        overflow: 'hidden',
        height: isLogging ? '100px' : '0px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 300ms ease'
      }}>
        <DotSpinner
          size={40}
          speed={0.9}
          color="black"
        />
        <p>connecter...</p>
      </div>
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={showSnackbar} onClose={handleClose} autoHideDuration={6000} message={snackbarMessage} />
    </div>
  );
}


export default LoginPage;
