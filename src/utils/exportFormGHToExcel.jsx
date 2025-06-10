// utils/excelExport.js
import ExcelJS from "exceljs";
import Swal from "sweetalert2";

/**
 * Export Form GH data (Income, Expenditure, Allotment) to Excel
 * @param {Object} params - Export parameters
 * @param {Array} params.incomes - Income data array
 * @param {Array} params.expenditures - Expenditure data array
 * @param {Array} params.allotments - Allotment data array
 * @param {string} params.heiName - Institution name
 * @param {string} params.heiUiid - Institution UIID
 * @param {Function} params.setExportLoading - Loading state setter
 */
export const exportFormGHToExcel = async ({
    incomes,
    expenditures,
    allotments,
    heiName,
    heiUiid,
    setExportLoading
}) => {
    try {
        if (typeof setExportLoading === 'function') {
            setExportLoading(true);
        }



        const workbook = new ExcelJS.Workbook();

        // Define common styles
        const thinBorder = {
            style: "thin",
            color: { argb: "FF000000" },
        };
        const fullBorder = {
            top: thinBorder,
            left: thinBorder,
            bottom: thinBorder,
            right: thinBorder,
        };
        const reportYear = incomes[0]?.report_year || new Date().getFullYear();

        // Create Allotment Sheet
        createAllotmentSheet(workbook, allotments, heiName, reportYear, fullBorder);

        // Create Expenditure Sheet
        createExpenditureSheet(workbook, expenditures, heiName, reportYear, fullBorder);

        // Create Income Sheet
        createIncomeSheet(workbook, incomes, heiName, reportYear, fullBorder);

        // Generate filename and download
        const fileName = `${heiUiid}_${heiName.replace(/[^a-zA-Z0-9]/g, "_")}_FormGH_${new Date().toISOString().split("T")[0]}.xlsx`;
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        Swal.fire({
            title: "Success!",
            text: "Form GH data exported successfully.",
            icon: "success",
            timer: 4000,
            showConfirmButton: false,
        });

    } catch (error) {
        console.error("Error exporting data:", error);
        Swal.fire({
            title: "Error!",
            text: "Failed to export data. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
        });
    } finally {
        if (typeof setExportLoading === 'function') {
            setExportLoading(false);
        }
    }
};

/**
 * Create Allotment Sheet (Form G-1)
 */
const createAllotmentSheet = (workbook, allotments, heiName, reportYear, fullBorder) => {
    const allotmentSheet = workbook.addWorksheet("FORM G-1 - ALLOTMENTS");

    // Set column widths
    allotmentSheet.columns = [
        { width: 5 }, // A - Row numbers
        { width: 25 }, // B - Function
        { width: 12 }, // C - Fund 101 PS
        { width: 12 }, // D - Fund 101 MOOE
        { width: 12 }, // E - Fund 101 CO
        { width: 15 }, // F - Fund 101 Total
        { width: 12 }, // G - Fund 164 PS
        { width: 12 }, // H - Fund 164 MOOE
        { width: 12 }, // I - Fund 164 CO
        { width: 15 }, // J - Fund 164 Total
        { width: 12 }, // K - Total PS
        { width: 12 }, // L - Total MOOE
        { width: 12 }, // M - Total CO
        { width: 18 }, // N - Total Allotment
    ];

    // Add title rows
    addTitleRows(allotmentSheet, heiName, reportYear, "G-1: ALLOTMENTS");

    // Add headers
    addFinancialHeaders(allotmentSheet, "ALLOT.");

    // Add allotment data
    let currentRow = 10;
    console.log("Exporting allotment data:", allotments);

    allotments.forEach((allotment, index) => {
        console.log(`Processing allotment row ${index + 1}:`, allotment);

        allotmentSheet.getCell(`A${currentRow}`).value = `${index + 1}.0`;
        allotmentSheet.getCell(`B${currentRow}`).value = allotment.function_name || '';

        // Fund 101
        allotmentSheet.getCell(`C${currentRow}`).value = parseFloat(allotment.fund_101_ps) || 0;
        allotmentSheet.getCell(`D${currentRow}`).value = parseFloat(allotment.fund_101_mooe) || 0;
        allotmentSheet.getCell(`E${currentRow}`).value = parseFloat(allotment.fund_101_co) || 0;
        allotmentSheet.getCell(`F${currentRow}`).value = parseFloat(allotment.fund_101_total) || 0;

        // Fund 164
        allotmentSheet.getCell(`G${currentRow}`).value = parseFloat(allotment.fund_164_ps) || 0;
        allotmentSheet.getCell(`H${currentRow}`).value = parseFloat(allotment.fund_164_mooe) || 0;
        allotmentSheet.getCell(`I${currentRow}`).value = parseFloat(allotment.fund_164_co) || 0;
        allotmentSheet.getCell(`J${currentRow}`).value = parseFloat(allotment.fund_164_total) || 0;

        // Totals
        allotmentSheet.getCell(`K${currentRow}`).value = parseFloat(allotment.total_ps) || 0;
        allotmentSheet.getCell(`L${currentRow}`).value = parseFloat(allotment.total_mooe) || 0;
        allotmentSheet.getCell(`M${currentRow}`).value = parseFloat(allotment.total_co) || 0;
        allotmentSheet.getCell(`N${currentRow}`).value = parseFloat(allotment.total_allot) || 0;

        // Style data rows
        styleDataRow(allotmentSheet, currentRow, fullBorder);
        currentRow++;
    });

    // Add footer notes
    addBudgetFooterNotes(allotmentSheet, currentRow + 2);
};

