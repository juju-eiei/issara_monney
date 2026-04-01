import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { User, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/owner/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2 className="text-center" style={{ fontSize: '1.8rem', marginBottom: '10px' }}>ระบบจัดการร้าน</h2>
      <p className="text-center text-muted mb-4">สำหรับแอดมินอิสระเฟอร์นิเจอร์</p>
      
      {error && <div className="text-danger mb-4 text-center">{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label text-main">ชื่อผู้ใช้ (Username)</label>
          <div className="flex items-center form-control">
            <User size={20} style={{ marginRight: '10px', color: 'var(--primary)' }} />
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="admin" 
              style={{ border: 'none', width: '100%', outline: 'none', background: 'transparent' }}
              required 
            />
          </div>
        </div>
        
        <div className="form-group mb-4">
          <label className="form-label text-main">รหัสผ่าน (Password)</label>
          <div className="flex items-center form-control">
            <Lock size={20} style={{ marginRight: '10px', color: 'var(--primary)' }} />
            <input 
              type="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="****" 
              style={{ border: 'none', width: '100%', outline: 'none', background: 'transparent' }}
              required 
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ height: '50px' }}>
          เข้าสู่ระบบร้านค้า
        </button>
      </form>
    </div>
  );
}
