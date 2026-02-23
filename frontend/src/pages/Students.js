import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api';
export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(()=>{ API.get('/students').then(r=>setStudents(r.data)); },[]);
  const filtered = students.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.email.toLowerCase().includes(search.toLowerCase()));
  const statuses = ['active','active','pending','active','inactive'];
  return (
    <Layout>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
        <div>
          <h1 style={{fontSize:'22px',fontWeight:'700',color:'#111827',margin:0}}>Students</h1>
          <p style={{fontSize:'14px',color:'#6b7280',marginTop:'4px'}}>Manage work-study student records</p>
        </div>
        <button style={{padding:'9px 18px',background:'#2563eb',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'600',fontSize:'14px',cursor:'pointer'}}>+ Add Student</button>
      </div>
      <div style={{display:'flex',gap:'12px',marginBottom:'16px'}}>
        <div style={{flex:1,position:'relative'}}>
          <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)'}}>🔍</span>
          <input style={{width:'100%',padding:'10px 14px 10px 36px',border:'1px solid #e5e7eb',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box',background:'#fff'}} placeholder="Search students by name, email, or ID..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select style={{padding:'10px 14px',border:'1px solid #e5e7eb',borderRadius:'8px',fontSize:'14px',outline:'none',background:'#fff'}}><option>All Status</option></select>
      </div>
      <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:'12px',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'#f9fafb'}}>
              {['STUDENT','STUDENT ID','DEPARTMENT','YEAR','HOURS','STATUS','ACTIONS'].map(h=>(
                <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:'11px',fontWeight:'700',color:'#9ca3af',letterSpacing:'0.06em'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((st,i)=>{
              const status = statuses[i%5];
              const sc = status==='active'?{bg:'#dcfce7',color:'#15803d'}:status==='pending'?{bg:'#fef9c3',color:'#b45309'}:{bg:'#f3f4f6',color:'#6b7280'};
              return (
                <tr key={st._id} style={{borderBottom:'1px solid #f3f4f6'}}>
                  <td style={{padding:'14px 16px'}}>
                    <div style={{fontWeight:'600',color:'#111827',fontSize:'14px'}}>{st.name}</div>
                    <div style={{fontSize:'12px',color:'#9ca3af',marginTop:'2px'}}>✉ {st.email}</div>
                  </td>
                  <td style={{padding:'14px 16px',fontSize:'13px',color:'#374151'}}>STU{String(i+1).padStart(3,'0')}</td>
                  <td style={{padding:'14px 16px',fontSize:'14px',color:'#374151'}}>{['Computer Science','Business','Engineering','Arts','Science'][i%5]}</td>
                  <td style={{padding:'14px 16px',fontSize:'14px',color:'#374151'}}>{['Junior','Senior','Sophomore','Freshman','Junior'][i%5]}</td>
                  <td style={{padding:'14px 16px'}}>
                    <div style={{fontSize:'13px',fontWeight:'600',color:'#111827',marginBottom:'4px'}}>0 / 20</div>
                    <div style={{height:'4px',background:'#e5e7eb',borderRadius:'2px',width:'80px'}}><div style={{height:'100%',background:'#2563eb',borderRadius:'2px',width:'0%'}}/></div>
                  </td>
                  <td style={{padding:'14px 16px'}}><span style={{padding:'4px 10px',borderRadius:'20px',fontSize:'12px',fontWeight:'500',background:sc.bg,color:sc.color}}>{status}</span></td>
                  <td style={{padding:'14px 16px'}}>
                    <button style={{background:'transparent',border:'none',cursor:'pointer',fontSize:'15px',padding:'4px'}}>✏️</button>
                    <button style={{background:'transparent',border:'none',cursor:'pointer',fontSize:'15px',padding:'4px'}}>🗑️</button>
                    <button style={{background:'transparent',border:'none',cursor:'pointer',fontSize:'15px',padding:'4px'}}>⋯</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0&&<div style={{padding:'40px',textAlign:'center',color:'#9ca3af'}}>No students found.</div>}
      </div>
    </Layout>
  );
}
