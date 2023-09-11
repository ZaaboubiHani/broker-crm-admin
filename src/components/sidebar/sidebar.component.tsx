
import React, { useState } from 'react';
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

  const location = useLocation(); 

  return (
    <Nav className="flex-column side-menu">
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
      <Expander title="Bons de commandes">
        <Nav.Link className={location.pathname === '/command/delegates' ? 'active' : ''} href="/command/delegates">
          Délégués
        </Nav.Link>
        <Nav.Link className={location.pathname === '/command/cam' ? 'active' : ''} href="/command/cam">
          Cam
        </Nav.Link>
      </Expander>
      <Nav.Link className={location.pathname === '/expense' ? 'active' : ''} href="/expense">
        Notes des frais
      </Nav.Link>
      <Expander title="Clients">
        <Nav.Link className={location.pathname === '/clients/delegates' ? 'active' : ''} href="/clients/pharmacy">
          Pharmacies
        </Nav.Link>
        <Nav.Link className={location.pathname === '/clients/cam' ? 'active' : ''} href="/clients/doctor">
          Médcins
        </Nav.Link>
        <Nav.Link className={location.pathname === '/clients/cam' ? 'active' : ''} href="/clients/wholesaler">
          Grossiste/super gros
        </Nav.Link>
      </Expander>
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
    </Nav>

  );
};

export default Sidebar;
