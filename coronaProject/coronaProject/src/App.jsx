import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './Components/Welcome';
import AllPatients from './Components/AllPatients';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<h1>error</h1>} />
        <Route path="/" element={<Welcome />} />
        <Route path="/patients" element={<AllPatients />} />
      </Routes>
    </Router>
  );
}

export default App;
