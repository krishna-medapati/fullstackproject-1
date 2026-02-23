import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Students() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/students').then(res => setStudents(res.data));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back</button>
        <h2>All Students</h2>
      </div>
      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Joined</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id} style={styles.tr}>
              <td style={styles.td}>{s.name}</td>
              <td style={styles.td}>{s.email}</td>
              <td style={styles.td}>{s.role}</td>
              <td style={styles.td}>{new Date(s.createdAt).toLocaleDateString()}</td>
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
  td: { padding:'12px 15px' }
};
