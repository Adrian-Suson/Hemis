<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LucFormBC;
use Illuminate\Http\Request;

class LucFormBCController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lucFormBCs = LucFormBC::with(['lucDetail'])->get();
        return response()->json($lucFormBCs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'luc_detail_id' => 'required|exists:luc_details,id',
            'program_name' => 'required|string|max:255',
            'program_code' => 'nullable|string|max:255',
            'major_name' => 'nullable|string|max:255',
            'major_code' => 'nullable|string|max:255',
            'with_thesis_dissertation' => 'nullable|integer',
            'code' => 'nullable|integer',
            'year_implemented' => 'nullable|integer',
            'aop_category' => 'nullable|string|max:255',
            'aop_serial' => 'nullable|string|max:255',
            'aop_year' => 'nullable|integer',
            'remarks' => 'nullable|string|max:255',
            'program_mode_code' => 'nullable|string|max:255',
            'program_mode_program' => 'nullable|string|max:255',
            'normal_length_years' => 'nullable|integer',
            'program_credit_units' => 'nullable|integer',
            'tuition_per_unit_peso' => 'nullable|numeric',
            'program_fee_peso' => 'nullable|numeric',
            'enrollment_new_students_m' => 'nullable|integer',
            'enrollment_new_students_f' => 'nullable|integer',
            'enrollment_1st_year_m' => 'nullable|integer',
            'enrollment_1st_year_f' => 'nullable|integer',
            'enrollment_2nd_year_m' => 'nullable|integer',
            'enrollment_2nd_year_f' => 'nullable|integer',
            'enrollment_3rd_year_m' => 'nullable|integer',
            'enrollment_3rd_year_f' => 'nullable|integer',
            'enrollment_4th_year_m' => 'nullable|integer',
            'enrollment_4th_year_f' => 'nullable|integer',
            'enrollment_5th_year_m' => 'nullable|integer',
            'enrollment_5th_year_f' => 'nullable|integer',
            'enrollment_6th_year_m' => 'nullable|integer',
            'enrollment_6th_year_f' => 'nullable|integer',
            'enrollment_7th_year_m' => 'nullable|integer',
            'enrollment_7th_year_f' => 'nullable|integer',
            'enrollment_sub_total_m' => 'nullable|integer',
            'enrollment_sub_total_f' => 'nullable|integer',
            'enrollment_total' => 'nullable|integer',
            'graduates_m' => 'nullable|integer',
            'graduates_f' => 'nullable|integer',
            'graduates_total' => 'nullable|integer',
        ]);

        $lucFormBC = LucFormBC::create($validatedData);
        return response()->json($lucFormBC, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $lucFormBC = LucFormBC::with(['lucDetail'])->findOrFail($id);
        return response()->json($lucFormBC);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $lucFormBC = LucFormBC::findOrFail($id);

        $validatedData = $request->validate([
            'luc_detail_id' => 'sometimes|exists:luc_details,id',
            'program_name' => 'sometimes|string|max:255',
            'program_code' => 'nullable|string|max:255',
            'major_name' => 'nullable|string|max:255',
            'major_code' => 'nullable|string|max:255',
            'with_thesis_dissertation' => 'nullable|integer',
            'code' => 'nullable|integer',
            'year_implemented' => 'nullable|integer',
            'aop_category' => 'nullable|string|max:255',
            'aop_serial' => 'nullable|string|max:255',
            'aop_year' => 'nullable|integer',
            'remarks' => 'nullable|string|max:255',
            'program_mode_code' => 'nullable|string|max:255',
            'program_mode_program' => 'nullable|string|max:255',
            'normal_length_years' => 'nullable|integer',
            'program_credit_units' => 'nullable|integer',
            'tuition_per_unit_peso' => 'nullable|numeric',
            'program_fee_peso' => 'nullable|numeric',
            'enrollment_new_students_m' => 'nullable|integer',
            'enrollment_new_students_f' => 'nullable|integer',
            'enrollment_1st_year_m' => 'nullable|integer',
            'enrollment_1st_year_f' => 'nullable|integer',
            'enrollment_2nd_year_m' => 'nullable|integer',
            'enrollment_2nd_year_f' => 'nullable|integer',
            'enrollment_3rd_year_m' => 'nullable|integer',
            'enrollment_3rd_year_f' => 'nullable|integer',
            'enrollment_4th_year_m' => 'nullable|integer',
            'enrollment_4th_year_f' => 'nullable|integer',
            'enrollment_5th_year_m' => 'nullable|integer',
            'enrollment_5th_year_f' => 'nullable|integer',
            'enrollment_6th_year_m' => 'nullable|integer',
            'enrollment_6th_year_f' => 'nullable|integer',
            'enrollment_7th_year_m' => 'nullable|integer',
            'enrollment_7th_year_f' => 'nullable|integer',
            'enrollment_sub_total_m' => 'nullable|integer',
            'enrollment_sub_total_f' => 'nullable|integer',
            'enrollment_total' => 'nullable|integer',
            'graduates_m' => 'nullable|integer',
            'graduates_f' => 'nullable|integer',
            'graduates_total' => 'nullable|integer',
        ]);

        $lucFormBC->update($validatedData);
        return response()->json($lucFormBC);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $lucFormBC = LucFormBC::findOrFail($id);
        $lucFormBC->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
