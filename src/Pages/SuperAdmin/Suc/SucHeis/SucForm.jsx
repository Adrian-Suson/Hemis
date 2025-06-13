import { useState, useEffect } from 'react';
import {
  Save,
  Building,
  MapPin,
  Phone,
  User,
  Calendar,
  GraduationCap,
  Globe,
  Award,
  FileText,
  Plus,
  Edit,
} from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';
import config from '../../../../utils/config';
import PropTypes from 'prop-types';
import useLocationData from '../../../../Hooks/useLocationData';
import Dialog from '../../../../Components/Dialog';

function SucForm({ initialData, onSave, onCancel, modalType, loading = false }) {
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
  const [errors, setErrors] = useState({});

  // Use the location hook
  const { regions, provinces, municipalities, loading: locationLoading, error: locationFetchError, getMunicipalityPostalCode } = useLocationData();

  // Fetch HEIs when component mounts
  useEffect(() => {
    fetchHeis();
  }, []);

  const fetchHeis = async () => {
    setLoadingHeis(true);
    try {
      const response = await axios.get(`${config.API_URL}/heis?type=SUC`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Ensure we're setting an array
      const heisData = Array.isArray(response.data) ? response.data :
                      response.data.data ? response.data.data :
                      response.data.heis ? response.data.heis : [];
      setHeis(heisData);
    } catch (error) {
      console.error("Error fetching HEIs:", error);
      setErrors(prev => ({ ...prev, heis: "Failed to load institutions. Please try again." }));
      setHeis([]); // Set empty array on error
    } finally {
      setLoadingHeis(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.institution_uiid.trim()) {
      newErrors.institution_uiid = "Institution UIID is required";
    }
    if (!formData.institution_name.trim()) {
      newErrors.institution_name = "Institution name is required";
    }
    if (!formData.report_year) {
      newErrors.report_year = "Report year is required";
    }

    // Email validation
    if (formData.institutional_email && !/\S+@\S+\.\S+/.test(formData.institutional_email)) {
      newErrors.institutional_email = "Please enter a valid email address";
    }

    // Website validation
    if (formData.institutional_website && !formData.institutional_website.startsWith('http')) {
      newErrors.institutional_website = "Website must start with http:// or https://";
    }

    // Year validations
    const currentYear = new Date().getFullYear();
    if (formData.year_established && (isNaN(formData.year_established) || formData.year_established < 1800 || formData.year_established > currentYear)) {
      newErrors.year_established = "Please enter a valid year";
    }
    if (formData.report_year && (isNaN(formData.report_year) || formData.report_year < 1800 || formData.report_year > currentYear + 1)) {
      newErrors.report_year = "Please enter a valid report year";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format HEIs for react-select
  const uiidOptions = Array.isArray(heis) ? heis.map((hei) => ({
    value: hei.uiid,
    label: `${hei.name} (${hei.uiid})`,
    name: hei.name,
    uiid: hei.uiid,
  })) : [];

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
    handleInputChange('institution_uiid', selectedOption ? selectedOption.value : '');
    handleInputChange('institution_name', selectedOption ? selectedOption.name : '');
  };

  const handleRegionChange = (selectedOption) => {
    setFormData({
      ...formData,
      region: selectedOption ? selectedOption.value : '',
      province: '', // Reset province when region changes
      municipality: '', // Reset municipality when region changes
      postal_code: '', // Reset postal code
    });
  };

  const handleProvinceChange = (selectedOption) => {
    setFormData({
      ...formData,
      province: selectedOption ? selectedOption.value : '',
      municipality: '', // Reset municipality when province changes
      postal_code: '', // Reset postal code
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
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setErrors({});
    onCancel();
  };

  // Custom select styles to match the campus forms
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': { borderColor: '#3b82f6' },
      borderRadius: '0.5rem',
      padding: '0.125rem',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : '',
      color: state.isSelected ? 'white' : '#374151',
    }),
  };

  const isEdit = modalType === "edit";

  return (
    <Dialog
      isOpen={true}
      onClose={handleClose}
      title={`${isEdit ? "Edit" : "Add New"} SUC Institution`}
      subtitle="State University & College Details - Region IX"
      icon={isEdit ? Edit : Plus}
      variant="default"
      size="xl"
    >
      <div className="space-y-4 p-4">
        {/* Error Messages */}
        {(errors.heis || locationFetchError) && (
          <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-800 rounded-xl shadow-sm">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              {errors.heis || locationFetchError}
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200/60 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
              <Building className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select SUC Institution <span className="text-red-500">*</span>
              </label>
              {loadingHeis ? (
                <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-gray-500">Loading institutions...</span>
                </div>
              ) : (
                <>
                  <Select
                    options={uiidOptions}
                    value={uiidOptions.find((option) => option.value === formData.institution_uiid) || null}
                    onChange={handleUiidChange}
                    placeholder="Select an institution (e.g., Western Mindanao State University)"
                    isClearable
                    isSearchable
                    className={`text-sm ${errors.institution_uiid ? "border-red-400" : ""}`}
                    classNamePrefix="select"
                    styles={{
                      ...customSelectStyles,
                      control: (base) => ({
                        ...base,
                        borderColor: errors.institution_uiid ? "#ef4444" : base.borderColor,
                        "&:hover": { borderColor: errors.institution_uiid ? "#ef4444" : "#3b82f6" },
                      }),
                    }}
                  />
                  {errors.institution_uiid && <p className="text-red-500 text-xs mt-1">{errors.institution_uiid}</p>}
                </>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year Established
                </label>
                <input
                  type="number"
                  value={formData.year_established}
                  onChange={(e) => handleInputChange("year_established", e.target.value)}
                  placeholder="e.g., 1957"
                  min="1800"
                  max={new Date().getFullYear()}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.year_established ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.year_established && <p className="text-red-500 text-xs mt-1">{errors.year_established}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.report_year}
                  onChange={(e) => handleInputChange("report_year", e.target.value)}
                  placeholder="e.g., 2024"
                  min="1800"
                  max={new Date().getFullYear() + 1}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.report_year ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.report_year && <p className="text-red-500 text-xs mt-1">{errors.report_year}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Location & Contact Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Location Information */}
          <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-xl p-4 border border-emerald-200/60 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-emerald-500 rounded-lg shadow-sm">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Location</h3>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                  {locationLoading ? (
                    <div className="flex items-center justify-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-emerald-600 mr-2"></div>
                      <span className="text-xs text-gray-500">Loading...</span>
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
                      styles={customSelectStyles}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  <Select
                    options={getProvinceOptions()}
                    value={getProvinceOptions().find((option) => option.value === formData.province) || null}
                    onChange={handleProvinceChange}
                    placeholder="Select province..."
                    isClearable
                    isSearchable
                    isDisabled={!formData.region || locationLoading}
                    className="text-sm"
                    classNamePrefix="select"
                    styles={customSelectStyles}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Municipality/City</label>
                  <Select
                    options={getMunicipalityOptions()}
                    value={getMunicipalityOptions().find((option) => option.value === formData.municipality) || null}
                    onChange={handleMunicipalityChange}
                    placeholder="Select municipality..."
                    isClearable
                    isSearchable
                    isDisabled={!formData.province || locationLoading}
                    className="text-sm"
                    classNamePrefix="select"
                    styles={customSelectStyles}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address_street}
                  onChange={(e) => handleInputChange("address_street", e.target.value)}
                  placeholder="e.g., Normal Road, Baliwasan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange("postal_code", e.target.value)}
                  placeholder="e.g., 7000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-100 rounded-xl p-4 border border-purple-200/60 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Contact</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institutional Telephone</label>
                <input
                  type="text"
                  value={formData.institutional_telephone}
                  onChange={(e) => handleInputChange("institutional_telephone", e.target.value)}
                  placeholder="e.g., +63-62-991-8888"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institutional Fax</label>
                <input
                  type="text"
                  value={formData.institutional_fax}
                  onChange={(e) => handleInputChange("institutional_fax", e.target.value)}
                  placeholder="e.g., +63-62-991-8889"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.institutional_email}
                  onChange={(e) => handleInputChange("institutional_email", e.target.value)}
                  placeholder="e.g., info@wmsu.edu.ph"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                    errors.institutional_email ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.institutional_email && <p className="text-red-500 text-xs mt-1">{errors.institutional_email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  value={formData.institutional_website}
                  onChange={(e) => handleInputChange("institutional_website", e.target.value)}
                  placeholder="e.g., https://wmsu.edu.ph"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                    errors.institutional_website ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.institutional_website && <p className="text-red-500 text-xs mt-1">{errors.institutional_website}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Leadership & Legal Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Leadership Information */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 rounded-xl p-4 border border-amber-200/60 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Leadership</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Head Name</label>
                <input
                  type="text"
                  value={formData.head_name}
                  onChange={(e) => handleInputChange("head_name", e.target.value)}
                  placeholder="e.g., Dr. Grace J. Rebollos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.head_title}
                  onChange={(e) => handleInputChange("head_title", e.target.value)}
                  placeholder="e.g., University President"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <GraduationCap className="w-4 h-4 inline mr-1" />
                  Educational Background
                </label>
                <input
                  type="text"
                  value={formData.head_education}
                  onChange={(e) => handleInputChange("head_education", e.target.value)}
                  placeholder="e.g., PhD in Education"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direct Telephone</label>
                <input
                  type="text"
                  value={formData.head_telephone}
                  onChange={(e) => handleInputChange("head_telephone", e.target.value)}
                  placeholder="e.g., +63-62-991-8800"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          {/* Legal & Historical Information */}
          <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 rounded-xl p-4 border border-slate-200/60 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-slate-600 rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Legal & Historical</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Award className="w-4 h-4 inline mr-1" />
                  SEC Registration
                </label>
                <input
                  type="text"
                  value={formData.sec_registration}
                  onChange={(e) => handleInputChange("sec_registration", e.target.value)}
                  placeholder="e.g., SUC-WMSU-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Granted/Approved</label>
                <input
                  type="number"
                  value={formData.year_granted_approved}
                  onChange={(e) => handleInputChange("year_granted_approved", e.target.value)}
                  placeholder="e.g., 1957"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Converted to College</label>
                <input
                  type="number"
                  value={formData.year_converted_college}
                  onChange={(e) => handleInputChange("year_converted_college", e.target.value)}
                  placeholder="Leave blank if not applicable"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Converted to University</label>
                <input
                  type="number"
                  value={formData.year_converted_university}
                  onChange={(e) => handleInputChange("year_converted_university", e.target.value)}
                  placeholder="e.g., 1957"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-2.5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center ${
              isEdit
                ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-green-500"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? "Update SUC" : "Create SUC"}
              </>
            )}
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
  loading: PropTypes.bool,
};

export default SucForm;
