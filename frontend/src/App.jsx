import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Customer Components
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerNavbar from './components/customer/CustomerNavbar';

// Admin Components
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNavbar from './components/admin/AdminNavbar';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to customer */}
        <Route path="/" element={<Navigate to="/customer" replace />} />

        {/* --- Customer Routes --- */}
        <Route path="/customer/*" element={
          <>
            <CustomerNavbar />
            <div className="container" style={{ marginTop: '30px' }}>
              <Routes>
                <Route path="/" element={<CustomerLogin />} />
                <Route path="/dashboard" element={<CustomerDashboard />} />
              </Routes>
            </div>
          </>
        } />

        {/* --- Admin Routes --- */}
        <Route path="/admin/*" element={
          <>
            <AdminNavbar />
            <div className="container" style={{ marginTop: '30px' }}>
              <Routes>
                <Route path="/" element={<AdminLogin />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
              </Routes>
            </div>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
