import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import PatientDashboard from './components/PatientDashboard';
import AdminDashboard from './components/AdminDashboard';
import { CloseIcon, MenuIcon } from './components/Icons';

// Pre-seeded Mock Data
const defaultDoctors = [
  { id: 1, name: 'Dr Rahul', specialty: 'Cardiologist', experience: '10 Years' },
  { id: 2, name: 'Dr Anjali', specialty: 'Neurologist', experience: '8 Years' },
  { id: 3, name: 'Dr Arjun', specialty: 'Orthopedic Specialist', experience: '12 Years' }
];

const defaultAppointments = [
  {
    id: 101,
    patientName: 'Rahul Sharma',
    age: 28,
    gender: 'Male',
    doctorName: 'Dr Rahul',
    specialty: 'Cardiologist',
    date: '2026-06-22',
    time: '10:30',
    phone: '+91 98765 43210',
    status: 'Confirmed',
    billingStatus: 'Unpaid',
    billingAmount: 500
  },
  {
    id: 102,
    patientName: 'Rahul Sharma',
    age: 28,
    gender: 'Male',
    doctorName: 'Dr Anjali',
    specialty: 'Neurologist',
    date: '2026-06-25',
    time: '14:00',
    phone: '+91 98765 43210',
    status: 'Pending',
    billingStatus: 'Unpaid',
    billingAmount: 500
  }
];

const defaultInvoices = [
  { id: 201, patientName: 'Rahul Sharma', doctorName: 'Dr Rahul', date: '2026-06-16', amount: 500, status: 'Unpaid' },
  { id: 202, patientName: 'Rahul Sharma', doctorName: 'Dr Anjali', date: '2026-06-16', amount: 500, status: 'Unpaid' },
  { id: 203, patientName: 'Priya Nair', doctorName: 'Dr Arjun', date: '2026-06-15', amount: 500, status: 'Paid' }
];

const defaultProfile = {
  name: 'Rahul Sharma',
  email: 'rahul@gmail.com',
  phone: '+91 98765 43210',
  age: 28,
  gender: 'Male',
  bloodGroup: 'B+',
  emergencyContact: '+91 91234 56789',
  allergies: 'Dust Mites, Penicillin'
};

