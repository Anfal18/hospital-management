import React, { useState } from 'react';
import { 
  CalendarIcon, UserIcon, HeartPulseIcon, ActivityIcon, DollarIcon, 
  ClipboardIcon, ClockIcon, PhoneIcon, MapPinIcon, MailIcon, StethoscopeIcon, PillsIcon 
} from './Icons';

export default function Home({ doctors, onBookAppointment, onNavigate, showNotification }) {
  // Appointment Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    doctorId: doctors[0]?.id || '',
    date: '',
    time: '',
    phone: ''
  });

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleAppointmentChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.date || !formData.time || !formData.phone) {
      showNotification('Please fill out all appointment details.', 'error');
      return;
    }

    const doc = doctors.find(d => d.id === parseInt(formData.doctorId));
    
    // Create new appointment structure
    const newAppointment = {
      id: Date.now(),
      patientName: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      doctorName: doc ? doc.name : 'Unknown Doctor',
      specialty: doc ? doc.specialty : 'General',
      date: formData.date,
      time: formData.time,
      phone: formData.phone,
      status: 'Pending', // Pending, Confirmed, Completed, Cancelled
      billingStatus: 'Unpaid',
      billingAmount: 500 // Flat fee of 500 INR
    };

    onBookAppointment(newAppointment);

    // Reset Form
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      doctorId: doctors[0]?.id || '',
      date: '',
      time: '',
      phone: ''
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      showNotification('Please fill out all contact fields.', 'error');
      return;
    }
    showNotification('Thank you! Your message has been sent successfully.', 'success');
    setContactForm({ name: '', email: '', message: '' });
  };

  const services = [
    { 
      id: 1, 
      title: 'Appointment Booking', 
      desc: 'Patients can book appointments online.', 
      icon: <CalendarIcon size={28} /> 
    },
    { 
      id: 2, 
      title: 'Doctor Management', 
      desc: 'Manage doctor details and schedules.', 
      icon: <StethoscopeIcon size={28} /> 
    },
    { 
      id: 3, 
      title: 'Patient Records', 
      desc: 'Store and retrieve patient information securely.', 
      icon: <ClipboardIcon size={28} /> 
    },
    { 
      id: 4, 
      title: 'Billing Management', 
      desc: 'Generate and manage hospital bills.', 
      icon: <DollarIcon size={28} /> 
    },
    { 
      id: 5, 
      title: 'Pharmacy Services', 
      desc: 'Manage medicines and prescriptions.', 
      icon: <PillsIcon size={28} /> 
    },
    { 
      id: 6, 
      title: 'Emergency Care', 
      desc: '24/7 emergency support.', 
      icon: <ActivityIcon size={28} /> 
    }
  ];

  return (
    <div className="home-container animate-fade">
      
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="hero-tagline">
              <HeartPulseIcon size={16} /> Welcome to CarePulse Healthcare
            </span>
            <h1>Hospital Management <span>System</span></h1>
            <p className="hero-desc">
              Providing efficient healthcare management with easy appointment booking, patient records, and doctor scheduling.
            </p>
            <div className="hero-buttons">
              <a href="#book-appointment" className="btn btn-primary">Book Appointment</a>
              <a href="#about" className="btn btn-secondary">Learn More</a>
            </div>
          </div>
          
          <div className="hero-img-container">
            <div className="hero-circle-backdrop"></div>
            <div className="hero-ui-mock">
              <div className="mock-header">
                <div className="mock-dots">
                  <span className="mock-dot"></span>
                  <span className="mock-dot"></span>
                  <span className="mock-dot"></span>
                </div>
                <span className="mock-badge">Active Panel</span>
              </div>
              <p style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>CarePulse Statistics</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>Real-time clinic activity metrics</p>
              
              <div className="mock-item">
                <div className="mock-icon">
                  <CalendarIcon size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Appointments Today</p>
                  <p style={{ fontWeight: 700, fontSize: '15px' }}>14 Patients Registered</p>
                </div>
              </div>
              <div className="mock-item">
                <div className="mock-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                  <UserIcon size={18} />
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Available Doctors</p>
                  <p style={{ fontWeight: 700, fontSize: '15px' }}>8 Specialists On Duty</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="section section-bg-tint" id="about">
        <div className="container welcome-layout">
          <div className="welcome-info">
            <span className="section-subtitle">About Us</span>
            <h3 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>Welcome to Our Hospital</h3>
            <p>
              Our Hospital Management System helps patients, doctors, and administrators manage healthcare services efficiently. The system provides online appointment booking, patient record management, doctor scheduling, and medical history tracking.
            </p>
            
            <div className="welcome-stats">
              <div className="stat-box">
                <div className="stat-num">99%</div>
                <div className="stat-label">Patient Satisfaction</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">24/7</div>
                <div className="stat-label">Emergency Care</div>
              </div>
            </div>
          </div>
          
          <div className="welcome-visual">
            <h4 style={{ marginBottom: '20px', fontFamily: 'var(--font-heading)', fontSize: '20px' }}>Core Facilities Available</h4>
            <ul className="facility-list">
              <li className="facility-item">
                <span className="facility-dot"></span>
                <span>Advanced Cardiology & Neurological Diagnostic Units</span>
              </li>
              <li className="facility-item">
                <span className="facility-dot"></span>
                <span>Paperless Cloud-backed Medical History Vault</span>
              </li>
              <li className="facility-item">
                <span className="facility-dot"></span>
                <span>Automated Pharmacy Refills & E-Prescriptions</span>
              </li>
              <li className="facility-item">
                <span className="facility-dot"></span>
                <span>Instant Billing Statements & Insurance Claims Support</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Services</span>
            <h2 className="section-title">Specialized Healthcare Solutions</h2>
          </div>
          
          <div className="services-grid">
            {services.map(s => (
              <div key={s.id} className="card">
                <div className="card-icon">{s.icon}</div>
                <h3 className="card-title">{s.title}</h3>
                <p className="card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="section section-bg-tint" id="doctors">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Doctors Section</span>
            <h2 className="section-title">Available Doctors</h2>
          </div>
          
          <div className="doctors-grid">
            {doctors.map(d => (
              <div key={d.id} className="card doctor-card">
                <div className="doctor-avatar-container">
                  <div className="doctor-avatar">
                    👨‍⚕️
                  </div>
                </div>
                <span className="doctor-specialty">{d.specialty}</span>
                <h3 className="card-title" style={{ marginTop: '8px', marginBottom: '4px' }}>{d.name}</h3>
                <div className="doctor-exp">
                  <ClockIcon size={14} /> <span>{d.experience} Experience</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <section className="section" id="book-appointment">
        <div className="container appointment-layout">
          <div className="appointment-info">
            <span className="section-subtitle">Appointment Section</span>
            <h3>Book an Appointment</h3>
            <p>
              Select your preferred doctor, date, and time. Ensure your contact details are correct so our clinical coordinator can confirm your reservation.
            </p>
            
            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">
                  <PhoneIcon size={20} />
                </div>
                <div className="info-content">
                  <h4>Immediate Assistance</h4>
                  <p>+91 XXXXX XXXXX</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">
                  <ClockIcon size={20} />
                </div>
                <div className="info-content">
                  <h4>Working Hours</h4>
                  <p>Mon - Sat: 8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="appointment-form-card">
            <form onSubmit={handleAppointmentSubmit}>
              <div className="form-grid">
                
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Patient Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="form-control" 
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleAppointmentChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="age">Age</label>
                  <input 
                    type="number" 
                    id="age" 
                    name="age" 
                    className="form-control" 
                    placeholder="Enter age" 
                    value={formData.age}
                    onChange={handleAppointmentChange}
                    min="1"
                    max="120"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="gender">Gender</label>
                  <select 
                    id="gender" 
                    name="gender" 
                    className="form-control" 
                    value={formData.gender}
                    onChange={handleAppointmentChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="doctorId">Doctor Selection</label>
                  <select 
                    id="doctorId" 
                    name="doctorId" 
                    className="form-control" 
                    value={formData.doctorId}
                    onChange={handleAppointmentChange}
                    required
                  >
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="date">Date</label>
                  <input 
                    type="date" 
                    id="date" 
                    name="date" 
                    className="form-control" 
                    value={formData.date}
                    onChange={handleAppointmentChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="time">Time</label>
                  <input 
                    type="time" 
                    id="time" 
                    name="time" 
                    className="form-control" 
                    value={formData.time}
                    onChange={handleAppointmentChange}
                    required
                  />
                </div>
                
                <div className="form-group form-group-full">
                  <label className="form-label" htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    className="form-control" 
                    placeholder="Enter phone number" 
                    value={formData.phone}
                    onChange={handleAppointmentChange}
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary form-submit-btn">Book Appointment</button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section section-bg-tint" id="contact">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Contact Us</span>
            <h2 className="section-title">Hospital Information</h2>
          </div>
          
          <div className="contact-layout">
            <div className="contact-details">
              <div className="contact-method">
                <div className="contact-method-icon">
                  <MapPinIcon size={20} />
                </div>
                <div className="contact-method-info">
                  <h4>Address</h4>
                  <p>Kozhikode, Kerala</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-method-icon">
                  <PhoneIcon size={20} />
                </div>
                <div className="contact-method-info">
                  <h4>Phone</h4>
                  <p>+91 XXXXX XXXXX</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-method-icon">
                  <MailIcon size={20} />
                </div>
                <div className="contact-method-info">
                  <h4>Email</h4>
                  <p>hospital@gmail.com</p>
                </div>
              </div>

              <div className="contact-map-mock">
                <MapPinIcon className="map-placeholder-icon" size={48} />
                <p style={{ fontWeight: 600, fontSize: '15px' }}>Location Map View</p>
                <div className="map-location-card">
                  <h4>CarePulse Medical Center</h4>
                  <p>Kozhikode Bypass Road, Near Cyberpark, Kerala</p>
                </div>
              </div>
            </div>
            
            <div className="appointment-form-card">
              <h3 style={{ marginBottom: '24px', fontFamily: 'var(--font-heading)' }}>Contact Form</h3>
              <form onSubmit={handleContactSubmit}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" htmlFor="contact-name">Name</label>
                  <input 
                    type="text" 
                    id="contact-name" 
                    className="form-control" 
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" htmlFor="contact-email">Email</label>
                  <input 
                    type="email" 
                    id="contact-email" 
                    className="form-control" 
                    placeholder="Your Email Address"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" htmlFor="contact-message">Message</label>
                  <textarea 
                    id="contact-message" 
                    rows="4" 
                    className="form-control" 
                    placeholder="Write your message here..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    style={{ resize: 'vertical' }}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3 className="logo" onClick={() => onNavigate('home')}>
                🏥 CarePulse
              </h3>
              <p>Providing top-tier healthcare services with an integrated hospital portal for patients and clinical staff.</p>
            </div>
            
            <div>
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#doctors">Doctors</a></li>
                <li><a href="#book-appointment">Book Appointment</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="footer-title">Services</h4>
              <ul className="footer-links">
                <li><a href="#services">Appointment Booking</a></li>
                <li><a href="#services">Emergency Support</a></li>
                <li><a href="#services">Prescription refills</a></li>
                <li><a href="#services">Billing statements</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="footer-title">Hospital Portal</h4>
              <ul className="footer-links">
                <li><a href="#login" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>Login Portal</a></li>
                <li><a href="#about">Privacy Policy</a></li>
                <li><a href="#contact">Contact Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>Copyright © 2026 Hospital Management System. All Rights Reserved.</p>
            <p>Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
