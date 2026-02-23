import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title:'', department:'', description:'', hoursPerWeek:'', pay:'', slots:'' });
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { API.get('/jobs').then(r => setJobs(r.data)); }, []);

  const handleApply = async (jobId) => {
    try {
      await API.post('/applications', { job: jobId });
      alert('✅ Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error applying');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await API.post('/jobs', form);
    setShowForm(false);
    API.get('/jobs').then(r => setJobs(r.data));
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this job?')) {
      await API.delete(`/jobs/${id}`);
      setJobs(jobs.filter(j => j._id !== id));
    }
  };

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.page}>
      <div style={s.sidebar}>
        <div style={s.logo}>WS</div>
        <nav style={s.nav}>
          <button style={s.navBtn} onClick={() => navigate('/dashboard')}>🏠 Dashboard</button>
          <button style={{...s.navBtn, ...s.activeNav}}>💼 Jobs</button>
          <button style={s.navBtn} onClick={() => navigate('/applications')}>📋 Applications</button>
          {user?.role === 'admin' && <button style={s.navBtn} onClick={() => navigate('/students')}>👥 Students</button>}
        </nav>
      </div>

      <div style={s.main}>
        <div style={s.topbar}>
          <div>
            <h1 style={s.pageTitle}>Job Listings</h1>
            <p style={s.pageSub}>{jobs.filter(j=>j.status==='open').length} positions available</p>
          </div>
          {user?.role === 'admin' && (
            <button style={s.addBtn} onClick={() => setShowForm(!showForm)}>+ Post New Job</button>
          )}
        </div>

        <input style={s.search} placeholder="🔍  Search jobs by title or department..."
          value={search} onChange={e => setSearch(e.target.value)} />

        {showForm && (
          <form onSubmit={handleCreate} style={s.form}>
            <h3 style={{margin:'0 0 16px 0', color:'#0f172a'}}>Post a New Job</h3>
            <div style={s.formGrid}>
              <input style={s.input} placeholder="Job Title" onChange={e=>setForm({...form,title:e.target.value})} required />
              <input style={s.input} placeholder="Department" onChange={e=>setForm({...form,department:e.target.value})} required />
              <input style={s.input} placeholder="Hours/Week" type="number" onChange={e=>setForm({...form,hoursPerWeek:e.target.value})} />
              <input style={s.input} placeholder="Pay ($/hr)" type="number" onChange={e=>setForm({...form,pay:e.target.value})} />
              <input style={s.input} placeholder="Available Slots" type="number" onChange={e=>setForm({...form,slots:e.target.value})} />
              <input style={s.input} placeholder="Description" onChange={e=>setForm({...form,description:e.target.value})} />
            </div>
            <button style={s.addBtn} type="submit">Create Job</button>
          </form>
        )}

        <div style={s.grid}>
          {filtered.map(job => (
            <div key={job._id} style={s.card}>
              <div style={s.cardTop}>
                <div style={s.deptBadge}>{job.department}</div>
                <span style={{...s.statusBadge, background: job.status==='open'?'#dcfce7':'#fee2e2', color: job.status==='open'?'#16a34a':'#dc2626'}}>{job.status}</span>
              </div>
              <h3 style={s.jobTitle}>{job.title}</h3>
              <p style={s.jobDesc}>{job.description || 'No description provided.'}</p>
              <div style={s.jobMeta}>
                <span style={s.metaItem}>⏱ {job.hoursPerWeek}h/week</span>
                <span style={s.metaItem}>💰 ${job.pay}/hr</span>
                <span style={s.metaItem}>👥 {job.slots} slots</span>
              </div>
              <div style={s.cardActions}>
                {user?.role === 'student' && job.status === 'open' && (
                  <button style={s.applyBtn} onClick={() => handleApply(job._id)}>Apply Now</button>
                )}
                {user?.role === 'admin' && (
                  <button style={s.deleteBtn} onClick={() => handleDelete(job._id)}>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display:'flex', height:'100vh', fontFamily:'sans-serif', background:'#f8fafc' },
  sidebar: { width:'240px', background:'#0f172a', display:'flex', flexDirection:'column', padding:'24px 16px' },
  logo: { background:'#2563eb', color:'white', width:'40px', height:'40px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'18px', marginBottom:'32px' },
  nav: { display:'flex', flexDirection:'column', gap:'4px' },
  navBtn: { padding:'10px 14px', background:'transparent', color:'#94a3b8', border:'none', borderRadius:'8px', cursor:'pointer', textAlign:'left', fontSize:'14px', fontWeight:'500' },
  activeNav: { background:'rgba(37,99,235,0.15)', color:'#60a5fa' },
  main: { flex:1, overflowY:'auto', padding:'32px' },
  topbar: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' },
  pageTitle: { fontSize:'24px', fontWeight:'700', color:'#0f172a', margin:0 },
  pageSub: { color:'#64748b', fontSize:'14px', marginTop:'4px' },
  addBtn: { padding:'10px 20px', background:'#2563eb', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'14px' },
  search: { width:'100%', padding:'12px 16px', border:'1.5px solid #e2e8f0', borderRadius:'10px', fontSize:'14px', marginBottom:'24px', boxSizing:'border-box', outline:'none' },
  form: { background:'white', padding:'24px', borderRadius:'12px', marginBottom:'24px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' },
  formGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px' },
  input: { padding:'10px 14px', border:'1.5px solid #e2e8f0', borderRadius:'8px', fontSize:'14px', outline:'none' },
  grid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' },
  card: { background:'white', borderRadius:'12px', padding:'20px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', display:'flex', flexDirection:'column', gap:'8px' },
  cardTop: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  deptBadge: { background:'#eff6ff', color:'#2563eb', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600' },
  statusBadge: { padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'500' },
  jobTitle: { fontSize:'16px', fontWeight:'700', color:'#0f172a', margin:0 },
  jobDesc: { fontSize:'13px', color:'#64748b', lineHeight:'1.5', margin:0 },
  jobMeta: { display:'flex', gap:'12px', flexWrap:'wrap' },
  metaItem: { fontSize:'12px', color:'#64748b', background:'#f8fafc', padding:'4px 10px', borderRadius:'6px' },
  cardActions: { marginTop:'8px' },
  applyBtn: { padding:'8px 20px', background:'linear-gradient(90deg,#2563eb,#0ea5e9)', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'13px' },
  deleteBtn: { padding:'8px 20px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600', fontSize:'13px' },
};
