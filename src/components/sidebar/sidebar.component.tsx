
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AiOutlineHome, AiOutlineLineChart, AiOutlineSchedule, AiOutlineShoppingCart, AiOutlineUnorderedList, AiOutlineUser } from 'react-icons/ai';
import { LiaUsersSolid } from 'react-icons/lia';
import { HiOutlineCash, HiOutlineUserGroup } from 'react-icons/hi';
import { HiOutlineClipboardDocument } from 'react-icons/hi2';
import { LuPackage2 } from 'react-icons/lu';
import { TfiBriefcase } from 'react-icons/tfi';
import Dropdown from '../drop-down/drop-down.component';
import Expander from '../expander/expander.component';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import '../sidebar/sidebar.style.css';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
}

const Sidebar: React.FC<SidebarProps> = () => {
  const commandata = window.localStorage.getItem('command');
  const clientdata = window.localStorage.getItem('client');

  const [commandOpened, setCommandOpened] = useState(commandata !== null ? JSON.parse(commandata) : false);
  const [clientOpened, setClientOpened] = useState(clientdata !== null ? JSON.parse(clientdata) : false);


  const handleCommandToggle = () => {
    window.localStorage.setItem('command', JSON.stringify(!commandOpened));
    setCommandOpened(!commandOpened);
  };

  const handleClientToggle = () => {
    window.localStorage.setItem('client', JSON.stringify(!clientOpened));
    setClientOpened(!clientOpened);
  };
  const location = useLocation();

  return (

    <Nav className="flex-column side-menu" >
      <div style={{ overflowY: 'auto', overflowX: 'hidden', height: '100vh', width: '200px' }}>
        <img src="/broker_title.png" height='60px' style={{ margin: '0px 8px' }} alt="" />
        <Nav.Link className={location.pathname === '/home' ? 'active' : ''} href="/home">
          Acceuil
        </Nav.Link>
        <Nav.Link className={location.pathname === '/delegate' ? 'active' : ''} href="/delegate">
          Délégués
        </Nav.Link>
        <Nav.Link className={location.pathname === '/plan' ? 'active' : ''} href="/plan">
          Plan de tournée
        </Nav.Link>
        <Nav.Link className={location.pathname === '/report' ? 'active' : ''} href="/report">
          Rapports des visites
        </Nav.Link>
        <Nav.Link className={location.pathname === '/command' ? 'active' : ''} href="/command">
        Bons de commandes
        </Nav.Link>
        <Nav.Link className={location.pathname === '/expense' ? 'active' : ''} href="/expense">
          Notes des frais
        </Nav.Link>
        <Nav.Link className={location.pathname === '/clients' ? 'active' : ''} href="/clients">
          Clients
        </Nav.Link>
        <Nav.Link className={location.pathname === '/revenue' ? 'active' : ''} href="/revenue">
          Chiffre d'affaire
        </Nav.Link>
        <Nav.Link className={location.pathname === '/statistics' ? 'active' : ''} href="/statistics">
          Statistiques
        </Nav.Link>
        <Nav.Link className={location.pathname === '/config' ? 'active' : ''} href="/config">
          Listes prédéfinies
        </Nav.Link>
        <Nav.Link className={location.pathname === '/profile' ? 'active' : ''} href="/profile">
          Profil
        </Nav.Link>
      </div>
    </Nav>

  );
};

export default Sidebar;
