
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BatchesPage from './pages/BatchesPage';
import FailuresPage from './pages/FailuresPage';
import MoldsPage from './pages/MoldsPage';
import StatsPage from './pages/StatsPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/batches" element={<BatchesPage />} />
        <Route path="/failures" element={<FailuresPage />} />
        <Route path="/molds" element={<MoldsPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
