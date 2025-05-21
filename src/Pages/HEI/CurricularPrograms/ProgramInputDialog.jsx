import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import CHEDButton from "../../../Components/CHEDButton";
import FormInput from "../../../Components/FormInput";
import { decryptId } from "../../../utils/encryption";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../../utils/config";

const ProgramInputDialog = ({ open, onClose, onSubmit, program = null }) => {
    const { institutionId: encryptedInstitutionId } = useParams();
    const institutionId = decryptId(encryptedInstitutionId);
    const [reportYear, setReportYear] = useState(null);
    const [activeTab, setActiveTab] = useState("program");
    const [formData, setFormData] = useState({
        program_name: "",
        program_code: "",
        major_name: "",
        major_code: "",
        category: "",
        serial: "",
        Year: "",
        is_thesis_dissertation_required: "",
        program_status: "",
        calendar_use_code: "",
        program_normal_length_in_years: "",
        lab_units: "",
        lecture_units: "",
        tuition_per_unit: "",
        program_fee: "",
        new_students_freshmen_male: "",
        new_students_freshmen_female: "",
        "1st_year_male": "",
        "1st_year_female": "",
        "2nd_year_male": "",
        "2nd_year_female": "",
        "3rd_year_male": "",
        "3rd_year_female": "",
        "4th_year_male": "",
        "4th_year_female": "",
        "5th_year_male": "",
        "5th_year_female": "",
        "6th_year_male": "",
        "6th_year_female": "",
        "7th_year_male": "",
        "7th_year_female": "",
        lecture_units_actual: "",
        laboratory_units_actual: "",
        graduates_males: "",
        graduates_females: "",
        externally_funded_merit_scholars: "",
        internally_funded_grantees: "",
        suc_funded_grantees: "",
        report_year: "",
        institution_id: reportYear,
    });

    useEffect(() => {
        const fetchInstitutionData = async () => {
            if (program) {
                setFormData(program);
            }
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${config.API_URL}/institutions/${institutionId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setReportYear(response.data.report_year);
                setFormData(prev => ({
                    ...prev,
                    report_year: response.data.report_year
                }));
            } catch (error) {
                console.error("Error fetching institution data:", error);
            }
        };

        fetchInstitutionData();
    }, [program, institutionId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert numeric fields to numbers
        const numericFields = [
            'program_normal_length_in_years',
            'lab_units',
            'lecture_units',
            'total_units',
            'tuition_per_unit',
            'program_fee',
            'new_students_freshmen_male',
            'new_students_freshmen_female',
            '1st_year_male',
            '1st_year_female',
            '2nd_year_male',
            '2nd_year_female',
            '3rd_year_male',
            '3rd_year_female',
            '4th_year_male',
            '4th_year_female',
            '5th_year_male',
            '5th_year_female',
            '6th_year_male',
            '6th_year_female',
            '7th_year_male',
            '7th_year_female',
            'lecture_units_actual',
            'laboratory_units_actual',
            'graduates_males',
            'graduates_females',
            'externally_funded_merit_scholars',
            'internally_funded_grantees',
            'suc_funded_grantees',
            'report_year',
            'Year'
        ];

        // Convert string fields to strings
        const stringFields = [
            'program_name',
            'program_code',
            'major_name',
            'major_code',
            'category',
            'serial',
            'is_thesis_dissertation_required',
            'program_status',
            'calendar_use_code'
        ];

        const processedData = {
            ...formData,
            // Convert numeric fields
            ...numericFields.reduce((acc, field) => ({
                ...acc,
                [field]: formData[field] ? Number(formData[field]) : null
            }), {}),
            // Convert string fields
            ...stringFields.reduce((acc, field) => ({
                ...acc,
                [field]: formData[field] ? String(formData[field]) : null
            }), {}),
            // Ensure institution_id is set
            institution_id: institutionId
        };

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token is missing");
            }

            if (program) {
                // Update existing program
                const response = await axios.put(
                    `${config.API_URL}/curricular_programs/${program.id}`,
                    processedData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );
                console.log('Update response:', response.data);
            } else {
                // Create new program
                const response = await axios.post(
                    `${config.API_URL}/curricular_programs`,
                    processedData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );
                console.log('Create response:', response.data);
            }

            onSubmit(processedData);
            onClose();
        } catch (error) {
            console.error("Error submitting program:", error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.entries(error.response.data.errors)
                    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                    .join("\n");
                alert(errorMessages);
            } else {
                alert(error.message || "Failed to submit program");
            }
        }
    };

    const referenceData = {
        authority: [
            { value: "GP", label: "Government Permit" },
            { value: "GR", label: "Government Recognition" },
            { value: "BR", label: "Board Resolution" },
        ],
        thesisDissertation: [
            { value: "1", label: "Required" },
            { value: "2", label: "Optional" },
            { value: "3", label: "Not Required" },
        ],
        programStatus: [
            { value: "1", label: "Active" },
            { value: "2", label: "Phased Out" },
            { value: "3", label: "Abolished" },
        ],
        calendar: [
            { value: "1", label: "Sem" },
            { value: "2", label: "Tri Sem" },
            { value: "3", label: "Quarter Sem" },
            { value: "4", label: "Distance Mode" },
        ],
    };

    if (!open) return null;

    const tabs = [
        { id: "program", label: "Program Details" },
        { id: "authority", label: "Authority & Status" },
        { id: "units", label: "Units & Fees" },
        { id: "enrollment", label: "Enrollment" },
        { id: "statistics", label: "Statistics & Scholars" }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center border-b border-gray-200 px-4 py-3 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {program ? "Edit Program" : "Add New Program"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="border-b border-gray-200">
                    <nav className="flex px-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-3 text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <form onSubmit={handleSubmit} className="h-full">
                        {/* Program Details Tab */}
                        {activeTab === "program" && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <div className="col-span-2">
                                    <div className="text-sm font-medium text-gray-600 mb-2">Program Information</div>
                                </div>
                                <FormInput
                                    name="program_name"
                                    label="Program Name"
                                    value={formData.program_name}
                                    onChange={handleChange}
                                    required
                                    size="default"
                                    inputClassName="bg-white"
                                />
                                <FormInput
                                    name="program_code"
                                    label="Program Code"
                                    value={formData.program_code}
                                    onChange={handleChange}
                                    size="default"
                                    inputClassName="bg-white"
                                />
                                <FormInput
                                    name="major_name"
                                    label="Major Name"
                                    value={formData.major_name}
                                    onChange={handleChange}
                                    size="default"
                                    inputClassName="bg-white"
                                />
                                <FormInput
                                    name="major_code"
                                    label="Major Code"
                                    value={formData.major_code}
                                    onChange={handleChange}
                                    size="default"
                                    inputClassName="bg-white"
                                />
                            </div>
                        )}

                        {/* Authority & Status Tab */}
                        {activeTab === "authority" && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <div className="col-span-2">
                                    <div className="text-sm font-medium text-gray-600 mb-2">Authority and Program Status</div>
                                </div>
                                <FormInput
                                    name="category"
                                    label="Authority to Offer"
                                    type="select"
                                    value={formData.category}
                                    onChange={handleChange}
                                    options={referenceData.authority}
                                    size="default"
                                    inputClassName="bg-white"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        name="serial"
                                        label="Serial"
                                        value={formData.serial}
                                        onChange={handleChange}
                                        size="default"
                                        inputClassName="bg-white"
                                    />
                                    <FormInput
                                        name="Year"
                                        label="Year"
                                        value={formData.Year}
                                        onChange={handleChange}
                                        size="default"
                                        inputClassName="bg-white"
                                    />
                                </div>
                                <FormInput
                                    name="is_thesis_dissertation_required"
                                    label="Thesis/Dissertation Required"
                                    type="select"
                                    value={formData.is_thesis_dissertation_required}
                                    onChange={handleChange}
                                    options={referenceData.thesisDissertation}
                                    size="default"
                                    inputClassName="bg-white"
                                />
                                <FormInput
                                    name="program_status"
                                    label="Program Status"
                                    type="select"
                                    value={formData.program_status}
                                    onChange={handleChange}
                                    options={referenceData.programStatus}
                                    size="default"
                                    inputClassName="bg-white"
                                />
                                <FormInput
                                    name="calendar_use_code"
                                    label="Calendar System"
                                    type="select"
                                    value={formData.calendar_use_code}
                                    onChange={handleChange}
                                    options={referenceData.calendar}
                                    size="default"
                                    inputClassName="bg-white"
                                />
                                <FormInput
                                    name="program_normal_length_in_years"
                                    label="Program Length (Years)"
                                    type="number"
                                    value={formData.program_normal_length_in_years}
                                    onChange={handleChange}
                                    size="default"
                                    inputClassName="bg-white"
                                    inputProps={{ min: 0 }}
                                />
                            </div>
                        )}

                        {/* Units & Fees Tab */}
                        {activeTab === "units" && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <div className="col-span-2">
                                    <div className="text-sm font-medium text-gray-600 mb-2">Units and Fee Structure</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        name="lecture_units"
                                        label="Lecture Units"
                                        type="number"
                                        value={formData.lecture_units}
                                        onChange={handleChange}
                                        size="default"
                                        inputClassName="bg-white"
                                        inputProps={{ min: 0 }}
                                    />
                                    <FormInput
                                        name="lab_units"
                                        label="Laboratory Units"
                                        type="number"
                                        value={formData.lab_units}
                                        onChange={handleChange}
                                        size="default"
                                        inputClassName="bg-white"
                                        inputProps={{ min: 0 }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        name="lecture_units_actual"
                                        label="Lecture Units Actual"
                                        type="number"
                                        value={formData.lecture_units_actual}
                                        onChange={handleChange}
                                        size="default"
                                        inputClassName="bg-white"
                                        inputProps={{ min: 0 }}
                                    />
                                    <FormInput
                                        name="laboratory_units_actual"
                                        label="Laboratory Units Actual"
                                        type="number"
                                        value={formData.laboratory_units_actual}
                                        onChange={handleChange}
                                        size="default"
                                        inputClassName="bg-white"
                                        inputProps={{ min: 0 }}
                                    />
                                </div>
                                <FormInput
                                    name="tuition_per_unit"
                                    label="Tuition Per Unit"
                                    type="number"
                                    value={formData.tuition_per_unit}
                                    onChange={handleChange}
                                    size="default"
                                    inputClassName="bg-white"
                                    inputProps={{ min: 0 }}
                                />
                                <FormInput
                                    name="program_fee"
                                    label="Program Fee"
                                    type="number"
                                    value={formData.program_fee}
                                    onChange={handleChange}
                                    size="default"
                                    inputClassName="bg-white"
                                    inputProps={{ min: 0 }}
                                />
                            </div>
                        )}

                        {/* Enrollment Tab */}
                        {activeTab === "enrollment" && (
                            <div className="space-y-4">
                                <div className="text-sm font-medium text-gray-600 mb-2">Student Enrollment</div>

                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-4 bg-gray-50 py-2 px-3 rounded text-sm font-medium">Freshmen & Early Years</div>

                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <FormInput
                                            name="new_students_freshmen_male"
                                            label="Freshmen Male"
                                            type="number"
                                            value={formData.new_students_freshmen_male}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                        <FormInput
                                            name="new_students_freshmen_female"
                                            label="Freshmen Female"
                                            type="number"
                                            value={formData.new_students_freshmen_female}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                    </div>

                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <FormInput
                                            name="1st_year_male"
                                            label="1st Year Male"
                                            type="number"
                                            value={formData["1st_year_male"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                        <FormInput
                                            name="1st_year_female"
                                            label="1st Year Female"
                                            type="number"
                                            value={formData["1st_year_female"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                    </div>

                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <FormInput
                                            name="2nd_year_male"
                                            label="2nd Year Male"
                                            type="number"
                                            value={formData["2nd_year_male"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                        <FormInput
                                            name="2nd_year_female"
                                            label="2nd Year Female"
                                            type="number"
                                            value={formData["2nd_year_female"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                    </div>

                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <FormInput
                                            name="3rd_year_male"
                                            label="3rd Year Male"
                                            type="number"
                                            value={formData["3rd_year_male"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                        <FormInput
                                            name="3rd_year_female"
                                            label="3rd Year Female"
                                            type="number"
                                            value={formData["3rd_year_female"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                    </div>

                                    <div className="col-span-4 bg-gray-50 py-2 px-3 rounded text-sm font-medium">Later Years</div>

                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <FormInput
                                            name="4th_year_male"
                                            label="4th Year Male"
                                            type="number"
                                            value={formData["4th_year_male"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                        <FormInput
                                            name="4th_year_female"
                                            label="4th Year Female"
                                            type="number"
                                            value={formData["4th_year_female"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                    </div>

                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <FormInput
                                            name="5th_year_male"
                                            label="5th Year Male"
                                            type="number"
                                            value={formData["5th_year_male"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                        <FormInput
                                            name="5th_year_female"
                                            label="5th Year Female"
                                            type="number"
                                            value={formData["5th_year_female"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                    </div>

                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <FormInput
                                            name="6th_year_male"
                                            label="6th Year Male"
                                            type="number"
                                            value={formData["6th_year_male"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                        <FormInput
                                            name="6th_year_female"
                                            label="6th Year Female"
                                            type="number"
                                            value={formData["6th_year_female"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                    </div>

                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <FormInput
                                            name="7th_year_male"
                                            label="7th Year Male"
                                            type="number"
                                            value={formData["7th_year_male"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                        <FormInput
                                            name="7th_year_female"
                                            label="7th Year Female"
                                            type="number"
                                            value={formData["7th_year_female"]}
                                            onChange={handleChange}
                                            size="default"
                                            inputClassName="bg-white"
                                            inputProps={{ min: 0 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Statistics & Scholars Tab */}
                        {activeTab === "statistics" && (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <div className="col-span-2">
                                    <div className="text-sm font-medium text-gray-600 mb-2">Graduates</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormInput
                                        name="graduates_males"
                                        label="Graduates Male"
                                        type="number"
                                        value={formData.graduates_males}
                                        onChange={handleChange}
                                        size="default"
                                        inputClassName="bg-white"
                                        inputProps={{ min: 0 }}
                                    />
                                    <FormInput
                                        name="graduates_females"
                                        label="Graduates Female"
                                        type="number"
                                        value={formData.graduates_females}
                                        onChange={handleChange}
                                        size="default"
                                        inputClassName="bg-white"
                                        inputProps={{ min: 0 }}
                                    />
                                </div>

                                <div className="col-span-2 mt-2">
                                    <div className="text-sm font-medium text-gray-600 mb-2">Scholars & Grantees</div>
                                </div>
                                <FormInput
                                    name="externally_funded_merit_scholars"
                                    label="Externally Funded Scholars"
                                    type="number"
                                    value={formData.externally_funded_merit_scholars}
                                    onChange={handleChange}
                                    size="default"
                                    inputClassName="bg-white"
                                    inputProps={{ min: 0 }}
                                />
                                <FormInput
                                    name="internally_funded_grantees"
                                    label="Internally Funded Grantees"
                                    type="number"
                                    value={formData.internally_funded_grantees}
                                    onChange={handleChange}
                                    size="default"
                                    inputClassName="bg-white"
                                    inputProps={{ min: 0 }}
                                />
                                <FormInput
                                    name="suc_funded_grantees"
                                    label="SUC Funded Grantees"
                                    type="number"
                                    value={formData.suc_funded_grantees}
                                    onChange={handleChange}
                                    size="default"
                                    inputClassName="bg-white"
                                    inputProps={{ min: 0 }}
                                />
                            </div>
                        )}
                    </form>
                </div>

                <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-end space-x-2">
                    <CHEDButton
                        type="button"
                        onClick={onClose}
                        variant="secondary"
                        size="sm"
                    >
                        Cancel
                    </CHEDButton>
                    <CHEDButton
                        type="button"
                        onClick={handleSubmit}
                        variant="primary"
                        size="sm"
                    >
                        {program ? "Update Program" : "Save Program"}
                    </CHEDButton>
                </div>
            </div>
        </div>
    );
};

ProgramInputDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    program: PropTypes.object,
};

export default ProgramInputDialog;
