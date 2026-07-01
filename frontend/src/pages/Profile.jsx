import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    try {
      setSaving(true);
      const body = { name, email };
      if (password) body.password = password;
      const { data } = await api.put('/profile', body);
      const stored = JSON.parse(localStorage.getItem('user'));
      stored.name = data.name;
      stored.email = data.email;
      localStorage.setItem('user', JSON.stringify(stored));
      setUser(stored);
      showToast('Profile updated');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem' }}>Profile</h2>
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Name</label>
          <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>New Password (leave blank to keep current)</label>
          <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input className="input-field" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}