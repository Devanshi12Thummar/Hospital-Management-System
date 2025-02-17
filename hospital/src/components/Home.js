import React from 'react';
import { FaHospital, FaUserMd, FaUserInjured, FaCalendarCheck, FaChartLine, FaAward, FaClock, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  const features = [
    {
      icon: <FaUserMd />,
      title: "Doctor Management",
      description: "Efficiently manage healthcare professionals with our comprehensive doctor registration and tracking system",
      link: "/doctor"
    },
    {
      icon: <FaUserInjured />,
      title: "Patient Care",
      description: "Streamlined patient registration and management for both indoor and outdoor patients",
      link: "/patient"
    },
    {
      icon: <FaCalendarCheck />,
      title: "Assignment System",
      description: "Smart patient-doctor assignment system ensuring optimal healthcare delivery",
      link: "/display"
    }
  ];

  const statistics = [
    { number: "24/7", label: "Healthcare Support", icon: <FaClock /> },
    { number: "100%", label: "Data Security", icon: <FaShieldAlt /> },
    { number: "500+", label: "Daily Patients", icon: <FaChartLine /> },
    { number: "50+", label: "Expert Doctors", icon: <FaAward /> }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <FaHospital className="hospital-icon" />
          <h1 className="main-title">Hospital Management System</h1>
          <p className="subtitle">Streamlining Healthcare Management for Better Patient Care</p>
          <div className="pulse-line"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Our Services</h2>
        <div className="features-container">
          {features.map((feature, index) => (
            <Link to={feature.link} className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <span className="feature-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div className="info-content">
          <h2>Why Choose Our System?</h2>
          <ul className="benefits-list">
            <li>
              <div className="benefit-icon">✓</div>
              <span>Streamlined patient registration and management</span>
            </li>
            <li>
              <div className="benefit-icon">✓</div>
              <span>Efficient doctor-patient assignment system</span>
            </li>
            <li>
              <div className="benefit-icon">✓</div>
              <span>Comprehensive medical records management</span>
            </li>
            <li>
              <div className="benefit-icon">✓</div>
              <span>Real-time updates and notifications</span>
            </li>
            <li>
              <div className="benefit-icon">✓</div>
              <span>Secure and confidential data handling</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        {statistics.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon">{stat.icon}</div>
            <span className="stat-number">{stat.number}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Begin managing your hospital operations more efficiently today</p>
        <div className="cta-buttons">
          <Link to="/doctor" className="cta-button primary">Register Doctor</Link>
          <Link to="/patient" className="cta-button secondary">Assign Patient</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
