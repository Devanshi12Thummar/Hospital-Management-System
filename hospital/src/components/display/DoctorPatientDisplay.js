import React, { useState, useEffect } from "react";
import { FaUserMd, FaUserInjured, FaEdit, FaTrash, FaTimes, FaSave, FaExclamationTriangle } from "react-icons/fa";
import "./DoctorPatientDisplay.css";

const DoctorPatientDisplay = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [doctorForm, setDoctorForm] = useState({
    name: "",
    specialization: "",
  });

  const [patientForm, setPatientForm] = useState({
    name: "",
    disease: "",
    admissionStatus: "",
    admittedDate: "",
    releasingDate: "",
    releasingSummary: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/doctors");
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctors(data);
      setError(null);
    } catch (error) {
      setError("Error loading doctors. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const response = await fetch(
        `http://localhost:3001/doctors/${doctorId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete doctor");
      setDoctors(doctors.filter((doctor) => doctor.doctorId !== doctorId));
      setSelectedDoctor(null);
      showNotification("Doctor deleted successfully", "success");
    } catch (error) {
      showNotification("Error deleting doctor", "error");
      console.error(error);
    }
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorForm({
      name: doctor.name,
      specialization: doctor.specialization,
    });
    setIsEditing(true);
  };

  const handleViewPatients = (doctor) => {
    setSelectedDoctor(doctor);
    setIsEditing(false);
  };

  const handleDeletePatient = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      const response = await fetch(
        `http://localhost:3001/doctors/${selectedDoctor.doctorId}/patients/${patientId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete patient");

      setSelectedDoctor((prevDoctor) => ({
        ...prevDoctor,
        patients: prevDoctor.patients.filter(
          (patient) => patient.patientId !== patientId
        ),
      }));
      showNotification("Patient deleted successfully", "success");
    } catch (error) {
      showNotification("Error deleting patient", "error");
      console.error(error);
    }
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setPatientForm({ ...patient });
  };

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setDoctorForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSaveDoctor = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/doctors/${selectedDoctor.doctorId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(doctorForm),
        }
      );
      if (!response.ok) throw new Error("Failed to update doctor");
      const updatedDoctor = await response.json();
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor.doctorId === updatedDoctor.doctorId ? updatedDoctor : doctor
        )
      );
      setIsEditing(false);
      showNotification("Doctor updated successfully", "success");
    } catch (error) {
      showNotification("Error updating doctor", "error");
      console.error(error);
    }
  };

  const handleSavePatient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/doctors/${selectedDoctor.doctorId}/patients/${editingPatient.patientId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patientForm),
        }
      );
      if (!response.ok) throw new Error("Failed to update patient");
      const updatedPatient = await response.json();
      setSelectedDoctor((prev) => ({
        ...prev,
        patients: prev.patients.map((patient) =>
          patient.patientId === editingPatient.patientId
            ? updatedPatient
            : patient
        ),
      }));
      setEditingPatient(null);
      showNotification("Patient updated successfully", "success");
    } catch (error) {
      showNotification("Error updating patient", "error");
      console.error(error);
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <p>{error}</p>
        <button onClick={fetchDoctors} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="doctor-patient-container">
      <div className="header-section">
        <FaUserMd className="header-icon" />
        <h2>Doctor-Patient Assignments</h2>
        <div className="underline"></div>
      </div>

      <div className="doctors-section">
        <h3 className="section-title">
          <FaUserMd className="section-icon" />
          Registered Doctors
        </h3>
        <div className="table-container">
          <table className="doctor-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.doctorId}>
                  <td className="doctor-name" onClick={() => handleViewPatients(doctor)}>
                    {doctor.name}
                  </td>
                  <td>{doctor.specialization}</td>
                  <td className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEditDoctor(doctor)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteDoctor(doctor.doctorId)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Details Modal */}
      {selectedDoctor && !isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <FaUserInjured className="modal-icon" />
                Patients of {selectedDoctor.name}
              </h3>
              <button className="close-button" onClick={() => setSelectedDoctor(null)}>
                <FaTimes />
              </button>
            </div>

            {selectedDoctor.patients?.length > 0 ? (
              <div className="table-container">
                <table className="patient-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Disease</th>
                      <th>Status</th>
                      <th>Admitted Date</th>
                      <th>Releasing Date</th>
                      <th>Summary</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDoctor.patients.map((patient) => (
                      <tr key={patient.patientId}>
                        <td>{patient.name}</td>
                        <td>{patient.disease}</td>
                        <td>
                          <span className={`status-badge ${patient.admissionStatus.toLowerCase()}`}>
                            {patient.admissionStatus}
                          </span>
                        </td>
                        <td>{patient.admittedDate || "-"}</td>
                        <td>{patient.releasingDate || "-"}</td>
                        <td>{patient.releasingSummary || "-"}</td>
                        <td className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => handleEditPatient(patient)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeletePatient(patient.patientId)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-patients">No patients assigned yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <FaEdit className="modal-icon" />
                Edit Doctor Details
              </h3>
              <button className="close-button" onClick={() => setIsEditing(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSaveDoctor} className="edit-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={doctorForm.name}
                  onChange={handleDoctorChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={doctorForm.specialization}
                  onChange={handleDoctorChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  <FaSave /> Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsEditing(false)}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {editingPatient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <FaEdit className="modal-icon" />
                Edit Patient Details
              </h3>
              <button className="close-button" onClick={() => setEditingPatient(null)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSavePatient} className="edit-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={patientForm.name}
                  onChange={handlePatientChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Disease</label>
                <input
                  type="text"
                  name="disease"
                  value={patientForm.disease}
                  onChange={handlePatientChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Admission Status</label>
                <select
                  name="admissionStatus"
                  value={patientForm.admissionStatus}
                  onChange={handlePatientChange}
                  required
                >
                  <option value="Outdoor">Outdoor</option>
                  <option value="Indoor">Indoor</option>
                </select>
              </div>
              {patientForm.admissionStatus === "Indoor" && (
                <>
                  <div className="form-group">
                    <label>Admitted Date</label>
                    <input
                      type="date"
                      name="admittedDate"
                      value={patientForm.admittedDate}
                      onChange={handlePatientChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Releasing Date</label>
                    <input
                      type="date"
                      name="releasingDate"
                      value={patientForm.releasingDate}
                      onChange={handlePatientChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Releasing Summary</label>
                    <textarea
                      name="releasingSummary"
                      value={patientForm.releasingSummary}
                      onChange={handlePatientChange}
                      rows="4"
                    />
                  </div>
                </>
              )}
              <div className="form-actions">
                <button type="submit" className="save-button">
                  <FaSave /> Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditingPatient(null)}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatientDisplay;
