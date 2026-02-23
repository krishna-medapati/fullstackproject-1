import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Applications() {
  const [apps, setApps] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    const res = await API.get('/applications');
    setApps(res.data);
  };

  const updateStatus = async (id, status) => {
    await API.put(`/applications/${id}`, { status });
    fetchApps();
  };

  const statusColor = { pending:'#ff9800', approved:'#4caf50', rejected:'#f44336' };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back</button>
        <h2>Applications</h2>
      </div>
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>Student</th>
            <th style={styles.th}>Job</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>Status</th>
            {user?.role === 'admin' && <th style={styles.th}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {apps.map(app => (
            <tr key={app._id} style={styles.tr}>
              <td style={styles.td}>{app.student?.name}</td>
              <td style={styles.td}>{app.job?.title}</td>
              <td style={styles.td}>{app.job?.department}</td>
              <td style={styles.td}>
                <span style={{...styles.badge, background: statusColor[app.status]}}>{app.status}</span>
              </td>
              {user?.role === 'admin' && (
                <td style={styles.td}>
                  <button style={{...styles.btn, background:'#4caf50'}} onClick={() => updateStatus(app._id,'approved')}>Approve</button>
                  <button style={{...styles.btn, background:'#f44336'}} onClick={() => updateStatus(app._id,'rejected')}>Reject</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding:'30px', background:'#f0f2f5', minHeight:'100vh' },
  header: { display:'flex', alignItems:'center', gap:'20px', marginBottom:'20px' },
  backBtn: { padding:'8px 15px', background:'#666', color:'white', border:'none', borderRadius:'5px', cursor:'pointer' },
  table: { width:'100%', background:'white', borderRadius:'10px', borderCollapse:'collapse', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
  thead: { background:'#1a73e8', color:'white' },
  th: { padding:'12px 15px', textAlign:'left' },
  tr: { borderBottom:'1px solid #eee' },
  td: { padding:'12px 15px' },
  badge: { padding:'3px 10px', borderRadius:'20px', color:'white', fontSize:'12px' },
  btn: { padding:'5px 10px', color:'white', border:'none', borderRadius:'5px', cursor:'pointer', margin:'2px' }
};
