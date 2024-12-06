import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/home/index';
import Analise from './pages/denuncias/emAnalise';
import Tratamento from './pages/denuncias/emTratamento';
import Resolvida from './pages/denuncias/resolvida';
import Denuncias from './pages/denuncias/denuncias';
import NewUser from './pages/NewUser';
import User from './pages/Users';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/AppUsers" element={<NewUser />} />
        <Route path="/home" element={<Home />} />
        <Route path="/analise" element={<Analise />} />
        <Route path="/tratamento" element={<Tratamento />} />
        <Route path="/resolvida" element={<Resolvida />} />
        <Route path="/denuncias" element={<Denuncias />} />
      </Routes>
    </Router>
  );
}

export default App;
