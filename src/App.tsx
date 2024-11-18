import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import './styles/styles.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <div className="content-container">
        <Sidebar />
        <MainContent />
      </div>
      <Footer />
    </div>
  );
};

export default App;
