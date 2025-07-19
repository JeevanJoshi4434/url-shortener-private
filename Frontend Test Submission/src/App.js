import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Redirect from './pages/Redirect';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Redirect />} />
        <Route path="/stats/:id" element={<Stats />} />
      </Routes>
    </Router>
  );
}

export default App;
