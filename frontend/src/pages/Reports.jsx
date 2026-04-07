import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api';
export default function Reports() {
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [students, setStudents] = useState([]);
  useEffect(()=>{
    API.get('/jobs').then(r=>setJobs(r.data)).catch(()=>{});
    API.get('/applications').then(r=>setApps(r.data)).catch(()=>{});
    API.get('/students').then(r=>setStudents(r.data)).catch(()=>{});
  },[]);

  const approved = apps.filter(a=>a.status==='approved').length;
  const pending = apps.filter(a=>a.status==='pending').length;
  const rejected = apps.filter(a=>a.status==='rejected').length;
  const totalApps = apps.length || 1;
  const openJobs = jobs.filter(j=>j.status==='open').length;
  const totalPayroll = approved * 15 * 8;

  // Department breakdown from real jobs
  const deptMap = {};
  jobs.forEach(j => { deptMap[j.department] = (deptMap[j.department]||0) + 1; });
  const depts = Object.keys(deptMap);
  const deptCounts = Object.values(deptMap);
  const maxCount = Math.max(...deptCounts, 1);

  // Donut chart values
  const approvedPct = Math.round((approved/totalApps)*100);
  const pendingPct = Math.round((pending/totalApps)*100);
  const rejectedPct = 100 - approvedPct - pendingPct;

  return (
    <Layout>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px"}}>
        <div>
          <h1 style={{fontSize:"22px",fontWeight:"700",color:"#111827",margin:0}}>Reports & Analytics</h1>
          <p style={{fontSize:"14px",color:"#6b7280",marginTop:"4px"}}>View program statistics and generate reports</p>
        </div>
        <button style={{padding:"9px 18px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",fontWeight:"600",fontSize:"14px",cursor:"pointer"}}>⬇ Export Report</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px",marginBottom:"20px"}}>
        {[
          {icon:"👤",label:"Total Students",val:students.length,note:`${approved} approved`,bg:"#eff6ff",trend:true},
          {icon:"📋",label:"Total Applications",val:apps.length,note:`${pending} pending`,bg:"#f0fdf4"},
          {icon:"💵",label:"Est. Payroll",val:`$${totalPayroll.toLocaleString()}`,note:"Avg. $15/hr",bg:"#faf5ff"},
          {icon:"💼",label:"Open Positions",val:openJobs,note:`of ${jobs.length} total`,bg:"#fff7ed"}
        ].map(c=>(
          <div key={c.label} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:"12px",padding:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"12px"}}>
              <div style={{width:"40px",height:"40px",background:c.bg,borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>{c.icon}</div>
              {c.trend&&<span style={{color:"#16a34a",fontSize:"16px"}}>↗</span>}
            </div>
            <div style={{fontSize:"13px",color:"#6b7280",marginBottom:"4px"}}>{c.label}</div>
            <div style={{fontSize:"28px",fontWeight:"700",color:"#111827"}}>{c.val}</div>
            <div style={{fontSize:"12px",color:"#22c55e",marginTop:"4px"}}>{c.note}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginBottom:"20px"}}>
        <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:"12px",padding:"20px"}}>
          <h3 style={{fontSize:"15px",fontWeight:"700",color:"#111827",margin:"0 0 20px 0"}}>Jobs by Department</h3>
          {depts.length === 0 ? (
            <p style={{color:"#9ca3af",fontSize:"13px"}}>No jobs data available</p>
          ) : (
            <div style={{display:"flex",alignItems:"flex-end",gap:"16px",height:"180px",paddingBottom:"24px",borderBottom:"1px solid #f3f4f6"}}>
              {depts.map((dept,i)=>(
                <div key={dept} style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1}}>
                  <div style={{flex:1,display:"flex",alignItems:"flex-end",width:"100%",justifyContent:"center"}}>
                    <div style={{width:"32px",background:"#2563eb",borderRadius:"4px 4px 0 0",height:`${Math.round((deptCounts[i]/maxCount)*140)+20}px`}}/>
                  </div>
                  <div style={{fontSize:"11px",color:"#9ca3af",marginTop:"8px",textAlign:"center"}}>{dept}</div>
                  <div style={{fontSize:"12px",fontWeight:"600",color:"#374151"}}>{deptCounts[i]}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:"12px",padding:"20px"}}>
          <h3 style={{fontSize:"15px",fontWeight:"700",color:"#111827",margin:"0 0 20px 0"}}>Application Status Distribution</h3>
          <div style={{display:"flex",alignItems:"center",gap:"24px",justifyContent:"center",padding:"10px 0"}}>
            <svg width="160" height="160" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3.8"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3.8" strokeDasharray={`${approvedPct} 100`} strokeDashoffset="25" transform="rotate(-90 18 18)"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3.8" strokeDasharray={`${pendingPct} 100`} strokeDashoffset={`${-(approvedPct-25)}`} transform="rotate(-90 18 18)"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" strokeWidth="3.8" strokeDasharray={`${rejectedPct} 100`} strokeDashoffset={`${-(approvedPct+pendingPct-25)}`} transform="rotate(-90 18 18)"/>
              <text x="18" y="20" textAnchor="middle" fontSize="6" fill="#111827" fontWeight="bold">{apps.length}</text>
              <text x="18" y="25" textAnchor="middle" fontSize="3.5" fill="#6b7280">total</text>
            </svg>
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
              {[{color:"#22c55e",label:`Approved (${approved})`},{color:"#f59e0b",label:`Pending (${pending})`},{color:"#ef4444",label:`Rejected (${rejected})`}].map(l=>(
                <div key={l.label} style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:"#374151"}}>
                  <span style={{width:"10px",height:"10px",borderRadius:"50%",background:l.color,display:"inline-block"}}/>
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:"12px",padding:"20px"}}>
        <h3 style={{fontSize:"15px",fontWeight:"700",color:"#111827",margin:"0 0 20px 0"}}>Applications per Job</h3>
        {jobs.length === 0 ? (
          <p style={{color:"#9ca3af",fontSize:"13px"}}>No data available</p>
        ) : jobs.map(job => {
          const jobApps = apps.filter(a=>a.job?.id===job.id || a.jobId===job.id).length;
          const jobApproved = apps.filter(a=>(a.job?.id===job.id || a.jobId===job.id) && a.status==="approved").length;
          return (
            <div key={job.id} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px"}}>
              <span style={{width:"120px",fontSize:"12px",color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{job.title}</span>
              <div style={{flex:1,height:"8px",background:"#f3f4f6",borderRadius:"4px",overflow:"hidden"}}>
                <div style={{height:"100%",background:"#2563eb",borderRadius:"4px",width:jobApps>0?`${Math.min((jobApps/5)*100,100)}%`:"0%"}}/>
              </div>
              <span style={{width:"60px",fontSize:"12px",color:"#374151",textAlign:"right"}}>{jobApps} apps / {jobApproved} ✓</span>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
