import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import './styles/styles.css';

interface MainContentProps {
  openCreatePost: () => void;
  closeCreatePost: () => void;
}

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openCreatePost = () => {
    setShowCreatePost(true);
  };

  const closeCreatePost = () => {
    setShowCreatePost(false);
  };

  return (
    <div className="app-container">
      <Header toggleSidebar={toggleSidebar} />
      <div className="content-container">
        <Sidebar isOpen={isSidebarOpen} openCreatePost={openCreatePost} />
        <MainContent openCreatePost={openCreatePost} closeCreatePost={closeCreatePost} />
      </div>
      <Footer />
    </div>
  );
};
export default App;
