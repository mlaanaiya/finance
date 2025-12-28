import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Finances from './pages/Finances';
import Goals from './pages/Goals';
import Personal from './pages/Personal';
import Professional from './pages/Professional';
import Health from './pages/Health';
import Psychology from './pages/Psychology';
import Advisor from './pages/Advisor';

function App() {
  const { darkMode } = useStore();

  // Apply dark mode class to html element for proper Tailwind v4 dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="finances" element={<Finances />} />
          <Route path="goals" element={<Goals />} />
          <Route path="personal" element={<Personal />} />
          <Route path="professional" element={<Professional />} />
          <Route path="health" element={<Health />} />
          <Route path="psychology" element={<Psychology />} />
          <Route path="advisor" element={<Advisor />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
