/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    DollarSign,
    ArrowLeft,
    Download,
    BarChart2,
    PieChart,
    Edit3,
} from "lucide-react";
import config from "../../../../utils/config";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import { exportFormGHToExcel } from "../../../../utils/exportFormGHToExcel";

const SucFormGH = () => {
    const { SucDetailId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const heiName = location.state?.heiName || "Unknown Institution";
    const heiUiid = location.state?.heiUiid || "Unknown Uiid";

    // State for Income
    const [incomes, setIncomes] = useState([]);

    // State for Expenditure
    const [expenditures, setExpenditures] = useState([]);

    // State for Allotment
    const [allotments, setAllotments] = useState([]);

    // State for Function Names

    // Common states
    const [activeTab, setActiveTab] = useState("income");
    const [exportLoading, setExportLoading] = useState(false);
    const [editingCell, setEditingCell] = useState(null); // { id: item.id, field: 'function_name', type: 'expenditure' | 'allotment' }

    // Add after the state declarations and before useEffect
    const calculateIncomeTotal = (income) => {
        return (parseFloat(income.tuition_fees) || 0) +
               (parseFloat(income.miscellaneous_fees) || 0) +
               (parseFloat(income.other_income) || 0);
    };

    const calculateExpenditureTotals = (expenditure) => {
        const fund101Total = (parseFloat(expenditure.fund_101_ps) || 0) +
                           (parseFloat(expenditure.fund_101_mooe) || 0) +
                           (parseFloat(expenditure.fund_101_co) || 0);

        const fund164Total = (parseFloat(expenditure.fund_164_ps) || 0) +
                           (parseFloat(expenditure.fund_164_mooe) || 0) +
                           (parseFloat(expenditure.fund_164_co) || 0);

        const totalPS = (parseFloat(expenditure.fund_101_ps) || 0) +
                       (parseFloat(expenditure.fund_164_ps) || 0);

        const totalMOOE = (parseFloat(expenditure.fund_101_mooe) || 0) +
                         (parseFloat(expenditure.fund_164_mooe) || 0);

        const totalCO = (parseFloat(expenditure.fund_101_co) || 0) +
                       (parseFloat(expenditure.fund_164_co) || 0);

        const totalExpend = totalPS + totalMOOE + totalCO;

        return {
            fund_101_total: fund101Total,
            fund_164_total: fund164Total,
            total_ps: totalPS,
            total_mooe: totalMOOE,
            total_co: totalCO,
            total_expend: totalExpend
        };
    };

    const calculateAllotmentTotals = (allotment) => {
        const fund101Total = (parseFloat(allotment.fund_101_ps) || 0) +
                           (parseFloat(allotment.fund_101_mooe) || 0) +
                           (parseFloat(allotment.fund_101_co) || 0);

        const fund164Total = (parseFloat(allotment.fund_164_ps) || 0) +
                           (parseFloat(allotment.fund_164_mooe) || 0) +
                           (parseFloat(allotment.fund_164_co) || 0);

        const totalPS = (parseFloat(allotment.fund_101_ps) || 0) +
                       (parseFloat(allotment.fund_164_ps) || 0);

        const totalMOOE = (parseFloat(allotment.fund_101_mooe) || 0) +
                         (parseFloat(allotment.fund_164_mooe) || 0);

        const totalCO = (parseFloat(allotment.fund_101_co) || 0) +
                       (parseFloat(allotment.fund_164_co) || 0);

        const totalAllot = totalPS + totalMOOE + totalCO;

        return {
            fund_101_total: fund101Total,
            fund_164_total: fund164Total,
            total_ps: totalPS,
            total_mooe: totalMOOE,
            total_co: totalCO,
            total_allot: totalAllot
        };
    };

    // Fetch data when component mounts
    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        if (!SucDetailId) {
            console.error("SucDetailId is undefined");
            return;
        }

        console.log("Fetching data for SucDetailId:", SucDetailId);

        try {
            // Fetch all data (Income, Expenditure, Allotment) in one go
            const response = await axios.get(
                `${config.API_URL}/suc-form-gh/${SucDetailId}/all-data`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        Accept: "application/json",
                    },
                }
            );

            const { income, expenditure, allotment } = response.data.data;

            setIncomes(Array.isArray(income) ? income : []);
            console.log("Fetched Income data:", income);

            setExpenditures(Array.isArray(expenditure) ? expenditure : []);
            console.log("Fetched Expenditure data:", expenditure);

            setAllotments(Array.isArray(allotment) ? allotment : []);
            console.log("Fetched Allotment data:", allotment);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    const handleBack = () => {
        navigate("/super-admin/institutions/suc");
    };

    const formatCurrency = (amount) => {
        if (!amount) return "₱0";
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleExportToExcel = async () => {
        setExportLoading(true);
        Swal.fire({
            title: "Confirm Export",
            text: `Do you want to export Form GH data for ${heiName}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Export",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await exportFormGHToExcel({
                    incomes,
                    expenditures,
                    allotments,
                    heiName,
                    heiUiid,
                });
            }
            setExportLoading(false);
        });
    };

    const handleCellClick = (id, field, type) => {
        setEditingCell({ id, field, type });
    };

    const handleCellChange = (e, id, field, type) => {
        const newValue = e.target.value;
        if (type === "expenditure") {
            setExpenditures((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, [field]: newValue } : item
                )
            );
        } else if (type === "allotment") {
            setAllotments((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, [field]: newValue } : item
                )
            );
        } else if (type === "income") {
            setIncomes((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, [field]: newValue } : item
                )
            );
        }
    };

    const handleCellKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log('Enter key pressed');
            const input = e.target;
            input.blur(); // Trigger blur to save changes
        } else if (e.key === "Escape") {
            e.preventDefault();
            console.log('Escape key pressed');
            setEditingCell(null);
        }
    };

    const handleCellBlur = async (e, item, field, type, isNumber = false, originalValue) => {
        console.log('Blur event triggered');
        console.log('Event type:', e.type);
        console.log('Related target:', e.relatedTarget);

        let newValue = e.target.value.trim();

        // Convert to number if it's a numeric field
        if (isNumber) {
            newValue = parseFloat(newValue) || 0;
        }

        console.log('Original value:', originalValue);
        console.log('New value:', newValue);
        console.log('Field:', field);
        console.log('Type:', type);

        let updatedItem;
        let totals;

        // Update local state immediately before API call for responsiveness
        if (type === "expenditure") {
            updatedItem = { ...item, [field]: newValue };
            totals = calculateExpenditureTotals(updatedItem);
            setExpenditures((prev) =>
                prev.map((dataItem) =>
                    dataItem.id === item.id
                        ? { ...updatedItem, ...totals }
                        : dataItem
                )
            );
        } else if (type === "allotment") {
            updatedItem = { ...item, [field]: newValue };
            totals = calculateAllotmentTotals(updatedItem);
            setAllotments((prev) =>
                prev.map((dataItem) =>
                    dataItem.id === item.id
                        ? { ...updatedItem, ...totals }
                        : dataItem
                )
            );
        } else if (type === "income") {
            updatedItem = { ...item, [field]: newValue };
            const total = calculateIncomeTotal(updatedItem);
            totals = { total_income: total };
            setIncomes((prev) =>
                prev.map((dataItem) =>
                    dataItem.id === item.id
                        ? { ...updatedItem, ...totals }
                        : dataItem
                )
            );
        }

        try {
            const token = localStorage.getItem("token");
            const endpoint = `${config.API_URL}/suc-form-gh/${type}s/${item.id}`;
            const dataToSend = {
                [field]: newValue,
                report_year: item.report_year,
                suc_details_id: item.suc_details_id,
                ...totals // Include all calculated totals in the request
            };

            console.log('Sending data to:', endpoint);
            console.log('Data being sent:', dataToSend);

            const response = await axios.put(endpoint, dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log('Response:', response.data);
            setEditingCell(null);
            await fetchData(); // Re-fetch to ensure totals are updated and data is fresh

            Swal.fire({
                icon: "success",
                title: "Saved!",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error(
                `Error updating ${field} for ${type} id ${item.id}:`,
                error.response || error
            );
            await fetchData(); // Re-fetch to revert to original state if save failed

            Swal.fire({
                icon: "error",
                title: "Failed to save!",
                text: error.response?.data?.message || "Please try again.",
                confirmButtonText: "OK",
            });
        }
    };

    // Editable cell component
    const EditableCell = ({
        value,
        item,
        field,
        type,
        isEditable = true,
        isNumber = false,
    }) => {
        const isEditing =
            editingCell?.id === item.id &&
            editingCell?.field === field &&
            editingCell?.type === type;

        if (isEditing) {
            return (
                <div className="relative">
                    <input
                        type={isNumber ? "number" : "text"}
                        value={value || ""}
                        onChange={(e) => handleCellChange(e, item.id, field, type)}
                        onKeyDown={handleCellKeyDown}
                        onBlur={(e) => handleCellBlur(e, item, field, type, isNumber, value)}
                        className="w-full h-full bg-blue-50 border border-blue-400 px-2 py-1 text-xs focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        autoFocus
                    />
                    <div className="absolute top-full right-0 mt-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded shadow-sm z-40">
                        Enter to save • Esc to cancel
                    </div>
                </div>
            );
        }

        return (
            <div
                className={`w-full h-full px-2 py-1 text-xs truncate group relative ${
                    isEditable ? "cursor-pointer hover:bg-gray-50" : ""
                }`}
                onClick={() =>
                    isEditable && handleCellClick(item.id, field, type)
                }
                title={value}
            >
                <span className="block truncate">
                    {isNumber ? formatCurrency(value) : value}
                </span>
                {isEditable && (
                    <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute top-1 right-1" />
                )}
            </div>
        );
    };

    EditableCell.propTypes = {
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        item: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            // Add other properties of 'item' if they are consistently used and need validation
        }).isRequired,
        field: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        isEditable: PropTypes.bool,
        isNumber: PropTypes.bool,
    };

    const renderIncomeTable = () => (
        <div className="w-full overflow-x-auto border border-gray-200">
            <div className="min-w-[50vh] max-h-[45vh] overflow-y-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-left w-40">
                                Income Category
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-32">
                                Tuition Fees
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-32">
                                Miscellaneous Fees
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-32">
                                Other Income
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-32">
                                Total Income
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {incomes.map((income, index) => (
                            <tr
                                key={income.id}
                                className={`border-b border-gray-200 hover:bg-gray-50 ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                                }`}
                            >
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={income.income_category}
                                        item={income}
                                        field="income_category"
                                        type="income"
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={income.tuition_fees}
                                        item={income}
                                        field="tuition_fees"
                                        type="income"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={income.miscellaneous_fees}
                                        item={income}
                                        field="miscellaneous_fees"
                                        type="income"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={income.other_income}
                                        item={income}
                                        field="other_income"
                                        type="income"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-gray-100">
                                    <EditableCell
                                        value={income.total_income}
                                        item={income}
                                        field="total_income"
                                        type="income"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderExpenditureTable = () => (
        <div className="w-full overflow-x-auto border border-gray-200">
            <div className="min-w-[1400px] max-h-[600px] overflow-y-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-left w-40">
                                Function Name
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 101 PS
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 101 MOOE
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 101 CO
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-blue-50">
                                Fund 101 Total
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 164 PS
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 164 MOOE
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 164 CO
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-blue-50">
                                Fund 164 Total
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-green-50">
                                Total PS
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-green-50">
                                Total MOOE
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-green-50">
                                Total CO
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-32 bg-yellow-50">
                                Total Expenditure
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenditures.map((expenditure, index) => (
                            <tr
                                key={expenditure.id}
                                className={`border-b border-gray-200 hover:bg-gray-50 ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                                }`}
                            >
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={expenditure.function_name}
                                        item={expenditure}
                                        field="function_name"
                                        type="expenditure"
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={expenditure.fund_101_ps}
                                        item={expenditure}
                                        field="fund_101_ps"
                                        type="expenditure"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={expenditure.fund_101_mooe}
                                        item={expenditure}
                                        field="fund_101_mooe"
                                        type="expenditure"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={expenditure.fund_101_co}
                                        item={expenditure}
                                        field="fund_101_co"
                                        type="expenditure"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-blue-50">
                                    <EditableCell
                                        value={expenditure.fund_101_total}
                                        item={expenditure}
                                        field="fund_101_total"
                                        type="expenditure"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={expenditure.fund_164_ps}
                                        item={expenditure}
                                        field="fund_164_ps"
                                        type="expenditure"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={expenditure.fund_164_mooe}
                                        item={expenditure}
                                        field="fund_164_mooe"
                                        type="expenditure"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={expenditure.fund_164_co}
                                        item={expenditure}
                                        field="fund_164_co"
                                        type="expenditure"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-blue-50">
                                    <EditableCell
                                        value={expenditure.fund_164_total}
                                        item={expenditure}
                                        field="fund_164_total"
                                        type="expenditure"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-green-50">
                                    <EditableCell
                                        value={expenditure.total_ps}
                                        item={expenditure}
                                        field="total_ps"
                                        type="expenditure"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-green-50">
                                    <EditableCell
                                        value={expenditure.total_mooe}
                                        item={expenditure}
                                        field="total_mooe"
                                        type="expenditure"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-green-50">
                                    <EditableCell
                                        value={expenditure.total_co}
                                        item={expenditure}
                                        field="total_co"
                                        type="expenditure"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-yellow-50">
                                    <EditableCell
                                        value={expenditure.total_expend}
                                        item={expenditure}
                                        field="total_expend"
                                        type="expenditure"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderAllotmentTable = () => (
        <div className="w-full overflow-x-auto border border-gray-200">
            <div className="min-w-[1400px] max-h-[600px] overflow-y-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-left w-40">
                                Function Name
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 101 PS
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 101 MOOE
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 101 CO
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-blue-50">
                                Fund 101 Total
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 164 PS
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 164 MOOE
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24">
                                Fund 164 CO
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-blue-50">
                                Fund 164 Total
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-green-50">
                                Total PS
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-green-50">
                                Total MOOE
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-24 bg-green-50">
                                Total CO
                            </th>
                            <th className="border-r border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 text-right w-32 bg-yellow-50">
                                Total Allotment
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {allotments.map((allotment, index) => (
                            <tr
                                key={allotment.id}
                                className={`border-b border-gray-200 hover:bg-gray-50 ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                                }`}
                            >
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={allotment.function_name}
                                        item={allotment}
                                        field="function_name"
                                        type="allotment"
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={allotment.fund_101_ps}
                                        item={allotment}
                                        field="fund_101_ps"
                                        type="allotment"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={allotment.fund_101_mooe}
                                        item={allotment}
                                        field="fund_101_mooe"
                                        type="allotment"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={allotment.fund_101_co}
                                        item={allotment}
                                        field="fund_101_co"
                                        type="allotment"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-blue-50">
                                    <EditableCell
                                        value={allotment.fund_101_total}
                                        item={allotment}
                                        field="fund_101_total"
                                        type="allotment"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={allotment.fund_164_ps}
                                        item={allotment}
                                        field="fund_164_ps"
                                        type="allotment"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={allotment.fund_164_mooe}
                                        item={allotment}
                                        field="fund_164_mooe"
                                        type="allotment"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8">
                                    <EditableCell
                                        value={allotment.fund_164_co}
                                        item={allotment}
                                        field="fund_164_co"
                                        type="allotment"
                                        isNumber={true}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-blue-50">
                                    <EditableCell
                                        value={allotment.fund_164_total}
                                        item={allotment}
                                        field="fund_164_total"
                                        type="allotment"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-green-50">
                                    <EditableCell
                                        value={allotment.total_ps}
                                        item={allotment}
                                        field="total_ps"
                                        type="allotment"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-green-50">
                                    <EditableCell
                                        value={allotment.total_mooe}
                                        item={allotment}
                                        field="total_mooe"
                                        type="allotment"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-green-50">
                                    <EditableCell
                                        value={allotment.total_co}
                                        item={allotment}
                                        field="total_co"
                                        type="allotment"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                                <td className="border-r border-gray-200 h-8 bg-yellow-50">
                                    <EditableCell
                                        value={allotment.total_allot}
                                        item={allotment}
                                        field="total_allot"
                                        type="allotment"
                                        isNumber={true}
                                        isEditable={false}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <div className="p-4 max-w-full mx-auto">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={handleBack}
                            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                Financial Management
                            </h1>
                            <p className="text-sm text-gray-600 flex items-center">
                                {heiName}
                            </p>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-sm mb-4">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
                                <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full lg:w-auto">
                                    {/* You can add filters or search here if needed */}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                                    <button
                                        onClick={handleExportToExcel}
                                        disabled={exportLoading}
                                        className="inline-flex items-center justify-center px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        {exportLoading
                                            ? "Exporting..."
                                            : "Export Excel"}
                                    </button>
                                </div>
                            </div>

                            {/* Tab Navigation */}
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-6">
                                    <button
                                        onClick={() => setActiveTab("income")}
                                        className={`${
                                            activeTab === "income"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center`}
                                    >
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        Income ({incomes.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("expenditure")}
                                        className={`${
                                            activeTab === "expenditure"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center`}
                                    >
                                        <BarChart2 className="w-4 h-4 mr-2" />
                                        Expenditure ({expenditures.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("allotment")}
                                        className={`${
                                            activeTab === "allotment"
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center`}
                                    >
                                        <PieChart className="w-4 h-4 mr-2" />
                                        Allotment ({allotments.length})
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
                    {activeTab === "income" && renderIncomeTable()}
                    {activeTab === "expenditure" && renderExpenditureTable()}
                    {activeTab === "allotment" && renderAllotmentTable()}
                </div>

                {/* Instructions */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Excel-like editing:</strong> Click on any
                        editable cell to edit. Press Enter to save or Escape to
                        cancel. Calculated fields (totals) are highlighted and
                        read-only.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SucFormGH;
