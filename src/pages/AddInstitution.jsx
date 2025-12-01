//frontend\src\pages\AddInstitution.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../assets/css/ind.css';
import '../assets/css/adminhome.css';

export default function AddInstitution() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [publishAdmissions, setPublishAdmissions] = useState(false); // UI only
  const [active, setActive] = useState(true); // UI only
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setMsgType('');

    try {
      const res = await API.post('/institute/', {   // instead of '/admin/institutions'
  name,
  type,
  address,
  contact,
});

      if (res.status === 201 || res.status === 200) {
        setMsg('✅ Institution added successfully!');
        setMsgType('success');

        setTimeout(() => {
          navigate('/admin'); // redirect to dashboard
        }, 800);
      } else {
        setMsg('❌ Something went wrong.');
        setMsgType('error');
      }
    } catch (error) {
      console.error(error);
      setMsg(error.response?.data?.message || '❌ Error adding institution');
      setMsgType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div className="form-wrapper" style={{ padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px', background: '#fff' }}>
        <h2 className="form-title" style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Add New Institution</h2>

        {msg && (
          <div
            className={`alert ${msgType === 'success' ? 'alert-success' : 'alert-error'}`}
            style={{
              padding: '0.8rem 1rem',
              marginBottom: '1rem',
              borderRadius: '6px',
              backgroundColor: msgType === 'success' ? '#d4edda' : '#f8d7da',
              color: msgType === 'success' ? '#155724' : '#721c24',
              border: msgType === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
              fontWeight: '500',
              textAlign: 'center'
            }}
          >
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="institution-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="name" style={{ marginBottom: '0.3rem', fontWeight: '600' }}>Institution Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              style={{ padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
              required
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="type" style={{ marginBottom: '0.3rem', fontWeight: '600' }}>Institution Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="form-control"
              style={{ padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
              required
            >
              <option value="">-- Select Type --</option>
              <option value="University">University</option>
              <option value="College">College</option>
              <option value="Technical School">Technical School</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="address" style={{ marginBottom: '0.3rem', fontWeight: '600' }}>Address</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-control"
              rows="3"
              style={{ padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}
              required
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="contact" style={{ marginBottom: '0.3rem', fontWeight: '600' }}>Contact Number / Email</label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="form-control"
              style={{ padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
              required
            />
          </div>

          {/* Optional Features (UI only) */}
          <div className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ fontWeight: '600' }}>Optional Features</label>
            <div className="checkbox-group" style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <input
                  type="checkbox"
                  checked={publishAdmissions}
                  onChange={(e) => setPublishAdmissions(e.target.checked)}
                />
                Publish Admissions (UI only)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                Active (UI only)
              </label>
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              className="btn-submit"
              style={{
                background: '#4CAF50',
                color: '#fff',
                padding: '0.7rem 1.2rem',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Add Institution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
