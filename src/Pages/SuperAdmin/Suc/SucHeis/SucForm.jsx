import { useState } from 'react';
import {
  Save,
  Building,
  MapPin,
  Phone,
  User,
  Calendar,
} from 'lucide-react';
import PropTypes from 'prop-types';

function SucForm({ initialData, onSave, onCancel }) {
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., SUC-001"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 1908"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., University of the Philippines"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., NCR"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <input
              type="text"
              value={formData.province}
              onChange={(e) => setFormData({...formData, province: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Metro Manila"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Municipality/City</label>
            <input
              type="text"
              value={formData.municipality}
              onChange={(e) => setFormData({...formData, municipality: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Quezon City"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Diliman"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input
              type="text"
              value={formData.postal_code}
              onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 1101"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., +63-2-8981-8500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institutional Fax</label>
            <input
              type="text"
              value={formData.institutional_fax}
              onChange={(e) => setFormData({...formData, institutional_fax: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., +63-2-8981-8501"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.institutional_email}
              onChange={(e) => setFormData({...formData, institutional_email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., info@university.edu.ph"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={formData.institutional_website}
              onChange={(e) => setFormData({...formData, institutional_website: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Dr. Angelo A. Jimenez"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.head_title}
              onChange={(e) => setFormData({...formData, head_title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., President, Chancellor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Educational Background</label>
            <input
              type="text"
              value={formData.head_education}
              onChange={(e) => setFormData({...formData, head_education: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., PhD in Economics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Direct Telephone</label>
            <input
              type="text"
              value={formData.head_telephone}
              onChange={(e) => setFormData({...formData, head_telephone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., +63-2-8981-8502"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">SEC Registration</label>
            <input
              type="text"
              value={formData.sec_registration}
              onChange={(e) => setFormData({...formData, sec_registration: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., SEC-UP-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year Granted/Approved</label>
            <input
              type="number"
              value={formData.year_granted_approved}
              onChange={(e) => setFormData({...formData, year_granted_approved: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 1908"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year Converted to College</label>
            <input
              type="number"
              value={formData.year_converted_college}
              onChange={(e) => setFormData({...formData, year_converted_college: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Leave blank if not applicable"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year Converted to University</label>
            <input
              type="number"
              value={formData.year_converted_university}
              onChange={(e) => setFormData({...formData, year_converted_university: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2 inline" />
          Save SUC
        </button>
      </div>
    </div>
  );
}

SucForm.propTypes = {
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

export default SucForm;