export default function App() {
  // Navigation: 'home' | 'login' | 'patient' | 'admin'
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Global States with localStorage sync
  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem('cp_doctors');
    return saved ? JSON.parse(saved) : defaultDoctors;
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('cp_appointments');
    return saved ? JSON.parse(saved) : defaultAppointments;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('cp_invoices');
    return saved ? JSON.parse(saved) : defaultInvoices;
  });

  const [patientProfile, setPatientProfile] = useState(() => {
    const saved = localStorage.getItem('cp_patient_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('cp_auth');
    return saved ? JSON.parse(saved) : null; // { role: 'patient' | 'admin', name: string }
  });

  const [isDarkMode, setIsDarkMode] = useState(true);

  // Floating notifications state
  const [notification, setNotification] = useState(null); // { message: string, type: 'success' | 'error' }

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cp_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('cp_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('cp_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('cp_patient_profile', JSON.stringify(patientProfile));
  }, [patientProfile]);

  useEffect(() => {
    if (auth) {
      localStorage.setItem('cp_auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('cp_auth');
    }
  }, [auth]);

  // Dark/Light Theme Control
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Core Handlers
  const handleBookAppointment = (newApp) => {
    setAppointments([newApp, ...appointments]);
    
    // Automatically generate invoice corresponding to booking
    const newInvoice = {
      id: Date.now() + 10,
      patientName: newApp.patientName,
      doctorName: newApp.doctorName,
      date: newApp.date,
      amount: newApp.billingAmount,
      status: 'Unpaid'
    };
    setInvoices([newInvoice, ...invoices]);
    
    showNotification('Appointment requested successfully! View progress in patient dashboard.', 'success');
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: 'Cancelled' } : app
    ));
    showNotification('Appointment cancelled.', 'success');
  };

  const handleApproveAppointment = (id) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: 'Confirmed' } : app
    ));
    showNotification('Appointment approved & confirmed!', 'success');
  };

  const handleRescheduleAppointment = (id, newDate, newTime) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, date: newDate, time: newTime, status: 'Confirmed' } : app
    ));
    showNotification('Appointment rescheduled successfully!', 'success');
  };

  const handlePayInvoice = (invoiceId) => {
    // Mark invoice paid
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv
    ));

    // Also update corresponding appointment billing status
    // Matching is done based on date/doctor since ID differs
    showNotification('Payment processed successfully. Thank you!', 'success');
  };

  const handleClearInvoiceAdmin = (invoiceId) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv
    ));
    showNotification('Invoice cleared and marked as Paid!', 'success');
  };

  const handleAddDoctor = (newDoc) => {
    setDoctors([...doctors, newDoc]);
    showNotification(`${newDoc.name} registered as staff doctor.`, 'success');
  };

  const handleDeleteDoctor = (docId) => {
    const doc = doctors.find(d => d.id === docId);
    setDoctors(doctors.filter(d => d.id !== docId));
    if (doc) {
      showNotification(`${doc.name} removed from registry.`, 'success');
    }
  };

  const handleUpdateProfile = (updatedProfile) => {
    setPatientProfile(updatedProfile);
    
    // Sync appointments name as well for simplicity
    setAppointments(appointments.map(app => {
      if (app.patientName === patientProfile.name) {
        return { ...app, patientName: updatedProfile.name, phone: updatedProfile.phone };
      }
      return app;
    }));

    // Sync invoices name
    setInvoices(invoices.map(inv => {
      if (inv.patientName === patientProfile.name) {
        return { ...inv, patientName: updatedProfile.name };
      }
      return inv;
    }));
  };

  const handleLogin = (role, name) => {
    setAuth({ role, name });
    // Redirect to dashboard
    setCurrentPage(role);
  };

  const handleLogout = () => {
    setAuth(null);
    setCurrentPage('home');
    showNotification('Logged out successfully.', 'success');
  };

  const navigateToSection = (sectionId) => {
    setCurrentPage('home');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="container nav-container">
          <div className="logo" onClick={() => setCurrentPage('home')}>
            🏥 CarePulse
          </div>

          {/* Desktop Links */}
          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`} style={mobileMenuOpen ? {
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            top: '80px',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-secondary)',
            padding: '24px',
            borderBottom: '1px solid var(--border-color)',
            gap: '20px',
            zIndex: 100
          } : {}}>
            <li className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} onClick={() => navigateToSection('home')}>Home</li>
            <li className="nav-link" onClick={() => navigateToSection('about')}>About</li>
            <li className="nav-link" onClick={() => navigateToSection('services')}>Services</li>
            <li className="nav-link" onClick={() => navigateToSection('doctors')}>Doctors</li>
            <li className="nav-link" onClick={() => navigateToSection('book-appointment')}>Appointments</li>
            <li className="nav-link" onClick={() => navigateToSection('contact')}>Contact</li>
          </ul>

          <div className="nav-actions">
            {/* Dark/Light Theme Button */}
            <button 
              className="theme-toggle" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Portal buttons */}
            {auth ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCurrentPage(auth.role)}
                >
                  Dashboard
                </button>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={handleLogout}
                  style={{ color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setCurrentPage('login')}
              >
                Login Portal
              </button>
            )}

            {/* Mobile menu toggle */}
            <button 
              className="theme-toggle"
              style={{ display: 'none', marginLeft: '8px' }} // Controlled in CSS or inline media check
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Page Render */}
      <div style={{ flexGrow: 1, marginTop: currentPage === 'home' ? '0' : '80px' }}>
        {currentPage === 'home' && (
          <Home 
            doctors={doctors}
            onBookAppointment={handleBookAppointment}
            onNavigate={(page) => setCurrentPage(page)}
            showNotification={showNotification}
          />
        )}
        
        {currentPage === 'login' && (
          <Login 
            onLogin={handleLogin}
            showNotification={showNotification}
          />
        )}

        {currentPage === 'patient' && auth?.role === 'patient' && (
          <PatientDashboard 
            appointments={appointments.filter(app => app.patientName === patientProfile.name)}
            onCancelAppointment={handleCancelAppointment}
            invoices={invoices.filter(inv => inv.patientName === patientProfile.name)}
            onPayInvoice={handlePayInvoice}
            patientProfile={patientProfile}
            onUpdateProfile={handleUpdateProfile}
            showNotification={showNotification}
          />
        )}

        {currentPage === 'admin' && auth?.role === 'admin' && (
          <AdminDashboard 
            appointments={appointments}
            onApproveAppointment={handleApproveAppointment}
            onRescheduleAppointment={handleRescheduleAppointment}
            onCancelAppointment={handleCancelAppointment}
            doctors={doctors}
            onAddDoctor={handleAddDoctor}
            onDeleteDoctor={handleDeleteDoctor}
            invoices={invoices}
            onAddInvoice={(newInv) => setInvoices([newInv, ...invoices])}
            onClearInvoice={handleClearInvoiceAdmin}
            showNotification={showNotification}
          />
        )}
      </div>

      {/* Floating Alert Notification */}
      {notification && (
        <div className={`notification-banner ${notification.type === 'error' ? 'error' : ''}`}>
          <div>
            <h4>{notification.type === 'error' ? 'Alert' : 'Notice'}</h4>
            <p>{notification.message}</p>
          </div>
          <button 
            className="notification-close"
            onClick={() => setNotification(null)}
          >
            <CloseIcon size={16} />
          </button>
        </div>
      )}

      {/* Simple Inline Style Overrides for Quick Mobile Nav Toggle visibility */}
      <style>{`
        @media (max-width: 992px) {
          #mobile-nav-toggle {
            display: flex !important;
          }
          .nav-links {
            display: none !important;
          }
          .nav-links.active {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
