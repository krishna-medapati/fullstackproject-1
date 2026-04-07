import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api';
import { useAuth } from '../context/AuthContext';
export default function Applications() {
  const [selected, setSelected] = React.useState(null);
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  useEffect(()=>{ API.get('/applications').then(r=>setApps(r.data)); },[]);
  const updateStatus = async (id, status) => {
    await API.put(`/applications/${id}`,{status});
    setApps(apps.map(a=>a.id===id?{...a,status}:a));
  };
  const counts = {pending:apps.filter(a=>a.status==='pending').length,approved:apps.filter(a=>a.status==='approved').length,rejected:apps.filter(a=>a.status==='rejected').length};
  const filtered = apps.filter(a=>{
    const mf = filter==='all'||a.status===filter;
    const ms = !search||a.student?.name?.toLowerCase().includes(search.toLowerCase())||a.job?.title?.toLowerCase().includes(search.toLowerCase());
    return mf&&ms;
  });
  const sStyle = {pending:{bg:'#fef9c3',color:'#b45309'},approved:{bg:'#dcfce7',color:'#15803d'},rejected:{bg:'#fee2e2',color:'#dc2626'}};
  return (
    <Layout>
      <div style={{marginBottom:'20px'}}>
        <h1 style={{fontSize:'22px',fontWeight:'700',color:'#111827',margin:0}}>Applications</h1>
        <p style={{fontSize:'14px',color:'#6b7280',marginTop:'4px'}}>Review and manage student job applications</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'20px'}}>
        <div style={{background:'#fff',border:'1px solid #fde68a',borderRadius:'10px',padding:'16px 20px'}}><div style={{fontSize:'13px',fontWeight:'600',color:'#b45309',marginBottom:'6px'}}>Pending Review</div><div style={{fontSize:'28px',fontWeight:'700',color:'#b45309'}}>{counts.pending}</div></div>
        <div style={{background:'#fff',border:'1px solid #bfdbfe',borderRadius:'10px',padding:'16px 20px'}}><div style={{fontSize:'13px',fontWeight:'600',color:'#1d4ed8',marginBottom:'6px'}}>Interviewed</div><div style={{fontSize:'28px',fontWeight:'700',color:'#1d4ed8'}}>0</div></div>
        <div style={{background:'#fff',border:'1px solid #bbf7d0',borderRadius:'10px',padding:'16px 20px'}}><div style={{fontSize:'13px',fontWeight:'600',color:'#15803d',marginBottom:'6px'}}>Approved</div><div style={{fontSize:'28px',fontWeight:'700',color:'#15803d'}}>{counts.approved}</div></div>
        <div style={{background:'#fff',border:'1px solid #fecaca',borderRadius:'10px',padding:'16px 20px'}}><div style={{fontSize:'13px',fontWeight:'600',color:'#dc2626',marginBottom:'6px'}}>Rejected</div><div style={{fontSize:'28px',fontWeight:'700',color:'#dc2626'}}>{counts.rejected}</div></div>
      </div>
      <div style={{display:'flex',gap:'12px',marginBottom:'16px'}}>
        <div style={{flex:1,position:'relative'}}>
          <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)'}}>🔍</span>
          <input style={{width:'100%',padding:'10px 14px 10px 36px',border:'1px solid #e5e7eb',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff'}} placeholder="Search by student name or job title..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select style={{padding:'10px 14px',border:'1px solid #e5e7eb',borderRadius:'8px',fontSize:'14px',outline:'none',background:'#fff',cursor:'pointer'}} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
        {filtered.map(app=>{
          const ss = sStyle[app.status]||sStyle.pending;
          return (
            <div key={app.id} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'20px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div>
                  <div style={{fontSize:'15px',fontWeight:'700',color:'#111827'}}>{app.student?.name}</div>
                  <div style={{fontSize:'13px',color:'#374151',marginTop:'3px'}}>Applied for: {app.job?.title}</div>
                  <div style={{fontSize:'12px',color:'#9ca3af',marginTop:'4px'}}>Department: {app.job?.department} &nbsp;·&nbsp; Applied: {new Date(app.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'8px'}}>
                  <span style={{padding:'4px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'500',background:ss.bg,color:ss.color}}>{app.status}</span>
                  {app.status==='approved'&&<button onClick={()=>setSelected(app)} style={{padding:'6px 14px',background:'#fff',border:'1px solid #e5e7eb',borderRadius:'8px',fontSize:'13px',cursor:'pointer',color:'#374151'}}>View Details</button>}
                </div>
              </div>
              {user?.role==='admin'&&app.status==='pending'&&(
                <div style={{display:'flex',gap:'8px',marginTop:'12px'}}>
                  <button onClick={()=>updateStatus(app.id,'approved')} style={{padding:'8px 16px',background:'#16a34a',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'600',fontSize:'13px',cursor:'pointer'}}>✓ Approve</button>
                  <button onClick={()=>updateStatus(app.id,'rejected')} style={{padding:'8px 16px',background:'#dc2626',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'600',fontSize:'13px',cursor:'pointer'}}>✕ Reject</button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length===0&&<div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'40px',textAlign:'center',color:'#9ca3af'}}>No applications found.</div>}
      </div>

      {selected && (
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'#fff',borderRadius:'14px',padding:'32px',width:'460px',boxShadow:'0 8px 40px rgba(0,0,0,0.18)'}}>
            <h3 style={{fontSize:'18px',fontWeight:'700',color:'#111827',margin:'0 0 20px 0'}}>Application Details</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'12px',fontSize:'14px',color:'#374151'}}>
              <div><b>Student:</b> {selected.student?.name || 'N/A'}</div>
              <div><b>Email:</b> {selected.student?.email || 'N/A'}</div>
              <div><b>Job:</b> {selected.job?.title || 'N/A'}</div>
              <div><b>Department:</b> {selected.job?.department || 'N/A'}</div>
              <div><b>Status:</b> <span style={{color:'#16a34a',fontWeight:'600'}}>{selected.status}</span></div>
              <div><b>Applied:</b> {selected.appliedAt ? new Date(selected.appliedAt).toLocaleDateString() : 'N/A'}</div>
            </div>
            <button onClick={()=>setSelected(null)} style={{marginTop:'24px',width:'100%',padding:'10px',background:'#2563eb',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'600',fontSize:'14px',cursor:'pointer'}}>Close</button>
          </div>
        </div>
      )}
    </Layout>
  );
}
