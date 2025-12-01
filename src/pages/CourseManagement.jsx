// src/pages/CourseManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../assets/css/admin.css';
import '../assets/css/ind.css';
import '../assets/css/adminhome.css';
import '../assets/css/course-management.css';

export default function CourseManagement() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeFacultyFilter, setActiveFacultyFilter] = useState('all');

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalType, setModalType] = useState('add');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    course_name: '',
    course_code: '',
    description: '',
    credits: 3,
    duration: '3 months',
    faculty_id: '',
    institute_id: '',
    status: 'Active'
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch courses, faculties, and institutes in parallel
      const [coursesRes, facultiesRes, institutesRes] = await Promise.all([
        API.get('/api/courses'),
        API.get('/api/faculties'),
        API.get('/api/institutions')
      ]);

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.data);
      } else {
        throw new Error(coursesRes.data.message || 'Failed to fetch courses');
      }

      if (facultiesRes.data.success) {
        setFaculties(facultiesRes.data.data);
      }

      if (institutesRes.data.success) {
        setInstitutes(institutesRes.data.data);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort courses
  const filterCourses = useCallback(() => {
    let filtered = courses;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(course =>
        Object.values(course).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by faculty
    if (activeFacultyFilter !== 'all') {
      filtered = filtered.filter(course => 
        course.faculty_id === parseInt(activeFacultyFilter)
      );
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [courses, searchTerm, activeFacultyFilter]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, activeFacultyFilter, filterCourses]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCourses = React.useMemo(() => {
    if (!sortConfig.key) return filteredCourses;

    return [...filteredCourses].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredCourses, sortConfig]);

  // Group courses by faculty
  const coursesByFaculty = React.useMemo(() => {
    const grouped = {};
    
    faculties.forEach(faculty => {
      grouped[faculty.faculty_id] = {
        faculty,
        courses: sortedCourses.filter(course => course.faculty_id === faculty.faculty_id)
      };
    });

    // Add courses without faculty (if any)
    const coursesWithoutFaculty = sortedCourses.filter(course => 
      !faculties.find(f => f.faculty_id === course.faculty_id)
    );
    
    if (coursesWithoutFaculty.length > 0) {
      grouped.unknown = {
        faculty: { faculty_name: 'Unknown Faculty', faculty_code: 'UNK' },
        courses: coursesWithoutFaculty
      };
    }

    return grouped;
  }, [sortedCourses, faculties]);

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.course_name.trim()) {
      errors.course_name = 'Course name is required';
    }
    
    if (!formData.course_code.trim()) {
      errors.course_code = 'Course code is required';
    }
    
    if (!formData.faculty_id) {
      errors.faculty_id = 'Faculty is required';
    }
    
    if (!formData.institute_id) {
      errors.institute_id = 'Institute is required';
    }
    
    if (!formData.credits || formData.credits < 1) {
      errors.credits = 'Valid credits are required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddModal = () => {
    setModalType('add');
    setFormData({
      course_name: '',
      course_code: '',
      description: '',
      credits: 3,
      duration: '3 months',
      faculty_id: '',
      institute_id: '',
      status: 'Active'
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const openEditModal = (course) => {
  console.log('🔍 Opening edit modal for course:', course);
  
  // Clean the course data
  const cleanCourse = {
    ...course,
    course_id: parseInt(course.course_id.toString().trim())
  };
  
  setModalType('edit');
  setSelectedCourse(cleanCourse);
  setFormData({
    course_name: course.course_name,
    course_code: course.course_code,
    description: course.description || '',
    credits: course.credits,
    duration: course.duration,
    faculty_id: course.faculty_id,
    institute_id: course.institute_id,
    status: course.status
  });
  setFormErrors({});
  setModalVisible(true);
};

  const openViewModal = (course) => {
    setSelectedCourse(course);
    setViewModalVisible(true);
  };

  const openDeleteModal = (course) => {
    setSelectedCourse(course);
    setDeleteModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setViewModalVisible(false);
    setDeleteModalVisible(false);
    setSelectedCourse(null);
    setFormErrors({});
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseInt(value) : value 
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // In your CourseManagement.jsx, update the handleSubmit function:

// Alternative handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  try {
    setIsSubmitting(true);
    setError('');

    let url, method;
    
    if (modalType === 'add') {
      url = '/api/courses';
      method = 'post';
    } else {
      // Manually construct the URL to avoid encoding issues
      const courseId = selectedCourse.course_id.toString().trim().replace(/\s+/g, '');
      url = `/api/courses/${courseId}`;
      method = 'put';
      console.log(`🔄 Using URL: ${url}`);
    }

    const response = await API[method](url, formData);
    
    if (response.data.success) {
      await fetchData();
      closeModal();
    } else {
      throw new Error(response.data.message || `Failed to ${modalType} course`);
    }
    
  } catch (err) {
    console.error('❌ Error:', err);
    setError(err.response?.data?.message || err.message || `Failed to ${modalType} course`);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleSelectCourse = (courseId) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCourses(currentCourses.map(course => course.course_id));
    } else {
      setSelectedCourses([]);
    }
  };

  const exportCourses = () => {
    const data = selectedCourses.length > 0 
      ? courses.filter(course => selectedCourses.includes(course.course_id))
      : courses;
    
    if (data.length === 0) {
      setError('No data to export');
      return;
    }
    
    const csv = convertToCSV(data);
    downloadCSV(csv, `courses_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const convertToCSV = (data) => {
    const headers = ['ID', 'Course Name', 'Course Code', 'Description', 'Credits', 'Duration', 'Faculty', 'Institute', 'Status', 'Created Date'];
    const rows = data.map(course => [
      course.course_id,
      `"${course.course_name}"`,
      course.course_code,
      `"${course.description || ''}"`,
      course.credits,
      course.duration,
      `"${faculties.find(f => f.faculty_id === course.faculty_id)?.faculty_name || 'Unknown'}"`,
      `"${institutes.find(i => i.institute_id === course.institute_id)?.name || 'Unknown'}"`,
      course.status,
      course.createdAt
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const clearError = () => {
    setError('');
  };

  const getFacultyName = (facultyId) => {
    const faculty = faculties.find(f => f.faculty_id === facultyId);
    return faculty ? `${faculty.faculty_name} (${faculty.faculty_code})` : 'Unknown Faculty';
  };

  const getInstituteName = (instituteId) => {
    const institute = institutes.find(i => i.institute_id === instituteId);
    return institute ? institute.name : 'Unknown Institute';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          Loading courses...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Course Management</h2>
        <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </button>
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="error-close">×</button>
        </div>
      )}

      {/* Controls Section */}
      <div className="controls-section">
        <div className="search-filter-group">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-group">
            <select 
              value={activeFacultyFilter} 
              onChange={(e) => setActiveFacultyFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Faculties</option>
              {faculties.map(faculty => (
                <option key={faculty.faculty_id} value={faculty.faculty_id}>
                  {faculty.faculty_name} ({faculty.faculty_code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={openAddModal}>
            Add Course
          </button>
          <button 
            className="btn-secondary" 
            onClick={exportCourses}
            disabled={courses.length === 0}
          >
            Export CSV
          </button>
          {selectedCourses.length > 0 && (
            <span className="selected-count">
              {selectedCourses.length} selected
            </span>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p className="stat-number">{courses.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Courses</h3>
          <p className="stat-number">
            {courses.filter(c => c.status === 'Active').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Faculties</h3>
          <p className="stat-number">
            {new Set(courses.map(c => c.faculty_id)).size}
          </p>
        </div>
        <div className="stat-card">
          <h3>Total Credits</h3>
          <p className="stat-number">
            {courses.reduce((sum, course) => sum + (course.credits || 0), 0)}
          </p>
        </div>
      </div>

      {/* View Toggle */}
     <div className="view-toggle" style={{
  display: 'flex',
  gap: '10px',
  marginBottom: '20px',
  padding: '8px',
  backgroundColor: 'var(--bg-secondary, #f8f9fa)',
  borderRadius: '12px',
  border: '1px solid var(--border-color, #e9ecef)',
  width: 'fit-content'
}}>
  <button 
    className="toggle-btn active" 
    style={{
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: 'var(--primary-color, #007bff)',
      color: 'white',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
      transform: 'translateY(0)'
    }}
    onMouseEnter={(e) => {
      e.target.style.setProperty('background-color', 'var(--primary-hover, #0056b3)');
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 6px 16px rgba(0, 123, 255, 0.4)';
    }}
    onMouseLeave={(e) => {
      e.target.style.setProperty('background-color', 'var(--primary-color, #007bff)');
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.3)';
    }}
    onMouseDown={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 1px 4px rgba(0, 123, 255, 0.3)';
    }}
    onMouseUp={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 6px 16px rgba(0, 123, 255, 0.4)';
    }}
  >
    Table View
  </button>
  <button 
    className="toggle-btn" 
    style={{
      padding: '12px 24px',
      border: '1px solid var(--border-color, #dee2e6)',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: 'var(--text-secondary, #003870ff)',
      fontWeight: '900',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 1px 3px rgba(63, 7, 109, 0.1)',
      transform: 'translateY(0)'
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = 'var(--bg-hover, #f8f9fa)';
      e.target.style.borderColor = 'var(--primary-color, #007bff)';
      e.target.style.color = 'var(--primary-color, #007bff)';
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = 'white';
      e.target.style.borderColor = 'var(--border-color, #19426bff)';
      e.target.style.color = 'var(--text-secondary, #495057)';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }}
    onMouseDown={(e) => {
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.1)';
    }}
    onMouseUp={(e) => {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
    }}
  >
    Faculty View
  </button>
</div>

      {/* Courses Table */}
      <div className="table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={currentCourses.length > 0 && selectedCourses.length === currentCourses.length}
                  disabled={currentCourses.length === 0}
                />
              </th>
              <th onClick={() => handleSort('course_code')} className="sortable">
                Code {sortConfig.key === 'course_code' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('course_name')} className="sortable">
                Course Name {sortConfig.key === 'course_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Faculty</th>
              <th>Institute</th>
              <th onClick={() => handleSort('credits')} className="sortable">
                Credits {sortConfig.key === 'credits' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Duration</th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.length > 0 ? (
              currentCourses.map((course) => (
                <tr key={course.course_id} className={selectedCourses.includes(course.course_id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.course_id)}
                      onChange={() => handleSelectCourse(course.course_id)}
                    />
                  </td>
                  <td>
                    <span className="course-code">{course.course_code}</span>
                  </td>
                  <td>
                    <div className="course-info">
                      <strong>{course.course_name}</strong>
                      {course.description && (
                        <small>{course.description}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="faculty-badge">
                      {getFacultyName(course.faculty_id)}
                    </span>
                  </td>
                  <td>
                    <span className="institute-badge">
                      {getInstituteName(course.institute_id)}
                    </span>
                  </td>
                  <td>
                    <span className="credits-badge">{course.credits}</span>
                  </td>
                  <td>{course.duration}</td>
                  <td>
                    <span className={`status-badge ${course.status.toLowerCase()}`}>
                      {course.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-view"
                        onClick={() => openViewModal(course)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-edit"
                        onClick={() => openEditModal(course)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => openDeleteModal(course)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  {searchTerm || activeFacultyFilter !== 'all' 
                    ? 'No courses match your search criteria' 
                    : 'No courses found'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ← Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}

      {/* Faculty-wise Course Groups */}
      <div className="faculty-groups">
        <h3>Courses by Faculty</h3>
        {Object.entries(coursesByFaculty).map(([facultyId, { faculty, courses }]) => (
          courses.length > 0 && (
            <div key={facultyId} className="faculty-group">
              <div className="faculty-header">
                <h4>{faculty.faculty_name} ({faculty.faculty_code})</h4>
                <span className="course-count">{courses.length} courses</span>
              </div>
              <div className="courses-grid">
                {courses.map(course => (
                  <div key={course.course_id} className="course-card">
                    <div className="course-card-header">
                      <h5>{course.course_name}</h5>
                      <span className={`status-badge small ${course.status.toLowerCase()}`}>
                        {course.status}
                      </span>
                    </div>
                    <div className="course-card-body">
                      <p className="course-code">{course.course_code}</p>
                      <p className="course-description">{course.description}</p>
                      <div className="course-meta">
                        <span className="credits">{course.credits} credits</span>
                        <span className="duration">{course.duration}</span>
                      </div>
                    </div>
                    <div className="course-card-actions">
                      <button 
                        className="btn-view small"
                        onClick={() => openViewModal(course)}
                      >
                        View
                      </button>
                      <button 
                        className="btn-edit small"
                        onClick={() => openEditModal(course)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modalVisible && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalType === 'add' ? 'Add New Course' : 'Edit Course'}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Course Name *</label>
                  <input
                    type="text"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleInputChange}
                    required
                    className={formErrors.course_name ? 'error' : ''}
                  />
                  {formErrors.course_name && (
                    <span className="error-text">{formErrors.course_name}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Course Code *</label>
                  <input
                    type="text"
                    name="course_code"
                    value={formData.course_code}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., CS101, MATH201"
                    className={formErrors.course_code ? 'error' : ''}
                  />
                  {formErrors.course_code && (
                    <span className="error-text">{formErrors.course_code}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Faculty *</label>
                  <select
                    name="faculty_id"
                    value={formData.faculty_id}
                    onChange={handleInputChange}
                    required
                    className={formErrors.faculty_id ? 'error' : ''}
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map(faculty => (
                      <option key={faculty.faculty_id} value={faculty.faculty_id}>
                        {faculty.faculty_name} ({faculty.faculty_code})
                      </option>
                    ))}
                  </select>
                  {formErrors.faculty_id && (
                    <span className="error-text">{formErrors.faculty_id}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Institute *</label>
                  <select
                    name="institute_id"
                    value={formData.institute_id}
                    onChange={handleInputChange}
                    required
                    className={formErrors.institute_id ? 'error' : ''}
                  >
                    <option value="">Select Institute</option>
                    {institutes.map(institute => (
                      <option key={institute.institute_id} value={institute.institute_id}>
                        {institute.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.institute_id && (
                    <span className="error-text">{formErrors.institute_id}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Credits *</label>
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    required
                    className={formErrors.credits ? 'error' : ''}
                  />
                  {formErrors.credits && (
                    <span className="error-text">{formErrors.credits}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                  >
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                    <option value="2 years">2 years</option>
                    <option value="4 years">4 years</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Course description..."
                  />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} disabled={isSubmitting}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (modalType === 'add' ? 'Add Course' : 'Update Course')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalVisible && selectedCourse && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Course Details</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="course-details">
              <div className="detail-header">
                <h4>{selectedCourse.course_name} ({selectedCourse.course_code})</h4>
                <span className={`status-badge large ${selectedCourse.status.toLowerCase()}`}>
                  {selectedCourse.status}
                </span>
              </div>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Faculty:</span>
                  <span className="detail-value">{getFacultyName(selectedCourse.faculty_id)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Institute:</span>
                  <span className="detail-value">{getInstituteName(selectedCourse.institute_id)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Credits:</span>
                  <span className="detail-value">{selectedCourse.credits}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{selectedCourse.duration}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{selectedCourse.description || 'No description available'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">{new Date(selectedCourse.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{new Date(selectedCourse.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalVisible && selectedCourse && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <p>Are you sure you want to delete course <strong>{selectedCourse.course_name}</strong>?</p>
            <p className="warning-text">This action cannot be undone and may affect enrolled students.</p>
            <div className="modal-actions">
              <button onClick={closeModal}>Cancel</button>
              <button onClick={handleDelete} className="btn-danger">
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}