/**
 * Create Expenditure Sheet (Form G-2)
 */
const createExpenditureSheet = (workbook, expenditures, heiName, reportYear, fullBorder) => {
    const expenditureSheet = workbook.addWorksheet("FORM G-2 - EXPENDITURES");

    // Set column widths
    expenditureSheet.columns = [
        { width: 5 }, // A - Row numbers
        { width: 25 }, // B - Function
        { width: 12 }, // C - Fund 101 PS
        { width: 12 }, // D - Fund 101 MOOE
        { width: 12 }, // E - Fund 101 CO
        { width: 15 }, // F - Fund 101 Total
        { width: 12 }, // G - Fund 164 PS
        { width: 12 }, // H - Fund 164 MOOE
        { width: 12 }, // I - Fund 164 CO
        { width: 15 }, // J - Fund 164 Total
        { width: 12 }, // K - Total PS
        { width: 12 }, // L - Total MOOE
        { width: 12 }, // M - Total CO
        { width: 18 }, // N - Grand Total
    ];

    // Add title rows (note: there's a bug in original - should be G-2 for expenditure)
    addTitleRows(expenditureSheet, heiName, reportYear, "G-2: EXPENDITURES");

    // Add headers
    addFinancialHeaders(expenditureSheet, "ALLOT.");

    // Add expenditure data
    let currentRow = 10;
    console.log("Exporting expenditure data:", expenditures);

    expenditures.forEach((expenditure, index) => {
        console.log(`Processing expenditure row ${index + 1}:`, expenditure);

        // Calculate totals for this row
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

        expenditureSheet.getCell(`A${currentRow}`).value = `${index + 1}.0`;
        expenditureSheet.getCell(`B${currentRow}`).value = expenditure.function_name || '';

        // Fund 101
        expenditureSheet.getCell(`C${currentRow}`).value = parseFloat(expenditure.fund_101_ps) || 0;
        expenditureSheet.getCell(`D${currentRow}`).value = parseFloat(expenditure.fund_101_mooe) || 0;
        expenditureSheet.getCell(`E${currentRow}`).value = parseFloat(expenditure.fund_101_co) || 0;
        expenditureSheet.getCell(`F${currentRow}`).value = fund101Total;

        // Fund 164
        expenditureSheet.getCell(`G${currentRow}`).value = parseFloat(expenditure.fund_164_ps) || 0;
        expenditureSheet.getCell(`H${currentRow}`).value = parseFloat(expenditure.fund_164_mooe) || 0;
        expenditureSheet.getCell(`I${currentRow}`).value = parseFloat(expenditure.fund_164_co) || 0;
        expenditureSheet.getCell(`J${currentRow}`).value = fund164Total;

        // Totals
        expenditureSheet.getCell(`K${currentRow}`).value = totalPS;
        expenditureSheet.getCell(`L${currentRow}`).value = totalMOOE;
        expenditureSheet.getCell(`M${currentRow}`).value = totalCO;
        expenditureSheet.getCell(`N${currentRow}`).value = totalExpend;

        // Style data rows
        styleDataRow(expenditureSheet, currentRow, fullBorder);
        currentRow++;
    });

    // Add footer notes
    addBudgetFooterNotes(expenditureSheet, currentRow + 2);
};

/**
 * Create Income Sheet (Form H)
 */
