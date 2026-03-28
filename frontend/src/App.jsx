import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLogin from './pages/CustomerLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import OwnerLogin from './pages/OwnerLogin';
import OwnerDashboard from './pages/OwnerDashboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container" style={{ marginTop: '30px' }}>
        <Routes>
          {/* Default to Customer Login */}
          <Route path="/" element={<Navigate to="/customer" replace />} />
          
          <Route path="/customer" element={<CustomerLogin />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          
          <Route path="/owner" element={<OwnerLogin />} />
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
