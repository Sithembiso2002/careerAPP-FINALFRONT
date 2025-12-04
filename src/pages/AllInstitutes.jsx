// frontend/src/pages/AllInstitutes.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AllInstitutes = () => {
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataSource, setDataSource] = useState('loading'); // 'database', 'sample', 'error'

  // Sample data as fallback
  const sampleInstitutes = [
    {
      institute_id: 1,
      name: 'Stanford University',
      type: 'University',
      address: '450 Serra Mall, Stanford, CA 94305, USA',
      contact: '+1-650-723-2300',
      email: 'admissions@stanford.edu',
      createdAt: '2023-01-15T10:30:00Z',
      faculty_count: 3,
      course_count: 5
    },
    {
      institute_id: 2,
      name: 'Harvard University',
      type: 'University',
      address: 'Cambridge, MA 02138, USA',
      contact: '+1-617-495-1000',
      email: 'admissions@harvard.edu',
      createdAt: '2023-02-20T14:45:00Z',
      faculty_count: 4,
      course_count: 6
    },
    {
      institute_id: 3,
      name: 'MIT',
      type: 'University',
      address: '77 Massachusetts Ave, Cambridge, MA 02139, USA',
      contact: '+1-617-253-1000',
      email: 'admissions@mit.edu',
      createdAt: '2023-03-10T09:15:00Z',
      faculty_count: 2,
      course_count: 4
    },
    {
      institute_id: 4,
      name: 'University of Cambridge',
      type: 'University',
      address: 'The Old Schools, Trinity Ln, Cambridge CB2 1TN, UK',
      contact: '+44-1223-337733',
      email: 'admissions@cam.ac.uk',
      createdAt: '2023-04-05T11:20:00Z',
      faculty_count: 3,
      course_count: 5
    },
    {
      institute_id: 5,
      name: 'University of Oxford',
      type: 'University',
      address: 'Oxford OX1 2JD, UK',
      contact: '+44-1865-270000',
      email: 'admissions@ox.ac.uk',
      createdAt: '2023-05-12T16:30:00Z',
      faculty_count: 5,
      course_count: 7
    },
    {
      institute_id: 6,
      name: 'National Institute of Technology',
      type: 'College',
      address: '123 Education St, New Delhi, India',
      contact: '+91-11-2659-0000',
      email: 'admissions@nit.edu',
      createdAt: '2023-06-18T13:45:00Z',
      faculty_count: 2,
      course_count: 3
    }
  ];

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching institutes from API...');
      
      // Try to fetch from backend with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://careerapp-final.onrender.com'}/api/public/institutes`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  signal: controller.signal
});

      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 API response:', data);
      
      if (data.success && data.data) {
        setInstitutes(data.data);
        setDataSource('database');
        if (data.message) {
          setError(`Note: ${data.message}`);
        }
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
      
    } catch (err) {
      console.error('❌ Error fetching institutes:', err);
      
      // Use sample data as fallback
      setInstitutes(sampleInstitutes);
      setDataSource('sample');
      setError(`Showing sample data. Could not connect to server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter institutes based on search
  const filteredInstitutes = institutes.filter(institute => {
    return institute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           institute.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
           institute.type.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const retryConnection = () => {
    fetchInstitutes();
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      padding: '25px',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      color: 'white',
      borderRadius: '12px',
      position: 'relative',
      boxShadow: '0 8px 16px rgba(30, 64, 175, 0.2)'
    },
    title: {
      fontSize: '2.5rem',
      margin: '0 0 10px 0',
      fontWeight: '700'
    },
    subtitle: {
      fontSize: '1.1rem',
      opacity: '0.9',
      margin: '0'
    },
    backButton: {
      position: 'absolute',
      left: '20px',
      top: '20px',
      padding: '10px 20px',
      background: 'rgba(255, 255, 255, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '14px',
      backdropFilter: 'blur(10px)'
    },
    dataSourceBadge: {
      position: 'absolute',
      right: '20px',
      top: '20px',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    databaseBadge: {
      background: '#10b981',
      color: 'white'
    },
    sampleBadge: {
      background: '#f59e0b',
      color: 'white'
    },
    errorBadge: {
      background: '#ef4444',
      color: 'white'
    },
    connectionStatus: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    retryButton: {
      padding: '8px 16px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '25px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease'
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1e3a8a',
      margin: '10px 0'
    },
    statLabel: {
      fontSize: '14px',
      color: '#718096',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    searchContainer: {
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    searchInput: {
      width: '100%',
      padding: '14px 20px',
      fontSize: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.3s'
    },
    institutesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    instituteCard: {
      backgroundColor: 'white',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    cardHeader: {
      padding: '20px',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0'
    },
    instituteName: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#1e3a8a',
      margin: '0 0 10px 0',
      lineHeight: '1.3'
    },
    instituteType: {
      display: 'inline-block',
      padding: '6px 12px',
      backgroundColor: '#1e3a8a',
      color: 'white',
      borderRadius: '15px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    cardBody: {
      padding: '20px',
      flex: '1'
    },
    infoRow: {
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'flex-start'
    },
    infoIcon: {
      marginRight: '10px',
      color: '#718096',
      width: '20px',
      fontSize: '14px'
    },
    infoText: {
      fontSize: '14px',
      color: '#4a5568',
      lineHeight: '1.4'
    },
    statsRow: {
      display: 'flex',
      gap: '10px',
      marginTop: '15px',
      flexWrap: 'wrap'
    },
    statBadge: {
      padding: '6px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    facultyBadge: {
      backgroundColor: '#e0f2fe',
      color: '#0369a1'
    },
    courseBadge: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    cardFooter: {
      padding: '15px 20px',
      backgroundColor: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    dateText: {
      fontSize: '12px',
      color: '#94a3b8'
    },
    viewButton: {
      padding: '8px 16px',
      backgroundColor: '#1e3a8a',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.3s ease'
    },
    emptyState: {
      textAlign: 'center',
      padding: '50px 20px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '30px'
    },
    emptyIcon: {
      fontSize: '3rem',
      marginBottom: '20px',
      opacity: '0.5'
    },
    emptyTitle: {
      fontSize: '1.5rem',
      color: '#4a5568',
      margin: '0 0 10px 0'
    },
    emptyText: {
      color: '#718096',
      fontSize: '1rem'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '50vh'
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #1e3a8a',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    },
    loadingText: {
      color: '#718096',
      fontSize: '1.1rem'
    },
    footer: {
      textAlign: 'center',
      padding: '20px',
      color: '#718096',
      fontSize: '14px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading institutions...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        
        <div>
          <h1 style={styles.title}>🏛️ All Educational Institutions</h1>
          <p style={styles.subtitle}>
            Browse {institutes.length} institutions from our database
          </p>
        </div>
        
        <div style={{
          ...styles.dataSourceBadge,
          ...(dataSource === 'database' ? styles.databaseBadge : 
               dataSource === 'sample' ? styles.sampleBadge : 
               styles.errorBadge)
        }}>
          {dataSource === 'database' ? 'Live Data' : 
           dataSource === 'sample' ? 'Sample Data' : 'Error'}
        </div>
      </div>

      {/* Connection Status */}
      {error && (
        <div style={styles.connectionStatus}>
          <span style={{ color: '#6b7280', flex: 1 }}>{error}</span>
          <button 
            style={styles.retryButton}
            onClick={retryConnection}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{institutes.length}</div>
          <div style={styles.statLabel}>Total Institutions</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {new Set(institutes.map(inst => inst.type)).size}
          </div>
          <div style={styles.statLabel}>Different Types</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {institutes.filter(inst => inst.type === 'University').length}
          </div>
          <div style={styles.statLabel}>Universities</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {institutes.filter(inst => inst.type === 'College').length}
          </div>
          <div style={styles.statLabel}>Colleges</div>
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search institutions by name, address, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
          onFocus={(e) => e.target.style.borderColor = '#1e3a8a'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      {/* Institutes Grid */}
      {filteredInstitutes.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🏛️</div>
          <h3 style={styles.emptyTitle}>No Institutions Found</h3>
          <p style={styles.emptyText}>
            Try adjusting your search to find what you're looking for.
          </p>
          <button 
            style={styles.viewButton}
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div style={styles.institutesGrid}>
          {filteredInstitutes.map(institute => (
            <div 
              key={institute.institute_id} 
              style={styles.instituteCard}
              onClick={() => {
                navigate('/student/application', {
                  state: { selectedInstitute: institute }
                });
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.instituteName}>{institute.name}</h3>
                <span style={styles.instituteType}>{institute.type}</span>
              </div>
              
              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <span style={styles.infoIcon}>📍</span>
                  <span style={styles.infoText}>{institute.address}</span>
                </div>
                
                <div style={styles.infoRow}>
                  <span style={styles.infoIcon}>📞</span>
                  <span style={styles.infoText}>{institute.contact}</span>
                </div>
                
                <div style={styles.infoRow}>
                  <span style={styles.infoIcon}>📧</span>
                  <span style={styles.infoText}>{institute.email}</span>
                </div>

                {/* Show faculty and course counts if available */}
                <div style={styles.statsRow}>
                  {(institute.faculty_count > 0) && (
                    <span style={{...styles.statBadge, ...styles.facultyBadge}}>
                      🎓 {institute.faculty_count} Faculties
                    </span>
                  )}
                  {(institute.course_count > 0) && (
                    <span style={{...styles.statBadge, ...styles.courseBadge}}>
                      📚 {institute.course_count} Courses
                    </span>
                  )}
                </div>
              </div>
              
              <div style={styles.cardFooter}>
                <span style={styles.dateText}>
                  Added: {formatDate(institute.createdAt)}
                </span>
                <button 
                  style={styles.viewButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/student/application', {
                      state: { selectedInstitute: institute }
                    });
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e40af';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1e3a8a';
                  }}
                >
                  Apply Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <p>
          Showing {filteredInstitutes.length} of {institutes.length} institutions • 
          Data Source: {dataSource === 'database' ? 'Live Database' : 'Sample Data'} • 
          Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </p>
      </div>

      {/* Add CSS animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AllInstitutes;