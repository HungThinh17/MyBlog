import React from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header>
      <button id="menu-btn" onClick={toggleSidebar}>☰</button>
      <h1>My Blog</h1>
    </header>
  );
};

export default Header;
