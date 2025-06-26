import { useState, useEffect } from 'react';
import {
  Save,
  Building,
  MapPin,
  Phone,
  User,
  Calendar,
  GraduationCap,
  Globe2,
  Award,
  FileText,
  Edit,
} from 'lucide-react';
import Select from 'react-select';
import axios from 'axios';
import config from '../../../../utils/config';
import PropTypes from 'prop-types';
import useLocationData from '../../../../Hooks/useLocationData';
import Dialog from '../../../../Components/Dialog';
import AlertComponent from '../../../../Components/AlertComponent';
import { HEAD_TITLE_MAPPING, EDUCATIONAL_LEVEL_MAPPING } from '../../../../utils/LucFormAConstants';

function EditLucForm({ initialData, onSave, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    hei_uiid: initialData?.hei_uiid || '',
    institution_name: initialData?.institution_name || initialData?.hei?.name || '',
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
    year_converted_university: initialData?.year_converted_university || '',
  });

  const [heis, setHeis] = useState([]);
  const [loadingHeis, setLoadingHeis] = useState(false);
  const [errors, setErrors] = useState({});

  // Use the location hook
  const { regions, provinces, municipalities, loading: locationLoading, error: locationFetchError, getMunicipalityPostalCode } = useLocationData();

  // Format HEAD_TITLE_MAPPING for react-select
  const headTitleOptions = Object.entries(HEAD_TITLE_MAPPING).map(([value, label]) => ({
    value: Number(value),
    label,
  }));

  // Format EDUCATIONAL_LEVEL_MAPPING for react-select
  const educationalLevelOptions = Object.entries(EDUCATIONAL_LEVEL_MAPPING).map(([value, label]) => ({
    value: Number(value),
    label,
  }));

  // Fetch HEIs when component mounts
  useEffect(() => {
    fetchHeis();
  }, []);

  // Populate location fields when initialData or location data changes
  useEffect(() => {
    if (initialData && regions.length > 0 && provinces.length > 0 && municipalities.length > 0) {
      setFormData(prev => ({
        ...prev,
        region: initialData.region || '',
        province: initialData.province || '',
        municipality: initialData.municipality || '',
      }));
    }
  }, [initialData, regions, provinces, municipalities]);

  const fetchHeis = async () => {
    setLoadingHeis(true);
    try {
      const response = await axios.get(`${config.API_URL}/heis?type=LUC`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const heisData = Array.isArray(response.data) ? response.data :
        response.data.data ? response.data.data :
        response.data.heis ? response.data.heis : [];
      setHeis(heisData.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      setErrors(prev => ({ ...prev, heis: "Failed to load institutions. Please try again.", error }));
      setHeis([]);
    } finally {
      setLoadingHeis(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.hei_uiid.trim()) {
      newErrors.hei_uiid = "Institution UIID is required";
    }
    if (!formData.institution_name.trim()) {
      newErrors.institution_name = "Institution name is required";
    }
    if (!formData.report_year) {
      newErrors.report_year = "Report year is required";
    }
    if (formData.institutional_email && !/\S+@\S+\.\S+/.test(formData.institutional_email)) {
      newErrors.institutional_email = "Please enter a valid email address";
    }
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

  const uiidOptions = Array.isArray(heis) ? heis.map((hei) => ({
    value: hei.uiid,
    label: `${hei.name} (${hei.uiid})`,
    name: hei.name,
    uiid: hei.uiid,
  })) : [];

  const regionOptions = regions.map((region) => ({
    value: region.name,
    label: region.name,
    id: region.id,
  }));

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
    handleInputChange('hei_uiid', selectedOption ? selectedOption.value : '');
    handleInputChange('institution_name', selectedOption ? selectedOption.name : '');
  };

  const handleRegionChange = (selectedOption) => {
    setFormData({
      ...formData,
      region: selectedOption ? selectedOption.value : '',
      province: '',
      municipality: '',
      postal_code: '',
    });
  };

  const handleProvinceChange = (selectedOption) => {
    setFormData({
      ...formData,
      province: selectedOption ? selectedOption.value : '',
      municipality: '',
      postal_code: '',
    });
  };

  const handleMunicipalityChange = (selectedOption) => {
    const municipalityName = selectedOption ? selectedOption.value : '';
    const postalCode = selectedOption ? getMunicipalityPostalCode(municipalityName) : '';
    let selectedRegionName = '';
    let selectedProvinceName = '';
    if (selectedOption) {
      const selectedMunicipality = municipalities.find(m => m.name === municipalityName);
      if (selectedMunicipality) {
        const correspondingProvince = provinces.find(p => p.id === selectedMunicipality.province_id);
        if (correspondingProvince) {
          selectedProvinceName = correspondingProvince.name;
          const correspondingRegion = regions.find(r => r.id === correspondingProvince.region_id);
          if (correspondingRegion) {
            selectedRegionName = correspondingRegion.name;
          }
        }
      }
    }
    setFormData(prev => ({
      ...prev,
      region: selectedRegionName,
      province: selectedProvinceName,
      municipality: municipalityName,
      postal_code: postalCode,
    }));
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Check for duplicate for this HEI and year (excluding current record)
        const token = localStorage.getItem("token");
        const checkResponse = await axios.get(
          `${config.API_URL}/luc-details?hei_uiid=${formData.hei_uiid}&report_year=${formData.report_year}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const existingRecords = Array.isArray(checkResponse.data)
          ? checkResponse.data
          : checkResponse.data?.data
            ? checkResponse.data.data
            : [];
        const duplicateRecord = existingRecords.find(record =>
          record.hei_uiid === formData.hei_uiid &&
          record.report_year === formData.report_year &&
          !record.deleted_at &&
          record.id !== initialData?.id
        );
        if (duplicateRecord) {
          AlertComponent.showAlert(
            `A record for ${formData.institution_name} (UIID: ${formData.hei_uiid}) already exists for the year ${formData.report_year}. Please select a different institution or year.`,
            'error'
          );
          return;
        }
        // Ensure head_title and head_education are sent as strings
        const dataToSend = {
          ...formData,
          head_title: formData.head_title !== undefined && formData.head_title !== null ? String(formData.head_title) : '',
          head_education: formData.head_education !== undefined && formData.head_education !== null ? String(formData.head_education) : '',
        };
        await onSave(dataToSend);
        AlertComponent.showAlert('LUC institution updated successfully!', 'success');
      } catch (error) {
        AlertComponent.showAlert(error.message || 'Failed to update LUC institution. Please try again.', 'error');
      }
    } else {
      AlertComponent.showAlert('Please fill in all required fields correctly.', 'error');
    }
  };

  const handleClose = () => {
    AlertComponent.showConfirmation(
      'Are you sure you want to cancel? Any unsaved changes will be lost.',
      () => {
        setErrors({});
        onCancel();
      }
    );
  };

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
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  return (
    <Dialog
      isOpen={true}
      onClose={handleClose}
      title="Edit LUC Institution"
      subtitle="Local University & College Details"
      icon={Edit}
      variant="default"
      size="xl"
    >
      <div className="space-y-4 p-4">
        {(errors.heis || locationFetchError) && (
          <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-800 rounded-xl shadow-sm">
            <div className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              {errors.heis || locationFetchError}
            </div>
          </div>
        )}

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
                Select LUC Institution <span className="text-red-500">*</span>
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
                    value={uiidOptions.find((option) => option.value === formData.hei_uiid) || null}
                    onChange={handleUiidChange}
                    placeholder="Select an institution (e.g., Aim High Colleges, Inc.)"
                    isClearable
                    isSearchable
                    className={`text-sm ${errors.hei_uiid ? "border-red-400" : ""}`}
                    classNamePrefix="select"
                    styles={{
                      ...customSelectStyles,
                      control: (base) => ({
                        ...base,
                        borderColor: errors.hei_uiid ? "#ef4444" : base.borderColor,
                        "&:hover": { borderColor: errors.hei_uiid ? "#ef4444" : "#3b82f6" },
                      }),
                    }}
                  />
                  {errors.hei_uiid && <p className="text-red-500 text-xs mt-1">{errors.hei_uiid}</p>}
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
                  placeholder="e.g., 1992"
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
                  placeholder="e.g., 2025"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                      value={regionOptions.find((option) => String(option.value) === String(formData.region)) || null}
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
                    value={getProvinceOptions().find((option) => String(option.value) === String(formData.province)) || null}
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
                    value={getMunicipalityOptions().find((option) => String(option.value) === String(formData.municipality)) || null}
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
                  placeholder="e.g., Main Street, Barangay"
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
                  placeholder="e.g., info@luc.edu.ph"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                    errors.institutional_email ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.institutional_email && <p className="text-red-500 text-xs mt-1">{errors.institutional_email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Globe2 className="w-4 h-4 inline mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  value={formData.institutional_website}
                  onChange={(e) => handleInputChange("institutional_website", e.target.value)}
                  placeholder="e.g., https://luc.edu.ph"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 ${
                    errors.institutional_website ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.institutional_website && <p className="text-red-500 text-xs mt-1">{errors.institutional_website}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                  placeholder="e.g., Dr. Juan Dela Cruz"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Select
                  options={headTitleOptions}
                  value={headTitleOptions.find((option) => Number(option.value) === Number(formData.head_title)) || null}
                  onChange={(selectedOption) => handleInputChange("head_title", selectedOption ? selectedOption.value : '')}
                  placeholder="Select title..."
                  isClearable
                  isSearchable
                  className="text-sm"
                  classNamePrefix="select"
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <GraduationCap className="w-4 h-4 inline mr-1" />
                  Educational Background
                </label>
                <Select
                  options={educationalLevelOptions}
                  value={educationalLevelOptions.find((option) => Number(option.value) === Number(formData.head_education)) || null}
                  onChange={(selectedOption) => handleInputChange("head_education", selectedOption ? selectedOption.value : '')}
                  placeholder="Select educational level..."
                  isClearable
                  isSearchable
                  className="text-sm"
                  classNamePrefix="select"
                  styles={customSelectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
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
                  placeholder="e.g., LUC-SEC-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Granted/Approved</label>
                <input
                  type="number"
                  value={formData.year_granted_approved}
                  onChange={(e) => handleInputChange("year_granted_approved", e.target.value)}
                  placeholder="e.g., 1992"
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
                  placeholder="e.g., 2000"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        </div>

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
            className="w-full sm:w-auto px-6 py-2.5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-green-500"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update LUC
              </>
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

EditLucForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hei_uiid: PropTypes.string,
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
    head_title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    head_education: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sec_registration: PropTypes.string,
    year_granted_approved: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    year_converted_college: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    year_converted_university: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hei: PropTypes.object,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default EditLucForm; 