import React, { useState } from "react";
import { FaUserMd, FaStethoscope, FaClock, FaInfoCircle, FaHospital } from "react-icons/fa";
import "./DoctorEntryForm.css";

const DoctorEntryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    experience: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const specializations = [
    "Cardiologist",
    "Neurologist",
    "Dermatologist",
    "Orthopedic",
    "Pediatrician",
    "Oncologist",
    "Psychiatrist",
    "Surgeon",
    "Radiologist",
  ];

  const specializationInfo = {
    Cardiologist: "Treats heart and cardiovascular conditions",
    Neurologist: "Specializes in brain and nervous system disorders",
    Dermatologist: "Treats skin, hair, and nail conditions",
    Orthopedic: "Focuses on musculoskeletal system and injuries",
    Pediatrician: "Provides medical care for infants and children",
    Oncologist: "Specializes in cancer treatment",
    Psychiatrist: "Treats mental health conditions",
    Surgeon: "Performs surgical procedures",
    Radiologist: "Specializes in medical imaging and diagnosis",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage("Please enter doctor's name");
      return false;
    }
    if (formData.name.trim().length < 2) {
      setMessage("Doctor's name must be at least 2 characters long");
      return false;
    }
    if (!formData.specialization) {
      setMessage("Please select a specialization");
      return false;
    }
    if (!specializations.includes(formData.specialization)) {
      setMessage("Invalid specialization selected");
      return false;
    }
    if (!formData.experience || isNaN(formData.experience) || formData.experience < 0) {
      setMessage("Please enter valid years of experience");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const doctorData = {
        name: formData.name.trim(),
        specialization: formData.specialization, // Keep title case
        experience: parseInt(formData.experience, 10),
      };

      const response = await fetch("http://localhost:3001/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doctorData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Doctor added successfully!");
        setFormData({ name: "", specialization: "", experience: "" });
      } else {
        setMessage(`Error: ${data.error || "Error adding doctor"}`);
        console.error("Server Error:", data);
      }
    } catch (err) {
      console.error("Network or other error:", err);
      setMessage("Error connecting to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-form-container">
      <div className="form-header">
        <FaHospital className="header-icon" />
        <h2>Add New Doctor</h2>
        <p className="header-description">Register a new medical professional in the system</p>
        <div className="underline"></div>
      </div>

      <form onSubmit={handleSubmit} className="doctor-form">
        <div className="form-section">
          <h3 className="section-title">
            <FaUserMd className="section-icon" />
            Personal Information
          </h3>
          <div className="form-group">
            <label>
              <span className="label-text">Full Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter doctor's full name"
                className="input-field"
              />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">
            <FaStethoscope className="section-icon" />
            Professional Details
          </h3>
          <div className="form-group">
            <label>
              <span className="label-text">Specialization</span>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                required
                className="input-field"
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </label>
            {formData.specialization && (
              <span className="field-hint">{specializationInfo[formData.specialization]}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              <span className="label-text">Years of Experience</span>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                min="0"
                max="50"
                placeholder="Enter years of experience"
                className="input-field"
              />
            </label>
          </div>
        </div>

        <div className="info-section">
          <FaInfoCircle className="info-icon" />
          <p>All fields are required. Please ensure accurate information.</p>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              <FaUserMd className="btn-icon" />
              <span>Add Doctor</span>
            </>
          )}
        </button>

        {message && (
          <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default DoctorEntryForm;
