import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Users, TrendingUp, HandCoins, Search, PlusCircle, CheckCircle } from 'lucide-react';

export default function OwnerDashboard() {
  const [dashboard, setDashboard] = useState({ totalCustomers: 0, totalSales: 0, totalRewardsRedeemed: 0, totalCashGiven: 0 });
  const [searchPhone, setSearchPhone] = useState('');
  const [customer, setCustomer] = useState(null);
  const [searchError, setSearchError] = useState('');
  
  // Create / Add Points state
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [isNew, setIsNew] = useState(false);

  // Redeem state
  const [rewardsToUse, setRewardsToUse] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('ownerToken')) {
      navigate('/owner');
      return;
    }
    fetchDashboard();
  }, [navigate]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setDashboard(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setCustomer(null);
    setSearchError('');
    setIsNew(false);
    
    try {
      if (searchPhone.length !== 10) throw new Error('เบอร์โทรศัพท์ต้องมี 10 หลัก');
      const res = await api.get(`/customers/${searchPhone}`);
      setCustomer(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setIsNew(true);
        setSearchError('ไม่พบลูกค้าในระบบ จะทำการลงทะเบียนใหม่');
      } else {
        setSearchError(err.message || 'เกิดข้อผิดพลาดในการค้นหา');
      }
    }
  };

  const handleAddPoints = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers', {
        phone: searchPhone,
        name: isNew ? name : undefined,
        pin: isNew ? pin : undefined,
        amount: parseFloat(amount)
      });
      alert('บันทึกยอดสำเร็จ');
      setAmount('');
      if (isNew) {
        setIsNew(false);
        setName('');
        setPin('');
      }
      handleSearch(new Event('submit'));
      fetchDashboard();
    } catch (err) {
        alert(err.response?.data?.error || 'บันทึกไม่สำเร็จ');
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!window.confirm(`ยืนยันการแลกเงิน ${rewardsToUse * 1000} บาท สำหรับลูกค้านี้?`)) return;
    try {
      const res = await api.post('/customers/redeem', {
        phone: customer.phone,
        rewardsToUse: parseInt(rewardsToUse)
      });
      alert(`แลกสิทธิ์สำเร็จ ให้เงินสดลูกค้า ${res.data.cashReceived} บาท`);
      setRewardsToUse(1);
      handleSearch(new Event('submit'));
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.error || 'แลกสิทธิ์ไม่สำเร็จ');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: 'bold' }}>แดชบอร์ดเจ้าของร้าน (Admin)</h2>
      
      <div className="grid grid-cols-2" style={{ marginBottom: '20px' }}>
        <div className="card text-center mb-0">
          <Users size={28} className="text-primary mb-2" style={{ margin: '0 auto' }} />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ลูกค้าทั้งหมด</h3>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{dashboard.totalCustomers} <span style={{fontSize:'1rem'}}>คน</span></p>
        </div>
        <div className="card text-center mb-0">
          <TrendingUp size={28} className="text-success mb-2" style={{ margin: '0 auto' }} />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ยอดขายสะสม</h3>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--success)' }}>{dashboard.totalSales.toLocaleString()} <span style={{fontSize:'1rem'}}>บาท</span></p>
        </div>
        <div className="card text-center mb-0" style={{ gridColumn: '1 / -1' }}>
          <HandCoins size={28} className="text-danger mb-2" style={{ margin: '0 auto' }} />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ให้ลูกค้าแลกไปแล้ว</h3>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--danger)' }}>{dashboard.totalCashGiven.toLocaleString()} <span style={{fontSize:'1rem'}}>บาท ({dashboard.totalRewardsRedeemed} สิทธิ์)</span></p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', fontWeight: 'bold' }}>ค้นหา / เพิ่มยอดลูกค้า</h3>
        <form onSubmit={handleSearch} className="flex flex-mobile-col gap-3">
          <div className="form-control flex items-center" style={{ flex: 1 }}>
            <Search size={20} style={{ marginRight: '8px', color: 'var(--text-muted)' }} />
            <input 
              type="tel" 
              maxLength="10"
              value={searchPhone} 
              onChange={(e) => setSearchPhone(e.target.value.replace(/\D/g, ''))} 
              placeholder="กรอกเบอร์โทร..." 
              style={{ border: 'none', width: '100%', outline: 'none' }}
              required={!isNew}
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary" style={{ flex: 1, whiteSpace: 'nowrap' }}>
              ค้นหาข้อมูล
            </button>
            <button 
              type="button" 
              className="btn btn-outline" 
              style={{ flex: 1, whiteSpace: 'nowrap', background: isNew ? '#f8f9fa' : 'transparent' }}
              onClick={() => {
                if (isNew) {
                  setIsNew(false);
                  setSearchPhone('');
                } else {
                  setCustomer(null);
                  setSearchError('');
                  setIsNew(true);
                  setSearchPhone('');
                  setName('');
                  setPin('');
                  setAmount('');
                }
              }}
            >
              {isNew ? 'ยกเลิก' : <><PlusCircle size={20} /> สมัครรายใหม่</>}
            </button>
          </div>
        </form>

        {searchError && (
          <div className="mt-4 p-4 text-danger" style={{ background: '#fff3cd', color: '#856404', borderRadius: '8px' }}>
            {searchError}
          </div>
        )}
      </div>

      {(customer || isNew) && (
        <div className="card" style={{ border: '2px solid var(--primary)' }}>
          <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid #ddd', paddingBottom: '12px', marginBottom: '16px', fontWeight: 'bold' }}>
            {isNew ? '✨ สมัครและเพิ่มยอดซื้อทันที' : `✅ ข้อมูลของ: ${customer.name || customer.phone}`}
          </h3>
          
          {!isNew && customer && (
            <div className="grid grid-cols-2 mb-4">
              <div style={{ padding: '12px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                <p style={{fontSize: '0.9rem'}}>ยอดสะสมรวม:</p>
                <h4 style={{ fontSize: '1.4rem', color: 'var(--success)' }}>{customer.totalItemsSpent.toLocaleString()} ฿</h4>
              </div>
              <div style={{ padding: '12px', background: '#e8f5e9', borderRadius: '8px', border: '1px solid var(--success)' }}>
                <p style={{fontSize: '0.9rem'}}>สิทธิ์แลกเงินคงเหลือ:</p>
                <h4 style={{ fontSize: '1.4rem', color: 'var(--success)', fontWeight: 'bold' }}>{customer.rewardBalance} สิทธิ์</h4>
              </div>
            </div>
          )}

          <form onSubmit={handleAddPoints}>
            {isNew && (
              <div className="grid grid-cols-2" style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '16px' }}>
                 <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" style={{fontSize: '1rem'}}>เบอร์โทรศัพท์ (10 หลัก)</label>
                  <input type="text" className="form-control" maxLength="10" value={searchPhone} onChange={e => setSearchPhone(e.target.value.replace(/\D/g, ''))} placeholder="08xxxxxxxx" required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{fontSize: '1rem'}}>ชื่อลูกค้า</label>
                  <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="ชื่อ นามสกุล" required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{fontSize: '1rem'}}>PIN (6 หลัก)</label>
                  <input type="text" className="form-control" pattern="[0-9]*" maxLength="6" value={pin} onChange={e => setPin(e.target.value)} placeholder="เช่น 123456" required />
                </div>
              </div>
            )}
            
            <div className="form-group mt-2">
              <label className="form-label" style={{ fontSize: '1.1rem', color: isNew ? 'var(--text-muted)' : 'var(--primary)', fontWeight: 'bold' }}>
                {isNew ? 'เพิ่มยอดซื้อบิลแรก (เว้นได้ถ้าไม่มี)' : 'เพิ่มยอดซื้อวันนี้ (บาท)'}
              </label>
              <div className="flex flex-mobile-col gap-3">
                <input 
                  type="number" 
                  className="form-control" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  placeholder="ยอดบิลตามใบเสร็จ" 
                  style={{ fontSize: '1.4rem', fontWeight: 'bold', flex: 2 }}
                  required={!isNew}
                />
                <button type="submit" className="btn btn-primary" style={{ flex: 1, fontSize: '1.1rem' }}>
                  <PlusCircle size={20} /> {isNew ? 'บันทึกสมัคร' : 'บันทึกยอด'}
                </button>
              </div>
            </div>

          </form>

          {!isNew && customer && customer.rewardBalance > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: '2px dashed var(--danger)' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--danger)', marginBottom: '12px', fontWeight: 'bold' }}>แลกเงินสดคืนให้ลูกค้า</h3>
              <form onSubmit={handleRedeem} className="flex flex-mobile-col gap-3 items-center">
                <div style={{ flex: 2, width: '100%' }}>
                  <select 
                    className="form-control" 
                    value={rewardsToUse} 
                    onChange={e => setRewardsToUse(e.target.value)}
                  >
                    {[...Array(customer.rewardBalance).keys()].map(i => (
                      <option key={i+1} value={i+1}>หัก {i+1} สิทธิ์ (เพื่อแลกเงิน {(i+1) * 1000} บาท)</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-danger" style={{ flex: 1, width: '100%' }}>
                  <CheckCircle size={20} /> ยืนยันให้เงินสด
                </button>
              </form>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
