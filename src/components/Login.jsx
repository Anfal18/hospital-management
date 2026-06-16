import React, { useState } from 'react';
import { UserIcon, ShieldIcon } from './Icons';

export default function Login({ onLogin, showNotification }) {
  const [role, setRole] = useState('patient'); // patient, admin
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      showNotification('Please fill in both username and password fields.', 'error');
      return;
    }

    // Standard demo checks
    if (role === 'patient') {
      if (username.toLowerCase() === 'patient' && password === 'patient') {
        onLogin('patient', 'Rahul Sharma');
        showNotification('Successfully logged in as Patient!', 'success');
      } else {
        showNotification('Invalid Patient credentials. Use: patient / patient', 'error');
      }
    } else if (role === 'admin') {
      if (username.toLowerCase() === 'admin' && password === 'admin') {
        onLogin('admin', 'Administrator Panel');
        showNotification('Successfully logged in as Admin!', 'success');
      } else {
        showNotification('Invalid Admin credentials. Use: admin / admin', 'error');
      }
    }
  };

  const fillDemoCredentials = () => {
    if (role === 'patient') {
      setUsername('patient');
      setPassword('patient');
    } else {
      setUsername('admin');
      setPassword('admin');
    }
  };

  return (
    <div className="auth-page animate-fade">
      <div className="auth-card">
        <div className="auth-header">
          <h2>CarePulse Portal</h2>
          <p>Select your login role and enter credentials to continue</p>
        </div>

        {/* Role Switcher */}
        <div className="auth-tabs">
          <div 
            className={`auth-tab ${role === 'patient' ? 'active' : ''}`}
            onClick={() => { setRole('patient'); setUsername(''); setPassword(''); }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <UserIcon size={16} /> Patient
            </span>
          </div>
          <div 
            className={`auth-tab ${role === 'admin' ? 'active' : ''}`}
            onClick={() => { setRole('admin'); setUsername(''); setPassword(''); }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldIcon size={16} /> Administrator
            </span>
          </div>
        </div>

        {/* Demo Credentials Box */}
        <div className="demo-credentials">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <h4>Demo Credentials Available</h4>
            <button 
              type="button" 
              onClick={fillDemoCredentials}
              style={{
                background: 'var(--success)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Auto Fill
            </button>
          </div>
          <p>Username: <code>{role}</code></p>
          <p>Password: <code>{role}</code></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              className="form-control" 
              placeholder={`Enter '${role}'`} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="form-control" 
              placeholder={`Enter '${role}'`} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
            Log In as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>
      </div>
    </div>
  );
}
