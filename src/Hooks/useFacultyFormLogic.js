import { useState } from "react";

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

    // Define options based on OCR data
    const facultyRankOptions = [
        { value: "20", label: "Instructor" },
        { value: "30", label: "Assistant Professor" },
        { value: "40", label: "Associate Professor" },
        { value: "50", label: "Full Professor (including University Professor)" },
        { value: "09", label: "Teaching Fellow or Teaching Associate" },
        { value: "11", label: "Lecturer, Senior Lecturer, Professorial Lecturer" },
        { value: "12", label: "Professor Emeritus" },
        { value: "13", label: "Visiting Professor (whatever the actual rank)" },
        { value: "14", label: "Adjunct or Affiliate Faculty (regardless of whether adjunct asst prof or adjunct associate prof or adjunt professor, etc.)" },
        { value: "90", label: "Others" },
    ];

    const tenuredOptions = [
        { value: "1", label: "Faculty member is tenured" },
        { value: "2", label: "Faculty member has his own plantilla item but is NOT TENURED" },
        { value: "3", label: "Faculty member has no plantilla item" },
        { value: "4", label: "No information on the matter" },
    ];

    const annualSalaryOptions = [
        { value: "1", label: "60,000 below" },
        { value: "2", label: "60,000 - 69,999" },
        { value: "3", label: "70,000 - 79,999" },
        { value: "4", label: "80,000 - 89,999" },
        { value: "5", label: "90,000 - 99,999" },
        { value: "6", label: "100,000 - 149,999" },
        { value: "7", label: "150,000 - 249,999" },
        { value: "8", label: "250,000 - 499,999" },
        { value: "9", label: "500,000 - UP" },
    ];

    const onLeavePayOptions = [
        { value: "1", label: "The faculty member is on OFFICIAL LEAVE WITHOUT PAY" },
        { value: "2", label: "The faculty member is in ACTIVE DUTY OR ON OFFICIAL LEAVE WITH PAY." },
        { value: "3", label: "No information on the matter." },
    ];

    const fullTimeEquivalentOptions = [
        { value: "1", label: "1.00" },
        { value: "2", label: "0.50" },
        { value: "3", label: "0.250" },
        // "Used by: A10" is not a direct option value
    ];

    const genderOptions = [
        { value: "1", label: "Male" },
        { value: "2", label: "Female" },
    ];

    const highestDegreeOptions = [
        { value: "000", label: "No formal education at all" },
        { value: "101", label: "Partial elementary schooling but did not complete Grade 4" },
        { value: "102", label: "Completed Grade 4 but did not graduate from elementary school" },
        { value: "103", label: "Completed Elementary School" },
        { value: "201", label: "Partial completion of High School" },
        { value: "202", label: "Secondary school graduate or equivalent" },
        { value: "301", label: "Partial completion of High School" },
        { value: "302", label: "Completed Tech/Voch" },
        { value: "401", label: "Partial completion of pre-baccalaureate certificate, diploma or associateship" },
        { value: "402", label: "Completed pre-bacc certificate, diploma or associateship" },
        { value: "501", label: "Completed Year 1 of baccalaureate level or equivalent" },
        { value: "502", label: "Completed Year 2 of baccalaureate level or equivalent" },
        { value: "503", label: "Completed Year 3 of baccalaureate level or equivalent" },
        { value: "504", label: "Completed Year 4 of baccalaureate level or equivalent" },
        { value: "505", label: "Completed Year 5 of baccalaureate level or equivalent" },
        { value: "506", label: "Completed Year 6 of baccalaureate level or equivalent" },
        { value: "507", label: "Completed a baccalaureate degree (including DVM, DDM, D Opt)" },
        { value: "601", label: "Partial Completion of postgraduate certificate or diploma program" },
        { value: "602", label: "Completed post-grad certificate or diploma program" },
        { value: "701", label: "Completed Year 1 of MD" },
        { value: "702", label: "Completed Year 2 of MD" },
        { value: "703", label: "Completed Year 3 of MD" },
        { value: "704", label: "Completed Year 4 of MD" },
        { value: "705", label: "Completed MD or LLB (or)" },
        { value: "801", label: "Partial completion of" }, // Label truncated in OCR
        { value: "802", label: "Completed all masters" },
        { value: "803", label: "Completed masters" }, // Duplicate label in OCR?
        { value: "901", label: "Partial completion of" }, // Label truncated in OCR
        { value: "902", label: "Completed all doctorate" },
        { value: "903", label: "Completed" }, // Label truncated in OCR?
    ];

    const pursuingNextDegreeOptions = [
        { value: "1", label: "Faculty has already completed doctorate degree in the field where he is teaching." },
        { value: "2", label: "Masters degree holder with some PhD units actively pursuing doctorate degree in the discipline where he is teaching." },
        { value: "3", label: "Masters degree holder with some PhD units in the discipline where he is teaching but no longer actively pursuing a PhD." },
        { value: "4", label: "Masters degree holder with no PhD units in the discipline where he is teaching." },
        { value: "5", label: "Bachelors degree holder with some masters units in the discipline where he is teaching actively pursuing masters degree." },
        { value: "6", label: "Bachelors degree holder with some masters units in the discipline whre he is teaching but no longer in active pursuit of masters degree." },
        { value: "7", label: "Bachelors degree holder with no masters units in the discipline where he is teaching." },
        { value: "8", label: "Not a faculty member." },
        { value: "9", label: "No information on the matter." },
    ];

    const thesisOptions = [
        { value: "1", label: "YES. IN OBTAINING MASTERS DEGREE, THE FACULTY MEMBER WROTE A THESIS." },
        { value: "2", label: "NO. IN OBTAINING HIS MASTERS, FACULTY MEMBER DID NOT WRITE A THESIS." },
        { value: "3", label: "NO INFORMATION ON THE MATTER." },
    ];

    const dissertationOptions = [
        { value: "1", label: "YES. IN OBTAINING DOCTORATE, THE FACULTY MEMBER WROTE A DISSERTATION." },
        { value: "2", label: "NO. IN OBTAINING DOCTORATE, FACULTY MEMBER DID NOT WRITE DISSERTATION." },
        { value: "3", label: "NO INFORMATION ON THE MATTER." },
    ];

    const facultyTypeOptions = [
        { value: "A1", label: "A1 - Full-time with Plantilla" },
        { value: "B", label: "B - Full-time from PS Items" },
        { value: "C1", label: "C1 - Full-time from GAA" },
        { value: "C2", label: "C2 - Full-time from SUC Income" },
        { value: "C3", label: "C3 - Full-time from LGU" },
        { value: "E", label: "E - Part-time Lecturer" },
    ];


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
        resetForm,
    };
};
