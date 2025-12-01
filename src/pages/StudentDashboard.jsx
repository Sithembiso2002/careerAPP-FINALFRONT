// frontend/src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function StudentDashboard({ studentId }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("apply");
  const [admissions, setAdmissions] = useState([]);
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    nationality: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  // Fetch student profile
  useEffect(() => {
    fetch(`http://localhost:4000/api/students/${studentId}`)
      .then((res) => res.json())
      .then((data) =>
        setProfile({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          nationality: data.nationality,
        })
      )
      .catch((err) => console.error(err));
  }, [studentId]);

  // Fetch student admissions
  useEffect(() => {
    fetch(`http://localhost:4000/api/studentApplications/${studentId}`)
      .then((res) => res.json())
      .then((data) => setAdmissions(data))
      .catch((err) => console.error(err));
  }, [studentId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:4000/api/students/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
      .then((res) => res.json())
      .then(() => alert("Profile updated successfully!"))
      .catch((err) => console.error(err));
  };

  // Logout function
  const handleLogout = () => {
    // Clear any authentication tokens from localStorage
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentEmail");
    
    // Clear sessionStorage if used
    sessionStorage.clear();
    
    // Navigate to login page
    navigate("/student-login");
    
    // Optional: Refresh the page to clear any state
    // window.location.reload();
  };

  const dashboardStyles = {
    container: {
      display: "grid",
      gridTemplateColumns: "250px 1fr",
      gridTemplateRows: "70px 1fr",
      height: "100vh",
      fontFamily: "Poppins, sans-serif",
      background: "linear-gradient(120deg, #f0f4f8, #d9e2ec)",
    },
    topNav: {
      gridColumn: "span 2",
      background: "linear-gradient(120deg, #4f46e5, #6d28d9)",
      padding: "0 30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      color: "white",
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    },
    appTitle: { fontSize: "22px", letterSpacing: "1px" },
    navRight: { 
      display: "flex", 
      alignItems: "center", 
      gap: "25px",
      position: "relative" 
    },
    notifications: { 
      position: "relative", 
      fontSize: "22px", 
      cursor: "pointer",
      padding: "8px",
      borderRadius: "8px",
      transition: "background-color 0.3s",
    },
    notificationsHover: {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
    badge: {
      position: "absolute",
      background: "red",
      color: "white",
      padding: "2px 6px",
      borderRadius: "8px",
      top: "-5px",
      right: "-8px",
      fontSize: "12px",
    },
    profileSection: { 
      display: "flex", 
      alignItems: "center", 
      gap: "10px", 
      cursor: "pointer",
      padding: "8px 12px",
      borderRadius: "8px",
      transition: "background-color 0.3s",
      position: "relative",
    },
    profileSectionHover: {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
    profileImg: { 
      width: "40px", 
      height: "40px", 
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      fontWeight: "bold",
    },
    profileName: {
      fontSize: "16px",
      fontWeight: "500",
    },
    logoutMenu: {
      position: "absolute",
      top: "60px",
      right: "0",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      minWidth: "180px",
      zIndex: "1000",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
    },
    logoutMenuItem: {
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
      transition: "background-color 0.2s",
      fontSize: "14px",
      color: "#2d3748",
      borderBottom: "1px solid #e2e8f0",
    },
    logoutMenuItemHover: {
      backgroundColor: "#f7fafc",
    },
    logoutMenuItemLast: {
      color: "#e53e3e",
      borderBottom: "none",
    },
    sidebar: {
      background: "#20798f",
      display: "flex",
      flexDirection: "column",
      padding: "25px 15px",
      boxShadow: "3px 0 15px rgba(0,0,0,0.1)",
      gap: "12px",
    },
    sidebarBtn: {
      padding: "12px",
      background: "#b32222",
      border: "none",
      borderRadius: "10px",
      textAlign: "left",
      fontSize: "16px",
      cursor: "pointer",
      transition: "0.3s",
      color: "white",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    sidebarBtnActive: {
      background: "#4f46e5",
      transform: "translateX(5px)",
    },
    mainContent: {
      padding: "30px",
      overflowY: "auto",
    },
    glassCard: {
      background: "rgba(255,255,255,0.65)",
      padding: "30px",
      borderRadius: "20px",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.3)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      animation: "fadeSlide 0.5s",
      marginBottom: "20px",
    },
    inputGroup: { position: "relative", marginBottom: "22px" },
    input: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: "10px",
      border: "1px solid #aaa",
      fontSize: "16px",
      outline: "none",
      transition: "0.3s",
    },
    label: { position: "absolute", top: "-8px", left: "14px", background: "#fff", padding: "0 5px", fontSize: "12px", color: "#555" },
    btnSubmit: {
      padding: "12px",
      background: "#4f46e5",
      border: "none",
      color: "white",
      borderRadius: "10px",
      fontSize: "17px",
      cursor: "pointer",
      transition: "0.3s",
      width: "100%",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { background: "#4f46e5", color: "white", padding: "12px" },
    td: { padding: "15px", borderBottom: "1px solid #ccc" },
    tagPending: { padding: "4px 10px", borderRadius: "8px", fontWeight: "bold", background: "#fff3cd", color: "#856404" },
    tagApproved: { padding: "4px 10px", borderRadius: "8px", fontWeight: "bold", background: "#d4edda", color: "#155724" },
    // Admissions Section Styles
    admissionsCard: {
      background: "rgba(255,255,255,0.65)",
      padding: "30px",
      borderRadius: "20px",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.3)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      marginBottom: "20px",
      minHeight: "400px",
    },
    admissionsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      borderBottom: "2px solid #e2e8f0",
      paddingBottom: "15px",
    },
    admissionsTitle: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#2d3748",
      margin: "0",
    },
    admissionsSubtitle: {
      fontSize: "16px",
      color: "#718096",
      margin: "10px 0 20px 0",
    },
    // Admissions Table Styles
    admissionsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    admissionsTableHeader: {
      background: "#4f46e5",
      color: "white",
    },
    admissionsTableHeaderCell: {
      padding: "12px 15px",
      textAlign: "left",
      fontWeight: "600",
      fontSize: "14px",
    },
    admissionsTableRow: {
      borderBottom: "1px solid #e2e8f0",
      transition: "background-color 0.2s ease",
    },
    admissionsTableCell: {
      padding: "15px",
      verticalAlign: "middle",
    },
    // View Admissions Button Styles
    viewAdmissionsButton: {
      padding: "12px 24px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      textDecoration: "none",
      marginTop: "20px",
      width: "fit-content",
    },
    admissionsStatus: {
      padding: "6px 12px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      display: "inline-block",
    },
    statusAdmitted: {
      backgroundColor: "#d4edda",
      color: "#155724",
    },
    statusWaitlisted: {
      backgroundColor: "#fff3cd",
      color: "#856404",
    },
    statusPending: {
      backgroundColor: "#cce5ff",
      color: "#004085",
    },
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const { first_name, last_name } = profile;
    if (first_name && last_name) {
      return `${first_name[0]}${last_name[0]}`.toUpperCase();
    } else if (first_name) {
      return first_name[0].toUpperCase();
    }
    return "S";
  };

  return (
    <div style={dashboardStyles.container}>
      {/* TOP NAV */}
      <nav style={dashboardStyles.topNav}>
        <h1 style={dashboardStyles.appTitle}>🎓 Student Portal</h1>
        <div style={dashboardStyles.navRight}>
          <div 
            style={dashboardStyles.notifications}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            🔔<span style={dashboardStyles.badge}>0</span>
          </div>
          <div 
            style={dashboardStyles.profileSection}
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <div style={dashboardStyles.profileImg}>
              {getUserInitials()}
            </div>
            <span style={dashboardStyles.profileName}>
              {profile.first_name || "Student"}
            </span>
            
            {/* Logout Dropdown Menu */}
            {showLogoutMenu && (
              <div style={dashboardStyles.logoutMenu}>
                <div 
                  style={dashboardStyles.logoutMenuItem}
                  onClick={() => {
                    setActiveTab("profile");
                    setShowLogoutMenu(false);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f7fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  👤 My Profile
                </div>
                <div 
                  style={dashboardStyles.logoutMenuItem}
                  onClick={() => {
                    setActiveTab("admissions");
                    setShowLogoutMenu(false);
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f7fafc"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  🎓 My Applications
                </div>
                <div 
                  style={{...dashboardStyles.logoutMenuItem, ...dashboardStyles.logoutMenuItemLast}}
                  onClick={handleLogout}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fed7d7"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  🚪 Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* SIDEBAR */}
      <aside style={dashboardStyles.sidebar}>
        <button
          style={{ ...dashboardStyles.sidebarBtn, ...(activeTab === "apply" ? dashboardStyles.sidebarBtnActive : {}) }}
          onClick={() => {
            setActiveTab("apply");
            navigate("/student/application");
          }}
        >
          📄 Apply
        </button>
        <button
          style={{ ...dashboardStyles.sidebarBtn, ...(activeTab === "admissions" ? dashboardStyles.sidebarBtnActive : {}) }}
          onClick={() => setActiveTab("admissions")}
        >
          🎓 Admissions
        </button>
        <button
          style={{ ...dashboardStyles.sidebarBtn, ...(activeTab === "profile" ? dashboardStyles.sidebarBtnActive : {}) }}
          onClick={() => setActiveTab("profile")}
        >
          👤 Profile
        </button>
        {/* Logout Button in Sidebar (Alternative location) */}
        <button
          style={{
            ...dashboardStyles.sidebarBtn,
            background: "#e53e3e",
            marginTop: "auto",
          }}
          onClick={handleLogout}
        >
          LOGOUT
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main style={dashboardStyles.mainContent}>
        {/* APPLY TAB */}
        {activeTab === "apply" && (
          <div style={dashboardStyles.glassCard}>
            <h2>Start Your Application</h2>
            <p>Select your institute, faculty, and course to begin.</p>
            <button style={dashboardStyles.btnSubmit} onClick={() => navigate("/student/application")}>
              Go to Application Page
            </button>
          </div>
        )}

        {/* ADMISSIONS TAB */}
        {activeTab === "admissions" && (
          <div style={dashboardStyles.admissionsCard}>
            <div style={dashboardStyles.admissionsHeader}>
              <h2 style={dashboardStyles.admissionsTitle}>Admissions Status</h2>
            </div>
            
            <p style={dashboardStyles.admissionsSubtitle}>
              Check the status of your applications and view university admissions.
            </p>

           

            {/* View All Admissions Button */}
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <p style={{ marginBottom: "15px", color: "#4a5568" }}>
                View all university admissions to see who got accepted.
              </p>
              <Link
                to="/view-admissions"
                style={dashboardStyles.viewAdmissionsButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                👁️ View All Admissions
              </Link>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div style={dashboardStyles.glassCard}>
            <h2>Edit Profile</h2>

            <form onSubmit={handleProfileSubmit}>
              {[
                { label: "First Name", name: "first_name", type: "text", autoComplete: "given-name" },
                { label: "Last Name", name: "last_name", type: "text", autoComplete: "family-name" },
                { label: "Email", name: "email", type: "email", autoComplete: "email" },
                { label: "Phone", name: "phone", type: "tel", autoComplete: "tel" },
                { label: "Date of Birth", name: "date_of_birth", type: "date", autoComplete: "bday" },
                { label: "Nationality", name: "nationality", type: "text", autoComplete: "nationality" },
              ].map((field) => (
                <div key={field.name} style={dashboardStyles.inputGroup}>
                  <label htmlFor={field.name} style={dashboardStyles.label}>{field.label}</label>
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={profile[field.name]}
                    onChange={handleProfileChange}
                    style={dashboardStyles.input}
                    required
                    autoComplete={field.autoComplete}
                  />
                </div>
              ))}

              <div style={dashboardStyles.inputGroup}>
                <label htmlFor="gender" style={dashboardStyles.label}>Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={profile.gender}
                  onChange={handleProfileChange}
                  style={dashboardStyles.input}
                  required
                  autoComplete="sex"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button type="submit" style={dashboardStyles.btnSubmit}>Update Profile</button>
            </form>
          </div>
        )}
      </main>

      {/* Add CSS for animations and backdrop */}
      <style>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        tr:hover {
          background-color: #f8f9fa;
        }
        
        /* Backdrop for logout menu */
        .backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: transparent;
          z-index: 999;
        }
      `}</style>
      
      {/* Backdrop to close logout menu when clicking outside */}
      {showLogoutMenu && (
        <div 
          className="backdrop"
          onClick={() => setShowLogoutMenu(false)}
        />
      )}
    </div>
  );
}