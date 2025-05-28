<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SucFormB;
use Illuminate\Http\Request;

class SucFormBController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sucFormBs = SucFormB::with(['sucDetail', 'reportYear'])->get();
        return response()->json($sucFormBs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'suc_details_id' => 'required|exists:suc_details,id',
            'program_name' => 'required|string|max:255',
            'program_code' => 'nullable|integer',
            'major_name' => 'nullable|string|max:255',
            'major_code' => 'nullable|integer',
            'aop_category' => 'nullable|string|max:255',
            'aop_serial' => 'nullable|string|max:255',
            'aop_year' => 'nullable|integer',
            'is_thesis_dissertation_required' => 'nullable|boolean',
            'program_status' => 'nullable|string|max:255',
            'calendar_use_code' => 'nullable|string|max:255',
            'program_normal_length_in_years' => 'nullable|integer',
            'lab_units' => 'nullable|integer',
            'lecture_units' => 'nullable|integer',
            'total_units' => 'nullable|integer',
            'tuition_per_unit' => 'nullable|numeric',
            'program_fee' => 'nullable|numeric',
            'program_type' => 'nullable|string|max:255',
            'new_students_freshmen_male' => 'nullable|integer',
            'new_students_freshmen_female' => 'nullable|integer',
            '1st_year_male' => 'nullable|integer',
            '1st_year_female' => 'nullable|integer',
            '2nd_year_male' => 'nullable|integer',
            '2nd_year_female' => 'nullable|integer',
            '3rd_year_male' => 'nullable|integer',
            '3rd_year_female' => 'nullable|integer',
            '4th_year_male' => 'nullable|integer',
            '4th_year_female' => 'nullable|integer',
            '5th_year_male' => 'nullable|integer',
            '5th_year_female' => 'nullable|integer',
            '6th_year_male' => 'nullable|integer',
            '6th_year_female' => 'nullable|integer',
            '7th_year_male' => 'nullable|integer',
            '7th_year_female' => 'nullable|integer',
            'subtotal_male' => 'nullable|integer',
            'subtotal_female' => 'nullable|integer',
            'grand_total' => 'nullable|integer',
            'lecture_units_actual' => 'nullable|integer',
            'laboratory_units_actual' => 'nullable|integer',
            'total_units_actual' => 'nullable|integer',
            'graduates_males' => 'nullable|integer',
            'graduates_females' => 'nullable|integer',
            'graduates_total' => 'nullable|integer',
            'externally_funded_merit_scholars' => 'nullable|integer',
            'internally_funded_grantees' => 'nullable|integer',
            'funded_grantees' => 'nullable|integer',
            'report_year' => 'required|integer|exists:report_years,year',
        ]);

        $sucFormB = SucFormB::create($validatedData);
        return response()->json($sucFormB, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $sucFormB = SucFormB::with(['sucDetail', 'reportYear'])->findOrFail($id);
        return response()->json($sucFormB);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $sucFormB = SucFormB::findOrFail($id);

        $validatedData = $request->validate([
            'suc_details_id' => 'sometimes|exists:suc_details,id',
            'program_name' => 'sometimes|string|max:255',
            'program_code' => 'nullable|integer',
            'major_name' => 'nullable|string|max:255',
            'major_code' => 'nullable|integer',
            'aop_category' => 'nullable|string|max:255',
            'aop_serial' => 'nullable|string|max:255',
            'aop_year' => 'nullable|integer',
            'is_thesis_dissertation_required' => 'nullable|boolean',
            'program_status' => 'nullable|string|max:255',
            'calendar_use_code' => 'nullable|string|max:255',
            'program_normal_length_in_years' => 'nullable|integer',
            'lab_units' => 'nullable|integer',
            'lecture_units' => 'nullable|integer',
            'total_units' => 'nullable|integer',
            'tuition_per_unit' => 'nullable|numeric',
            'program_fee' => 'nullable|numeric',
            'program_type' => 'nullable|string|max:255',
            'new_students_freshmen_male' => 'nullable|integer',
            'new_students_freshmen_female' => 'nullable|integer',
            '1st_year_male' => 'nullable|integer',
            '1st_year_female' => 'nullable|integer',
            '2nd_year_male' => 'nullable|integer',
            '2nd_year_female' => 'nullable|integer',
            '3rd_year_male' => 'nullable|integer',
            '3rd_year_female' => 'nullable|integer',
            '4th_year_male' => 'nullable|integer',
            '4th_year_female' => 'nullable|integer',
            '5th_year_male' => 'nullable|integer',
            '5th_year_female' => 'nullable|integer',
            '6th_year_male' => 'nullable|integer',
            '6th_year_female' => 'nullable|integer',
            '7th_year_male' => 'nullable|integer',
            '7th_year_female' => 'nullable|integer',
            'subtotal_male' => 'nullable|integer',
            'subtotal_female' => 'nullable|integer',
            'grand_total' => 'nullable|integer',
            'lecture_units_actual' => 'nullable|integer',
            'laboratory_units_actual' => 'nullable|integer',
            'total_units_actual' => 'nullable|integer',
            'graduates_males' => 'nullable|integer',
            'graduates_females' => 'nullable|integer',
            'graduates_total' => 'nullable|integer',
            'externally_funded_merit_scholars' => 'nullable|integer',
            'internally_funded_grantees' => 'nullable|integer',
            'funded_grantees' => 'nullable|integer',
            'report_year' => 'sometimes|integer|exists:report_years,year',
        ]);

        $sucFormB->update($validatedData);
        return response()->json($sucFormB);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sucFormB = SucFormB::findOrFail($id);
        $sucFormB->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
