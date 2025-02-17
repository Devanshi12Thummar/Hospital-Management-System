import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar'; // Importing the Navbar component
import PatientAssignmentForm from './components/patient/PatientAssignmentForm';
import DoctorPatientDisplay from './components/display/DoctorPatientDisplay';
import DoctorEntryForm from './components/doctor/DoctorEntryForm';

function App() {
  return (
      <Router>
        <div>
          {/* Adding the Navbar to all pages */}
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
             <Route path="/doctor" element={<DoctorEntryForm />} />
            <Route path="/patient" element={<PatientAssignmentForm />} /> 
            <Route path="/display" element={<DoctorPatientDisplay />} />
            </Routes>
        </div>
      </Router>
  );
}

export default App;
