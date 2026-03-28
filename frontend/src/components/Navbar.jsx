import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOwner = location.pathname.includes('/owner');

  const logout = () => {
    localStorage.removeItem(isOwner ? 'ownerToken' : 'customerToken');
    localStorage.removeItem('customerData');
    navigate(isOwner ? '/owner' : '/customer');
  };

  const hasToken = isOwner ? !!localStorage.getItem('ownerToken') : !!localStorage.getItem('customerToken');

  return (
    <nav style={{ background: 'var(--primary)', padding: '16px 20px', color: 'white', boxShadow: 'var(--shadow-md)' }}>
      <div className="container flex justify-between items-center">
        <h1 
          style={{ margin: 0, fontSize: '1.6rem', cursor: 'pointer', fontWeight: 600, lineHeight: 1.2 }} 
          onClick={() => navigate(isOwner ? (hasToken ? '/owner/dashboard' : '/owner') : (hasToken ? '/customer/dashboard' : '/customer'))}
        >
          ⭐ อิสระเฟอร์นิเจอร์
        </h1>
        {hasToken && (
          <button 
            onClick={logout} 
            className="btn" 
            title="ออกจากระบบ"
            style={{ 
              width: '44px', 
              height: '44px', 
              padding: '0', 
              background: 'rgba(255, 255, 255, 0.15)', 
              color: 'white', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
