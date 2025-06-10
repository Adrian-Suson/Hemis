import { useState } from "react";
import { Save, Plus } from "lucide-react";
import axios from "axios";
import config from "../../../../utils/config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import Dialog from "../../../../Components/Dialog";

function ResearchAddModal({ isOpen, onClose, institutionId, onAddSuccess }) {
    const [activeTab, setActiveTab] = useState("TB1");
    const [loading, setLoading] = useState(false);

    // TB1 Form Data (Articles/Books)
    const [tb1Data, setTb1Data] = useState({
        hei_uiid: institutionId || '',
        title_of_article: '',
        keywords: '',
        authors: '',
        name_of_book_journal: '',
        editors: '',
        vol_no_issue_no: '',
        no_of_pages: '',
        year_of_publication: new Date().getFullYear()
    });

    // TB2 Form Data (Conference Papers)
    const [tb2Data, setTb2Data] = useState({
        hei_uiid: institutionId || '',
        title_of_research_paper: '',
        keywords: '',
        researchers: '',
        conference_title: '',
        conference_venue: '',
        conference_date: '',
        conference_organizer: '',
        type_of_conference: ''
    });

    // TB3 Form Data (Inventions/Patents)
    const [tb3Data, setTb3Data] = useState({
        hei_uiid: institutionId || '',
        inventions: '',
        patent_number: '',
        date_of_issue: '',
        utilization_development: false,
        utilization_service: false,
        name_of_commercial_product: '',
        points: 0
    });

    // TB4 Form Data (Citations)
    const [tb4Data, setTb4Data] = useState({
        hei_uiid: institutionId || '',
        keywords: '',
        researchers: '',
        citing_authors: '',
        citing_article_title: '',
        journal_title: '',
        vol_issue_page_no: '',
        city_year_published: '',
        publisher_name: ''
    });

    // TB5 Form Data (Awards)
    const [tb5Data, setTb5Data] = useState({
        hei_uiid: institutionId || '',
        name_of_researcher: '',
        title_of_research_output_award: '',
        year_published_accepted_presented_received: new Date().getFullYear(),
        publisher_conference_organizer_confering_body: ''
    });

    // TBC Form Data (Training Programs)
    const [tbcData, setTbcData] = useState({
        hei_uiid: institutionId || '',
        title: '',
        keywords: '',
        duration_number_of_hours: '',
        number_of_trainees_beneficiaries: 0,
        citation_title: '',
        citation_confering_agency_body: '',
        citation_year_received: ''
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value, type) => {
        switch (type) {
            case "TB1":
                setTb1Data(prev => ({ ...prev, [field]: value }));
                break;
            case "TB2":
                setTb2Data(prev => ({ ...prev, [field]: value }));
                break;
            case "TB3":
                setTb3Data(prev => ({ ...prev, [field]: value }));
                break;
            case "TB4":
                setTb4Data(prev => ({ ...prev, [field]: value }));
                break;
            case "TB5":
                setTb5Data(prev => ({ ...prev, [field]: value }));
                break;
            case "TBC":
                setTbcData(prev => ({ ...prev, [field]: value }));
                break;
        }

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

        switch (activeTab) {
            case "TB1":
                if (!tb1Data.title_of_article.trim()) {
                    newErrors.title_of_article = "Title of article is required";
                }
                if (!tb1Data.keywords.trim()) {
                    newErrors.keywords = "Keywords are required";
                }
                if (!tb1Data.authors.trim()) {
                    newErrors.authors = "Authors are required";
                }
                if (!tb1Data.name_of_book_journal.trim()) {
                    newErrors.name_of_book_journal = "Journal name is required";
                }
                if (!tb1Data.vol_no_issue_no.trim()) {
                    newErrors.vol_no_issue_no = "Volume/Issue number is required";
                }
                if (!tb1Data.no_of_pages) {
                    newErrors.no_of_pages = "Number of pages is required";
                }
                if (!tb1Data.year_of_publication) {
                    newErrors.year_of_publication = "Year of publication is required";
                }
                break;

            case "TB2":
                if (!tb2Data.title_of_research_paper.trim()) {
                    newErrors.title_of_research_paper = "Title of research paper is required";
                }
                if (!tb2Data.keywords.trim()) {
                    newErrors.keywords = "Keywords are required";
                }
                if (!tb2Data.researchers.trim()) {
                    newErrors.researchers = "Researchers are required";
                }
                if (!tb2Data.conference_title.trim()) {
                    newErrors.conference_title = "Conference title is required";
                }
                if (!tb2Data.conference_venue.trim()) {
                    newErrors.conference_venue = "Conference venue is required";
                }
                if (!tb2Data.conference_date) {
                    newErrors.conference_date = "Conference date is required";
                }
                if (!tb2Data.conference_organizer.trim()) {
                    newErrors.conference_organizer = "Conference organizer is required";
                }
                if (!tb2Data.type_of_conference.trim()) {
                    newErrors.type_of_conference = "Type of conference is required";
                }
                break;

            case "TB3":
                if (!tb3Data.inventions.trim()) {
                    newErrors.inventions = "Inventions are required";
                }
                if (!tb3Data.patent_number.trim()) {
                    newErrors.patent_number = "Patent number is required";
                }
                if (!tb3Data.date_of_issue) {
                    newErrors.date_of_issue = "Date of issue is required";
                }
                if (!tb3Data.name_of_commercial_product.trim()) {
                    newErrors.name_of_commercial_product = "Name of commercial product is required";
                }
                if (!tb3Data.points) {
                    newErrors.points = "Points are required";
                }
                break;

            case "TB4":
                if (!tb4Data.keywords.trim()) {
                    newErrors.keywords = "Keywords are required";
                }
                if (!tb4Data.researchers.trim()) {
                    newErrors.researchers = "Researchers are required";
                }
                if (!tb4Data.citing_authors.trim()) {
                    newErrors.citing_authors = "Citing authors are required";
                }
                if (!tb4Data.citing_article_title.trim()) {
                    newErrors.citing_article_title = "Citing article title is required";
                }
                if (!tb4Data.journal_title.trim()) {
                    newErrors.journal_title = "Journal title is required";
                }
                if (!tb4Data.vol_issue_page_no.trim()) {
                    newErrors.vol_issue_page_no = "Volume/Issue/Page number is required";
                }
                if (!tb4Data.city_year_published.trim()) {
                    newErrors.city_year_published = "City and year published are required";
                }
                if (!tb4Data.publisher_name.trim()) {
                    newErrors.publisher_name = "Publisher name is required";
                }
                break;

            case "TB5":
                if (!tb5Data.name_of_researcher.trim()) {
                    newErrors.name_of_researcher = "Name of researcher is required";
                }
                if (!tb5Data.title_of_research_output_award.trim()) {
                    newErrors.title_of_research_output_award = "Title of research output/award is required";
                }
                if (!tb5Data.year_published_accepted_presented_received) {
                    newErrors.year_published_accepted_presented_received = "Year is required";
                }
                if (!tb5Data.publisher_conference_organizer_confering_body.trim()) {
                    newErrors.publisher_conference_organizer_confering_body = "Publisher/Conference organizer/Conferring body is required";
                }
                break;

            case "TBC":
                if (!tbcData.title.trim()) {
                    newErrors.title = "Title is required";
                }
                if (!tbcData.keywords.trim()) {
                    newErrors.keywords = "Keywords are required";
                }
                if (!tbcData.duration_number_of_hours.trim()) {
                    newErrors.duration_number_of_hours = "Duration (number of hours) is required";
                }
                if (!tbcData.number_of_trainees_beneficiaries) {
                    newErrors.number_of_trainees_beneficiaries = "Number of trainees/beneficiaries is required";
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                setLoading(true);
                let data;
                switch (activeTab) {
                    case "TB1":
                        data = tb1Data;
                        break;
                    case "TB2":
                        data = tb2Data;
                        break;
                    case "TB3":
                        data = tb3Data;
                        break;
                    case "TB4":
                        data = tb4Data;
                        break;
                    case "TB5":
                        data = tb5Data;
                        break;
                    case "TBC":
                        data = tbcData;
                        break;
                }

                const response = await axios.post(
                    `${config.API_URL}/research-${activeTab.toLowerCase()}`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (response.status === 201) {
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: "Research has been added successfully.",
                    });
                    onAddSuccess();
                    onClose();
                }
            } catch (error) {
                console.error("Error adding research:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: error.response?.data?.message || "Failed to add research.",
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClose = () => {
        // Reset all form data
        setTb1Data({
            hei_uiid: institutionId || '',
            title_of_article: '',
            keywords: '',
            authors: '',
            name_of_book_journal: '',
            editors: '',
            vol_no_issue_no: '',
            no_of_pages: '',
            year_of_publication: new Date().getFullYear()
        });

        setTb2Data({
            hei_uiid: institutionId || '',
            title_of_research_paper: '',
            keywords: '',
            researchers: '',
            conference_title: '',
            conference_venue: '',
            conference_date: '',
            conference_organizer: '',
            type_of_conference: ''
        });

        setTb3Data({
            hei_uiid: institutionId || '',
            inventions: '',
            patent_number: '',
            date_of_issue: '',
            utilization_development: false,
            utilization_service: false,
            name_of_commercial_product: '',
            points: 0
        });

        setTb4Data({
            hei_uiid: institutionId || '',
            keywords: '',
            researchers: '',
            citing_authors: '',
            citing_article_title: '',
            journal_title: '',
            vol_issue_page_no: '',
            city_year_published: '',
            publisher_name: ''
        });

        setTb5Data({
            hei_uiid: institutionId || '',
            name_of_researcher: '',
            title_of_research_output_award: '',
            year_published_accepted_presented_received: new Date().getFullYear(),
            publisher_conference_organizer_confering_body: ''
        });

        setTbcData({
            hei_uiid: institutionId || '',
            title: '',
            keywords: '',
            duration_number_of_hours: '',
            number_of_trainees_beneficiaries: 0,
            citation_title: '',
            citation_confering_agency_body: '',
            citation_year_received: ''
        });

        setErrors({});
        onClose();
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "TB1":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title of Article <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb1Data.title_of_article}
                                    onChange={(e) => handleInputChange("title_of_article", e.target.value, "TB1")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.title_of_article ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.title_of_article && <p className="text-red-500 text-xs mt-1">{errors.title_of_article}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Keywords <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb1Data.keywords}
                                    onChange={(e) => handleInputChange("keywords", e.target.value, "TB1")}
                                    placeholder="Separate keywords with commas"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.keywords ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.keywords && <p className="text-red-500 text-xs mt-1">{errors.keywords}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Author(s) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb1Data.authors}
                                    onChange={(e) => handleInputChange("authors", e.target.value, "TB1")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.authors ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.authors && <p className="text-red-500 text-xs mt-1">{errors.authors}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name of Book/Journal <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb1Data.name_of_book_journal}
                                    onChange={(e) => handleInputChange("name_of_book_journal", e.target.value, "TB1")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.name_of_book_journal ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.name_of_book_journal && <p className="text-red-500 text-xs mt-1">{errors.name_of_book_journal}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Editors</label>
                                <input
                                    type="text"
                                    value={tb1Data.editors}
                                    onChange={(e) => handleInputChange("editors", e.target.value, "TB1")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vol. No. / Issue No. <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb1Data.vol_no_issue_no}
                                    onChange={(e) => handleInputChange("vol_no_issue_no", e.target.value, "TB1")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.vol_no_issue_no ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.vol_no_issue_no && <p className="text-red-500 text-xs mt-1">{errors.vol_no_issue_no}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    No. of Pages <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={tb1Data.no_of_pages}
                                    onChange={(e) => handleInputChange("no_of_pages", e.target.value, "TB1")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.no_of_pages ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.no_of_pages && <p className="text-red-500 text-xs mt-1">{errors.no_of_pages}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Year of Publication <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={tb1Data.year_of_publication}
                                    onChange={(e) => handleInputChange("year_of_publication", e.target.value, "TB1")}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.year_of_publication ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.year_of_publication && <p className="text-red-500 text-xs mt-1">{errors.year_of_publication}</p>}
                            </div>
                        </div>
                    </div>
                );
            case "TB2":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title of Research Paper <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb2Data.title_of_research_paper}
                                    onChange={(e) => handleInputChange("title_of_research_paper", e.target.value, "TB2")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.title_of_research_paper ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.title_of_research_paper && <p className="text-red-500 text-xs mt-1">{errors.title_of_research_paper}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Keywords <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb2Data.keywords}
                                    onChange={(e) => handleInputChange("keywords", e.target.value, "TB2")}
                                    placeholder="Separate keywords with commas"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.keywords ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.keywords && <p className="text-red-500 text-xs mt-1">{errors.keywords}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Researchers <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb2Data.researchers}
                                    onChange={(e) => handleInputChange("researchers", e.target.value, "TB2")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.researchers ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.researchers && <p className="text-red-500 text-xs mt-1">{errors.researchers}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Conference Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb2Data.conference_title}
                                    onChange={(e) => handleInputChange("conference_title", e.target.value, "TB2")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.conference_title ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.conference_title && <p className="text-red-500 text-xs mt-1">{errors.conference_title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Conference Venue <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb2Data.conference_venue}
                                    onChange={(e) => handleInputChange("conference_venue", e.target.value, "TB2")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.conference_venue ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.conference_venue && <p className="text-red-500 text-xs mt-1">{errors.conference_venue}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Conference Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={tb2Data.conference_date}
                                    onChange={(e) => handleInputChange("conference_date", e.target.value, "TB2")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.conference_date ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.conference_date && <p className="text-red-500 text-xs mt-1">{errors.conference_date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Conference Organizer <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb2Data.conference_organizer}
                                    onChange={(e) => handleInputChange("conference_organizer", e.target.value, "TB2")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.conference_organizer ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.conference_organizer && <p className="text-red-500 text-xs mt-1">{errors.conference_organizer}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type of Conference <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb2Data.type_of_conference}
                                    onChange={(e) => handleInputChange("type_of_conference", e.target.value, "TB2")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.type_of_conference ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.type_of_conference && <p className="text-red-500 text-xs mt-1">{errors.type_of_conference}</p>}
                            </div>
                        </div>
                    </div>
                );
            case "TB3":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Inventions <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb3Data.inventions}
                                    onChange={(e) => handleInputChange("inventions", e.target.value, "TB3")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.inventions ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.inventions && <p className="text-red-500 text-xs mt-1">{errors.inventions}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Patent Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb3Data.patent_number}
                                    onChange={(e) => handleInputChange("patent_number", e.target.value, "TB3")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.patent_number ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.patent_number && <p className="text-red-500 text-xs mt-1">{errors.patent_number}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Issue <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={tb3Data.date_of_issue}
                                    onChange={(e) => handleInputChange("date_of_issue", e.target.value, "TB3")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.date_of_issue ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.date_of_issue && <p className="text-red-500 text-xs mt-1">{errors.date_of_issue}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name of Commercial Product <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb3Data.name_of_commercial_product}
                                    onChange={(e) => handleInputChange("name_of_commercial_product", e.target.value, "TB3")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.name_of_commercial_product ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.name_of_commercial_product && <p className="text-red-500 text-xs mt-1">{errors.name_of_commercial_product}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Points <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={tb3Data.points}
                                    onChange={(e) => handleInputChange("points", e.target.value, "TB3")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.points ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.points && <p className="text-red-500 text-xs mt-1">{errors.points}</p>}
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={tb3Data.utilization_development}
                                        onChange={(e) => handleInputChange("utilization_development", e.target.checked, "TB3")}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Utilization Development</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={tb3Data.utilization_service}
                                        onChange={(e) => handleInputChange("utilization_service", e.target.checked, "TB3")}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Utilization Service</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case "TB4":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Keywords <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb4Data.keywords}
                                    onChange={(e) => handleInputChange("keywords", e.target.value, "TB4")}
                                    placeholder="Separate keywords with commas"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.keywords ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.keywords && <p className="text-red-500 text-xs mt-1">{errors.keywords}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Researchers <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb4Data.researchers}
                                    onChange={(e) => handleInputChange("researchers", e.target.value, "TB4")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.researchers ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.researchers && <p className="text-red-500 text-xs mt-1">{errors.researchers}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Citing Authors <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb4Data.citing_authors}
                                    onChange={(e) => handleInputChange("citing_authors", e.target.value, "TB4")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.citing_authors ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.citing_authors && <p className="text-red-500 text-xs mt-1">{errors.citing_authors}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Citing Article Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb4Data.citing_article_title}
                                    onChange={(e) => handleInputChange("citing_article_title", e.target.value, "TB4")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.citing_article_title ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.citing_article_title && <p className="text-red-500 text-xs mt-1">{errors.citing_article_title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Journal Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb4Data.journal_title}
                                    onChange={(e) => handleInputChange("journal_title", e.target.value, "TB4")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.journal_title ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.journal_title && <p className="text-red-500 text-xs mt-1">{errors.journal_title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Volume/Issue/Page Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb4Data.vol_issue_page_no}
                                    onChange={(e) => handleInputChange("vol_issue_page_no", e.target.value, "TB4")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.vol_issue_page_no ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.vol_issue_page_no && <p className="text-red-500 text-xs mt-1">{errors.vol_issue_page_no}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City and Year Published <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb4Data.city_year_published}
                                    onChange={(e) => handleInputChange("city_year_published", e.target.value, "TB4")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.city_year_published ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.city_year_published && <p className="text-red-500 text-xs mt-1">{errors.city_year_published}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Publisher Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb4Data.publisher_name}
                                    onChange={(e) => handleInputChange("publisher_name", e.target.value, "TB4")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.publisher_name ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.publisher_name && <p className="text-red-500 text-xs mt-1">{errors.publisher_name}</p>}
                            </div>
                        </div>
                    </div>
                );
            case "TB5":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name of Researcher <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb5Data.name_of_researcher}
                                    onChange={(e) => handleInputChange("name_of_researcher", e.target.value, "TB5")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.name_of_researcher ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.name_of_researcher && <p className="text-red-500 text-xs mt-1">{errors.name_of_researcher}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title of Research Output/Award <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb5Data.title_of_research_output_award}
                                    onChange={(e) => handleInputChange("title_of_research_output_award", e.target.value, "TB5")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.title_of_research_output_award ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.title_of_research_output_award && <p className="text-red-500 text-xs mt-1">{errors.title_of_research_output_award}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Year Published/Accepted/Presented/Received <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={tb5Data.year_published_accepted_presented_received}
                                    onChange={(e) => handleInputChange("year_published_accepted_presented_received", e.target.value, "TB5")}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.year_published_accepted_presented_received ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.year_published_accepted_presented_received && <p className="text-red-500 text-xs mt-1">{errors.year_published_accepted_presented_received}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Publisher/Conference Organizer/Conferring Body <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tb5Data.publisher_conference_organizer_confering_body}
                                    onChange={(e) => handleInputChange("publisher_conference_organizer_confering_body", e.target.value, "TB5")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.publisher_conference_organizer_confering_body ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.publisher_conference_organizer_confering_body && <p className="text-red-500 text-xs mt-1">{errors.publisher_conference_organizer_confering_body}</p>}
                            </div>
                        </div>
                    </div>
                );
            case "TBC":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tbcData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value, "TBC")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.title ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Keywords <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tbcData.keywords}
                                    onChange={(e) => handleInputChange("keywords", e.target.value, "TBC")}
                                    placeholder="Separate keywords with commas"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.keywords ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.keywords && <p className="text-red-500 text-xs mt-1">{errors.keywords}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration (Number of Hours) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={tbcData.duration_number_of_hours}
                                    onChange={(e) => handleInputChange("duration_number_of_hours", e.target.value, "TBC")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.duration_number_of_hours ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.duration_number_of_hours && <p className="text-red-500 text-xs mt-1">{errors.duration_number_of_hours}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Trainees/Beneficiaries <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={tbcData.number_of_trainees_beneficiaries}
                                    onChange={(e) => handleInputChange("number_of_trainees_beneficiaries", e.target.value, "TBC")}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.number_of_trainees_beneficiaries ? "border-red-300 bg-red-50" : "border-gray-300"
                                    }`}
                                />
                                {errors.number_of_trainees_beneficiaries && <p className="text-red-500 text-xs mt-1">{errors.number_of_trainees_beneficiaries}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Citation Title</label>
                                <input
                                    type="text"
                                    value={tbcData.citation_title}
                                    onChange={(e) => handleInputChange("citation_title", e.target.value, "TBC")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Citation Confering Agency/Body</label>
                                <input
                                    type="text"
                                    value={tbcData.citation_confering_agency_body}
                                    onChange={(e) => handleInputChange("citation_confering_agency_body", e.target.value, "TBC")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Citation Year Received</label>
                                <input
                                    type="text"
                                    value={tbcData.citation_year_received}
                                    onChange={(e) => handleInputChange("citation_year_received", e.target.value, "TBC")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Research"
            subtitle="Create a new research entry for the institution"
            icon={Plus}
            variant="default"
            size="xl"
        >
            <div className="space-y-4 max-h-[600px] overflow-y-auto p-4">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-4">
                        {["TB1", "TB2", "TB3", "TB4", "TB5", "TBC"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                                    activeTab === tab
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                {tab === "TB1" ? "Articles/Books" :
                                 tab === "TB2" ? "Conference Papers" :
                                 tab === "TB3" ? "Inventions/Patents" :
                                 tab === "TB4" ? "Citations" :
                                 tab === "TB5" ? "Awards" : "Training Programs"}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content will be rendered by renderTabContent */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                    {renderTabContent()}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Create Research
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}

ResearchAddModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    institutionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onAddSuccess: PropTypes.func.isRequired,
};

export default ResearchAddModal;
