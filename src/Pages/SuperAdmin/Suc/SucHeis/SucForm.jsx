import { useState, useEffect } from 'react';
import {
  Save,
  Building,
  MapPin,
  Phone,
  User,
  Calendar,
  GraduationCap,
} from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';
import config from '../../../../utils/config';
import PropTypes from 'prop-types';
import useLocationData from '../../../../Hooks/useLocationData';
import Dialog from '../../../../Components/Dialog';

function SucForm({ initialData, onSave, onCancel, modalType, closeModal }) {
  const [formData, setFormData] = useState({
    institution_uiid: initialData?.institution_uiid || '',
    institution_name: initialData?.institution_name || '',
    region: initialData?.region || 'Region IX (Zamboanga Peninsula)',
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
  const [heis, setHeis] = useState([]);
  const [loadingHeis, setLoadingHeis] = useState(false);
  const [uiidError, setUiidError] = useState('');
  const [locationError, setLocationError] = useState('');

  // Use the location hook
  const { regions, provinces, municipalities, loading: locationLoading, error: locationFetchError, getMunicipalityPostalCode } = useLocationData();


  // Fetch HEIs when component mounts
  useEffect(() => {
    fetchHeis();
  }, []);

  useEffect(() => {
    if (locationFetchError) {
      setLocationError(locationFetchError);
    }
  }, [locationFetchError]);

  const fetchHeis = async () => {
    setLoadingHeis(true);
    try {
      const response = await axios.get(`${config.API_URL}/heis?type=SUC`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setHeis(response.data);
    } catch (error) {
      console.error("Error fetching HEIs:", error);
      setUiidError("Failed to load institutions. Please try again.");
    } finally {
      setLoadingHeis(false);
    }
  };

  // Format HEIs for react-select
  const uiidOptions = heis.map((hei) => ({
    value: hei.uiid,
    label: `${hei.name} (${hei.uiid})`,
    name: hei.name,
    uiid: hei.uiid,
  }));

  // Format regions for react-select
  const regionOptions = regions.map((region) => ({
    value: region.name,
    label: region.name,
    id: region.id,
  }));

  // Format provinces for react-select, filtered by selected region
  const getProvinceOptions = () => {
    if (!formData.region) return [];
    const regionId = regions.find((r) => r.name === formData.region)?.id;
    if (!regionId) return [];
    return provinces
      .filter((province) => province.region_id === regionId)
      .map((province) => ({
        value: province.name,
        label: province.name,
        id: province.id,
      }));
  };

  // Format municipalities for react-select, filtered by selected province
  const getMunicipalityOptions = () => {
    if (!formData.province) return [];
    const provinceId = provinces.find((p) => p.name === formData.province)?.id;
    if (!provinceId) return [];
    return municipalities
      .filter((municipality) => municipality.province_id === provinceId)
      .map((municipality) => ({
        value: municipality.name,
        label: municipality.name,
      }));
  };

  const handleUiidChange = (selectedOption) => {
    setFormData({
      ...formData,
      institution_uiid: selectedOption ? selectedOption.value : '',
      institution_name: selectedOption ? selectedOption.name : '',
    });
    setUiidError('');
  };

  const handleRegionChange = (selectedOption) => {
    setFormData({
      ...formData,
      region: selectedOption ? selectedOption.value : '',
      province: '', // Reset province when region changes
      municipality: '', // Reset municipality when region changes
    });
  };

  const handleProvinceChange = (selectedOption) => {
    setFormData({
      ...formData,
      province: selectedOption ? selectedOption.value : '',
      municipality: '', // Reset municipality when province changes
    });
  };

  const handleMunicipalityChange = (selectedOption) => {
    const municipalityName = selectedOption ? selectedOption.value : '';
    const postalCode = selectedOption ? getMunicipalityPostalCode(municipalityName) : '';

    setFormData({
      ...formData,
      municipality: municipalityName,
      postal_code: postalCode,
    });
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.institution_uiid || !formData.institution_name || !formData.report_year) {
      alert('Please fill in all required fields (Institution UIID, Name, and Report Year)');
      setUiidError(formData.institution_uiid ? '' : 'Please select an institution UIID.');
      return;
    }
    onSave(formData);
  };

  // Custom select styles
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': { borderColor: '#3b82f6' },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : '',
      color: state.isSelected ? 'white' : '#374151',
    }),
  };

  return (
    <Dialog
      isOpen={true}
      onClose={closeModal}
      title={`${modalType === "add" ? "Add New" : "Edit"} - Region IX`}
      subtitle="SUC Institution Details"
      icon={GraduationCap}
      variant="default"
      size="xl"
    >
      <div className="space-y-6 max-h-[600px] overflow-y-auto px-2">
        {/* Error Messages */}
        {(uiidError || locationError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {uiidError || locationError}
          </div>
        )}

        {/* Basic Information */}
        <div className="w-full">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-600" />
            Basic Information
          </h4>
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select SUC HEI <span className="text-red-500"></span>
            </label>
            {loadingHeis ? (
              <div className="flex items-center justify-center p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600 mr-2"></div>
                <span className="text-sm text-gray-500">Loading institutions...</span>
              </div>
            ) : (
              <>
                <Select
                  options={uiidOptions}
                  value={uiidOptions.find((option) => option.value === formData.institution_uiid) || null}
                  onChange={handleUiidChange}
                  placeholder="Select an institution (e.g., Western Mindanao State University, Jose Rizal Memorial State University)"
                  isClearable
                  isSearchable
                  className={`text-sm ${uiidError ? "border-red-400" : ""}`}
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: uiidError ? "#ef4444" : base.borderColor,
                      "&:hover": { borderColor: uiidError ? "#ef4444" : "#3b82f6" },
                      borderRadius: "0.375rem",
                      padding: "0.25rem",
                      width: "100%",
                    }),
                  }}
                  aria-label="Select institution UIID"
                />
                {uiidError && <p className="mt-1 text-sm text-red-500">{uiidError}</p>}
              </>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year Established
              </label>
              <input
                type="text"
                value={formData.year_established}
                onChange={(e) => setFormData({ ...formData, year_established: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., 1957 (WMSU), 1965 (JRMSU)"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.report_year}
                onChange={(e) => setFormData({ ...formData, report_year: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., 2024"
                required
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="w-full">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Location Information - Zamboanga Peninsula
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              {locationLoading ? (
                <div className="flex items-center justify-center p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-gray-500">Loading regions...</span>
                </div>
              ) : (
                <Select
                  options={regionOptions}
                  value={regionOptions.find((option) => option.value === formData.region) || null}
                  onChange={handleRegionChange}
                  placeholder="Select region..."
                  isClearable
                  isSearchable
                  className="text-sm"
                  classNamePrefix="select"
                  styles={{
                    ...customSelectStyles,
                    control: (base) => ({
                      ...base,
                      width: "100%",
                    }),
                  }}
                  aria-label="Select region"
                />
              )}
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              {locationLoading ? (
                <div className="flex items-center justify-center p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-gray-500">Loading provinces...</span>
                </div>
              ) : (
                <Select
                  options={getProvinceOptions()}
                  value={getProvinceOptions().find((option) => option.value === formData.province) || null}
                  onChange={handleProvinceChange}
                  placeholder="Select province..."
                  isClearable
                  isSearchable
                  isDisabled={!formData.region}
                  className="text-sm"
                  classNamePrefix="select"
                  styles={{
                    ...customSelectStyles,
                    control: (base) => ({
                      ...base,
                      width: "100%",
                    }),
                  }}
                  aria-label="Select province"
                />
              )}
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Municipality/City</label>
              {locationLoading ? (
                <div className="flex items-center justify-center p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-gray-500">Loading municipalities...</span>
                </div>
              ) : (
                <Select
                  options={getMunicipalityOptions()}
                  value={getMunicipalityOptions().find((option) => option.value === formData.municipality) || null}
                  onChange={handleMunicipalityChange}
                  placeholder={formData.province ? "Select municipality/city..." : "Select province first"}
                  isClearable
                  isSearchable
                  isDisabled={!formData.province}
                  className="text-sm"
                  classNamePrefix="select"
                  styles={{
                    ...customSelectStyles,
                    control: (base) => ({
                      ...base,
                      width: "100%",
                    }),
                  }}
                  aria-label="Select municipality"
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 w-full">
            <div className="md:col-span-3 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                value={formData.address_street}
                onChange={(e) => setFormData({ ...formData, address_street: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., Normal Road, Baliwasan (WMSU), Dapitan City (JRMSU)"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., 7000 (Zamboanga City), 8207 (Dapitan City)"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="w-full">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-blue-600" />
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Institutional Telephone</label>
              <input
                type="text"
                value={formData.institutional_telephone}
                onChange={(e) => setFormData({ ...formData, institutional_telephone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., +63-62-991-8888 (Zamboanga area code)"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Institutional Fax</label>
              <input
                type="text"
                value={formData.institutional_fax}
                onChange={(e) => setFormData({ ...formData, institutional_fax: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., +63-62-991-8889"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.institutional_email}
                onChange={(e) => setFormData({ ...formData, institutional_email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., info@wmsu.edu.ph, registrar@jrmsu.edu.ph"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={formData.institutional_website}
                onChange={(e) => setFormData({ ...formData, institutional_website: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., https://wmsu.edu.ph, https://jrmsu.edu.ph"
              />
            </div>
          </div>
        </div>

        {/* Leadership Information */}
        <div className="w-full">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Leadership Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Head Name</label>
              <input
                type="text"
                value={formData.head_name}
                onChange={(e) => setFormData({ ...formData, head_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., Dr. Grace J. Rebollos, Dr. Majahar B. Abubakar"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.head_title}
                onChange={(e) => setFormData({ ...formData, head_title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., University President, SUC President"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Educational Background</label>
              <input
                type="text"
                value={formData.head_education}
                onChange={(e) => setFormData({ ...formData, head_education: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., PhD in Education, Doctor of Education"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Direct Telephone</label>
              <input
                type="text"
                value={formData.head_telephone}
                onChange={(e) => setFormData({ ...formData, head_telephone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., +63-62-991-8800 (President's Office)"
              />
            </div>
          </div>
        </div>

        {/* Legal & Historical Information */}
        <div className="w-full">
          <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Legal & Historical Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">SEC Registration</label>
              <input
                type="text"
                value={formData.sec_registration}
                onChange={(e) => setFormData({ ...formData, sec_registration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., SUC-WMSU-001, SUC-JRMSU-001"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year Granted/Approved</label>
              <input
                type="text"
                value={formData.year_granted_approved}
                onChange={(e) => setFormData({ ...formData, year_granted_approved: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., 1957 (WMSU charter), 1965 (JRMSU charter)"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year Converted to College</label>
              <input
                type="text"
                value={formData.year_converted_college}
                onChange={(e) => setFormData({ ...formData, year_converted_college: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="Leave blank if not applicable"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year Converted to University</label>
              <input
                type="text"
                value={formData.year_converted_university}
                onChange={(e) => setFormData({ ...formData, year_converted_university: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-600"
                placeholder="e.g., 1957 (WMSU), 1990s (JRMSU)"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t bg-gray-50 -mx-2 px-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Save Region IX SUC
          </button>
        </div>
      </div>
    </Dialog>
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
  modalType: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default SucForm;
