import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from '../api';

export default function Login() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await API.post("/auth/login", { email, password });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await API.post("/auth/verify-otp", { email, otp });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Panel */}
      <div style={{ width: '45%', background: '#1a56db', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 50px', color: '#fff' }}>
        <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '60px' }}>
          Work-Study Management System<br />
          <span style={{ fontSize: '13px', fontWeight: '400', opacity: 0.8 }}>FSAD-PS42</span>
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.3', marginBottom: '32px' }}>
          {step === 1 ? 'Welcome back to the work-study portal' : 'Verify your identity'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px', opacity: 0.9 }}>
          <div>✓ Access your job applications</div>
          <div>✓ View your work schedule</div>
          <div>✓ Track earnings and reports</div>
          <div>✓ Secure OTP-based login</div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: '40px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          {step === 1 ? (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>Sign in</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '28px' }}>Enter your credentials to continue</p>

              {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    style={{ width: '100%', padding: '11px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                    placeholder="you@university.edu" />
                </div>
                <div style={{ marginBottom: '26px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                    style={{ width: '100%', padding: '11px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                    placeholder="Min. 6 characters" />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '12px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                  {loading ? 'Sending OTP...' : 'Sign In'}
                </button>
              </form>
              <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
                Don't have an account? <Link to="/register" style={{ color: '#1a56db', fontWeight: '600' }}>Register</Link>
              </p>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>Check your email</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '28px' }}>We sent a 6-digit OTP to <strong>{email}</strong></p>

              {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

              <form onSubmit={handleVerifyOtp}>
                <div style={{ marginBottom: '26px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Enter OTP</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6}
                    style={{ width: '100%', padding: '14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '28px', letterSpacing: '12px', textAlign: 'center', boxSizing: 'border-box', outline: 'none' }}
                    placeholder="000000" />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '12px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                  {loading ? 'Verifying...' : 'Verify OTP & Login'}
                </button>
                <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }}
                  style={{ width: '100%', marginTop: '10px', padding: '11px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', color: '#6b7280' }}>
                  Back to Sign In
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
