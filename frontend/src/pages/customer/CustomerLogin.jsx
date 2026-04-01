import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Phone, Lock } from 'lucide-react';

export default function CustomerLogin() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/customer/login', { phone, pin });
      localStorage.setItem('customerToken', res.data.token);
      localStorage.setItem('customerData', JSON.stringify({ name: res.data.name, phone: res.data.phone }));
      navigate('/customer/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '40px auto', padding: '32px 24px' }}>
      <h2 className="text-center" style={{ fontSize: '1.5rem', marginBottom: '8px', fontWeight: 'bold' }}>ดูยอดสะสม</h2>
      <p className="text-center text-muted mb-4" style={{ fontSize: '0.95rem' }}>กรอกเบอร์และรหัส PIN เพื่อเข้าสู่ระบบ</p>
      
      {error && <div className="text-danger mb-4 text-center" style={{ padding: '10px', background: '#ffe6e6', borderRadius: '8px', fontSize: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleLogin}>
        <div className="form-group mb-4">
          <label className="form-label text-main">โทรศัพท์มือถือ</label>
          <div className="flex items-center form-control">
            <Phone size={20} style={{ marginRight: '10px', color: 'var(--primary)' }} />
            <input 
              type="tel" 
              maxLength="10"
              value={phone} 
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
              placeholder="08xxxxxxxx" 
              style={{ border: 'none', width: '100%', outline: 'none', background: 'transparent' }}
              required 
            />
          </div>
        </div>
        
        <div className="form-group mb-4">
          <label className="form-label text-main">รหัส PIN 6 หลัก</label>
          <div className="flex items-center form-control">
            <Lock size={20} style={{ marginRight: '10px', color: 'var(--primary)' }} />
            <input 
              type="password"
              pattern="[0-9]*" 
              inputMode="numeric"
              maxLength="6"
              value={pin} 
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} 
              placeholder="รหัส 6 หลัก" 
              style={{ border: 'none', width: '100%', outline: 'none', background: 'transparent' }}
              required 
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ height: '50px', marginTop: '16px' }}>
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}
