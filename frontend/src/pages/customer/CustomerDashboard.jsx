import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Gift, TrendingUp, History, Coins } from 'lucide-react';

export default function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const userDataStr = localStorage.getItem('customerData');
      if (!userDataStr) {
        navigate('/customer');
        return;
      }
      const { phone } = JSON.parse(userDataStr);
      try {
        const res = await api.get(`/customers/${phone}`);
        setData(res.data);
      } catch (err) {
        navigate('/customer');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  if (loading) return <div className="text-center mt-4"><h3>กำลังโหลดข้อมูล...</h3></div>;
  if (!data) return null;

  const SPEND_PER_REWARD = 20000;
  const currentProgress = data.totalItemsSpent % SPEND_PER_REWARD;
  const percentage = Math.min((currentProgress / SPEND_PER_REWARD) * 100, 100);
  const remainingList = SPEND_PER_REWARD - currentProgress;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="card text-center" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', fontWeight: 'bold' }}>ยินดีต้อนรับคุณ {data.name || 'ลูกค้าคนพิเศษ'}</h2>
        <p style={{ fontSize: '1rem', opacity: 0.9 }}>เบอร์โทร: {data.phone}</p>
      </div>

      <div className="grid grid-cols-2 mt-4">
        {data.rewardBalance > 0 ? (
          <div className="card text-center" style={{ background: '#fff8e1', border: '3px solid #ffc107', boxShadow: '0 6px 16px rgba(255, 193, 7, 0.4)' }}>
            <Gift size={36} color="#ff8f00" className="mb-2" style={{ margin: '0 auto' }} />
            <h3 style={{ fontSize: '1rem', color: '#e65100', fontWeight: 'bold' }}>🎉 ยอดเงินที่รอคุณอยู่!</h3>
            <p style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#e65100', lineHeight: 1, margin: '10px 0' }}>
              {(data.rewardBalance * 1000).toLocaleString()} <span style={{fontSize: '1.2rem'}}>บาท</span>
            </p>
            <div style={{ background: '#ff8f00', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', fontWeight: 'bold' }}>
              👉 แจ้งรับเงินสดที่เคาน์เตอร์ร้านได้เลย
            </div>
          </div>
        ) : (
          <div className="card text-center">
            <Gift size={32} className="text-primary mb-3" style={{ margin: '0 auto' }} />
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>เงินสดที่คุณแลกคืนได้ตอนนี้</h3>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: 1 }}>0 <span style={{fontSize: '1rem'}}>บาท</span></p>
            <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>(ซื้อครบ 2 หมื่น รับเลย 1,000)</p>
          </div>
        )}

        <div className="card text-center">
          <TrendingUp size={32} className="text-success mb-3" style={{ margin: '0 auto' }} />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ยอดซื้อสะสมทั้งหมด</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)', lineHeight: 1 }}>{data.totalItemsSpent.toLocaleString()}</p>
          <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>บาท</p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
          <Coins size={24} className="text-primary" /> หลอดสะสมเพื่อรับเงิน 1,000 บาท
        </h3>
        <p style={{ fontSize: '1rem', marginBottom: '12px' }}>ยอดปัจจุบัน: <strong className="text-primary">{currentProgress.toLocaleString()} / 20,000 บาท</strong></p>
        
        <div className="progress-container" style={{ height: '30px' }}>
          <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
          <div className="progress-text" style={{ fontSize: '0.9rem' }}>{percentage.toFixed(0)}%</div>
        </div>
        
        <p className="text-center mt-3" style={{ fontSize: '1rem' }}>
          ซื้อเพิ่มอีก <strong className="text-danger">{remainingList.toLocaleString()} บาท</strong> รับ 1,000 บาท ทันที!
        </p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
          <History size={24} className="text-muted" /> ประวัติการใช้จ่าย 5 ครั้งล่าสุด
        </h3>
        {data.transactions.length === 0 ? (
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ยังไม่มีประวัติการซื้อ</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.transactions.map((tx) => (
              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px', fontSize: '1rem' }}>
                <div>
                  <strong>ซื้อสินค้า</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(tx.createdAt).toLocaleDateString('th-TH')} {new Date(tx.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <strong className="text-success" style={{ fontSize: '1.1rem' }}>+{tx.amount.toLocaleString()} ฿</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
