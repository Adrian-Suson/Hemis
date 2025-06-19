import { useState } from "react";
import {
  GENERIC_FACULTY_RANK,
  TENURED_STATUS,
  ANNUAL_SALARY,
  ON_LEAVE_PAY,
  FULL_TIME_EQUIVALENT,
  GENDER,
  HIGHEST_DEGREE,
  PURSUING_NEXT_DEGREE,
  MASTERS_THESIS,
  DOCTORATE_DISSERTATION,
  facultyTypeOptions as facultyTypeConstants,
  SALARY_GRADE
} from "../utils/SucFormE2Constants";

export const useFacultyFormLogic = (institutionId) => {
    const [formData, setFormData] = useState({
        // Personal Information
        name: "",
        gender: "", // Based on OCR: 1 Male, 2 Female
        generic_faculty_rank: "", // Based on OCR: 20, 30, 40, 50, 09, 11, 12, 13, 14, 90
        home_college: "",
        home_department: "",
        is_tenured: "", // Based on OCR: 1, 2, 3, 4
        ssl_salary_grade: "", // Based on OCR: 1 to 33
        annual_basic_salary: "", // Based on OCR: ranges with codes 1-9
        on_leave_without_pay: "", // Based on OCR: 1, 2, 3
        full_time_equivalent: "", // Based on OCR: 1, 2, 3 (FTEF values)

        // Academic Information
        highest_degree_attained: "", // Based on OCR: codes 000-903
        pursuing_next_degree: "", // Based on OCR: codes 1-9
        discipline_teaching_load_1: "",
        discipline_teaching_load_2: "",
        discipline_bachelors: "",
        discipline_masters: "",
        discipline_doctorate: "",
        masters_with_thesis: "", // Based on OCR: 1, 2, 3
        doctorate_with_dissertation: "", // Based on OCR: 1, 2, 3

        // Undergraduate Teaching Load
        undergrad_lab_credit_units: 0,
        undergrad_lecture_credit_units: 0,
        undergrad_total_credit_units: 0,
        undergrad_lab_hours_per_week: 0,
        undergrad_lecture_hours_per_week: 0,
        undergrad_total_hours_per_week: 0,
        undergrad_lab_contact_hours: 0,
        undergrad_lecture_contact_hours: 0,
        undergrad_total_contact_hours: 0,

        // Graduate Teaching Load
        graduate_lab_credit_units: 0,
        graduate_lecture_credit_units: 0,
        graduate_total_credit_units: 0,
        graduate_lab_contact_hours: 0,
        graduate_lecture_contact_hours: 0,
        graduate_total_contact_hours: 0,

        // Additional Workload
        research_load: 0,
        extension_services_load: 0,
        study_load: 0,
        production_load: 0,
        administrative_load: 0,
        other_load_credits: 0,
        total_work_load: 0,

        // System Information
        report_year: new Date().getFullYear(),
        faculty_type: "", // Based on original form options
        suc_details_id: institutionId,
    });

    const [errors, setErrors] = useState({});

    // Define options from constants
    const facultyRankOptions = Object.entries(GENERIC_FACULTY_RANK).map(([value, label]) => ({ value: String(value), label }));
    const tenuredOptions = Object.entries(TENURED_STATUS).map(([value, label]) => ({ value: String(value), label }));
    const annualSalaryOptions = Object.entries(ANNUAL_SALARY).map(([value, label]) => ({ value: String(value), label }));
    const onLeavePayOptions = Object.entries(ON_LEAVE_PAY).map(([value, label]) => ({ value: String(value), label }));
    const fullTimeEquivalentOptions = Object.entries(FULL_TIME_EQUIVALENT).map(([value, label]) => ({ value: String(value), label }));
    const genderOptions = Object.entries(GENDER).map(([value, label]) => ({ value: String(value), label }));
    const highestDegreeOptions = Object.entries(HIGHEST_DEGREE).map(([value, label]) => ({ value: String(value), label }));
    const pursuingNextDegreeOptions = Object.entries(PURSUING_NEXT_DEGREE).map(([value, label]) => ({ value: String(value), label }));
    const thesisOptions = Object.entries(MASTERS_THESIS).map(([value, label]) => ({ value: String(value), label }));
    const dissertationOptions = Object.entries(DOCTORATE_DISSERTATION).map(([value, label]) => ({ value: String(value), label }));
    const facultyTypeOptions = facultyTypeConstants.map(({ code, label }) => ({ value: code, label }));
    const salaryGradeOptions = Object.entries(SALARY_GRADE).map(([value, label]) => ({ value: String(value), label }));

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // Calculate totals based on the field that changed
            if (field === 'undergrad_lab_credit_units' || field === 'undergrad_lecture_credit_units') {
                newData.undergrad_total_credit_units =
                    (parseFloat(newData.undergrad_lab_credit_units) || 0) +
                    (parseFloat(newData.undergrad_lecture_credit_units) || 0);
            }

            if (field === 'undergrad_lab_hours_per_week' || field === 'undergrad_lecture_hours_per_week') {
                newData.undergrad_total_hours_per_week =
                    (parseFloat(newData.undergrad_lab_hours_per_week) || 0) +
                    (parseFloat(newData.undergrad_lecture_hours_per_week) || 0);
            }

            if (field === 'undergrad_lab_contact_hours' || field === 'undergrad_lecture_contact_hours') {
                newData.undergrad_total_contact_hours =
                    (parseFloat(newData.undergrad_lab_contact_hours) || 0) +
                    (parseFloat(newData.undergrad_lecture_contact_hours) || 0);
            }

            if (field === 'graduate_lab_credit_units' || field === 'graduate_lecture_credit_units') {
                newData.graduate_total_credit_units =
                    (parseFloat(newData.graduate_lab_credit_units) || 0) +
                    (parseFloat(newData.graduate_lecture_credit_units) || 0);
            }

            if (field === 'graduate_lab_contact_hours' || field === 'graduate_lecture_contact_hours') {
                newData.graduate_total_contact_hours =
                    (parseFloat(newData.graduate_lab_contact_hours) || 0) +
                    (parseFloat(newData.graduate_lecture_contact_hours) || 0);
            }

            // Calculate total workload
            if (field.includes('_load') || field.includes('credit_units')) {
                newData.total_work_load =
                    (parseFloat(newData.undergrad_total_credit_units) || 0) +
                    (parseFloat(newData.graduate_total_credit_units) || 0) +
                    (parseFloat(newData.research_load) || 0) +
                    (parseFloat(newData.extension_services_load) || 0) +
                    (parseFloat(newData.study_load) || 0) +
                    (parseFloat(newData.production_load) || 0) +
                    (parseFloat(newData.administrative_load) || 0) +
                    (parseFloat(newData.other_load_credits) || 0);
            }

            return newData;
        });

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Required fields - based on your previous form logic
        if (!formData.name?.trim()) newErrors.name = "Name is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.faculty_type) newErrors.faculty_type = "Faculty type is required";
        if (!formData.highest_degree_attained) newErrors.highest_degree_attained = "Highest degree is required";

        // Numeric validations - based on your previous form logic
        if (formData.annual_basic_salary && parseFloat(formData.annual_basic_salary) < 0) {
            newErrors.annual_basic_salary = "Salary cannot be negative";
        }

        if (formData.full_time_equivalent && (parseFloat(formData.full_time_equivalent) < 0 || parseFloat(formData.full_time_equivalent) > 1)) {
            newErrors.full_time_equivalent = "FTE must be between 0 and 1";
        }
        if (formData.ssl_salary_grade && (parseFloat(formData.ssl_salary_grade) < 1 || parseFloat(formData.ssl_salary_grade) > 33)) {
            newErrors.ssl_salary_grade = "Salary Grade must be between 1 and 33";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Reset form data and errors
    const resetForm = () => {
        setFormData({
            name: "",
            gender: "",
            generic_faculty_rank: "",
            home_college: "",
            home_department: "",
            is_tenured: "",
            ssl_salary_grade: "",
            annual_basic_salary: "",
            on_leave_without_pay: "",
            full_time_equivalent: "",
            highest_degree_attained: "",
            pursuing_next_degree: "",
            discipline_teaching_load_1: "",
            discipline_teaching_load_2: "",
            discipline_bachelors: "",
            discipline_masters: "",
            discipline_doctorate: "",
            masters_with_thesis: "",
            doctorate_with_dissertation: "",
            undergrad_lab_credit_units: 0,
            undergrad_lecture_credit_units: 0,
            undergrad_total_credit_units: 0,
            undergrad_lab_hours_per_week: 0,
            undergrad_lecture_hours_per_week: 0,
            undergrad_total_hours_per_week: 0,
            undergrad_lab_contact_hours: 0,
            undergrad_lecture_contact_hours: 0,
            undergrad_total_contact_hours: 0,
            graduate_lab_credit_units: 0,
            graduate_lecture_credit_units: 0,
            graduate_total_credit_units: 0,
            graduate_lab_contact_hours: 0,
            graduate_lecture_contact_hours: 0,
            graduate_total_contact_hours: 0,
            research_load: 0,
            extension_services_load: 0,
            study_load: 0,
            production_load: 0,
            administrative_load: 0,
            other_load_credits: 0,
            total_work_load: 0,
            report_year: new Date().getFullYear(),
            faculty_type: "",
            suc_details_id: institutionId,
        });
        setErrors({});
    };

    return {
        formData,
        errors,
        handleInputChange,
        validateForm,
        facultyRankOptions,
        tenuredOptions,
        annualSalaryOptions,
        onLeavePayOptions,
        fullTimeEquivalentOptions,
        genderOptions,
        highestDegreeOptions,
        pursuingNextDegreeOptions,
        thesisOptions,
        dissertationOptions,
        facultyTypeOptions,
        salaryGradeOptions,
        resetForm,
    };
};
