import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    API.get('/jobs').then(r => setJobs(r.data)).catch(()=>{});
    API.get('/applications').then(r => setApps(r.data)).catch(()=>{});
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const pendingCount = apps.filter(a => a.status === 'pending').length;
  const approvedCount = apps.filter(a => a.status === 'approved').length;
  const openJobs = jobs.filter(j => j.status === 'open').length;

  return (
    <div style={s.page}>
      <div style={s.sidebar}>
        <div style={s.logo}>WS</div>
        <nav style={s.nav}>
          <button style={{...s.navBtn, ...s.activeNav}}>🏠 Dashboard</button>
          <button style={s.navBtn} onClick={() => navigate('/jobs')}>💼 Jobs</button>
          <button style={s.navBtn} onClick={() => navigate('/applications')}>📋 Applications</button>
          {user?.role === 'admin' && <button style={s.navBtn} onClick={() => navigate('/students')}>👥 Students</button>}
        </nav>
        <div style={s.userBox}>
          <div style={s.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div style={s.userName}>{user?.name}</div>
            <div style={s.userRole}>{user?.role}</div>
          </div>
          <button style={s.logoutBtn} onClick={handleLogout} title="Logout">⏻</button>
        </div>
      </div>

      <div style={s.main}>
        <div style={s.topbar}>
          <div>
            <h1 style={s.pageTitle}>Dashboard</h1>
            <p style={s.pageSub}>Welcome back, {user?.name}!</p>
          </div>
        </div>

        <div style={s.statsRow}>
          <div style={{...s.statCard, borderTop:'4px solid #2563eb'}}>
            <div style={s.statIcon}>💼</div>
            <div style={s.statNum}>{openJobs}</div>
            <div style={s.statLabel}>Open Jobs</div>
          </div>
          <div style={{...s.statCard, borderTop:'4px solid #f59e0b'}}>
            <div style={s.statIcon}>⏳</div>
            <div style={s.statNum}>{pendingCount}</div>
            <div style={s.statLabel}>Pending Applications</div>
          </div>
          <div style={{...s.statCard, borderTop:'4px solid #10b981'}}>
            <div style={s.statIcon}>✅</div>
            <div style={s.statNum}>{approvedCount}</div>
            <div style={s.statLabel}>Approved</div>
          </div>
          <div style={{...s.statCard, borderTop:'4px solid #8b5cf6'}}>
            <div style={s.statIcon}>📊</div>
            <div style={s.statNum}>{apps.length}</div>
            <div style={s.statLabel}>Total Applications</div>
          </div>
        </div>

        <div style={s.grid}>
          <div style={s.section}>
            <h3 style={s.sectionTitle}>Recent Jobs</h3>
            {jobs.slice(0,5).map(job => (
              <div key={job._id} style={s.row}>
                <div>
                  <div style={s.rowTitle}>{job.title}</div>
                  <div style={s.rowSub}>{job.department} • ${job.pay}/hr</div>
                </div>
                <span style={{...s.badge, background: job.status==='open'?'#dcfce7':'#fee2e2', color: job.status==='open'?'#16a34a':'#dc2626'}}>{job.status}</span>
              </div>
            ))}
            <button style={s.viewAll} onClick={() => navigate('/jobs')}>View all jobs →</button>
          </div>

          <div style={s.section}>
            <h3 style={s.sectionTitle}>Recent Applications</h3>
            {apps.slice(0,5).map(app => (
              <div key={app._id} style={s.row}>
                <div>
                  <div style={s.rowTitle}>{app.job?.title}</div>
                  <div style={s.rowSub}>{app.student?.name}</div>
                </div>
                <span style={{...s.badge,
                  background: app.status==='approved'?'#dcfce7':app.status==='rejected'?'#fee2e2':'#fef3c7',
                  color: app.status==='approved'?'#16a34a':app.status==='rejected'?'#dc2626':'#d97706'
                }}>{app.status}</span>
              </div>
            ))}
            <button style={s.viewAll} onClick={() => navigate('/applications')}>View all →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display:'flex', height:'100vh', fontFamily:'sans-serif', background:'#f8fafc' },
  sidebar: { width:'240px', background:'#0f172a', display:'flex', flexDirection:'column', padding:'24px 16px' },
  logo: { background:'#2563eb', color:'white', width:'40px', height:'40px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'18px', marginBottom:'32px' },
  nav: { display:'flex', flexDirection:'column', gap:'4px', flex:1 },
  navBtn: { padding:'10px 14px', background:'transparent', color:'#94a3b8', border:'none', borderRadius:'8px', cursor:'pointer', textAlign:'left', fontSize:'14px', fontWeight:'500' },
  activeNav: { background:'rgba(37,99,235,0.15)', color:'#60a5fa' },
  userBox: { display:'flex', alignItems:'center', gap:'10px', padding:'12px', background:'rgba(255,255,255,0.05)', borderRadius:'10px' },
  avatar: { width:'32px', height:'32px', background:'#2563eb', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700', fontSize:'14px' },
  userName: { fontSize:'13px', fontWeight:'600', color:'#f1f5f9' },
  userRole: { fontSize:'11px', color:'#64748b', textTransform:'capitalize' },
  logoutBtn: { marginLeft:'auto', background:'transparent', border:'none', color:'#64748b', cursor:'pointer', fontSize:'16px' },
  main: { flex:1, overflowY:'auto', padding:'32px' },
  topbar: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px' },
  pageTitle: { fontSize:'24px', fontWeight:'700', color:'#0f172a', margin:0 },
  pageSub: { color:'#64748b', fontSize:'14px', marginTop:'4px' },
  statsRow: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px' },
  statCard: { background:'white', padding:'20px', borderRadius:'12px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' },
  statIcon: { fontSize:'24px', marginBottom:'8px' },
  statNum: { fontSize:'28px', fontWeight:'700', color:'#0f172a' },
  statLabel: { fontSize:'13px', color:'#64748b', marginTop:'4px' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' },
  section: { background:'white', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize:'16px', fontWeight:'700', color:'#0f172a', marginBottom:'16px', margin:'0 0 16px 0' },
  row: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #f1f5f9' },
  rowTitle: { fontSize:'14px', fontWeight:'500', color:'#1e293b' },
  rowSub: { fontSize:'12px', color:'#94a3b8', marginTop:'2px' },
  badge: { padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'500' },
  viewAll: { marginTop:'14px', background:'none', border:'none', color:'#2563eb', cursor:'pointer', fontSize:'13px', fontWeight:'600', padding:0 },
};
