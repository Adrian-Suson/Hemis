import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Save,
  X,
  Building,
  MapPin,
  Phone,
  User,
  Calendar,
  School,
  Mail,
} from 'lucide-react';
import PropTypes from 'prop-types'; // Import PropTypes

function LucHeiManagement() {
  const [lucData, setLucData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add' or 'edit'
  const [currentRecord, setCurrentRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with API calls
  useEffect(() => {
    setLucData([
      {
        id: 1,
        institution_uiid: 'LUC-001',
        institution_name: 'University of Makati',
        region: 'NCR',
        province: 'Metro Manila',
        municipality: 'Makati City',
        address_street: 'J.P. Rizal Extension',
        postal_code: '1215',
        institutional_telephone: '+63-2-8883-1863',
        institutional_fax: '+63-2-8883-1864',
        institutional_email: 'info@umak.edu.ph',
        institutional_website: 'https://umak.edu.ph',
        year_established: 1972,
        report_year: 2024,
        head_name: 'Dr. Tomas D. Fontanilla',
        head_title: 'President',
        head_education: 'PhD in Business Administration',
        head_telephone: '+63-2-8883-1865',
        sec_registration: 'SEC-UMAK-001',
        year_granted_approved: 1972,
        year_converted_college: 1982,
        year_converted_university: 1995
      },
      {
        id: 2,
        institution_uiid: 'LUC-002',
        institution_name: 'Pamantasan ng Lungsod ng Maynila',
        region: 'NCR',
        province: 'Metro Manila',
        municipality: 'Manila',
        address_street: 'General Luna Street, Intramuros',
        postal_code: '1002',
        institutional_telephone: '+63-2-8643-2500',
        institutional_email: 'info@plm.edu.ph',
        institutional_website: 'https://plm.edu.ph',
        year_established: 1965,
        report_year: 2024,
        head_name: 'Dr. Emmanuel de Guzman',
        head_title: 'President',
        head_education: 'PhD in Public Administration',
        head_telephone: '+63-2-8643-2501',
        sec_registration: 'SEC-PLM-001',
        year_granted_approved: 1965,
        year_converted_college: 1967,
        year_converted_university: 1977
      },
      {
        id: 3,
        institution_uiid: 'LUC-003',
        institution_name: 'Pamantasan ng Lungsod ng Pasig',
        region: 'NCR',
        province: 'Metro Manila',
        municipality: 'Pasig City',
        address_street: 'Nagpayong Complex, C. Raymundo Avenue',
        postal_code: '1600',
        institutional_telephone: '+63-2-8641-5661',
        institutional_email: 'info@plpasig.edu.ph',
        institutional_website: 'https://plpasig.edu.ph',
        year_established: 1999,
        report_year: 2024,
        head_name: 'Dr. Carmelita Divinagracia',
        head_title: 'President',
        head_education: 'PhD in Education',
        head_telephone: '+63-2-8641-5662',
        sec_registration: 'SEC-PLP-001',
        year_granted_approved: 1999,
        year_converted_college: 2001,
        year_converted_university: 2010
      }
    ]);
  }, []);

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

  const handleSave = (formData) => {
    if (modalType === 'add') {
      const newLuc = { ...formData, id: Date.now() };
      setLucData([...lucData, newLuc]);
    } else {
      setLucData(lucData.map(item => item.id === currentRecord.id ? { ...item, ...formData } : item));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this LUC record?')) {
      setLucData(lucData.filter(item => item.id !== id));
    }
  };

  const filteredData = lucData.filter(item =>
    item.institution_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.head_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.municipality?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-2">
            <School className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Local Universities and Colleges Management</h1>
          </div>
          <p className="text-gray-600">Comprehensive management system for Local Universities and Colleges (LUC) in the Philippines</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {/* Filters and Actions */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by institution name, head, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  Total LUCs: <span className="font-semibold ml-1">{filteredData.length}</span>
                </div>
              </div>
              <button
                onClick={() => openModal('add')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New LUC
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leadership</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Established</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((luc) => (
                  <tr key={luc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{luc.institution_name}</div>
                          <div className="text-sm text-gray-500">{luc.institution_uiid}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{luc.municipality}, {luc.province}</div>
                      <div className="text-sm text-gray-500">{luc.region}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{luc.head_name}</div>
                      <div className="text-sm text-gray-500">{luc.head_title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {luc.institutional_telephone}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {luc.institutional_email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{luc.year_established}</div>
                      {luc.year_converted_university && (
                        <div className="text-sm text-gray-500">Univ: {luc.year_converted_university}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openModal('edit', luc)}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Edit LUC"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(luc.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete LUC"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <School className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No LUCs found</p>
                        <p className="text-sm">Try adjusting your search terms or add a new LUC.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
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