const createIncomeSheet = (workbook, incomes, heiName, reportYear, fullBorder) => {
    const incomeSheet = workbook.addWorksheet("FORM H - INCOME");

    // Set column widths
    incomeSheet.columns = [
        { width: 5 }, // A - Row numbers
        { width: 25 }, // B - Description
        { width: 22 }, // C - Tuition Fees
        { width: 22 }, // D - Miscellaneous
        { width: 22 }, // E - Other Income
        { width: 20 }, // F - Total
    ];

    // Title and Headers
    incomeSheet.getCell("A1").value = `FORM H: STATEMENT OF INCOME ( Jan 1 to Dec 31 ${reportYear})`;
    incomeSheet.mergeCells("A1:F1");
    incomeSheet.getCell("A1").font = { bold: true, size: 14 };
    incomeSheet.getCell("A1").alignment = { horizontal: "center" };

    incomeSheet.getCell("A2").value = "BY CAMPUS and FUNCTION";
    incomeSheet.mergeCells("A2:F2");
    incomeSheet.getCell("A2").font = { bold: true };
    incomeSheet.getCell("A2").alignment = { horizontal: "center" };

    incomeSheet.getCell("A3").value = `SUC ${heiName.toUpperCase()}`;
    incomeSheet.mergeCells("A3:F3");
    incomeSheet.getCell("A3").font = { bold: true, color: { argb: "FF0000FF" } };
    incomeSheet.getCell("A3").alignment = { horizontal: "center" };

    incomeSheet.getCell("A4").value = "CAMPUS";
    incomeSheet.mergeCells("A4:F4");
    incomeSheet.getCell("A4").font = { bold: true, color: { argb: "FFFF0000" } };
    incomeSheet.getCell("A4").alignment = { horizontal: "center" };

    // Table headers
    incomeSheet.getCell("A6").value = "";
    incomeSheet.getCell("B6").value = "SUC CAMPUS";
    incomeSheet.getCell("C6").value = "TUITION AND MISC FEES";
    incomeSheet.getCell("D6").value = "MISCELLANEOUS";
    incomeSheet.getCell("E6").value = "OTHER INCOME";
    incomeSheet.getCell("F6").value = "TOTAL SUC INCOME";

    // Style headers
    ["A6", "B6", "C6", "D6", "E6", "F6"].forEach((cell) => {
        incomeSheet.getCell(cell).font = { bold: true };
        incomeSheet.getCell(cell).alignment = { horizontal: "center", vertical: "middle" };
        incomeSheet.getCell(cell).border = fullBorder;
        incomeSheet.getCell(cell).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFECECEC" } };
    });

    // Add income data
    let currentRow = 7;
    console.log("Exporting income data:", incomes);

    incomes.forEach((income, index) => {
        console.log(`Processing income row ${index + 1}:`, income);

        // Calculate totals for this row
        const tuitionFees = parseFloat(income.tuition_fees) || 0;
        const miscFees = parseFloat(income.miscellaneous_fees) || 0;
        const otherIncome = parseFloat(income.other_income) || 0;
        const totalIncome = tuitionFees + miscFees + otherIncome;

        incomeSheet.getCell(`A${currentRow}`).value = `${index + 1}.0`;
        incomeSheet.getCell(`B${currentRow}`).value = income.income_category || income.campus || '';
        incomeSheet.getCell(`C${currentRow}`).value = tuitionFees;
        incomeSheet.getCell(`D${currentRow}`).value = miscFees;
        incomeSheet.getCell(`E${currentRow}`).value = otherIncome;
        incomeSheet.getCell(`F${currentRow}`).value = totalIncome;

        // Style data rows
        ["A", "B", "C", "D", "E", "F"].forEach((col) => {
            const cell = incomeSheet.getCell(`${col}${currentRow}`);
            cell.border = fullBorder;
            if (["C", "D", "E", "F"].includes(col)) {
                cell.numFmt = "#,##0.00";
                cell.alignment = { horizontal: "right" };
            }
        });
        currentRow++;
    });

    // Add totals row
    incomeSheet.getCell(`B${currentRow}`).value = "GRAND TOTAL FOR SUC";
    incomeSheet.getCell(`B${currentRow}`).font = { bold: true };

    // Calculate grand totals
    const grandTotals = incomes.reduce((acc, income) => {
        const tuitionFees = parseFloat(income.tuition_fees) || 0;
        const miscFees = parseFloat(income.miscellaneous_fees) || 0;
        const otherIncome = parseFloat(income.other_income) || 0;
        const totalIncome = tuitionFees + miscFees + otherIncome;

        acc.tuitionFees += tuitionFees;
        acc.miscFees += miscFees;
        acc.otherIncome += otherIncome;
        acc.totalIncome += totalIncome;
        return acc;
    }, { tuitionFees: 0, miscFees: 0, otherIncome: 0, totalIncome: 0 });

    console.log("Grand totals:", grandTotals);

    // Add grand totals to the last row
    incomeSheet.getCell(`C${currentRow}`).value = grandTotals.tuitionFees;
    incomeSheet.getCell(`D${currentRow}`).value = grandTotals.miscFees;
    incomeSheet.getCell(`E${currentRow}`).value = grandTotals.otherIncome;
    incomeSheet.getCell(`F${currentRow}`).value = grandTotals.totalIncome;

    // Style the totals row
    ["A", "B", "C", "D", "E", "F"].forEach((col) => {
        const cell = incomeSheet.getCell(`${col}${currentRow}`);
        cell.border = fullBorder;
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFF0" } };
        if (["C", "D", "E", "F"].includes(col)) {
            cell.numFmt = "#,##0.00";
            cell.alignment = { horizontal: "right" };
            cell.font = { bold: true };
        }
    });

    // Add footer notes
    addIncomeFooterNotes(incomeSheet, currentRow + 2);
};

