
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
import NavListItem from '../nav-list-item/nav-list-item';
import { PRIMARY_COLOR } from '../../theme';

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
          <ArrowBackIosNewIcon
            style={{
              width: '30px',
              left: '0px',
              top: '8px',
              position: 'absolute',
              color: PRIMARY_COLOR,
              transition: 'opacity 0.5s ease',
              opacity: isOpen ? '1' : '0',
            }} />
          <ArrowForwardIosIcon
            style={{
              width: '30px',
              left: '0px',
              top: '8px',
              position: 'absolute',
              color: PRIMARY_COLOR,
              transition: 'opacity 0.5s ease',
              opacity: isOpen ? '0' : '1',
            }} />
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

        <NavListItem
          name='Acceuil'
          route='/home'
          isOpen={isOpen}
          icon={<HomeIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px', }} />}
        />
        <NavListItem
          name='Délégués'
          route='/delegate'
          isOpen={isOpen}
          icon={<BusinessCenterIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
        />
        <NavListItem
          name='Plan de tournée'
          route='/plan'
          isOpen={isOpen}
          icon={<CalendarMonthIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
        />
        <NavListItem
          name='Rapports des visites'
          route='/report'
          isOpen={isOpen}
          icon={<EventNoteIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
        />
        <NavListItem
          name='Bons de commandes'
          route='/command'
          isOpen={isOpen}
          icon={<ShoppingCartIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
        />
        <NavListItem
          name='Notes des frais'
          route='/expense'
          isOpen={isOpen}
          icon={<PaidIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
        />
        <NavListItem
          name='Clients'
          route='/clients'
          isOpen={isOpen}
          icon={<Diversity3Icon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
        />
        <NavListItem
          name="Chiffre d'affaire"
          route='/revenue'
          isOpen={isOpen}
          icon={<CreditCardIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
        />
        <NavListItem
          name="Statistiques"
          route='/statistics'
          isOpen={isOpen}
          icon={<InsertChartIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
        />
        <NavListItem
          name="Listes prédéfinies"
          route='/config'
          isOpen={isOpen}
          icon={<TuneIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
        />
        <NavListItem
          name="Profil"
          route='/profile'
          isOpen={isOpen}
          icon={<AssignmentIndIcon style={{ color: 'white', width: '30px', height: '30px', marginRight: '8px' }} />}
        />
      </div>
    </Nav>

  );
};

export default Sidebar;
