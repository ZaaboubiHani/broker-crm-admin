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

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  var authService = new AuthService();
  var userService = new UserService();

  const handleLogin = async () => {
    setIsLogging(true);
    var id = await authService.login(identifier, password);
    if (id != 0) {
      var user = await userService.getUser(id);
      localStorage.setItem('token', user.token!);
      setIsLogging(false);
      navigate('/content');
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
              }} />
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
                />
              </div>
              <button onClick={(event) => {
                event.preventDefault();
                setShowPassword(!showPassword);
              }} className="btn btn-primary" style={{ backgroundColor: '#fff', border: '#ddd solid 1px', height: '38px' }}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} style={{ color: 'black' }} />
              </button>
            </div>
          </Form.Group>
        </Form>
        <Button variant="primary" onClick={handleLogin} style={{ backgroundColor: 'teal' }}>Connecter</Button>
      </div>
      <div style={{
          width: '80px',
          overflow:'hidden',
          height: isLogging ? '100px' : '0px' ,
          display: 'flex',
          flexDirection:'column',
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
    </div>
  );
}


export default LoginPage;
