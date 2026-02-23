import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <h1 style={s.brand}>WorkStudy</h1>
        <p style={s.tagline}>Connecting students with opportunities on campus</p>
      </div>
      <div style={s.right}>
        <div style={s.card}>
          <h2 style={s.title}>Welcome back</h2>
          <p style={s.sub}>Sign in to your account</p>
          {error && <div style={s.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="you@university.edu"
              onChange={e => setForm({...form, email: e.target.value})} required />
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••"
              onChange={e => setForm({...form, password: e.target.value})} required />
            <button style={s.btn} type="submit">Sign In →</button>
          </form>
          <p style={s.switch}>Don't have an account? <a href="/register" style={s.link}>Register</a></p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display:'flex', height:'100vh', fontFamily:'sans-serif' },
  left: { flex:1, background:'linear-gradient(135deg, #1e3a5f, #2563eb)', color:'white', display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px' },
  brand: { fontSize:'36px', fontWeight:'800', margin:'0 0 16px 0' },
  tagline: { fontSize:'18px', opacity:0.85, lineHeight:'1.6' },
  right: { flex:1, background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center' },
  card: { background:'white', padding:'48px', borderRadius:'16px', width:'380px', boxShadow:'0 4px 24px rgba(0,0,0,0.08)' },
  title: { fontSize:'24px', fontWeight:'700', color:'#0f172a', margin:'0 0 8px 0' },
  sub: { color:'#64748b', marginBottom:'28px', fontSize:'15px' },
  label: { display:'block', fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'6px' },
  input: { width:'100%', padding:'11px 14px', border:'1.5px solid #e2e8f0', borderRadius:'8px', fontSize:'15px', outline:'none', boxSizing:'border-box', marginBottom:'16px' },
  btn: { width:'100%', padding:'13px', marginTop:'8px', background:'linear-gradient(90deg, #2563eb, #0ea5e9)', color:'white', border:'none', borderRadius:'8px', fontSize:'16px', fontWeight:'600', cursor:'pointer' },
  switch: { textAlign:'center', marginTop:'20px', fontSize:'14px', color:'#64748b' },
  link: { color:'#2563eb', textDecoration:'none', fontWeight:'600' },
  error: { background:'#fee2e2', color:'#dc2626', padding:'10px 14px', borderRadius:'8px', marginBottom:'16px', fontSize:'14px' },
};
