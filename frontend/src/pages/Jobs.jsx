import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import API from '../api';
import { useAuth } from '../context/AuthContext.jsx';

const TIME_SLOTS = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
  '16:00 - 17:00', '17:00 - 18:00'
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', department: '', description: '', slots: 1, status: 'open', timeSlots: [], workDays: [], location: '', salary: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    API.get('/jobs').then(r => setJobs(r.data)).catch(() => {});
  }, []);

  const toggleTimeSlot = (slot) => {
    setForm(f => ({
      ...f,
      timeSlots: f.timeSlots.includes(slot)
        ? f.timeSlots.filter(s => s !== slot)
        : [...f.timeSlots, slot]
    }));
  };

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      workDays: f.workDays.includes(day)
        ? f.workDays.filter(d => d !== day)
        : [...f.workDays, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) { await API.put('/jobs/' + editId, form); }
      else { await API.post('/jobs', form); }
      setShowForm(false); setEditId(null);
      setForm({ title: '', department: '', description: '', slots: 1, status: 'open', timeSlots: [], workDays: [], location: '', salary: '' });
      API.get('/jobs').then(r => setJobs(r.data));
    } catch (err) { setError(err.response?.data?.msg || 'Failed to save job'); }
  };

  const handleEdit = (job) => {
    setForm({
      title: job.title || '', department: job.department || '',
      description: job.description || '', slots: job.slots || 1,
      status: job.status || 'open', timeSlots: job.timeSlots || [],
      workDays: job.workDays || [], location: job.location || '', salary: job.salary || ''
    });
    setEditId(job.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job?')) {
      await API.delete('/jobs/' + id);
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  const handleApply = async (jobId) => {
    try {
      await API.post('/applications', { jobId: jobId });
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to apply');
    }
  };

  const filtered = jobs.filter(j =>
    !search || j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.department?.toLowerCase().includes(search.toLowerCase())
  );

  const openJobs = jobs.filter(j => j.status === 'open').length;

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: 0 }}>Job Postings</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{openJobs} open positions available</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', department: '', description: '', slots: 1, status: 'open', timeSlots: [], workDays: [], location: '', salary: '' }); }}
            style={{ padding: '9px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
            + Post Job
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
        <input style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
          placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Job Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '14px', padding: '32px', width: '560px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 20px 0' }}>{editId ? 'Edit Job' : 'Post New Job'}</h3>
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}
            <form onSubmit={handleSubmit}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Job Title *</label>
                  <input required value={form.title} placeholder="e.g. Library Assistant" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Department *</label>
                  <input required value={form.department} placeholder="e.g. Library" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onChange={e => setForm({ ...form, department: e.target.value })} />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Description</label>
                <textarea value={form.description} rows={2} placeholder="Describe the role..." style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Open Slots</label>
                  <input type="number" min="1" value={form.slots} style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onChange={e => setForm({ ...form, slots: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Location</label>
                  <input value={form.location} placeholder="e.g. Block A" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Pay (₹/hr)</label>
                  <input value={form.salary} placeholder="e.g. 150" style={{ width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onChange={e => setForm({ ...form, salary: e.target.value })} />
                </div>
              </div>

              {/* Work Days */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Work Days</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {DAYS.map(day => (
                    <button key={day} type="button" onClick={() => toggleDay(day)}
                      style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', border: '1px solid', background: form.workDays.includes(day) ? '#2563eb' : '#f3f4f6', color: form.workDays.includes(day) ? '#fff' : '#6b7280', borderColor: form.workDays.includes(day) ? '#2563eb' : '#e5e7eb' }}>
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Time Slots</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {TIME_SLOTS.map(slot => (
                    <button key={slot} type="button" onClick={() => toggleTimeSlot(slot)}
                      style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', border: '1px solid', background: form.timeSlots.includes(slot) ? '#2563eb' : '#f3f4f6', color: form.timeSlots.includes(slot) ? '#fff' : '#6b7280', borderColor: form.timeSlots.includes(slot) ? '#2563eb' : '#e5e7eb' }}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>{editId ? 'Update Job' : 'Post Job'}</button>
                <button type="button" onClick={() => { setShowForm(false); setError(''); }} style={{ flex: 1, padding: '10px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map(job => (
          <div key={job.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{job.title}</div>
                  <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: job.status === 'open' ? '#dcfce7' : '#fee2e2', color: job.status === 'open' ? '#15803d' : '#dc2626' }}>
                    {job.status}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#6b7280', marginBottom: '10px' }}>
                  <span>🏢 {job.department}</span>
                  {job.location && <span>📍 {job.location}</span>}
                  {job.salary && <span>💰 ₹{job.salary}/hr</span>}
                  <span>👥 {job.slots} slot{job.slots !== 1 ? 's' : ''}</span>
                </div>

                {job.description && (
                  <p style={{ fontSize: '13px', color: '#374151', marginBottom: '10px', lineHeight: '1.5' }}>{job.description}</p>
                )}

                {/* Work Days */}
                {job.workDays && job.workDays.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginRight: '8px' }}>📅 Days:</span>
                    <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '4px' }}>
                      {job.workDays.map(d => (
                        <span key={d} style={{ padding: '2px 8px', background: '#eff6ff', color: '#2563eb', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>{d.slice(0, 3)}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Time Slots */}
                {job.timeSlots && job.timeSlots.length > 0 && (
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginRight: '8px' }}>🕐 Time Slots:</span>
                    <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '4px' }}>
                      {job.timeSlots.map(s => (
                        <span key={s} style={{ padding: '2px 8px', background: '#f0fdf4', color: '#15803d', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '16px' }}>
                {user?.role === 'student' && job.status === 'open' && (
                  <button onClick={() => handleApply(job.id)}
                    style={{ padding: '8px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Apply Now
                  </button>
                )}
                {user?.role === 'admin' && (
                  <>
                    <button onClick={() => handleEdit(job)}
                      style={{ padding: '7px 14px', background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDelete(job.id)}
                      style={{ padding: '7px 14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No jobs found.</div>
        )}
      </div>
    </Layout>
  );
}
