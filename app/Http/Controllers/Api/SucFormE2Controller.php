<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SucFormE2;
use Illuminate\Http\Request;

class SucFormE2Controller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sucFormE2s = SucFormE2::with(['sucDetail', 'reportYear'])->get();
        return response()->json($sucFormE2s);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'suc_details_id' => 'required|exists:suc_details,id',
            'name' => 'required|string|max:255',
            'generic_faculty_rank' => 'nullable|integer',
            'home_college' => 'nullable|string|max:255',
            'home_department' => 'nullable|string|max:255',
            'is_tenured' => 'nullable|boolean',
            'ssl_salary_grade' => 'nullable|integer',
            'annual_basic_salary' => 'nullable|numeric',
            'on_leave_without_pay' => 'nullable|boolean',
            'full_time_equivalent' => 'nullable|numeric',
            'gender' => 'nullable|integer',
            'highest_degree_attained' => 'nullable|integer',
            'pursuing_next_degree' => 'nullable|boolean',
            'discipline_teaching_load_1' => 'nullable|string|max:255',
            'discipline_teaching_load_2' => 'nullable|string|max:255',
            'discipline_bachelors' => 'nullable|string|max:255',
            'discipline_masters' => 'nullable|string|max:255',
            'discipline_doctorate' => 'nullable|string|max:255',
            'masters_with_thesis' => 'nullable|boolean',
            'doctorate_with_dissertation' => 'nullable|boolean',
            'undergrad_lab_credit_units' => 'nullable|numeric',
            'undergrad_lecture_credit_units' => 'nullable|numeric',
            'undergrad_total_credit_units' => 'nullable|numeric',
            'undergrad_lab_hours_per_week' => 'nullable|numeric',
            'undergrad_lecture_hours_per_week' => 'nullable|numeric',
            'undergrad_total_hours_per_week' => 'nullable|numeric',
            'undergrad_lab_contact_hours' => 'nullable|numeric',
            'undergrad_lecture_contact_hours' => 'nullable|numeric',
            'undergrad_total_contact_hours' => 'nullable|numeric',
            'graduate_lab_credit_units' => 'nullable|numeric',
            'graduate_lecture_credit_units' => 'nullable|numeric',
            'graduate_total_credit_units' => 'nullable|numeric',
            'graduate_lab_contact_hours' => 'nullable|numeric',
            'graduate_lecture_contact_hours' => 'nullable|numeric',
            'graduate_total_contact_hours' => 'nullable|numeric',
            'research_load' => 'nullable|numeric',
            'extension_services_load' => 'nullable|numeric',
            'study_load' => 'nullable|numeric',
            'production_load' => 'nullable|numeric',
            'administrative_load' => 'nullable|numeric',
            'other_load_credits' => 'nullable|numeric',
            'total_work_load' => 'nullable|numeric',
            'report_year' => 'required|integer|exists:report_years,year',
        ]);

        $sucFormE2 = SucFormE2::create($validatedData);
        return response()->json($sucFormE2, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $sucFormE2 = SucFormE2::with(['sucDetail', 'reportYear'])->findOrFail($id);
        return response()->json($sucFormE2);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $sucFormE2 = SucFormE2::findOrFail($id);

        $validatedData = $request->validate([
            'suc_details_id' => 'sometimes|exists:suc_details,id',
            'name' => 'sometimes|string|max:255',
            'generic_faculty_rank' => 'nullable|integer',
            'home_college' => 'nullable|string|max:255',
            'home_department' => 'nullable|string|max:255',
            'is_tenured' => 'nullable|boolean',
            'ssl_salary_grade' => 'nullable|integer',
            'annual_basic_salary' => 'nullable|numeric',
            'on_leave_without_pay' => 'nullable|boolean',
            'full_time_equivalent' => 'nullable|numeric',
            'gender' => 'nullable|integer',
            'highest_degree_attained' => 'nullable|integer',
            'pursuing_next_degree' => 'nullable|boolean',
            'discipline_teaching_load_1' => 'nullable|string|max:255',
            'discipline_teaching_load_2' => 'nullable|string|max:255',
            'discipline_bachelors' => 'nullable|string|max:255',
            'discipline_masters' => 'nullable|string|max:255',
            'discipline_doctorate' => 'nullable|string|max:255',
            'masters_with_thesis' => 'nullable|boolean',
            'doctorate_with_dissertation' => 'nullable|boolean',
            'undergrad_lab_credit_units' => 'nullable|numeric',
            'undergrad_lecture_credit_units' => 'nullable|numeric',
            'undergrad_total_credit_units' => 'nullable|numeric',
            'undergrad_lab_hours_per_week' => 'nullable|numeric',
            'undergrad_lecture_hours_per_week' => 'nullable|numeric',
            'undergrad_total_hours_per_week' => 'nullable|numeric',
            'undergrad_lab_contact_hours' => 'nullable|numeric',
            'undergrad_lecture_contact_hours' => 'nullable|numeric',
            'undergrad_total_contact_hours' => 'nullable|numeric',
            'graduate_lab_credit_units' => 'nullable|numeric',
            'graduate_lecture_credit_units' => 'nullable|numeric',
            'graduate_total_credit_units' => 'nullable|numeric',
            'graduate_lab_contact_hours' => 'nullable|numeric',
            'graduate_lecture_contact_hours' => 'nullable|numeric',
            'graduate_total_contact_hours' => 'nullable|numeric',
            'research_load' => 'nullable|numeric',
            'extension_services_load' => 'nullable|numeric',
            'study_load' => 'nullable|numeric',
            'production_load' => 'nullable|numeric',
            'administrative_load' => 'nullable|numeric',
            'other_load_credits' => 'nullable|numeric',
            'total_work_load' => 'nullable|numeric',
            'report_year' => 'sometimes|integer|exists:report_years,year',
        ]);

        $sucFormE2->update($validatedData);
        return response()->json($sucFormE2);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sucFormE2 = SucFormE2::findOrFail($id);
        $sucFormE2->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
