// frontend/src/pages/ViewAdmissions.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// frontend/src/pages/ViewAdmissions.jsx
// frontend/src/pages/ViewAdmissions.jsx


const ViewAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    institution: 'all',
    faculty: 'all',
    search: '',
    year: '',
    month: ''
  });
  const [showFilters, setShowFilters] = useState(true);
  const [useSampleData, setUseSampleData] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  // Sample data
  const sampleAdmissions = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Smith',
      date_of_birth: '2002-05-15',
      gender: 'Male',
      nationality: 'American',
      email: 'john.smith@example.com',
      phone: '+1-555-1234',
      high_school_name: 'Lincoln High School',
      highest_qualification: 'A-Level',
      course_name: 'Computer Science',
      status: 'admitted',
      submitted_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-20T14:45:00Z',
      Institute: {
        id: 1,
        name: 'LUCT',
        location: 'California, USA',
        type: 'University'
      },
      Faculty: {
        id: 1,
        name: 'Engineering',
        description: 'Faculty of Engineering and Technology'
      },
      guardian_name: 'Robert Smith',
      guardian_relationship: 'Father',
      guardian_phone: '+1-555-5678',
      guardian_occupation: 'Engineer'
    },
    {
      id: 2,
      first_name: 'Emma',
      last_name: 'Johnson',
      date_of_birth: '2003-08-22',
      gender: 'Female',
      nationality: 'British',
      email: 'emma.johnson@example.com',
      phone: '+44-7911-123456',
      high_school_name: 'Oxford High School',
      highest_qualification: 'IGCSE/LGCSE',
      course_name: 'Medicine',
      status: 'waitlisted',
      submitted_at: '2024-01-18T09:15:00Z',
      updated_at: '2024-01-22T11:20:00Z',
      Institute: {
        id: 2,
        name: 'Harvard University',
        location: 'NUL',
        type: 'University'
      },
      Faculty: {
        id: 2,
        name: 'Medical Sciences',
        description: 'Faculty of Medical and Health Sciences'
      },
      guardian_name: 'Sarah Johnson',
      guardian_relationship: 'Mother',
      guardian_phone: '+44-7911-987654',
      guardian_occupation: 'Doctor'
    },
    {
      id: 3,
      first_name: 'David',
      last_name: 'Chen',
      date_of_birth: '2001-11-30',
      gender: 'Male',
      nationality: 'Chinese',
      email: 'david.chen@example.com',
      phone: '+86-138-0013-8000',
      high_school_name: 'Beijing High School',
      highest_qualification: 'A-Level',
      course_name: 'Business Administration',
      status: 'admitted',
      submitted_at: '2024-01-10T14:20:00Z',
      updated_at: '2024-01-25T16:30:00Z',
      Institute: {
        id: 3,
        name: 'MIT',
        location: 'LUCT',
        type: 'University'
      },
      Faculty: {
        id: 3,
        name: 'Business',
        description: 'Faculty of Business and Management'
      },
      guardian_name: 'Wei Chen',
      guardian_relationship: 'Father',
      guardian_phone: '+86-139-0013-8001',
      guardian_occupation: 'Business Owner'
    },
    {
      id: 4,
      first_name: 'Sophia',
      last_name: 'Williams',
      date_of_birth: '2002-03-08',
      gender: 'Female',
      nationality: 'Canadian',
      email: 'sophia.williams@example.com',
      phone: '+1-416-555-7890',
      high_school_name: 'Toronto High School',
      highest_qualification: 'JC',
      course_name: 'Law',
      status: 'admitted',
      submitted_at: '2024-01-22T11:45:00Z',
      updated_at: '2024-01-28T09:15:00Z',
      Institute: {
        id: 4,
        name: 'NUL',
        location: 'Cambridge, UK',
        type: 'University'
      },
      Faculty: {
        id: 4,
        name: 'Law',
        description: 'Faculty of Law and Justice'
      },
      guardian_name: 'Michael Williams',
      guardian_relationship: 'Father',
      guardian_phone: '+1-416-555-7891',
      guardian_occupation: 'Professor'
    },
    {
      id: 5,
      first_name: 'Ahmed',
      last_name: 'Ali',
      date_of_birth: '2003-07-19',
      gender: 'Male',
      nationality: 'Egyptian',
      email: 'ahmed.ali@example.com',
      phone: '+20-100-1234-567',
      high_school_name: 'Cairo International School',
      highest_qualification: 'IGCSE/LGCSE',
      course_name: 'Architecture',
      status: 'waitlisted',
      submitted_at: '2024-01-25T13:30:00Z',
      updated_at: '2024-01-29T10:45:00Z',
      Institute: {
        id: 5,
        name: 'LCE',
        location: 'Oxford, UK',
        type: 'College'
      },
      Faculty: {
        id: 5,
        name: 'Architecture',
        description: 'Faculty of Architecture and Design'
      },
      guardian_name: 'Mohammed Ali',
      guardian_relationship: 'Father',
      guardian_phone: '+20-100-9876-543',
      guardian_occupation: 'Architect'
    },
    {
      id: 6,
      first_name: 'Maria',
      last_name: 'Garcia',
      date_of_birth: '2002-12-05',
      gender: 'Female',
      nationality: 'Spanish',
      email: 'maria.garcia@example.com',
      phone: '+34-600-123-456',
      high_school_name: 'Madrid International School',
      highest_qualification: 'A-Level',
      course_name: 'Psychology',
      status: 'admitted',
      submitted_at: '2024-01-05T08:45:00Z',
      updated_at: '2024-01-30T15:20:00Z',
      Institute: {
        id: 1,
        name: 'LP',
        location: 'California, USA',
        type: 'College'
      },
      Faculty: {
        id: 6,
        name: 'Social Sciences',
        description: 'Faculty of Social Sciences'
      },
      guardian_name: 'Carlos Garcia',
      guardian_relationship: 'Father',
      guardian_phone: '+34-600-987-654',
      guardian_occupation: 'Psychologist'
    },
    {
      id: 7,
      first_name: 'Kenji',
      last_name: 'Tanaka',
      date_of_birth: '2001-09-14',
      gender: 'Male',
      nationality: 'Japanese',
      email: 'kenji.tanaka@example.com',
      phone: '+81-90-1234-5678',
      high_school_name: 'Tokyo High School',
      highest_qualification: 'IGCSE/LGCSE',
      course_name: 'Electrical Engineering',
      status: 'admitted',
      submitted_at: '2024-01-12T16:30:00Z',
      updated_at: '2024-01-27T12:10:00Z',
      Institute: {
        id: 3,
        name: ' NUL',
        location: 'Massachusetts, USA',
        type: 'University'
      },
      Faculty: {
        id: 1,
        name: 'Engineering',
        description: 'Faculty of Engineering and Technology'
      },
      guardian_name: 'Hiroshi Tanaka',
      guardian_relationship: 'Father',
      guardian_phone: '+81-90-8765-4321',
      guardian_occupation: 'Electrical Engineer'
    },
    {
      id: 8,
      first_name: 'Lina',
      last_name: 'Khalid',
      date_of_birth: '2003-04-25',
      gender: 'Female',
      nationality: 'Saudi Arabian',
      email: 'lina.khalid@example.com',
      phone: '+966-50-123-4567',
      high_school_name: 'Riyadh International School',
      highest_qualification: 'JC',
      course_name: 'Pharmacy',
      status: 'waitlisted',
      submitted_at: '2024-01-28T14:15:00Z',
      updated_at: '2024-02-01T10:30:00Z',
      Institute: {
        id: 2,
        name: 'LUCT',
        location: 'Massachusetts, USA',
        type: 'University'
      },
      Faculty: {
        id: 2,
        name: 'Medical Sciences',
        description: 'Faculty of Medical and Health Sciences'
      },
      guardian_name: 'Omar Khalid',
      guardian_relationship: 'Father',
      guardian_phone: '+966-50-987-6543',
      guardian_occupation: 'Pharmacist'
    }
  ];

  useEffect(() => {
    fetchAdmissions();
  }, []);

  useEffect(() => {
    if (useSampleData) {
      applyFiltersToSampleData();
    } else {
      const timer = setTimeout(() => {
        fetchAdmissions();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [filters, useSampleData]);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value);
        }
      });

      const response = await axios.get(`http://localhost:5000/api/public/admissions?${params}`);
      
      if (response.data.success) {
        setAdmissions(response.data.data);
        setStatistics(response.data.statistics);
        setUseSampleData(false);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      console.error('Error fetching admissions:', err);
      // Fallback to sample data
      setUseSampleData(true);
      applyFiltersToSampleData();
      setError('data.');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersToSampleData = () => {
    let filteredData = [...sampleAdmissions];
    
    // Apply status filter
    if (filters.status !== 'all') {
      filteredData = filteredData.filter(item => item.status === filters.status);
    }
    
    // Apply institution filter
    if (filters.institution !== 'all') {
      const instId = parseInt(filters.institution);
      filteredData = filteredData.filter(item => item.Institute.id === instId);
    }
    
    // Apply faculty filter
    if (filters.faculty !== 'all') {
      const facultyId = parseInt(filters.faculty);
      filteredData = filteredData.filter(item => item.Faculty.id === facultyId);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.first_name.toLowerCase().includes(searchTerm) ||
        item.last_name.toLowerCase().includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm) ||
        item.course_name.toLowerCase().includes(searchTerm) ||
        item.Institute.name.toLowerCase().includes(searchTerm) ||
        item.Faculty.name.toLowerCase().includes(searchTerm)
      );
    }
    
    setAdmissions(filteredData);
    
    // Calculate statistics
    const total = filteredData.length;
    const admitted = filteredData.filter(app => app.status === 'admitted').length;
    const waitlisted = filteredData.filter(app => app.status === 'waitlisted').length;
    
    setStatistics({
      total,
      admitted,
      waitlisted,
      admissionRate: total > 0 ? ((admitted / total) * 100).toFixed(1) : 0
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      institution: 'all',
      faculty: 'all',
      search: '',
      year: '',
      month: ''
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      admitted: {
        background: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb'
      },
      waitlisted: {
        background: '#fff3cd',
        color: '#856404',
        border: '1px solid #ffeaa7'
      },
      pending: {
        background: '#cce5ff',
        color: '#004085',
        border: '1px solid #b8daff'
      },
      rejected: {
        background: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb'
      }
    };

    const style = styles[status] || styles.pending;

    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block',
        ...style
      }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const toggleUseRealData = () => {
    if (!useSampleData) {
      setUseSampleData(true);
      applyFiltersToSampleData();
    } else {
      setUseSampleData(false);
      fetchAdmissions();
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading admissions data...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>

        <div style={styles.backButtonContainer}>
  <button 
    style={styles.backButton}
    onClick={() => window.history.back()}
  >
    ← Back
  </button>
</div>
        <h1 style={styles.title}> Institutions Admissions Portal</h1>
        <p style={styles.subtitle}>
          View and manage student admissions from various institutions
        </p>
      </div>
      

      {/* Data Source Toggle */}
      <div style={styles.dataSourceContainer}>
        <button
          onClick={toggleUseRealData}
          style={{
            ...styles.toggleButton,
            backgroundColor: useSampleData ? '#e53e3e' : '#38a169',
            color: 'white'
          }}
        >
          {useSampleData ? 'Available Data' : 'Using Real Data'}
        </button>

        
        {error && <span style={styles.errorText}>{error}</span>}
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div>
              <h3 style={styles.statLabel}>Total Applications</h3>
              <p style={styles.statValue}>{statistics.total}</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div>
              <h3 style={styles.statLabel}>Admitted</h3>
              <p style={styles.statValue}>{statistics.admitted}</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div>
              <h3 style={styles.statLabel}>Waitlisted</h3>
              <p style={styles.statValue}>{statistics.waitlisted}</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div>
              <h3 style={styles.statLabel}>Admission Rate</h3>
              <p style={styles.statValue}>{statistics.admissionRate}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls and Filters */}
      <div style={styles.controlsContainer}>
        <div style={styles.controlsHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Applications</h2>
            <p style={styles.sectionSubtitle}>
              Showing {admissions.length} out of {statistics?.total || admissions.length} applications
            </p>
          </div>
          
          <div style={styles.controlsButtons}>
            <button
              style={styles.controlButton}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button
              style={styles.controlButton}
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, course, or institution..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={styles.filtersPanel}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="admitted">Admitted</option>
                <option value="waitlisted">Waitlisted</option>
              </select>
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Institution</label>
              <select
                value={filters.institution}
                onChange={(e) => handleFilterChange('institution', e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Institutions</option>
                <option value="1">Stanford University</option>
                <option value="2">Harvard University</option>
                <option value="3">MIT</option>
                <option value="4">University of Cambridge</option>
                <option value="5">University of Oxford</option>
              </select>
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Faculty</label>
              <select
                value={filters.faculty}
                onChange={(e) => handleFilterChange('faculty', e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All Faculties</option>
                <option value="1">Engineering</option>
                <option value="2">Medical Sciences</option>
                <option value="3">Business</option>
                <option value="4">Law</option>
                <option value="5">Architecture</option>
                <option value="6">Social Sciences</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div style={styles.tableContainer}>
        {admissions.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyTitle}>No Admissions Found</h3>
            <p style={styles.emptyText}>
              Try adjusting your filters or check back later for new applications.
            </p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableHeaderCell}>Student</th>
                <th style={styles.tableHeaderCell}>Course & Institution</th>
                <th style={styles.tableHeaderCell}>Status</th>
                <th style={styles.tableHeaderCell}>Applied Date</th>
                <th style={styles.tableHeaderCell}>Contact</th>
                <th style={styles.tableHeaderCell}>Details</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((admission) => (
                <tr key={admission.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <div style={styles.studentInfo}>
                      <div style={styles.avatar}>
                        {admission.first_name[0]}{admission.last_name[0]}
                      </div>
                      <div>
                        <div style={styles.studentName}>
                          {admission.first_name} {admission.last_name}
                        </div>
                        <div style={styles.studentDetails}>
                          {admission.gender} • {admission.nationality}
                        </div>
                        <div style={styles.studentDetails}>
                          DOB: {formatDate(admission.date_of_birth)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.courseInfo}>
                      <div style={styles.courseName}>{admission.course_name}</div>
                      <div style={styles.institutionName}>{admission.Institute?.name}</div>
                      <div style={styles.facultyName}>{admission.Faculty?.name}</div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    {getStatusBadge(admission.status)}
                  </td>
                  <td style={styles.tableCell}>
                    <div>{formatDate(admission.submitted_at)}</div>
                    <div style={styles.smallText}>
                      Updated: {formatDate(admission.updated_at)}
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={styles.contactInfo}>
                      <div>{admission.email}</div>
                      <div style={styles.phone}>{admission.phone}</div>
                      <div style={styles.smallText}>
                        Guardian: {admission.guardian_name}
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <button
                      style={styles.detailsButton}
                      onClick={() => setSelectedAdmission(admission)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedAdmission && (
        <div style={styles.modalOverlay} onClick={() => setSelectedAdmission(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Application Details</h2>
              <button
                style={styles.modalClose}
                onClick={() => setSelectedAdmission(null)}
              >
                ✕
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>Personal Information</h3>
                <div style={styles.modalGrid}>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Full Name</label>
                    <p style={styles.modalValue}>{selectedAdmission.first_name} {selectedAdmission.last_name}</p>
                  </div>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Date of Birth</label>
                    <p style={styles.modalValue}>{formatDate(selectedAdmission.date_of_birth)}</p>
                  </div>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Gender</label>
                    <p style={styles.modalValue}>{selectedAdmission.gender}</p>
                  </div>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Nationality</label>
                    <p style={styles.modalValue}>{selectedAdmission.nationality}</p>
                  </div>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Email</label>
                    <p style={styles.modalValue}>{selectedAdmission.email}</p>
                  </div>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Phone</label>
                    <p style={styles.modalValue}>{selectedAdmission.phone}</p>
                  </div>
                </div>
              </div>
              
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>Academic Information</h3>
                <div style={styles.modalGrid}>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>High School</label>
                    <p style={styles.modalValue}>{selectedAdmission.high_school_name}</p>
                  </div>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Qualification</label>
                    <p style={styles.modalValue}>{selectedAdmission.highest_qualification}</p>
                  </div>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Course</label>
                    <p style={styles.modalValue}>{selectedAdmission.course_name}</p>
                  </div>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Institution</label>
                    <p style={styles.modalValue}>{selectedAdmission.Institute?.name}</p>
                  </div>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Faculty</label>
                    <p style={styles.modalValue}>{selectedAdmission.Faculty?.name}</p>
                  </div>
                </div>
              </div>
              
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>Guardian Information</h3>
                <div style={styles.modalGrid}>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Name</label>
                    <p style={styles.modalValue}>{selectedAdmission.guardian_name}</p>
                  </div>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Relationship</label>
                    <p style={styles.modalValue}>{selectedAdmission.guardian_relationship}</p>
                  </div>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Phone</label>
                    <p style={styles.modalValue}>{selectedAdmission.guardian_phone}</p>
                  </div>
                  <div style={styles.modalField}>
                    <label style={styles.modalLabel}>Occupation</label>
                    <p style={styles.modalValue}>{selectedAdmission.guardian_occupation || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button
                style={styles.modalButton}
                onClick={() => setSelectedAdmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Showing {admissions.length} of {statistics?.total || admissions.length} admissions • 
          Last updated: {new Date().toLocaleDateString()} • 
          Data Source: {useSampleData ? 'Available Data' : 'Live Database'}
        </p>
      </div>

      {/* Add CSS animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        tr:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, Roboto, -apple-system, sans-serif',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '15px',
    color: 'white',
    boxShadow: '0 10px 20px rgba(102, 126, 234, 0.2)'
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
  dataSourceContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '25px'
  },
  toggleButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '25px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px'
  },
  errorText: {
    color: '#e53e3e',
    fontSize: '14px',
    fontWeight: '500'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.3s ease'
  },
  statCardHover: {
    transform: 'translateY(-5px)'
  },
  statIcon: {
    fontSize: '2.5rem'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#06152eff',
    margin: '0 0 5px 0',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    margin: '0',
    color: '#22033bff'
  },
  controlsContainer: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '25px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  controlsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2d3748',
    margin: '0 0 5px 0',
    fontWeight: '700'
  },
  sectionSubtitle: {
    fontSize: '0.95rem',
    color: '#718096',
    margin: '0'
  },
  controlsButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  controlButton: {
    padding: '10px 20px',
    border: '2px solid #e2e8f0',
    background: 'white',
    color: '#4a5568',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px'
  },
  controlButtonHover: {
    borderColor: '#667eea',
    color: '#667eea'
  },
  searchContainer: {
    marginBottom: '20px'
  },
  searchWrapper: {
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.2rem',
    color: '#a0aec0'
  },
  searchInput: {
    width: '100%',
    padding: '15px 15px 15px 45px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    background: 'white'
  },
  searchInputFocus: {
    outline: 'none',
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)'
  },
  filtersPanel: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  filterLabel: {
    fontWeight: '600',
    color: '#001d4eff',
    fontSize: '14px'
  },
  filterSelect: {
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  filterSelectFocus: {
    outline: 'none',
    borderColor: '#667eea'
  },
  tableContainer: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    marginBottom: '30px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '1000px'
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #e9ecef'
  },
  tableHeaderCell: {
    padding: '18px 20px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#000000ff',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tableRow: {
    borderBottom: '1px solid #e9ecef',
    transition: 'background-color 0.2s ease'
  },
  tableCell: {
    padding: '20px',
    verticalAlign: 'top'
  },
  studentInfo: {
    display: 'flex',
    gap: '15px'
  },
  avatar: {
    width: '45px',
    height: '45px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
    flexShrink: '0'
  },
  studentName: {
    fontWeight: '600',
    color: '#c1d7fdff',
    fontSize: '16px',
    marginBottom: '4px'
  },
  studentDetails: {
    fontSize: '13px',
    color: '#a8c3ebff',
    marginBottom: '2px'
  },
  courseInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  courseName: {
    fontWeight: '600',
    color: '#077996ff',
    fontSize: '15px'
  },
  institutionName: {
    fontSize: '14px',
    color: '#aae0eeff'
  },
  facultyName: {
    fontSize: '13px',
    color: '#abc7f1ff',
    fontStyle: 'italic'
  },
  smallText: {
    fontSize: '12px',
    color: '#ffffffff',
    marginTop: '3px'
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  phone: {
    fontSize: '14px',
    color: '#4a5568'
  },
  detailsButton: {
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px'
  },
  detailsButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 30px'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
    opacity: '0.5'
  },
  emptyTitle: {
    fontSize: '1.5rem',
    color: '#4a5568',
    margin: '0 0 15px 0'
  },
  emptyText: {
    color: '#718096',
    fontSize: '1rem',
    maxWidth: '500px',
    margin: '0 auto'
  },
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1000',
    padding: '20px',
    animation: 'fadeIn 0.3s ease'
  },
  modalContent: {
    background: 'white',
    borderRadius: '15px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflowY: 'auto',
    animation: 'fadeIn 0.3s ease'
  },
  modalHeader: {
    padding: '25px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e9ecef',
    position: 'sticky',
    top: '0',
    background: 'white',
    zIndex: '10'
  },
  modalTitle: {
    margin: '0',
    fontSize: '1.5rem',
    color: '#6298f5ff',
    fontWeight: '700'
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    color: '#f6faffff',
    cursor: 'pointer',
    padding: '5px',
    transition: 'color 0.3s ease'
  },
  modalCloseHover: {
    color: '#e53e3e'
  },
  modalBody: {
    padding: '30px'
  },
  modalSection: {
    marginBottom: '30px'
  },
  modalSectionTitle: {
    fontSize: '1.2rem',
    color: '#cbcfd6ff',
    margin: '0 0 20px 0',
    paddingBottom: '10px',
    borderBottom: '2px solid #e9ecef',
    fontWeight: '600'
  },
  modalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  modalField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  modalLabel: {
    fontSize: '13px',
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600'
  },
  modalValue: {
    margin: '0',
    color: '#2d3748',
    fontWeight: '500',
    fontSize: '15px'
  },
  modalFooter: {
    padding: '20px 30px',
    borderTop: '1px solid #e9ecef',
    textAlign: 'right'
  },
  modalButton: {
    padding: '12px 30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px'
  },
  modalButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#718096',
    fontSize: '14px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  },
  footerText: {
    margin: '0'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  loadingText: {
    color: '#718096',
    fontSize: '1.1rem',
    fontWeight: '500'
  },

  backButtonContainer: {
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'flex-start'
},
backButton: {
  padding: '10px 20px',
  background: '#f8f9fa',
  border: '1px solid #dee2e6',
  borderRadius: '6px',
  color: '#495057',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px'
},
backButtonHover: {
  background: '#e9ecef',
  borderColor: '#ced4da'
}

};

export default ViewAdmissions;