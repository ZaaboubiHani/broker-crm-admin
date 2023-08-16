
import React, { useState } from 'react';
import '../sidebar/sidebar.style.css';
interface SidebarProps {
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const [activeItem, setActiveItem] = useState('');

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    onItemClick(item);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">BROKER</div>
      <ul className="sidebar-menu">
        <li
          className={activeItem === 'Home' ? 'active' : ''}
          onClick={() => handleItemClick('Home')}
        >
          Acceuil
        </li>
        <li
          className={activeItem === 'About' ? 'active' : ''}
          onClick={() => handleItemClick('About')}
        >
          About
        </li>
        <li
          className={activeItem === 'Expense' ? 'active' : ''}
          onClick={() => handleItemClick('Expense')}
        >
          Notes des frais
        </li>
        <li
          className={activeItem === 'Profile' ? 'active' : ''}
          onClick={() => handleItemClick('Profile')}
        >
          Profil
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
