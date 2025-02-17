import React, { useState, useEffect } from "react";
import { FaUserMd, FaUser, FaDisease, FaHospital, FaCalendarAlt, FaFileAlt } from "react-icons/fa";
import "./PatientAssignmentForm.css";

const PatientAssignmentForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: "",
    name: "",
    disease: "",
    admissionStatus: "",
    admittedDate: "",
    releasingDate: "",
    releasingSummary: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:3001/doctors");
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        setMessage("Error fetching doctors list");
      }
    };
    fetchDoctors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage(""); // Clear any previous messages
  };

  const validateForm = () => {
    const {
      doctorId,
      name,
      disease,
      admissionStatus,
      admittedDate,
      releasingDate,
    } = formData;

    if (!doctorId || !name || !disease || !admissionStatus) {
      setMessage("All fields except releasing details are required.");
      return false;
    }

    if (admissionStatus === "Indoor") {
      if (!admittedDate || !releasingDate) {
        setMessage(
          "Admitted Date and Releasing Date are required for Indoor patients."
        );
        return false;
      }

      if (new Date(releasingDate) < new Date(admittedDate)) {
        setMessage("Releasing Date cannot be earlier than Admitted Date.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const {
      doctorId,
      admissionStatus,
      admittedDate,
      releasingDate,
      releasingSummary,
      ...basicDetails
    } = formData;

    const patientData =
      admissionStatus === "Indoor"
        ? {
            ...basicDetails,
            admissionStatus,
            admittedDate,
            releasingDate,
            releasingSummary,
          }
        : { ...basicDetails, admissionStatus };

    try {
      const response = await fetch(
        `http://localhost:3001/doctors/${doctorId}/patients`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patientData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Patient assigned successfully!");
        setFormData({
          doctorId: "",
          name: "",
          disease: "",
          admissionStatus: "",
          admittedDate: "",
          releasingDate: "",
          releasingSummary: "",
        });
      } else {
        setMessage(data.error || "Error assigning patient");
      }
    } catch (err) {
      setMessage("Error connecting to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-form-container">
      <div className="form-header">
        <FaHospital className="header-icon" />
        <h2>Assign Patient to Doctor</h2>
        <p className="header-description">Complete the form below to assign a patient to a doctor</p>
        <div className="underline"></div>
      </div>

      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-section">
          <h3 className="section-title">
            <FaUserMd className="section-icon" />
            Doctor Selection
          </h3>
          <div className="form-group">
            <label>
              <span className="label-text">Select Doctor</span>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                required
                className="select-input"
              >
                <option value="">Choose a doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.doctorId} value={doc.doctorId}>
                    Dr. {doc.name} ({doc.specialization})
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">
            <FaUser className="section-icon" />
            Patient Information
          </h3>
          <div className="form-group">
            <label>
              <span className="label-text">Patient Name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter patient's full name"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              <span className="label-text">Disease/Condition</span>
              <input
                type="text"
                name="disease"
                value={formData.disease}
                onChange={handleInputChange}
                required
                placeholder="Enter disease or condition"
              />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">
            <FaHospital className="section-icon" />
            Admission Details
          </h3>
          <div className="form-group">
            <label>
              <span className="label-text">Admission Status</span>
              <select
                name="admissionStatus"
                value={formData.admissionStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Indoor">Indoor</option>
              </select>
            </label>
          </div>

          {formData.admissionStatus === "Indoor" && (
            <div className="indoor-fields">
              <div className="form-group">
                <label>
                  <span className="label-text">Admitted Date</span>
                  <input
                    type="date"
                    name="admittedDate"
                    value={formData.admittedDate}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  <span className="label-text">Expected Release Date</span>
                  <input
                    type="date"
                    name="releasingDate"
                    value={formData.releasingDate}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label>
                  <span className="label-text">Release Summary</span>
                  <textarea
                    name="releasingSummary"
                    value={formData.releasingSummary}
                    onChange={handleInputChange}
                    placeholder="Enter any additional notes or summary"
                    rows="4"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              <FaFileAlt className="btn-icon" />
              <span>Assign Patient</span>
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

export default PatientAssignmentForm;
