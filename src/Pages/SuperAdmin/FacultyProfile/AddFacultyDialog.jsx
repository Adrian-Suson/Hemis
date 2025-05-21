import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import CHEDButton from "../../../Components/CHEDButton";
import config from "../../../utils/config";
import AlertComponent from "../../../Components/AlertComponent";
import FormInput from "../../../Components/FormInput";
import axios from "axios";

const AddFacultyDialog = ({
    open,
    onClose,
    facultyGroups,
    institutionId,
    onFacultyAdded,
}) => {
    const [formData, setFormData] = useState({
        faculty_group: facultyGroups[0]?.sheetName || "",
        name: "",
        generic_faculty_rank: "",
        home_college: "",
        home_department: "",
        is_tenured: "",
        ssl_salary_grade: "",
        annual_basic_salary: "",
        on_leave_without_pay: "",
        full_time_equivalent: "",
        gender: "",
        highest_degree_attained: "",
        pursuing_next_degree: "",
        discipline_teaching_load_1: "",
        discipline_teaching_load_2: "",
        discipline_bachelors: "",
        discipline_masters: "",
        discipline_doctorate: "",
        masters_with_thesis: "",
        doctorate_with_dissertation: "",
        undergrad_lab_credit_units: "",
        undergrad_lecture_credit_units: "",
        undergrad_total_credit_units: "",
        undergrad_lab_hours_per_week: "",
        undergrad_lecture_hours_per_week: "",
        undergrad_total_hours_per_week: "",
        undergrad_lab_contact_hours: "",
        undergrad_lecture_contact_hours: "",
        undergrad_total_contact_hours: "",
        graduate_lab_credit_units: "",
        graduate_lecture_credit_units: "",
        graduate_total_credit_units: "",
        graduate_lab_contact_hours: "",
        graduate_lecture_contact_hours: "",
        graduate_total_contact_hours: "",
        research_load: "",
        extension_services_load: "",
        study_load: "",
        production_load: "",
        administrative_load: "",
        other_load_credits: "",
        total_work_load: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reportYear, setReportYear] = useState(null);

    // State for active tab
    const [activeTab, setActiveTab] = useState("basicInfo");

    // Tab definitions
    const tabs = [
        { id: "basicInfo", label: "Basic Info" },
        { id: "qualifications", label: "Qualifications" },
        { id: "undergradLoad", label: "Undergrad Load" },
        { id: "graduateLoad", label: "Graduate Load" },
        { id: "otherLoads", label: "Other Loads" }
    ];

    // Fetch institution report year
    useEffect(() => {
        const fetchReportYear = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    AlertComponent.showAlert(
                        "Authentication token is missing.",
                        "error"
                    );
                    return;
                }
                const response = await axios.get(
                    `${config.API_URL}/institutions/${institutionId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setReportYear(response.data?.report_year || null);
            } catch (error) {
                console.error("Error fetching report year:", error);
                AlertComponent.showAlert(
                    "Failed to fetch institution report year.",
                    "error"
                );
            }
        };
        if (open) {
            fetchReportYear();
        }
    }, [open, institutionId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.faculty_group || !reportYear) {
            AlertComponent.showAlert(
                "Please fill in all required fields.",
                "error"
            );
            return;
        }

        setIsSubmitting(true);
        const token = localStorage.getItem("token");
        if (!token) {
            AlertComponent.showAlert(
                "Authentication token is missing.",
                "error"
            );
            setIsSubmitting(false);
            return;
        }

        const payload = {
            institution_id: institutionId,
            faculty_group: formData.faculty_group,
            name: formData.name,
            generic_faculty_rank: formData.generic_faculty_rank
                ? parseInt(formData.generic_faculty_rank, 10)
                : null,
            home_college: formData.home_college || null,
            home_department: formData.home_department || null,
            is_tenured: formData.is_tenured || null,
            ssl_salary_grade: formData.ssl_salary_grade
                ? parseInt(formData.ssl_salary_grade, 10)
                : null,
            annual_basic_salary: formData.annual_basic_salary
                ? parseInt(formData.annual_basic_salary, 10)
                : null,
            on_leave_without_pay: formData.on_leave_without_pay
                ? parseInt(formData.on_leave_without_pay, 10)
                : null,
            full_time_equivalent: formData.full_time_equivalent
                ? parseFloat(formData.full_time_equivalent)
                : null,
            gender: formData.gender ? parseInt(formData.gender, 10) : null,
            highest_degree_attained: formData.highest_degree_attained
                ? parseInt(formData.highest_degree_attained, 10)
                : null,
            pursuing_next_degree: formData.pursuing_next_degree
                ? parseInt(formData.pursuing_next_degree, 10)
                : null,
            discipline_teaching_load_1:
                formData.discipline_teaching_load_1 || null,
            discipline_teaching_load_2:
                formData.discipline_teaching_load_2 || null,
            discipline_bachelors: formData.discipline_bachelors || null,
            discipline_masters: formData.discipline_masters || null,
            discipline_doctorate: formData.discipline_doctorate || null,
            masters_with_thesis: formData.masters_with_thesis
                ? parseInt(formData.masters_with_thesis, 10)
                : null,
            doctorate_with_dissertation: formData.doctorate_with_dissertation
                ? parseInt(formData.doctorate_with_dissertation, 10)
                : null,
            undergrad_lab_credit_units: formData.undergrad_lab_credit_units
                ? parseFloat(formData.undergrad_lab_credit_units)
                : null,
            undergrad_lecture_credit_units:
                formData.undergrad_lecture_credit_units
                    ? parseFloat(formData.undergrad_lecture_credit_units)
                    : null,
            undergrad_total_credit_units: formData.undergrad_total_credit_units
                ? parseFloat(formData.undergrad_total_credit_units)
                : null,
            undergrad_lab_hours_per_week: formData.undergrad_lab_hours_per_week
                ? parseFloat(formData.undergrad_lab_hours_per_week)
                : null,
            undergrad_lecture_hours_per_week:
                formData.undergrad_lecture_hours_per_week
                    ? parseFloat(formData.undergrad_lecture_hours_per_week)
                    : null,
            undergrad_total_hours_per_week:
                formData.undergrad_total_hours_per_week
                    ? parseFloat(formData.undergrad_total_hours_per_week)
                    : null,
            undergrad_lab_contact_hours: formData.undergrad_lab_contact_hours
                ? parseFloat(formData.undergrad_lab_contact_hours)
                : null,
            undergrad_lecture_contact_hours:
                formData.undergrad_lecture_contact_hours
                    ? parseFloat(formData.undergrad_lecture_contact_hours)
                    : null,
            undergrad_total_contact_hours:
                formData.undergrad_total_contact_hours
                    ? parseFloat(formData.undergrad_total_contact_hours)
                    : null,
            graduate_lab_credit_units: formData.graduate_lab_credit_units
                ? parseFloat(formData.graduate_lab_credit_units)
                : null,
            graduate_lecture_credit_units:
                formData.graduate_lecture_credit_units
                    ? parseFloat(formData.graduate_lecture_credit_units)
                    : null,
            graduate_total_credit_units: formData.graduate_total_credit_units
                ? parseFloat(formData.graduate_total_credit_units)
                : null,
            graduate_lab_contact_hours: formData.graduate_lab_contact_hours
                ? parseFloat(formData.graduate_lab_contact_hours)
                : null,
            graduate_lecture_contact_hours:
                formData.graduate_lecture_contact_hours
                    ? parseFloat(formData.graduate_lecture_contact_hours)
                    : null,
            graduate_total_contact_hours: formData.graduate_total_contact_hours
                ? parseFloat(formData.graduate_total_contact_hours)
                : null,
            research_load: formData.research_load
                ? parseFloat(formData.research_load)
                : null,
            extension_services_load: formData.extension_services_load
                ? parseFloat(formData.extension_services_load)
                : null,
            study_load: formData.study_load
                ? parseFloat(formData.study_load)
                : null,
            production_load: formData.production_load
                ? parseFloat(formData.production_load)
                : null,
            administrative_load: formData.administrative_load
                ? parseFloat(formData.administrative_load)
                : null,
            other_load_credits: formData.other_load_credits
                ? parseFloat(formData.other_load_credits)
                : null,
            total_work_load: formData.total_work_load
                ? parseFloat(formData.total_work_load)
                : null,
            report_year: reportYear,
        };

        try {
            await axios.post(`${config.API_URL}/faculty-profiles`, [payload], {
                headers: { Authorization: `Bearer ${token}` },
            });
            AlertComponent.showAlert(
                "Faculty profile added successfully!",
                "success"
            );
            onFacultyAdded();
            onClose();
            setFormData({
                faculty_group: facultyGroups[0]?.sheetName || "",
                name: "",
                generic_faculty_rank: "",
                home_college: "",
                home_department: "",
                is_tenured: "",
                ssl_salary_grade: "",
                annual_basic_salary: "",
                on_leave_without_pay: "",
                full_time_equivalent: "",
                gender: "",
                highest_degree_attained: "",
                pursuing_next_degree: "",
                discipline_teaching_load_1: "",
                discipline_teaching_load_2: "",
                discipline_bachelors: "",
                discipline_masters: "",
                discipline_doctorate: "",
                masters_with_thesis: "",
                doctorate_with_dissertation: "",
                undergrad_lab_credit_units: "",
                undergrad_lecture_credit_units: "",
                undergrad_total_credit_units: "",
                undergrad_lab_hours_per_week: "",
                undergrad_lecture_hours_per_week: "",
                undergrad_total_hours_per_week: "",
                undergrad_lab_contact_hours: "",
                undergrad_lecture_contact_hours: "",
                undergrad_total_contact_hours: "",
                graduate_lab_credit_units: "",
                graduate_lecture_credit_units: "",
                graduate_total_credit_units: "",
                graduate_lab_contact_hours: "",
                graduate_lecture_contact_hours: "",
                graduate_total_contact_hours: "",
                research_load: "",
                extension_services_load: "",
                study_load: "",
                production_load: "",
                administrative_load: "",
                other_load_credits: "",
                total_work_load: "",
            });
        } catch (error) {
            console.error("Error adding faculty profile:", error);
            AlertComponent.showAlert(
                "Failed to add faculty profile. Please try again.",
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Tab navigation component
    const TabNavigation = () => (
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-2 px-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap py-3 px-3 text-sm font-medium ${
                            activeTab === tab.id
                                ? "border-b-2 border-indigo-500 text-indigo-600"
                                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } transition-colors duration-150 ease-in-out`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );

    // Category title component
    const CategoryTitle = ({ title }) => (
        <div className="py-1 px-2 bg-gray-50 rounded text-xs font-medium text-gray-600 mb-2">
            {title}
        </div>
    );

    CategoryTitle.propTypes = {
        title: PropTypes.string.isRequired,
    };

    // Gender options for select
    const genderOptions = [
        { value: "1", label: "Male" },
        { value: "2", label: "Female" }
    ];

    // Options for is_tenured
    const tenuredOptions = [
        { value: "1", label: "Yes" },
        { value: "0", label: "No" }
    ];

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-indigo-50 border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
                    <h2 className="text-lg font-semibold text-indigo-800">
                        Add Faculty Profile
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <TabNavigation />

                {/* Tab Content */}
                <div className="overflow-y-auto flex-grow p-5">
                    {/* Basic Information Tab */}
                    {activeTab === "basicInfo" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <FormInput
                                    name="faculty_group"
                                    label="Faculty Group"
                                    type="select"
                                    required
                                    value={formData.faculty_group}
                                    onChange={handleInputChange}
                                    options={facultyGroups.map(group => ({
                                        value: group.sheetName,
                                        label: group.label
                                    }))}
                                    size="small"
                                />
                                <FormInput
                                    name="name"
                                    label="Name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="generic_faculty_rank"
                                    label="Faculty Rank"
                                    type="number"
                                    value={formData.generic_faculty_rank}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="home_college"
                                    label="Home College"
                                    value={formData.home_college}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="home_department"
                                    label="Home Department"
                                    value={formData.home_department}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="is_tenured"
                                    label="Is Tenured"
                                    type="select"
                                    value={formData.is_tenured}
                                    onChange={handleInputChange}
                                    options={tenuredOptions}
                                    size="small"
                                />
                                <FormInput
                                    name="ssl_salary_grade"
                                    label="SSL Salary Grade"
                                    type="number"
                                    value={formData.ssl_salary_grade}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="annual_basic_salary"
                                    label="Annual Basic Salary"
                                    type="number"
                                    value={formData.annual_basic_salary}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="gender"
                                    label="Gender"
                                    type="select"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    options={genderOptions}
                                    size="small"
                                />
                                <FormInput
                                    name="on_leave_without_pay"
                                    label="On Leave Without Pay"
                                    type="number"
                                    value={formData.on_leave_without_pay}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="full_time_equivalent"
                                    label="Full Time Equivalent"
                                    type="number"
                                    value={formData.full_time_equivalent}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                            </div>
                        </div>
                    )}

                    {/* Qualifications Tab */}
                    {activeTab === "qualifications" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <FormInput
                                    name="highest_degree_attained"
                                    label="Highest Degree Attained"
                                    type="number"
                                    value={formData.highest_degree_attained}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="pursuing_next_degree"
                                    label="Pursuing Next Degree"
                                    type="number"
                                    value={formData.pursuing_next_degree}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="masters_with_thesis"
                                    label="Masters with Thesis"
                                    type="number"
                                    value={formData.masters_with_thesis}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="doctorate_with_dissertation"
                                    label="Doctorate with Dissertation"
                                    type="number"
                                    value={formData.doctorate_with_dissertation}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <div className="md:col-span-3">
                                    <CategoryTitle title="Disciplines" />
                                </div>
                                <FormInput
                                    name="discipline_bachelors"
                                    label="Bachelors Discipline"
                                    value={formData.discipline_bachelors}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="discipline_masters"
                                    label="Masters Discipline"
                                    value={formData.discipline_masters}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="discipline_doctorate"
                                    label="Doctorate Discipline"
                                    value={formData.discipline_doctorate}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="discipline_teaching_load_1"
                                    label="Teaching Load Discipline 1"
                                    value={formData.discipline_teaching_load_1}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="discipline_teaching_load_2"
                                    label="Teaching Load Discipline 2"
                                    value={formData.discipline_teaching_load_2}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                            </div>
                        </div>
                    )}

                    {/* Undergraduate Load Tab */}
                    {activeTab === "undergradLoad" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <CategoryTitle title="Credit Units" />
                                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <FormInput
                                        name="undergrad_lab_credit_units"
                                        label="Lab Credit Units"
                                        type="number"
                                        value={formData.undergrad_lab_credit_units}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                    <FormInput
                                        name="undergrad_lecture_credit_units"
                                        label="Lecture Credit Units"
                                        type="number"
                                        value={formData.undergrad_lecture_credit_units}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                    <FormInput
                                        name="undergrad_total_credit_units"
                                        label="Total Credit Units"
                                        type="number"
                                        value={formData.undergrad_total_credit_units}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                </div>

                                <CategoryTitle title="Hours Per Week" />
                                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <FormInput
                                        name="undergrad_lab_hours_per_week"
                                        label="Lab Hours per Week"
                                        type="number"
                                        value={formData.undergrad_lab_hours_per_week}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                    <FormInput
                                        name="undergrad_lecture_hours_per_week"
                                        label="Lecture Hours per Week"
                                        type="number"
                                        value={formData.undergrad_lecture_hours_per_week}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                    <FormInput
                                        name="undergrad_total_hours_per_week"
                                        label="Total Hours per Week"
                                        type="number"
                                        value={formData.undergrad_total_hours_per_week}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                </div>

                                <CategoryTitle title="Contact Hours" />
                                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <FormInput
                                        name="undergrad_lab_contact_hours"
                                        label="Lab Contact Hours"
                                        type="number"
                                        value={formData.undergrad_lab_contact_hours}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                    <FormInput
                                        name="undergrad_lecture_contact_hours"
                                        label="Lecture Contact Hours"
                                        type="number"
                                        value={formData.undergrad_lecture_contact_hours}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                    <FormInput
                                        name="undergrad_total_contact_hours"
                                        label="Total Contact Hours"
                                        type="number"
                                        value={formData.undergrad_total_contact_hours}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Graduate Load Tab */}
                    {activeTab === "graduateLoad" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <CategoryTitle title="Credit Units" />
                                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <FormInput
                                        name="graduate_lab_credit_units"
                                        label="Lab Credit Units"
                                        type="number"
                                        value={formData.graduate_lab_credit_units}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                    <FormInput
                                        name="graduate_lecture_credit_units"
                                        label="Lecture Credit Units"
                                        type="number"
                                        value={formData.graduate_lecture_credit_units}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                    <FormInput
                                        name="graduate_total_credit_units"
                                        label="Total Credit Units"
                                        type="number"
                                        value={formData.graduate_total_credit_units}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                </div>

                                <CategoryTitle title="Contact Hours" />
                                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <FormInput
                                        name="graduate_lab_contact_hours"
                                        label="Lab Contact Hours"
                                        type="number"
                                        value={formData.graduate_lab_contact_hours}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                    <FormInput
                                        name="graduate_lecture_contact_hours"
                                        label="Lecture Contact Hours"
                                        type="number"
                                        value={formData.graduate_lecture_contact_hours}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                    <FormInput
                                        name="graduate_total_contact_hours"
                                        label="Total Contact Hours"
                                        type="number"
                                        value={formData.graduate_total_contact_hours}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Other Loads Tab */}
                    {activeTab === "otherLoads" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <FormInput
                                    name="research_load"
                                    label="Research Load"
                                    type="number"
                                    value={formData.research_load}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="extension_services_load"
                                    label="Extension Services Load"
                                    type="number"
                                    value={formData.extension_services_load}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="study_load"
                                    label="Study Load"
                                    type="number"
                                    value={formData.study_load}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="production_load"
                                    label="Production Load"
                                    type="number"
                                    value={formData.production_load}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="administrative_load"
                                    label="Administrative Load"
                                    type="number"
                                    value={formData.administrative_load}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <FormInput
                                    name="other_load_credits"
                                    label="Other Load Credits"
                                    type="number"
                                    value={formData.other_load_credits}
                                    onChange={handleInputChange}
                                    size="small"
                                />
                                <div className="md:col-span-3">
                                    <CategoryTitle title="Total Load" />
                                </div>
                                <div className="md:col-span-3 md:w-1/2 mx-auto">
                                    <FormInput
                                        name="total_work_load"
                                        label="Total Work Load"
                                        type="number"
                                        value={formData.total_work_load}
                                        onChange={handleInputChange}
                                        size="small"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="mt-4 text-xs text-gray-500">
                        Fields marked with <span className="text-red-500">*</span> are required.
                    </p>
                </div>

                {/* Footer with actions */}
                <div className="flex justify-end gap-2 p-3 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md text-sm transition-colors"
                    >
                        Cancel
                    </button>
                    <CHEDButton
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        variant="primary"
                        size="sm"
                    >
                        {isSubmitting ? "Adding..." : "Add Faculty"}
                    </CHEDButton>
                </div>
            </div>
        </div>
    );
};

AddFacultyDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    facultyGroups: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            sheetName: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
        })
    ).isRequired,
    institutionId: PropTypes.number.isRequired,
    onFacultyAdded: PropTypes.func.isRequired,
};

export default AddFacultyDialog;
