import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CRUDPage from './pages/CRUDPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/crud-page" element={<CRUDPage />} />
      </Routes>
    </Router>
  );
};

export default App;
