import React, { Component, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login-page/login-page.style.css';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';
import LoadingIndicator from '../../components/loading-indicator/loading-indicator.component';
import Globals from '../../api/globals';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { DotSpinner } from '@uiball/loaders';
import Snackbar from '@mui/material/Snackbar';
import { UserType } from '../../models/user.model';

const LoginPage: React.FC = () => {

  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const navigate = useNavigate();

  var authService = new AuthService();
  var userService = new UserService();

  const handleLogin = async (event: any) => {
    event.preventDefault();
    setIsLogging(true);
    var loginSuccess = await authService.login(identifier, password);

    if (loginSuccess) {
      var user = await userService.getMe();
      if (user.type === UserType.admin || user.type === UserType.supervisor) {
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

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {

    setShowSnackbar(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.key === 'Enter') {
      handleLogin(event);
    }
  };

  return (
    <div className='login-container'>
      <div className='login-border'>
        <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Se connecter</h2>
        <Form style={{ height: '100%', display: 'flex', width: '100%', flexDirection: 'column' }}>
          <Form.Group className="mb-3" style={{ height: '100%', display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'space-around' }}>
            <div>
              <Form.Label>Entrez votre nom d'utilisateur ou email:</Form.Label>
              <Form.Control placeholder="name@example.com" onChange={(event) => {
                setIdentifier(event.target.value);
              }} 
              onKeyDown={handleKeyDown}
              
              />
            </div>
            <div style={{ display: 'flex', justifyItems: 'space-between', alignItems: "flex-end" }}>
              <div style={{ flexGrow: '1' }}>
                <Form.Label htmlFor="inputPassword5">Mot de passe:</Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : "password"}
                  id="inputPassword5"
                  aria-describedby="passwordHelpBlock"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  autoFocus={true}
                />
              </div>
              <button onClick={(event) => {
                event.preventDefault();
                setShowPassword(!showPassword);
              }} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px' }}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} style={{ color: 'black' }} />
              </button>
            </div>
            <Button variant="primary" onClick={handleLogin} style={{ backgroundColor: 'teal' }}>Connecter</Button>
          </Form.Group>
        </Form>
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