/**
 * Add common title rows to sheets
 */
const addTitleRows = (sheet, heiName, reportYear, formTitle) => {
    sheet.getCell("A1").value = `HEMIS DATA COLLECTION ${reportYear}`;
    sheet.mergeCells("A1:N1");
    sheet.getCell("A1").font = { bold: true, size: 12 };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    sheet.getCell("A2").value = `Form ${formTitle} ( FUND 101 and FUND 164) FY ${reportYear}`;
    sheet.mergeCells("A2:N2");
    sheet.getCell("A2").font = { bold: true, size: 14 };
    sheet.getCell("A2").alignment = { horizontal: "center" };

    sheet.getCell("A3").value = "BY CAMPUS and by FUNCTION";
    sheet.mergeCells("A3:N3");
    sheet.getCell("A3").font = { bold: true };
    sheet.getCell("A3").alignment = { horizontal: "center" };

    sheet.getCell("A4").value = `SUC ${heiName.toUpperCase()}`;
    sheet.mergeCells("A4:N4");
    sheet.getCell("A4").font = { bold: true, color: { argb: "FF0000FF" } };
    sheet.getCell("A4").alignment = { horizontal: "center" };

    sheet.getCell("A5").value = "CAMPUS";
    sheet.mergeCells("A5:N5");
    sheet.getCell("A5").font = { bold: true, color: { argb: "FFFF0000" } };
    sheet.getCell("A5").alignment = { horizontal: "center" };
};

/**
 * Add financial headers (for allotment and expenditure sheets)
 */
const addFinancialHeaders = (sheet, totalLabel) => {
    const thinBorder = {
        style: "thin",
        color: { argb: "FF000000" },
    };
    const fullBorder = {
        top: thinBorder,
        left: thinBorder,
        bottom: thinBorder,
        right: thinBorder,
    };

    // Multi-level Headers
    sheet.getCell("A7").value = "";
    sheet.getCell("B7").value = "";
    sheet.getCell("C7").value = "ALLOTMENTS FROM GAA";
    sheet.mergeCells("C7:F7");
    sheet.getCell("G7").value = "ALLOTMENTS FROM SUC INCOME";
    sheet.mergeCells("G7:J7");
    sheet.getCell("K7").value = "ALLOTMENTS ( GAA AND SUC INCOME)";
    sheet.mergeCells("K7:N7");

    sheet.getCell("A8").value = "";
    sheet.getCell("B8").value = "FUNCTION";
    sheet.getCell("C8").value = "FUND 101";
    sheet.mergeCells("C8:F8");
    sheet.getCell("G8").value = "FUND 164";
    sheet.mergeCells("G8:J8");
    sheet.getCell("K8").value = "TOTAL";
    sheet.mergeCells("K8:N8");

    sheet.getCell("A9").value = "";
    sheet.getCell("B9").value = "";
    sheet.getCell("C9").value = "PS";
    sheet.getCell("D9").value = "MOOE";
    sheet.getCell("E9").value = "CO";
    sheet.getCell("F9").value = "TOTAL";
    sheet.getCell("G9").value = "PS";
    sheet.getCell("H9").value = "MOOE";
    sheet.getCell("I9").value = "CO";
    sheet.getCell("J9").value = "TOTAL";
    sheet.getCell("K9").value = "PS";
    sheet.getCell("L9").value = "MOOE";
    sheet.getCell("M9").value = "CO";
    sheet.getCell("N9").value = `TOTAL ${totalLabel}`;

    // Style headers
    ["A7", "B7", "C7", "G7", "K7", "A8", "B8", "C8", "G8", "K8", "A9", "B9", "C9", "D9", "E9", "F9", "G9", "H9", "I9", "J9", "K9", "L9", "M9", "N9"].forEach((cellRef) => {
        const cell = sheet.getCell(cellRef);
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
        cell.border = fullBorder;
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFECECEC" } };
    });
};

