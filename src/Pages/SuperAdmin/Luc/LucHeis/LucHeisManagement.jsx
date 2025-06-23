import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Search,
  Save,
  X,
  Building,
  MapPin,
  Phone,
  User,
  Calendar,
  School,
  Upload,
  RefreshCw,
} from 'lucide-react';
import PropTypes from 'prop-types'; // Import PropTypes
import config from '../../../../utils/config';
import LucDataTable from './LucDataTable';
import LucUploadDialog from './LucUploadDialog';

function LucHeiManagement() {
  const [lucData, setLucData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add' or 'edit'
  const [currentRecord, setCurrentRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReportYear, setSelectedReportYear] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    fetchLucData();
    fetchClusters();
  }, []);

  const fetchLucData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${config.API_URL}/luc-details`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });
      setLucData(response.data);
    } catch {
      setError('Failed to load LUC data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchClusters = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/clusters`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });
      setClusters(response.data);
    } catch{
      setError('Failed to load clusters. Please try again.');
    }
  };

  const openModal = (type, record = null) => {
    setModalType(type);
    setCurrentRecord(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRecord(null);
    setModalType('');
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleSave = async (formData) => {
    if (modalType === 'add') {
      await createLucDetail(formData);
    } else {
      await updateLucDetail(currentRecord.id, formData);
    }
    closeModal();
    fetchLucData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this LUC record?')) {
      await deleteLucDetail(id);
      fetchLucData();
    }
  };

  const handleDataImported = () => {
    setIsUploadModalOpen(false);
    setSearchTerm('');
    setSelectedReportYear(null);
    fetchLucData();
  };

  const handleRefresh = () => {
    fetchLucData();
  };

  const filteredData = lucData.filter(
    (item) =>
      (item.institution_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.head_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.municipality?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedReportYear === null || String(item.report_year) === String(selectedReportYear)) &&
      (selectedCluster === null || String(item.cluster_id) === String(selectedCluster))
  );

  // Implement API POST for LUC
  const createLucDetail = async (formData) => {
    try {
      await axios.post(`${config.API_URL}/luc-details`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
    } catch (error) {
      setError('Failed to create LUC record.');
      throw error;
    }
  };

  // Implement API PUT for LUC
  const updateLucDetail = async (id, formData) => {
    try {
      await axios.put(`${config.API_URL}/luc-details/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
    } catch (error) {
      setError('Failed to update LUC record.');
      throw error;
    }
  };

  // Implement API DELETE for LUC
  const deleteLucDetail = async (id) => {
    try {
      await axios.delete(`${config.API_URL}/luc-details/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });
    } catch (error) {
      setError('Failed to delete LUC record.');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading LUC data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-2">
            <School className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Local Universities and Colleges Management
            </h1>
          </div>
          <p className="text-gray-600">
            Comprehensive management system for Local Universities and Colleges (LUC) in the Philippines
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg border bg-red-50 border-red-200 text-red-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <X className="w-5 h-5 mr-2" />
                <span className="font-medium">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          {/* Filters and Actions */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search institutions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>

                {/* Report Year Filter */}
                <div className="flex items-center gap-2">
                  <label htmlFor="reportYear" className="text-sm text-gray-600">Year:</label>
                  <select
                    id="reportYear"
                    value={selectedReportYear || ""}
                    onChange={(e) => setSelectedReportYear(e.target.value === "" ? null : Number(e.target.value))}
                    className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    <option value="">All</option>
                    {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Cluster Filter */}
                <div className="flex items-center gap-2">
                  <label htmlFor="cluster" className="text-sm text-gray-600">Cluster:</label>
                  <select
                    id="cluster"
                    value={selectedCluster || ""}
                    onChange={(e) => setSelectedCluster(e.target.value === "" ? null : e.target.value)}
                    className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    <option value="">All</option>
                    {clusters.map((cluster) => (
                      <option key={cluster.id} value={cluster.id}>
                        {cluster.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-sm text-gray-500">
                  Total: <span className="font-semibold">{filteredData.length}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="p-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>

                {/* Upload Excel Button */}
                <button
                  onClick={openUploadModal}
                  className="flex items-center px-3 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload
                </button>

                <button
                  onClick={() => openModal('add')}
                  className="flex items-center px-3 py-2 border border-transparent text-sm rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add LUC
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <LucDataTable
            data={filteredData}
            onEdit={(record) => openModal('edit', record)}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Upload Modal */}
      <LucUploadDialog
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        onUploadSuccess={handleDataImported}
      />

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-5xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <School className="w-5 h-5 mr-2" />
                {modalType === 'add' ? 'Add New' : 'Edit'} Local University/College
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <LucForm
              initialData={currentRecord}
              onSave={handleSave}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// LUC Form Component
function LucForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    institution_uiid: initialData?.institution_uiid || '',
    institution_name: initialData?.institution_name || '',
    region: initialData?.region || '',
    province: initialData?.province || '',
    municipality: initialData?.municipality || '',
    address_street: initialData?.address_street || '',
    postal_code: initialData?.postal_code || '',
    institutional_telephone: initialData?.institutional_telephone || '',
    institutional_fax: initialData?.institutional_fax || '',
    head_telephone: initialData?.head_telephone || '',
    institutional_email: initialData?.institutional_email || '',
    institutional_website: initialData?.institutional_website || '',
    year_established: initialData?.year_established || '',
    report_year: initialData?.report_year || new Date().getFullYear(),
    head_name: initialData?.head_name || '',
    head_title: initialData?.head_title || '',
    head_education: initialData?.head_education || '',
    sec_registration: initialData?.sec_registration || '',
    year_granted_approved: initialData?.year_granted_approved || '',
    year_converted_college: initialData?.year_converted_college || '',
    year_converted_university: initialData?.year_converted_university || ''
  });

  const handleSubmit = () => {
    // Basic validation
    if (!formData.institution_uiid || !formData.institution_name || !formData.report_year) {
      alert('Please fill in all required fields (Institution UIID, Name, and Report Year)');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="space-y-6 max-h-96 overflow-y-auto">
      {/* Basic Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <Building className="w-5 h-5 mr-2" />
          Basic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institution UIID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.institution_uiid}
              onChange={(e) => setFormData({...formData, institution_uiid: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., LUC-001"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Established
            </label>
            <input
              type="number"
              value={formData.year_established}
              onChange={(e) => setFormData({...formData, year_established: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., 1972"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.report_year}
              onChange={(e) => setFormData({...formData, report_year: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.institution_name}
            onChange={(e) => setFormData({...formData, institution_name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., University of Makati"
            required
          />
        </div>
      </div>

      {/* Location Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Location Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., NCR"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <input
              type="text"
              value={formData.province}
              onChange={(e) => setFormData({...formData, province: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Metro Manila"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Municipality/City</label>
            <input
              type="text"
              value={formData.municipality}
              onChange={(e) => setFormData({...formData, municipality: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Makati City"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input
              type="text"
              value={formData.address_street}
              onChange={(e) => setFormData({...formData, address_street: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., J.P. Rizal Extension"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input
              type="text"
              value={formData.postal_code}
              onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., 1215"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <Phone className="w-5 h-5 mr-2" />
          Contact Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institutional Telephone</label>
            <input
              type="text"
              value={formData.institutional_telephone}
              onChange={(e) => setFormData({...formData, institutional_telephone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., +63-2-8883-1863"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institutional Fax</label>
            <input
              type="text"
              value={formData.institutional_fax}
              onChange={(e) => setFormData({...formData, institutional_fax: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., +63-2-8883-1864"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.institutional_email}
              onChange={(e) => setFormData({...formData, institutional_email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., info@university.edu.ph"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={formData.institutional_website}
              onChange={(e) => setFormData({...formData, institutional_website: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., https://university.edu.ph"
            />
          </div>
        </div>
      </div>

      {/* Leadership Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Leadership Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Head Name</label>
            <input
              type="text"
              value={formData.head_name}
              onChange={(e) => setFormData({...formData, head_name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Dr. Tomas D. Fontanilla"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.head_title}
              onChange={(e) => setFormData({...formData, head_title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., President, Chancellor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Educational Background</label>
            <input
              type="text"
              value={formData.head_education}
              onChange={(e) => setFormData({...formData, head_education: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., PhD in Business Administration"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Direct Telephone</label>
            <input
              type="text"
              value={formData.head_telephone}
              onChange={(e) => setFormData({...formData, head_telephone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., +63-2-8883-1865"
            />
          </div>
        </div>
      </div>

      {/* Legal & Historical Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Legal & Historical Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Local Government Registration</label>
            <input
              type="text"
              value={formData.sec_registration}
              onChange={(e) => setFormData({...formData, sec_registration: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., LGU-UMAK-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year Granted/Approved</label>
            <input
              type="number"
              value={formData.year_granted_approved}
              onChange={(e) => setFormData({...formData, year_granted_approved: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., 1972"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year Converted to College</label>
            <input
              type="number"
              value={formData.year_converted_college}
              onChange={(e) => setFormData({...formData, year_converted_college: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Leave blank if not applicable"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year Converted to University</label>
            <input
              type="number"
              value={formData.year_converted_university}
              onChange={(e) => setFormData({...formData, year_converted_university: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Leave blank if still a college"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t bg-gray-50 -mx-5 px-5">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2 inline" />
          Save LUC
        </button>
      </div>
    </div>
  );
}

LucForm.propTypes = {
  initialData: PropTypes.shape({
    institution_uiid: PropTypes.string,
    institution_name: PropTypes.string,
    region: PropTypes.string,
    province: PropTypes.string,
    municipality: PropTypes.string,
    address_street: PropTypes.string,
    postal_code: PropTypes.string,
    institutional_telephone: PropTypes.string,
    institutional_fax: PropTypes.string,
    head_telephone: PropTypes.string,
    institutional_email: PropTypes.string,
    institutional_website: PropTypes.string,
    year_established: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    report_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    head_name: PropTypes.string,
    head_title: PropTypes.string,
    head_education: PropTypes.string,
    sec_registration: PropTypes.string,
    year_granted_approved: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    year_converted_college: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    year_converted_university: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default LucHeiManagement;
