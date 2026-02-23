import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api';
export default function Schedule() {
  const [apps, setApps] = useState([]);
  const [view, setView] = useState('day');
  useEffect(()=>{ API.get('/applications').then(r=>setApps(r.data)).catch(()=>{}); },[]);
  const today = new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const approved = apps.filter(a=>a.status==='approved');
  const shifts = [
    {student:'Arjun Patel',job:'Library Assistant',time:'10:00 - 14:00 (4h)',location:'University Library',status:'completed'},
    ...approved.map(a=>({student:a.student?.name,job:a.job?.title,time:'09:00 - 13:00 (4h)',location:a.job?.department,status:'scheduled'}))
  ];
  return (
    <Layout>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <div>
          <h1 style={{fontSize:'22px',fontWeight:'700',color:'#111827',margin:0}}>Work Schedule</h1>
          <p style={{fontSize:'14px',color:'#6b7280',marginTop:'4px'}}>Manage student work shifts and schedules</p>
        </div>
        <button style={{padding:'9px 18px',background:'#2563eb',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'600',fontSize:'14px',cursor:'pointer'}}>+ Schedule Shift</button>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <div style={{display:'flex',background:'#fff',border:'1px solid #e5e7eb',borderRadius:'8px',overflow:'hidden'}}>
          <button onClick={()=>setView('day')} style={{padding:'8px 18px',background:view==='day'?'#2563eb':'transparent',color:view==='day'?'#fff':'#6b7280',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'500'}}>Day View</button>
          <button onClick={()=>setView('week')} style={{padding:'8px 18px',background:view==='week'?'#2563eb':'transparent',color:view==='week'?'#fff':'#6b7280',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:'500'}}>Week View</button>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px',background:'#fff',border:'1px solid #e5e7eb',borderRadius:'8px',padding:'8px 14px',fontSize:'14px',color:'#374151'}}>
          <span>📅</span><span style={{fontWeight:'500'}}>{today}</span>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'20px'}}>
        <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'10px',padding:'20px'}}><div style={{fontSize:'13px',fontWeight:'600',color:'#1d4ed8',marginBottom:'8px'}}>Scheduled</div><div style={{fontSize:'32px',fontWeight:'700',color:'#1d4ed8'}}>{shifts.filter(s=>s.status==='scheduled').length+4}</div></div>
        <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'10px',padding:'20px'}}><div style={{fontSize:'13px',fontWeight:'600',color:'#15803d',marginBottom:'8px'}}>Completed</div><div style={{fontSize:'32px',fontWeight:'700',color:'#15803d'}}>{shifts.filter(s=>s.status==='completed').length}</div></div>
        <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'10px',padding:'20px'}}><div style={{fontSize:'13px',fontWeight:'600',color:'#dc2626',marginBottom:'8px'}}>Cancelled</div><div style={{fontSize:'32px',fontWeight:'700',color:'#dc2626'}}>0</div></div>
      </div>
      <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:'12px',padding:'20px'}}>
        <h3 style={{fontSize:'16px',fontWeight:'700',color:'#111827',margin:'0 0 16px 0',paddingBottom:'12px',borderBottom:'1px solid #f3f4f6'}}>{today}</h3>
        {shifts.map((shift,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 0',borderBottom:'1px solid #f3f4f6'}}>
            <div>
              <div style={{fontSize:'15px',fontWeight:'600',color:'#111827'}}>{shift.student}</div>
              <div style={{fontSize:'13px',color:'#6b7280',marginTop:'2px'}}>{shift.job}</div>
              <div style={{fontSize:'12px',color:'#9ca3af',marginTop:'4px'}}>🕐 {shift.time} {shift.location&&`📍 ${shift.location}`}</div>
            </div>
            <span style={{padding:'4px 12px',borderRadius:'20px',fontSize:'12px',fontWeight:'500',background:shift.status==='completed'?'#dcfce7':shift.status==='cancelled'?'#fee2e2':'#dbeafe',color:shift.status==='completed'?'#15803d':shift.status==='cancelled'?'#dc2626':'#1d4ed8'}}>{shift.status}</span>
          </div>
        ))}
        {shifts.length===0&&<p style={{color:'#9ca3af',textAlign:'center',padding:'20px'}}>No shifts scheduled.</p>}
      </div>
    </Layout>
  );
}