/**
 * Style data rows for financial sheets
 */
const styleDataRow = (sheet, currentRow, fullBorder) => {
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"].forEach((col) => {
        const cell = sheet.getCell(`${col}${currentRow}`);
        cell.border = fullBorder;
        if (["C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"].includes(col)) {
            cell.numFmt = "#,##0.00";
            cell.alignment = { horizontal: "right" };
        }
        if (["F", "J", "N"].includes(col)) {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F0F0" } };
        }
    });
};

/**
 * Add footer notes to income sheet
 */
const addIncomeFooterNotes = (sheet, startRow) => {
    let currentRow = startRow;

    sheet.getCell(`A${currentRow}`).value = "NOTE: TUITION AND INCOME FROM MISCELLANEOUS FEES SHOULD BE TABULATED SEPARATELY.";
    sheet.mergeCells(`A${currentRow}:F${currentRow}`);
    sheet.getCell(`A${currentRow}`).font = { italic: true };

    currentRow += 1;
    sheet.getCell(`A${currentRow}`).value = "ALL SUC RECEIVABLES SHOULD BE CERTIFIED BY THE SUC.";
    sheet.mergeCells(`A${currentRow}:F${currentRow}`);
    sheet.getCell(`A${currentRow}`).font = { italic: true };

    currentRow += 2;
    sheet.getCell(`A${currentRow}`).value = "ORIGINAL DATA SUPPLIED BY:";
    sheet.mergeCells(`A${currentRow}:B${currentRow}`);
    sheet.getCell(`D${currentRow}`).value = " ";
    sheet.mergeCells(`D${currentRow}:F${currentRow}`);

    currentRow += 1;
    sheet.getCell(`A${currentRow}`).value = "DATA KEYED IN BY:";
    sheet.mergeCells(`A${currentRow}:B${currentRow}`);
    sheet.getCell(`D${currentRow}`).value = " ";
    sheet.mergeCells(`D${currentRow}:F${currentRow}`);

    currentRow += 1;
    sheet.getCell(`A${currentRow}`).value = "CERTIFIED CORRECT BY:";
    sheet.mergeCells(`A${currentRow}:B${currentRow}`);
    sheet.getCell(`D${currentRow}`).value = " ";
    sheet.mergeCells(`D${currentRow}:F${currentRow}`);
};

/**
 * Add footer notes for Allotment and Expenditure sheets (IOB note and signature rows)
 */
const addBudgetFooterNotes = (sheet, startRow) => {
    let currentRow = startRow;
    // NOTE row
    sheet.getCell(`A${currentRow}`).value = "NOTE:";
    sheet.getCell(`A${currentRow}`).font = { bold: true };
    sheet.getCell(`B${currentRow}`).value = "THIS, IN EFFECT, IS THE INTERNAL OPERATING BUDGET (IOB) OF THE SUC.";
    sheet.mergeCells(`B${currentRow}:N${currentRow}`);
    sheet.getCell(`B${currentRow}`).font = { bold: false };
    currentRow += 2;
    // Signature rows
    sheet.getCell(`B${currentRow}`).value = "ORIGINAL DATA SUPPLIED BY:";
    sheet.mergeCells(`B${currentRow}:D${currentRow}`);
    sheet.getCell(`F${currentRow}`).value = "PRINTED NAME, POSITION, SIGNATURE, DATE";
    sheet.mergeCells(`F${currentRow}:N${currentRow}`);
    currentRow += 1;
    sheet.getCell(`B${currentRow}`).value = "DATA KEYED IN BY:";
    sheet.mergeCells(`B${currentRow}:D${currentRow}`);
    sheet.getCell(`F${currentRow}`).value = "PRINTED NAME, POSITION, SIGNATURE, DATE";
    sheet.mergeCells(`F${currentRow}:N${currentRow}`);
    currentRow += 1;
    sheet.getCell(`B${currentRow}`).value = "CERTIFIED CORRECT BY:";
    sheet.mergeCells(`B${currentRow}:D${currentRow}`);
    sheet.getCell(`F${currentRow}`).value = "PRINTED NAME, POSITION, SIGNATURE, DATE";
    sheet.mergeCells(`F${currentRow}:N${currentRow}`);
};
