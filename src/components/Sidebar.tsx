import React from 'react';
import '../styles/styles.css';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div id="sidebar" className={isOpen ? 'open' : ''}>
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Blog</a>
      <a href="#">Contact</a>
      <a id="create-post-link" onClick={() => alert('Create Post functionality not yet implemented')}>Create Post</a>
    </div>
  );
};

export default Sidebar;
