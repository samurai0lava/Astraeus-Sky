import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;