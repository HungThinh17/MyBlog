import React from 'react';
import '../styles/styles.css';

interface SidebarProps {
  isOpen: boolean;
  openCreatePost: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, openCreatePost }) => {
  return (
    <div id="sidebar" className={isOpen ? 'open' : ''}>
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Blog</a>
      <a href="#">Contact</a>
      <a id="create-post-link" onClick={openCreatePost}>Create Post</a>
    </div>
  );
};

export default Sidebar;
