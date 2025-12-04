
// App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard'; // Admin dashboard
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup'; // <-- Added import
import InstituteDashboard from './pages/InstituteDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AddInstitution from './pages/AddInstitution'; // New institution page
import NU from "./pages/NU.jsx";
import LUCT from "./pages/LUCT.jsx";
import LP from "./pages/LP.jsx";
import BU from "./pages/BU.jsx";
import Blogo2 from './assets/images/logo2.png'; // adjust path relative to this file
import StudentApplication from "./pages/StudentApplication.jsx";
import AllInstitutes from "./pages/AllInstitutes.jsx";
import UserLogin from "./pages/UserLogin"; // <-- Your path
import StudentRegistration from "./pages/StudentRegistration";
import InstituteRegistor from "./pages/InstituteRegistor";
import StudentManagement from './pages/StudentManagement'; // Add this import
import FacultyManagement from './pages/FacultyManagement';
import CourseManagement from './pages/CourseManagement';
import ApplicationsManagement from "./pages/ApplicationsManagement";
import ViewAdmissions from "./pages/ViewAdmissions";




export default function App() {
  return (
    <div style={{ fontFamily: 'Arial' }}>
      {/* Header */}
      <header>
        <div className="main">
          <div className="headbar">
            
            {/* Logo */}
            <div>
      <ul>
        <li className="Logo">
          <img 
            src={Blogo2} 
            alt="WAP Logo" 
            
          />
        </li>
      </ul>
    </div>

            {/* Navigation links */}
            <div>
              <ul>
                <li>
                  <Link to="/"><i className="fa fa-fw fa-home"></i> Home</Link>
                </li>
                
                {/* Admin links */}
                 <li>
                  <Link to="/admin/login">
                    <i className="fa fa-fw fa-wrench"></i>Admin
                  </Link>
                </li> 
                {/*<li>
                  <Link to="/admin">
                  <i className="fa fa-fw fa-wrench"></i> Admin</Link>
                </li>*/}

                <li>
                  <Link to="/login">
                    <i className="fa fa-fw fa-building"></i> Institute
                  </Link>
                </li>
                <li>
                  <Link to="/login"><i className="fa fa-fw fa-user"></i> Student</Link>
                </li>
                
                {/* ADD THIS LINE - Link to View Admissions */}
                <li>
                  <Link to="/view-admissions">
                    <i className="fa fa-fw fa-graduation-cap"></i> Admissions
                  </Link>
                </li>
              </ul>
            </div>

           {/* Login / Signup */} 
            <div className="logi">
              <ul className="nav-list">
                {/* Login button */}
                <li>
                  <Link to="/user-login">
                    <i className="fa fa-fw fa-user"></i> LogIn
                  </Link>
                </li>
              </ul>
            </div>


          </div>
        </div>
      </header>

      {/* Main content */}
      <div style={{ padding: 20 }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />

          {/* Admin dashboard directly accessible */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />

          {/* Add institution page */}
          <Route path="/admin/add-institution" element={<AddInstitution />} />

          {/* Other dashboards */}
          <Route path="/institute" element={<InstituteDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />

          {/*INSTITUTES*/}
          
          <Route path="/NUL" element={<NU />} />
          <Route path="/LUCT" element={<LUCT />} />
          <Route path="/LP" element={<LP />} />
          <Route path="/BU" element={<BU />} />
          
          {/*apply*/}
          <Route path="/student-application" element={<StudentApplication />} />
          
          {/* other routes */}
          <Route path="/all-institutions" element={<AllInstitutes />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/student/application" element={<StudentApplication />} />
          
          <Route path="/user-login" element={<UserLogin />} />
          
          <Route path="/register" element={<StudentRegistration />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/dashboard" element={<StudentDashboard />} />

          <Route path="/StudentRegistration" element={<StudentRegistration />} />
          <Route path="/InstituteRegistor" element={<InstituteRegistor />} />

          <Route path="/admin/students" element={<StudentManagement />} />
          <Route path="/admin/faculties" element={<FacultyManagement />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/applications" element={<ApplicationsManagement />} />
            
            {/* ADD THIS ROUTE - View Admissions for all users */}
            <Route path="/view-admissions" element={<ViewAdmissions />} />


            <Route path="/applications-management" element={<ApplicationsManagement />} />
            <Route path="/view-admissions" element={<ViewAdmissions />} />
            

        </Routes>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-4">
        <p>
          &copy; {new Date().getFullYear()} Career Guidance Platform<br />
          Terms and Condition<br />
          Contact US
        </p>
        <br />
        <p>
          The more you visit us, the higher your chances.<br />
          Win $2,000.00 per month!
        </p>
      </footer>
    </div>
  );
}











{/*
// App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard'; // Admin dashboard
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup'; // <-- Added import
import InstituteDashboard from './pages/InstituteDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AddInstitution from './pages/AddInstitution'; // New institution page
import NU from "./pages/NU.jsx";
import LUCT from "./pages/LUCT.jsx";
import LP from "./pages/LP.jsx";
import BU from "./pages/BU.jsx";
import Blogo2 from './assets/images/logo2.png'; // adjust path relative to this file
import StudentApplication from "./pages/StudentApplication.jsx";
import AllInstitutes from "./pages/AllInstitutes.jsx";
import UserLogin from "./pages/UserLogin"; // <-- Your path
import StudentRegistration from "./pages/StudentRegistration";
import InstituteRegistor from "./pages/InstituteRegistor";
import StudentManagement from './pages/StudentManagement'; // Add this import
import FacultyManagement from './pages/FacultyManagement';
import CourseManagement from './pages/CourseManagement';
import ApplicationsManagement from "./pages/ApplicationsManagement";
import ViewAdmissions from "./pages/ViewAdmissions";



export default function App() {
  return (
    <div style={{ fontFamily: 'Arial' }}>


    <header>
        <div className="main">
          <div className="headbar">
            
            <div>
      <ul>
        <li className="Logo">
          <img 
            src={Blogo2} 
            alt="WAP Logo" 
            
          />
        </li>
      </ul>
    </div>

            <div>
              <ul>
                <li>
                  <Link to="/"><i className="fa fa-fw fa-home"></i> Home</Link>
                </li>
                
                {/* <li>
                  <Link to="/admin/login">
                    <i className="fa fa-fw fa-wrench"></i>Admin
                  </Link>
                </li> *


                <li>
                  <Link to="/admin"><i className="fa fa-fw fa-wrench"></i> Admin</Link>
                </li>

                <li>
                  <Link to="/institute">
                    <i className="fa fa-fw fa-building"></i> Institute
                  </Link>
                </li>
                <li>
                  <Link to="/student"><i className="fa fa-fw fa-user"></i> Student</Link>
                </li>
              </ul>
            </div>

           {/* Login / Signup *
            <div className="logi">
              <ul className="nav-list">
                {/* Login button *
                <li>
                  <Link to="/user-login">
                    <i className="fa fa-fw fa-user"></i> LogIn
                  </Link>
                </li>
              </ul>
            </div>


          </div>
        </div>
      </header>

      {/* Main content *
      <div style={{ padding: 20 }}>
        <Routes>
          {/* Public routes *
          <Route path="/" element={<Home />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />

          <Route path="/admin/add-institution" element={<AddInstitution />} />

          <Route path="/institute" element={<InstituteDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />

          
          <Route path="/NUL" element={<NU />} />
          <Route path="/LUCT" element={<LUCT />} />
          <Route path="/LP" element={<LP />} />
          <Route path="/BU" element={<BU />} />
          
          <Route path="/student-application" element={<StudentApplication />} />
          
          <Route path="/all-institutions" element={<AllInstitutes />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/student/application" element={<StudentApplication />} />
          
          <Route path="/user-login" element={<UserLogin />} />
          
          <Route path="/register" element={<StudentRegistration />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/dashboard" element={<StudentDashboard />} />

          <Route path="/StudentRegistration" element={<StudentRegistration />} />
          <Route path="/InstituteRegistor" element={<InstituteRegistor />} />

          <Route path="/admin/students" element={<StudentManagement />} />
          <Route path="/admin/faculties" element={<FacultyManagement />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/admin/applications" element={<ApplicationsManagement />} />
            <Route path="/view-admissions" element={<ViewAdmissions />} />
            

        </Routes>
      </div>

      <footer className="bg-dark text-white text-center py-3 mt-4">
        <p>
          &copy; {new Date().getFullYear()} Career Guidance Platform<br />
          Terms and Condition<br />
          Contact US
        </p>
        <br />
        <p>
          The more you visit us, the higher your chances.<br />
          Win $2,000.00 per month!
        </p>
      </footer>
    </div>
  );
}
*/}