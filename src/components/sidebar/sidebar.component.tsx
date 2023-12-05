
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import '../sidebar/sidebar.style.css';
import HomeIcon from '@mui/icons-material/Home';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import PaidIcon from '@mui/icons-material/Paid';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import TuneIcon from '@mui/icons-material/Tune';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Sidebar: React.FC = () => {


  const [isOpen, setIsOpen] = useState<Boolean>(localStorage.getItem('sidebarOpen') === 'true');

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    localStorage.setItem('sidebarOpen', String(!isOpen));
  };

  const location = useLocation();

  return (

    <Nav style={{
      overflowY: 'auto',
      overflowX: 'hidden',
      height: '100vh',
      width: isOpen ? '220px' : '58px',
      whiteSpace: 'nowrap',
      transition: 'width 0.5s ease',
      backgroundColor: 'teal',
      borderRadius: '0px 8px 8px 0px'
    }}>

      <div >
        <Button style={{
          display: 'block', position:
            'absolute', left: isOpen ? '200px' : '38px',
          bottom: "20px",
          backgroundColor: 'white',
          width: '10px',
          minWidth: '10px',
          height: '40px',
          zIndex: '99',
          transition: 'all 0.5s ease',
        }}
          onClick={toggleDrawer}
          variant="contained">
          <ArrowBackIosNewIcon style={{ width: '30px', left: '0px', top: '8px', position: 'absolute', color: 'rgb(0, 182, 182)', transition: 'opacity 0.5s ease', opacity: isOpen ? '1' : '0', }} />
          <ArrowForwardIosIcon style={{ width: '30px', left: '0px', top: '8px', position: 'absolute', color: 'rgb(0, 182, 182)', transition: 'opacity 0.5s ease', opacity: isOpen ? '0' : '1', }} />
        </Button>
        <img src='/images/broker_logo_white.png'
          style={{
            margin: '0px 8px 40px 8px ',
            height: '50px',
            transition: 'opacity 0.5s ease',
            opacity: isOpen ? '0' : '1',
          }} alt="" />
        <img src="/images/broker_title.png"
          height='60px'
          style={{
            margin: '0px 8px 40px 8px ',
            left: '0px',
            position: 'absolute',
            transition: 'opacity 0.5s ease',
            opacity: isOpen ? '1' : '0',
          }} alt="" />
        <Nav.Link style={{ display: 'flex', }} href="/home">
          <HomeIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />
          <p style={{ color: 'white', transition: 'opacity 0.5s ease', opacity: isOpen ? '1' : '0', }}>
            Acceuil
          </p>
        </Nav.Link>
        <Nav.Link style={{ display: 'flex' }} href="/delegate">
          <BusinessCenterIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />
          <p style={{ color: 'white', transition: 'opacity 0.5s ease', opacity: isOpen ? '1' : '0', }}>
            Délégués
          </p>
        </Nav.Link>
        <Nav.Link style={{ display: 'flex', }} href="/plan">
          <CalendarMonthIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />
          <p style={{ color: 'white', transition: 'opacity 0.5s ease', opacity: isOpen ? '1' : '0', }}>
            Plan de tournée
          </p>
        </Nav.Link>
        <Nav.Link style={{ display: 'flex' }} href="/report">
          <EventNoteIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />
          <p style={{ color: 'white', transition: 'opacity 0.5s ease', opacity: isOpen ? '1' : '0', }}>
            Rapports des visites
          </p>
        </Nav.Link>
        <Nav.Link style={{ display: 'flex' }} href="/command">
          <ShoppingCartIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />
          <p style={{ color: 'white', transition: 'opacity 0.5s ease', opacity: isOpen ? '1' : '0', }}>
            Bons de commandes
          </p>
        </Nav.Link>
        <Nav.Link style={{ display: 'flex' }} href="/expense">
          <PaidIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />
          <p style={{ color: 'white', transition: 'opacity 0.5s ease', opacity: isOpen ? '1' : '0', }}>
            Notes des frais
          </p>
        </Nav.Link>
        <Nav.Link style={{ display: 'flex' }} href="/clients">
          <Diversity3Icon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />
          <p style={{ color: 'white', transition: 'opacity 0.5s ease', opacity: isOpen ? '1' : '0', }}>
            Clients
          </p>
        </Nav.Link>
        <Nav.Link style={{ display: 'flex' }} href="/revenue">
          <CreditCardIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />
          <p style={{ color: 'white', transition: 'opacity 0.5s ease', opacity: isOpen ? '1' : '0', }}>
            Chiffre d'affaire
          </p>
        </Nav.Link>
        <Nav.Link style={{ display: 'flex' }} href="/statistics">
          <InsertChartIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />
          <p style={{ color: 'white', transition: 'opacity 0.5s ease', opacity: isOpen ? '1' : '0', }}>
            Statistiques
          </p>
        </Nav.Link>
        <Nav.Link style={{ display: 'flex' }} href="/config">
          <TuneIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />
          <p style={{ color: 'white', transition: 'opacity 0.5s ease', opacity: isOpen ? '1' : '0', }}>
            Listes prédéfinies
          </p>
        </Nav.Link>
        <Nav.Link style={{ display: 'flex' }} href="/profile">
          <AssignmentIndIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />
          <p style={{ color: 'white', transition: 'opacity 0.5s ease', opacity: isOpen ? '1' : '0', }}>
            Profil
          </p>
        </Nav.Link>
      </div>
    </Nav>

  );
};

export default Sidebar;
