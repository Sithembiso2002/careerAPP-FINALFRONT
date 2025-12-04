// frontend/src/pages/ApplicationsManagement.jsx
import React, { useState, useEffect } from "react";
import '../assets/css/admin.css';
import '../assets/css/adminhome.css';
import API from "../api";
import { 
  Search, 
  Download, 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Mail,
  Phone,
  School,
  BookOpen,
  Users,
  Calendar,
  Send,
  AlertCircle,
  RefreshCw  // ADD THIS - this is the correct refresh icon
} from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';


export default function ApplicationsManagement() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [instituteFilter, setInstituteFilter] = useState("all");
  const [publishing, setPublishing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    under_review: 0,
    admitted: 0,
    rejected: 0,
    waitlisted: 0
  });

  // Sample institutes data - you can replace with API call
  const institutes = [
    { id: 1, name: "National University of Lesotho" },
    { id: 2, name: "Limkokwing University" },
    { id: 3, name: "Lerotholi Polytechnic" },
    { id: 4, name: "Botho University" }
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter, instituteFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // FIXED: Added /api to the endpoint
      const response = await API.get('/api/admin/applications');
      const apps = response.data.applications;
      setApplications(apps);
      calculateStats(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Failed to fetch applications. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (apps) => {
    const stats = {
      total: apps.length,
      pending: apps.filter(app => app.status === 'pending').length,
      under_review: apps.filter(app => app.status === 'under_review').length,
      admitted: apps.filter(app => app.status === 'admitted').length,
      rejected: apps.filter(app => app.status === 'rejected').length,
      waitlisted: apps.filter(app => app.status === 'waitlisted').length
    };
    setStats(stats);
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Institute filter
    if (instituteFilter !== "all") {
      filtered = filtered.filter(app => app.institution_id === parseInt(instituteFilter));
    }

    setFilteredApplications(filtered);
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      // FIXED: Added /api to the endpoint
      await API.patch(`/api/admin/applications/${applicationId}/status`, { status: newStatus });
      // Update local state
      const updatedApps = applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      );
      setApplications(updatedApps);
      calculateStats(updatedApps);
      
      alert(`Application status updated to ${newStatus.replace('_', ' ')}`);
      setStatusModalVisible(false);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const publishAdmissions = async () => {
    setPublishing(true);
    try {
      // Get all admitted and waitlisted applications
      const admittedApps = applications.filter(app => app.status === 'admitted');
      const waitlistedApps = applications.filter(app => app.status === 'waitlisted');
      
      const totalToPublish = admittedApps.length + waitlistedApps.length;
      
      if (totalToPublish === 0) {
        alert('No admitted or waitlisted applications to publish.');
        setPublishModalVisible(false);
        return;
      }

      // Here you would typically call your backend API to publish admissions
      // For now, we'll simulate the process
      console.log('Publishing admissions for:', {
        admitted: admittedApps.length,
        waitlisted: waitlistedApps.length,
        total: totalToPublish
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would call:
      // await API.post('/api/admin/publish-admissions', {
      //   admitted: admittedApps.map(app => app.id),
      //   waitlisted: waitlistedApps.map(app => app.id)
      // });

      alert(`Successfully published ${totalToPublish} admissions!\n\nAdmitted: ${admittedApps.length}\nWaitlisted: ${waitlistedApps.length}`);
      setPublishModalVisible(false);
      
    } catch (error) {
      console.error('Error publishing admissions:', error);
      alert('Failed to publish admissions');
    } finally {
      setPublishing(false);
    }
  };

  const viewApplicationDetails = (application) => {
    setSelectedApp(application);
    setDetailModalVisible(true);
  };

  const openStatusModal = (application) => {
    setSelectedApp(application);
    setStatusModalVisible(true);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock, label: "Pending" },
      under_review: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Eye, label: "Under Review" },
      admitted: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle, label: "Admitted" },
      rejected: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle, label: "Rejected" },
      waitlisted: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: Clock, label: "Waitlisted" }
    };
    return configs[status] || configs.pending;
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Institute", "Course", "Status", "Applied Date"];
    const csvData = filteredApplications.map(app => [
      `${app.first_name} ${app.last_name}`,
      app.email,
      app.phone,
      app.institution_name || "N/A",
      app.course_name,
      app.status,
      new Date(app.submitted_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const StatusBadge = ({ status }) => {
    const config = getStatusConfig(status);
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <IconComponent className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const StatCard = ({ title, value, color, icon: Icon }) => (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );

  // Get admitted and waitlisted counts for the publish button
  const admittedCount = applications.filter(app => app.status === 'admitted').length;
  const waitlistedCount = applications.filter(app => app.status === 'waitlisted').length;
  const canPublish = admittedCount > 0 || waitlistedCount > 0;

  // Test the API connection on component mount
  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await API.get('/api/applications/health');
        console.log('API Health Check:', response.data);
      } catch (error) {
        console.error('API Health Check Failed:', error);
        alert('Cannot connect to server. Please make sure the backend is running on localhost:5000');
      }
    };
    testAPI();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
              <p className="text-gray-600 mt-2">Manage and review student applications</p>
            </div>
            
            <div className="flex space-x-3">
              {/* Refresh Button - FIXED: Using RefreshCw */}
              <button
                onClick={fetchApplications}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" /> {/* CHANGED: Refresh to RefreshCw */}
                Refresh
              </button>
              
              {/* Publish Admissions Button */}
              <button
                onClick={() => setPublishModalVisible(true)}
                disabled={!canPublish}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  canPublish
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5 mr-2" />
                Publish Admissions
                {(admittedCount > 0 || waitlistedCount > 0) && (
                  <span className="ml-2 bg-white text-green-600 px-2 py-1 rounded-full text-xs font-bold">
                    {admittedCount + waitlistedCount}
                  </span>
                )}
              </button>

              {/* Add this with the other buttons in the header section */}
                <Link
                  to="/view-admissions"
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View Admissions
                </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <StatCard title="Total Applications" value={stats.total} color="border-l-4 border-l-blue-500" icon={Users} />
          <StatCard title="Pending" value={stats.pending} color="border-l-4 border-l-yellow-500" icon={Clock} />
          <StatCard title="Under Review" value={stats.under_review} color="border-l-4 border-l-blue-500" icon={Eye} />
          <StatCard title="Admitted" value={stats.admitted} color="border-l-4 border-l-green-500" icon={CheckCircle} />
          <StatCard title="Waitlisted" value={stats.waitlisted} color="border-l-4 border-l-purple-500" icon={Clock} />
          <StatCard title="Rejected" value={stats.rejected} color="border-l-4 border-l-red-500" icon={XCircle} />
        </div>

        {/* Rest of your component remains the same... */}
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="admitted">Admitted</option>
                <option value="waitlisted">Waitlisted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Institute Filter */}
            <div>
              <select
                value={instituteFilter}
                onChange={(e) => setInstituteFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Institutes</option>
                {institutes.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institute & Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.first_name} {application.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.highest_qualification}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {application.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {application.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <School className="w-4 h-4 mr-2 text-gray-400" />
                        {application.institution_name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                        {application.course_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(application.submitted_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => viewApplicationDetails(application)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => openStatusModal(application)}
                        className="text-green-600 hover:text-green-900 flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {applications.length === 0 ? "No applications have been submitted yet." : "Try changing your filters."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* The rest of your modals remain exactly the same */}
      {/* Publish Admissions Modal */}
      {publishModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Publish Admissions</h3>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  This will publish admission results for all selected applications. Students will be notified of their admission status.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700 font-medium">Admitted Students</span>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {admittedCount}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-700 font-medium">Waitlisted Students</span>
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {waitlistedCount}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-t">
                  <span className="text-blue-700 font-medium">Total to Publish</span>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {admittedCount + waitlistedCount}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setPublishModalVisible(false)}
                  disabled={publishing}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={publishAdmissions}
                  disabled={publishing || (admittedCount === 0 && waitlistedCount === 0)}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {publishing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Publish Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {detailModalVisible && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Application Details</h3>
                <button
                  onClick={() => setDetailModalVisible(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-lg text-blue-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium">{selectedApp.first_name} {selectedApp.last_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date of Birth:</span>
                        <span className="font-medium">{selectedApp.date_of_birth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium">{selectedApp.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nationality:</span>
                        <span className="font-medium">{selectedApp.nationality}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-lg text-green-900 mb-4 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedApp.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedApp.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic & Institute Information */}
                <div className="space-y-6">
                  {/* Academic Information */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-lg text-purple-900 mb-4 flex items-center">
                      <School className="w-5 h-5 mr-2" />
                      Academic Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">High School:</span>
                        <span className="font-medium">{selectedApp.high_school_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Qualification:</span>
                        <span className="font-medium">{selectedApp.highest_qualification}</span>
                      </div>
                    </div>
                  </div>

                  {/* Institute Selection */}
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-lg text-orange-900 mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Institute Selection
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Institution:</span>
                        <span className="font-medium">{selectedApp.institution_name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Faculty:</span>
                        <span className="font-medium">{selectedApp.faculty_name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Course:</span>
                        <span className="font-medium">{selectedApp.course_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-lg text-red-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Guardian Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedApp.guardian_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Relationship:</span>
                        <span className="font-medium">{selectedApp.guardian_relationship}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedApp.guardian_phone}</span>
                      </div>
                      {selectedApp.guardian_occupation && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Occupation:</span>
                          <span className="font-medium">{selectedApp.guardian_occupation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => openStatusModal(selectedApp)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setDetailModalVisible(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {statusModalVisible && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Update Application Status</h3>
              <p className="text-gray-600 mb-6">
                Update status for <strong>{selectedApp.first_name} {selectedApp.last_name}</strong>
              </p>
              
              <div className="space-y-3">
                {['pending', 'under_review', 'admitted', 'waitlisted', 'rejected'].map((status) => {
                  const config = getStatusConfig(status);
                  const IconComponent = config.icon;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedApp.id, status)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        selectedApp.status === status 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <IconComponent className={`w-5 h-5 mr-3 ${config.color.split(' ')[2]}`} />
                        <span className="font-medium">{config.label}</span>
                      </div>
                      {selectedApp.status === status && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setStatusModalVisible(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}