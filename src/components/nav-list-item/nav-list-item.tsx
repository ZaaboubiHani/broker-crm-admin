import { PRIMARY_COLOR, PRIMARY_COLOR_HIGHLIGHT } from '../../theme';
import React, { useState, useEffect } from 'react';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';


interface NavListItemProps {
    name: string,
    route: string,
    icon: any,
    isOpen: Boolean,
}



const NavListItem: React.FC<NavListItemProps> = ({ name, route, icon, isOpen }) => {

    const [onHoverBool, setOnHoverBool] = useState(false);
    const location = useLocation();

    return (<Nav.Link
        onMouseEnter={() => {
            setOnHoverBool(true);
        }}
        onMouseLeave={() => {
            setOnHoverBool(false);
        }}
        style={{
            display: 'flex',
            backgroundColor: onHoverBool || location.pathname === route ? PRIMARY_COLOR_HIGHLIGHT : undefined,
            height: '45px',
            margin: '8px 0px',
            transition: 'all 300ms ease',
        }} href={route}>
        {icon}
        <p style={{ color: 'white', transition: 'opacity 0.5s ease', opacity: isOpen ? '1' : '0', }}>
            {name}
        </p>
    </Nav.Link>);
}


export default NavListItem;