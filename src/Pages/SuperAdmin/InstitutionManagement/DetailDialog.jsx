import { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import EditDialog from "./EditDialog";

const DetailDialog = ({
  open,
  onClose,
  institution,
  onEdit,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity,
  fetchInstitutions,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!institution || !open) return null;

  if (isEditing) {
    return (
      <EditDialog
        open={true}
        onClose={() => {
          setIsEditing(false);
          onClose();
        }}
        institution={institution}
        onEdit={(updatedInstitution) => {
          onEdit(updatedInstitution);
          setIsEditing(false);
        }}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarMessage={setSnackbarMessage}
        setSnackbarSeverity={setSnackbarSeverity}
        fetchInstitutions={fetchInstitutions}
      />
    );
  }

  const formatField = (label, value) => {
    const displayValue = value || "N/A";
    const isNA = displayValue === "N/A";

    return (
      <div key={label} className="py-0.5">
        <p className={`text-xs ${isNA ? "text-gray-500" : "text-gray-900"}`}>
          <span className="font-medium">{label}:</span>{" "}
          {isNA ? <span className="italic text-gray-500">Not Available</span> : displayValue}
        </p>
      </div>
    );
  };

  // Group the fields for more compact display
  const renderSection = (title, fields) => (
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-blue-600 mb-1">{title}</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {fields.map(([label, value]) => formatField(label, value))}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl  bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="institution-details-dialog"
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-blue-600 text-white p-2 rounded-t-lg">
          <h2 id="institution-details-dialog" className="text-lg font-semibold pl-2">
            {institution.name || "Institution Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-white hover:bg-white/10 rounded-full"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 bg-gray-50 max-h-[70vh] overflow-y-auto">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            {/* Basic Information */}
            {renderSection("Basic Information", [
              ["Name", institution.name],
              ["SEC Registration", institution.sec_registration],
              ["Institution Type", institution.institution_type]
            ])}
            <div className="border-t border-gray-200 my-2" />

            {/* Address Information */}
            {renderSection("Address Information", [
              ["Street Address", institution.address_street],
              ["Region", institution.region],
              ["Province", institution.province],
              ["Municipality/City", institution.municipality],
              ["Postal Code", institution.postal_code]
            ])}
            <div className="border-t border-gray-200 my-2" />

            {/* Contact Information */}
            {renderSection("Contact Information", [
              ["Institutional Telephone", institution.institutional_telephone],
              ["Institutional Fax", institution.institutional_fax],
              ["Institutional Email", institution.institutional_email],
              ["Institutional Website", institution.institutional_website],
              ["Head Telephone", institution.head_telephone]
            ])}
            <div className="border-t border-gray-200 my-2" />

            {/* Head of Institution */}
            {renderSection("Head of Institution", [
              ["Head Name", institution.head_name],
              ["Head Title", institution.head_title],
              ["Head Education", institution.head_education]
            ])}
            <div className="border-t border-gray-200 my-2" />

            {/* Historical Dates */}
            {renderSection("Historical Dates", [
              ["Year Established", institution.year_established],
              ["Year Approved", institution.year_granted_approved],
              ["Year → College", institution.year_converted_college],
              ["Year → University", institution.year_converted_university]
            ])}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end p-2 bg-gray-100 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

DetailDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  institution: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    region: PropTypes.string,
    address_street: PropTypes.string,
    municipality: PropTypes.string,
    province: PropTypes.string,
    postal_code: PropTypes.string,
    institutional_telephone: PropTypes.string,
    institutional_fax: PropTypes.string,
    head_telephone: PropTypes.string,
    institutional_email: PropTypes.string,
    institutional_website: PropTypes.string,
    year_established: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sec_registration: PropTypes.string,
    year_granted_approved: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    year_converted_college: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    year_converted_university: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    head_name: PropTypes.string,
    head_title: PropTypes.string,
    head_education: PropTypes.string,
    institution_type: PropTypes.string,
  }),
  onEdit: PropTypes.func.isRequired,
  setSnackbarOpen: PropTypes.func,
  setSnackbarMessage: PropTypes.func,
  setSnackbarSeverity: PropTypes.func,
  fetchInstitutions: PropTypes.func,
};

DetailDialog.defaultProps = {
  institution: null,
  fetchInstitutions: () => {},
};

export default DetailDialog;
