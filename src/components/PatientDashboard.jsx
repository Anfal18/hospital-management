import React, { useState } from 'react';
import { 
  CalendarIcon, ClipboardIcon, DollarIcon, UserIcon, ClockIcon, HeartPulseIcon, PillsIcon
} from './Icons';

export default function PatientDashboard({ 
  appointments, 
  onCancelAppointment, 
  invoices, 
  onPayInvoice, 
  patientProfile, 
  onUpdateProfile, 
  showNotification 
}) {
  const [activeTab, setActiveTab] = useState('appointments'); // appointments, medical-history, billing, profile
  const [profileForm, setProfileForm] = useState({ ...patientProfile });

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    showNotification('Profile updated successfully!', 'success');
  };

  // Mock Medical History data if not provided
  const medicalHistory = [
    {
      id: 1,
      date: '2026-05-12',
      diagnosis: 'Seasonal Influenza',
      doctor: 'Dr Anjali (Neurologist/General Specialist)',
      symptoms: 'High fever, sore throat, body aches',
      treatment: 'Rest, hydration, and paracetamol',
      prescriptions: [
        { name: 'Paracetamol 650mg', dosage: '1-0-1 (After meals)', duration: '5 Days' },
        { name: 'Cough Syrup (Ascoril)', dosage: '2 tsp - thrice daily', duration: '3 Days' }
      ]
    },
    {
      id: 2,
      date: '2026-01-20',
      diagnosis: 'Vitamin D Deficiency',
      doctor: 'Dr Arjun (Orthopedic Specialist)',
      symptoms: 'Mild bone pain, muscle fatigue',
      treatment: 'Vitamin D3 supplementation & morning sunlight exposure',
      prescriptions: [
        { name: 'Calcirol Sachet 60K', dosage: 'Once weekly (With milk)', duration: '8 Weeks' }
      ]
    }
  ];

  return (
    <div className="dashboard-wrapper animate-fade">
      
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-title">Patient Portal</div>
        
        <div 
          className={`sidebar-link ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <CalendarIcon size={18} />
          <span>Appointments</span>
        </div>

        <div 
          className={`sidebar-link ${activeTab === 'medical-history' ? 'active' : ''}`}
          onClick={() => setActiveTab('medical-history')}
        >
          <ClipboardIcon size={18} />
          <span>Medical History</span>
        </div>

        <div 
          className={`sidebar-link ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          <DollarIcon size={18} />
          <span>Billing & Invoices</span>
        </div>

        <div 
          className={`sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <UserIcon size={18} />
          <span>Profile Settings</span>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="dashboard-main">
        
        {/* Header */}
        <header className="dash-header">
          <div className="dash-title-section">
            <h2>Welcome back, {patientProfile.name}</h2>
            <p>Here is your health dashboard and schedules</p>
          </div>
          <div className="user-badge-profile">
            <span className="profile-initials">
              {patientProfile.name ? patientProfile.name.split(' ').map(n=>n[0]).join('') : 'PT'}
            </span>
            <span className="profile-username">{patientProfile.name}</span>
          </div>
        </header>

        {/* Tab contents */}
        
        {/* Tab 1: Appointments */}
        {activeTab === 'appointments' && (
          <div className="dashboard-panel animate-slide-up">
            <div className="panel-header">
              <h3 className="panel-title">My Appointments</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Total: {appointments.length} Appointments
              </p>
            </div>

            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
                <CalendarIcon size={48} style={{ stroke: 'var(--text-muted)', marginBottom: '16px' }} />
                <p>No appointments booked yet.</p>
                <p style={{ fontSize: '13px', marginTop: '6px' }}>Go to the homepage to book a consultation.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Specialty</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(app => (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 600 }}>{app.doctorName}</td>
                        <td>{app.specialty}</td>
                        <td>{app.date}</td>
                        <td>{app.time}</td>
                        <td>{app.phone}</td>
                        <td>
                          <span className={`badge badge-${app.status.toLowerCase()}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          {app.status === 'Pending' || app.status === 'Confirmed' ? (
                            <button 
                              onClick={() => onCancelAppointment(app.id)}
                              className="btn btn-outline btn-sm"
                              style={{ color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                            >
                              Cancel
                            </button>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Locked</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Medical History & Prescriptions */}
        {activeTab === 'medical-history' && (
          <div className="dashboard-panel animate-slide-up">
            <div className="panel-header">
              <h3 className="panel-title">Medical Records & Prescriptions</h3>
            </div>
            
            <div className="timeline">
              {medicalHistory.map(record => (
                <div className="timeline-item" key={record.id}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">{record.date}</div>
                    <h4 className="timeline-title">{record.diagnosis}</h4>
                    <p className="timeline-desc" style={{ marginBottom: '12px' }}>
                      <strong>Symptoms:</strong> {record.symptoms}
                    </p>
                    <p className="timeline-desc" style={{ marginBottom: '20px' }}>
                      <strong>Recommended Treatment:</strong> {record.treatment}
                    </p>
                    
                    <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px', color: 'var(--accent)', marginBottom: '12px' }}>
                        <PillsIcon size={16} /> Prescribed Medicines
                      </p>
                      <div className="table-responsive">
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                              <th style={{ paddingBottom: '8px', color: 'var(--text-secondary)' }}>Medicine Name</th>
                              <th style={{ paddingBottom: '8px', color: 'var(--text-secondary)' }}>Dosage</th>
                              <th style={{ paddingBottom: '8px', color: 'var(--text-secondary)' }}>Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {record.prescriptions.map((p, idx) => (
                              <tr key={idx}>
                                <td style={{ padding: '8px 0', fontWeight: 600 }}>{p.name}</td>
                                <td style={{ padding: '8px 0' }}>{p.dosage}</td>
                                <td style={{ padding: '8px 0' }}>{p.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="timeline-meta">
                      <span>Attending Doctor: <strong>{record.doctor}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Billing & Invoices */}
        {activeTab === 'billing' && (
          <div className="dashboard-panel animate-slide-up">
            <div className="panel-header">
              <h3 className="panel-title">Invoices & Statements</h3>
            </div>

            {invoices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
                <DollarIcon size={48} style={{ stroke: 'var(--text-muted)', marginBottom: '16px' }} />
                <p>No billing invoices generated yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Service Details</th>
                      <th>Bill Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(invoice => (
                      <tr key={invoice.id}>
                        <td>INV-{invoice.id.toString().slice(-6)}</td>
                        <td style={{ fontWeight: 600 }}>Consultation Fee - {invoice.doctorName}</td>
                        <td>{invoice.date}</td>
                        <td style={{ fontWeight: 700 }}>₹{invoice.amount}</td>
                        <td>
                          <span className={`badge ${invoice.status === 'Paid' ? 'badge-completed' : 'badge-pending'}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td>
                          {invoice.status === 'Unpaid' ? (
                            <button 
                              onClick={() => onPayInvoice(invoice.id)}
                              className="btn btn-primary btn-sm"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <span style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 600 }}>Cleared</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile Management */}
        {activeTab === 'profile' && (
          <div className="dashboard-panel animate-slide-up">
            <div className="panel-header">
              <h3 className="panel-title">Profile Management</h3>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="form-grid">
                
                <div className="form-group">
                  <label className="form-label" htmlFor="p-name">Full Name</label>
                  <input 
                    type="text" 
                    id="p-name" 
                    name="name" 
                    className="form-control" 
                    value={profileForm.name} 
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="p-email">Email</label>
                  <input 
                    type="email" 
                    id="p-email" 
                    name="email" 
                    className="form-control" 
                    value={profileForm.email} 
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="p-phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="p-phone" 
                    name="phone" 
                    className="form-control" 
                    value={profileForm.phone} 
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="p-age">Age</label>
                  <input 
                    type="number" 
                    id="p-age" 
                    name="age" 
                    className="form-control" 
                    value={profileForm.age} 
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="p-blood">Blood Group</label>
                  <select 
                    id="p-blood" 
                    name="bloodGroup" 
                    className="form-control" 
                    value={profileForm.bloodGroup} 
                    onChange={handleProfileChange}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="p-emergency">Emergency Contact</label>
                  <input 
                    type="tel" 
                    id="p-emergency" 
                    name="emergencyContact" 
                    className="form-control" 
                    value={profileForm.emergencyContact} 
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label" htmlFor="p-allergies">Allergies / Special Notes</label>
                  <textarea 
                    id="p-allergies" 
                    name="allergies" 
                    rows="3" 
                    className="form-control" 
                    value={profileForm.allergies} 
                    onChange={handleProfileChange}
                    placeholder="Enter any medical allergies or chronic conditions"
                  ></textarea>
                </div>

              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '24px' }}>
                Save Profile Changes
              </button>
            </form>
          </div>
        )}

      </main>

    </div>
  );
}
