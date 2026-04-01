import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const hasToken = !!localStorage.getItem('adminToken');

  return (
    <nav style={{ background: 'var(--primary)', padding: '16px 20px', color: 'white', boxShadow: 'var(--shadow-md)' }}>
      <div className="container flex justify-between items-center">
        <h1 
          style={{ margin: 0, fontSize: '1.6rem', cursor: 'pointer', fontWeight: 600, lineHeight: 1.2 }} 
          onClick={() => navigate(hasToken ? '/admin/dashboard' : '/admin')}
        >
          ⚙️ ระบบจัดการร้าน - อิสระเฟอร์นิเจอร์
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

export default AdminNavbar;
