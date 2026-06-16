import React, { useState } from 'react';
import { 
  CalendarIcon, UserIcon, UsersIcon, DollarIcon, ClipboardIcon, 
  PlusIcon, TrashIcon, EditIcon, ClockIcon, ActivityIcon, ReportIcon
} from './Icons';

export default function AdminDashboard({ 
  appointments, 
  onApproveAppointment, 
  onRescheduleAppointment, 
  onCancelAppointment,
  doctors, 
  onAddDoctor, 
  onDeleteDoctor, 
  invoices, 
  onAddInvoice, 
  onClearInvoice,
  showNotification 
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, appointments, doctors, patients, billing
  
  // Reschedule state
  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });

  // Doctor Form State
  const [docForm, setDocForm] = useState({ name: '', specialty: 'Cardiologist', experience: '' });

  // Custom Invoice Form State
  const [billForm, setBillForm] = useState({
    patientName: '',
    doctorName: doctors[0]?.name || 'Dr Rahul',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleDocSubmit = (e) => {
    e.preventDefault();
    if (!docForm.name || !docForm.experience) {
      showNotification('Please fill out all doctor details.', 'error');
      return;
    }
    const newDoc = {
      id: Date.now(),
      name: docForm.name.startsWith('Dr') ? docForm.name : `Dr ${docForm.name}`,
      specialty: docForm.specialty,
      experience: docForm.experience.includes('Year') ? docForm.experience : `${docForm.experience} Years`
    };
    onAddDoctor(newDoc);
    setDocForm({ name: '', specialty: 'Cardiologist', experience: '' });
  };

  const handleRescheduleSubmit = (e, id) => {
    e.preventDefault();
    if (!rescheduleData.date || !rescheduleData.time) {
      showNotification('Please select a valid date and time.', 'error');
      return;
    }
    onRescheduleAppointment(id, rescheduleData.date, rescheduleData.time);
    setRescheduleId(null);
    setRescheduleData({ date: '', time: '' });
  };

  const handleBillingSubmit = (e) => {
    e.preventDefault();
    if (!billForm.patientName || !billForm.amount) {
      showNotification('Please enter patient name and invoice amount.', 'error');
      return;
    }

    const newInvoice = {
      id: Date.now(),
      patientName: billForm.patientName,
      doctorName: billForm.doctorName,
      date: billForm.date,
      amount: parseInt(billForm.amount),
      status: 'Unpaid'
    };

    onAddInvoice(newInvoice);
    setBillForm({
      patientName: '',
      doctorName: doctors[0]?.name || 'Dr Rahul',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Compute stats
  const totalAppointments = appointments.length;
  const pendingApps = appointments.filter(a => a.status === 'Pending').length;
  const totalRevenue = invoices.reduce((acc, curr) => curr.status === 'Paid' ? acc + curr.amount : acc, 0);
  const unpaidRevenue = invoices.reduce((acc, curr) => curr.status === 'Unpaid' ? acc + curr.amount : acc, 0);

  // Group appointments by doctor for reports
  const doctorLoads = doctors.map(doc => {
    const count = appointments.filter(a => a.doctorName === doc.name).length;
    return { name: doc.name, count };
  });

  return (
    <div className="dashboard-wrapper animate-fade">
      
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-title">Admin Console</div>
        
        <div 
          className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <ActivityIcon size={18} />
          <span>Overview & Reports</span>
        </div>

        <div 
          className={`sidebar-link ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <CalendarIcon size={18} />
          <span>Manage Appointments</span>
        </div>

        <div 
          className={`sidebar-link ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          <UserIcon size={18} />
          <span>Manage Doctors</span>
        </div>

        <div 
          className={`sidebar-link ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          <UsersIcon size={18} />
          <span>Patient Directory</span>
        </div>

        <div 
          className={`sidebar-link ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          <DollarIcon size={18} />
          <span>Billing Desk</span>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="dashboard-main">
        
        {/* Header */}
        <header className="dash-header">
          <div className="dash-title-section">
            <h2>Administrative Dashboard</h2>
            <p>Control center for hospital schedules, clinic staff, and patient billing</p>
          </div>
          <div className="user-badge-profile">
            <span className="profile-initials" style={{ backgroundColor: 'var(--accent)' }}>AD</span>
            <span className="profile-username">Admin Portal</span>
          </div>
        </header>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="animate-slide-up">
            
            {/* Stats Overview */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-icon blue">
                  <CalendarIcon size={24} />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-value">{totalAppointments}</span>
                  <span className="stat-card-label">Total Bookings</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon orange">
                  <ClockIcon size={24} />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-value">{pendingApps}</span>
                  <span className="stat-card-label">Pending Approval</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon green">
                  <DollarIcon size={24} />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-value">₹{totalRevenue}</span>
                  <span className="stat-card-label">Revenue Collected</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon teal">
                  <UsersIcon size={24} />
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-value">{doctors.length}</span>
                  <span className="stat-card-label">Staff Doctors</span>
                </div>
              </div>
            </div>

            {/* Reports Charts */}
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3 className="panel-title">Clinic Performance Reports</h3>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Updated live</span>
              </div>

              <div className="reports-layout">
                {/* Chart 1: Appointments per Doctor */}
                <div className="report-chart-box">
                  <h4 style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Doctor Patient-Load Chart</h4>
                  
                  <div className="chart-bars">
                    {doctorLoads.map((d, index) => {
                      // Normalize heights (max value represents 100% or 100px minimum)
                      const maxVal = Math.max(...doctorLoads.map(dl => dl.count), 1);
                      const barHeight = Math.max((d.count / maxVal) * 100, 10);
                      
                      return (
                        <div className="chart-bar-container" key={index}>
                          <div className="chart-bar" style={{ height: `${barHeight}%` }}>
                            <span className="chart-bar-value">{d.count}</span>
                          </div>
                          <span className="chart-bar-label">{d.name.split(' ')[1] || d.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chart 2: Billing & Income Distribution */}
                <div className="report-chart-box">
                  <h4 style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>Revenue Split (Paid vs Unpaid)</h4>
                  
                  <div className="chart-doughnut">
                    <div className="doughnut-visual" style={{
                      background: totalRevenue || unpaidRevenue 
                        ? `conic-gradient(var(--success) 0% ${(totalRevenue / (totalRevenue + unpaidRevenue)) * 100}%, var(--error) ${(totalRevenue / (totalRevenue + unpaidRevenue)) * 100}% 100%)`
                        : 'var(--border-color)'
                    }}>
                      <div className="doughnut-inner"></div>
                    </div>
                    
                    <div className="doughnut-legends">
                      <div className="doughnut-legend">
                        <span className="legend-dot" style={{ backgroundColor: 'var(--success)' }}></span>
                        <span>Cleared: ₹{totalRevenue}</span>
                      </div>
                      <div className="doughnut-legend">
                        <span className="legend-dot" style={{ backgroundColor: 'var(--error)' }}></span>
                        <span>Outstanding: ₹{unpaidRevenue}</span>
                      </div>
                      <div className="doughnut-legend" style={{ fontWeight: 700 }}>
                        <span className="legend-dot" style={{ backgroundColor: 'var(--accent)' }}></span>
                        <span>Total: ₹{totalRevenue + unpaidRevenue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Appointments */}
        {activeTab === 'appointments' && (
          <div className="dashboard-panel animate-slide-up">
            <div className="panel-header">
              <h3 className="panel-title">Manage Appointment Registrations</h3>
            </div>

            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
                <CalendarIcon size={48} style={{ stroke: 'var(--text-muted)', marginBottom: '16px' }} />
                <p>No appointments requested.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Age/Gender</th>
                      <th>Doctor Selection</th>
                      <th>Date / Time</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(app => (
                      <tr key={app.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{app.patientName}</div>
                        </td>
                        <td>{app.age} Yrs / {app.gender}</td>
                        <td style={{ color: 'var(--accent)', fontWeight: 500 }}>{app.doctorName}</td>
                        <td>
                          <div>{app.date}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.time}</div>
                        </td>
                        <td>{app.phone}</td>
                        <td>
                          <span className={`badge badge-${app.status.toLowerCase()}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {app.status === 'Pending' && (
                              <button 
                                onClick={() => onApproveAppointment(app.id)}
                                className="btn btn-primary btn-sm"
                                style={{ backgroundColor: 'var(--success)' }}
                              >
                                Approve
                              </button>
                            )}

                            {rescheduleId === app.id ? (
                              <form 
                                onSubmit={(e) => handleRescheduleSubmit(e, app.id)} 
                                style={{ display: 'flex', gap: '4px', alignItems: 'center' }}
                              >
                                <input 
                                  type="date" 
                                  className="form-control" 
                                  style={{ padding: '4px 8px', fontSize: '12px', width: '110px' }}
                                  value={rescheduleData.date}
                                  onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                                  required
                                />
                                <input 
                                  type="time" 
                                  className="form-control" 
                                  style={{ padding: '4px 8px', fontSize: '12px', width: '85px' }}
                                  value={rescheduleData.time}
                                  onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                                  required
                                />
                                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '6px 10px' }}>
                                  Save
                                </button>
                                <button 
                                  type="button" 
                                  className="btn btn-secondary btn-sm" 
                                  style={{ padding: '6px 10px' }}
                                  onClick={() => setRescheduleId(null)}
                                >
                                  X
                                </button>
                              </form>
                            ) : (
                              (app.status === 'Pending' || app.status === 'Confirmed') && (
                                <button 
                                  onClick={() => {
                                    setRescheduleId(app.id);
                                    setRescheduleData({ date: app.date, time: app.time });
                                  }}
                                  className="btn btn-secondary btn-sm"
                                >
                                  Reschedule
                                </button>
                              )
                            )}

                            {(app.status === 'Pending' || app.status === 'Confirmed') && rescheduleId !== app.id && (
                              <button 
                                onClick={() => onCancelAppointment(app.id)}
                                className="btn btn-outline btn-sm"
                                style={{ color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Doctors */}
        {activeTab === 'doctors' && (
          <div>
            {/* Add Doctor Form */}
            <div className="dashboard-panel animate-slide-up">
              <h3 className="panel-title" style={{ marginBottom: '20px' }}>Register New Staff Doctor</h3>
              <form onSubmit={handleDocSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Doctor Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Dr Rahul"
                      value={docForm.name} 
                      onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Specialty</label>
                    <select 
                      className="form-control"
                      value={docForm.specialty}
                      onChange={(e) => setDocForm({ ...docForm, specialty: e.target.value })}
                    >
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Orthopedic Specialist">Orthopedic Specialist</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="General Physician">General Physician</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Experience (Years)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 10" 
                      min="1" 
                      max="50"
                      value={docForm.experience}
                      onChange={(e) => setDocForm({ ...docForm, experience: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <PlusIcon size={18} /> Register Doctor
                </button>
              </form>
            </div>

            {/* Doctors list */}
            <div className="dashboard-panel animate-slide-up">
              <h3 className="panel-title" style={{ marginBottom: '20px' }}>Current Specialists</h3>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Doctor Name</th>
                      <th>Specialty / Department</th>
                      <th>Clinical Experience</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map(doc => (
                      <tr key={doc.id}>
                        <td style={{ fontWeight: 600 }}>{doc.name}</td>
                        <td>
                          <span className="doctor-specialty">{doc.specialty}</span>
                        </td>
                        <td>{doc.experience}</td>
                        <td>
                          <button 
                            onClick={() => onDeleteDoctor(doc.id)}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                          >
                            <TrashIcon size={14} /> Remove Staff
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Patients Directory */}
        {activeTab === 'patients' && (
          <div className="dashboard-panel animate-slide-up">
            <h3 className="panel-title" style={{ marginBottom: '20px' }}>Active Patients Directory</h3>
            
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Emergency Phone</th>
                    <th>Blood Group</th>
                    <th>Known Allergies</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Extract patients from unique bookings */}
                  {Array.from(new Set(appointments.map(a => a.patientName))).map((pName, index) => {
                    const patientApps = appointments.filter(a => a.patientName === pName);
                    const lastApp = patientApps[patientApps.length - 1];
                    
                    return (
                      <tr key={index}>
                        <td style={{ fontWeight: 600 }}>{pName}</td>
                        <td>{lastApp.age}</td>
                        <td>{lastApp.gender}</td>
                        <td>{lastApp.phone}</td>
                        <td>O+ (Default)</td>
                        <td>None reported</td>
                      </tr>
                    );
                  })}
                  
                  {/* Add standard demo patient */}
                  <tr>
                    <td style={{ fontWeight: 600 }}>Rahul Sharma</td>
                    <td>28</td>
                    <td>Male</td>
                    <td>+91 98765 43210</td>
                    <td>B+</td>
                    <td>Dust Mites, Penicillin</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Billing */}
        {activeTab === 'billing' && (
          <div>
            
            {/* Generate Custom Invoice */}
            <div className="dashboard-panel animate-slide-up">
              <h3 className="panel-title" style={{ marginBottom: '20px' }}>Create Patient Billing Invoice</h3>
              <form onSubmit={handleBillingSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Patient Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Patient Name"
                      value={billForm.patientName}
                      onChange={(e) => setBillForm({ ...billForm, patientName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Attending Doctor</label>
                    <select 
                      className="form-control"
                      value={billForm.doctorName}
                      onChange={(e) => setBillForm({ ...billForm, doctorName: e.target.value })}
                    >
                      {doctors.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Consultation Fee (₹)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      placeholder="e.g. 500" 
                      min="100"
                      value={billForm.amount}
                      onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Invoice Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={billForm.date}
                      onChange={(e) => setBillForm({ ...billForm, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <PlusIcon size={18} /> Generate Invoice
                </button>
              </form>
            </div>

            {/* Invoices List */}
            <div className="dashboard-panel animate-slide-up">
              <h3 className="panel-title" style={{ marginBottom: '20px' }}>Invoices Ledger</h3>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Invoice ID</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(invoice => (
                      <tr key={invoice.id}>
                        <td>INV-{invoice.id.toString().slice(-6)}</td>
                        <td style={{ fontWeight: 600 }}>{invoice.patientName}</td>
                        <td>{invoice.doctorName}</td>
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
                              onClick={() => onClearInvoice(invoice.id)}
                              className="btn btn-primary btn-sm"
                              style={{ backgroundColor: 'var(--success)' }}
                            >
                              Clear Invoice
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
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
