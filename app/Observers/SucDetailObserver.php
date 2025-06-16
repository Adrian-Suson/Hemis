<?php

namespace App\Observers;

use App\Models\Allotment;
use App\Models\FunctionName;
use App\Models\ReportYear;
use App\Models\SucDetails;
use App\Models\Expenditure;
use App\Models\Income;

class SucDetailObserver
{
    public function created(SucDetails $sucDetail)
    {
        // Get all function names
        $functionNames = [
            "INSTRUCTION",
            "RESEARCH",
            "EXTENSION SERVICE",
            "PRODUCTION",
            "OTHERS, PLEASE SPECIFY",
            "Advanced Education Services (MFO2)",
            "Administrative Services (A.I.A)",
            "Auxiliary Services (Library)",
            "Mandatory Reserve",
            "Retirement & Life Insurance Premium",
            "Special Purpose Fund",
        ];

        // Define default income categories
        $incomeCategories = [
            "Tuition",
            "Laboratory",
            "Registration",
            "Entrance fees",
            "Identification Card",
            "Diploma",
            "Dropping/Changing of Subjects",
            "Transcript of Records",
            "Late Registration",
            "Removal/Completion of Grades",
            "Certification",
            "CFAT/Tech Admission",
            "Telephone/Internet and Electricity",
            "Replacement/Breakages & Fines",
            "Medical/Dental",
            "Library Fee",
            "Athletic Fee",
            "Cultural Development",
            "Affiliation Fees",
            "Examination Fee",
            "Other School Fees",
            "Other Business Income",
        ];

        // Use the report year from the SUC details
        $reportYear = $sucDetail->report_year;

        if (!$reportYear) {
            return;
        }

        // Create allotment records for each function name
        foreach ($functionNames as $functionName) {
            Allotment::create([
                'suc_details_id' => $sucDetail->id,
                'campus' => $sucDetail->campus,
                'function_name' => $functionName,
                'fund_101_ps' => 0,
                'fund_101_mooe' => 0,
                'fund_101_co' => 0,
                'fund_101_total' => 0,
                'fund_164_ps' => 0,
                'fund_164_mooe' => 0,
                'fund_164_co' => 0,
                'fund_164_total' => 0,
                'total_ps' => 0,
                'total_mooe' => 0,
                'total_co' => 0,
                'total_allot' => 0,
                'report_year' => $reportYear
            ]);
        }

        // Create expenditure records for each function name
        foreach ($functionNames as $functionName) {
            Expenditure::create([
                'suc_details_id' => $sucDetail->id,
                'campus' => $sucDetail->campus,
                'function_name' => $functionName,
                'fund_101_ps' => 0,
                'fund_101_mooe' => 0,
                'fund_101_co' => 0,
                'fund_101_total' => 0,
                'fund_164_ps' => 0,
                'fund_164_mooe' => 0,
                'fund_164_co' => 0,
                'fund_164_total' => 0,
                'total_ps' => 0,
                'total_mooe' => 0,
                'total_co' => 0,
                'total_expend' => 0,
                'report_year' => $reportYear
            ]);
        }

        // Create income records for each income category
        foreach ($incomeCategories as $category) {
            Income::create([
                'suc_details_id' => $sucDetail->id,
                'campus' => $sucDetail->campus,
                'income_category' => $category,
                'tuition_fees' => 0,
                'miscellaneous_fees' => 0,
                'other_income' => 0,
                'total_income' => 0,
                'report_year' => $reportYear
            ]);
        }
    }
}
