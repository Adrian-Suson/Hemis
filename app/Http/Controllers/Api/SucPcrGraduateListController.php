<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SucPcrGraduateList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SucPcrGraduateListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $graduates = SucPcrGraduateList::with(['sucDetails', 'reportYear'])->get();

        return response()->json([
            'status' => 'success',
            'data' => $graduates
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'suc_details_id' => 'required|exists:suc_details,id',
            'student_id' => 'required|string|unique:suc_pcr_graduate_list',
            'date_of_birth' => 'required|date',
            'last_name' => 'required|string',
            'first_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'sex' => 'required|in:M,F,Male,Female',
            'date_graduated' => 'nullable|date',
            'program_name' => 'required|string',
            'program_major' => 'required|string',
            'authority_number' => 'nullable|string',
            'year_granted' => 'nullable|integer',
            'report_year' => 'required|exists:report_years,year'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $graduate = SucPcrGraduateList::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Graduate record created successfully',
            'data' => $graduate
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SucPcrGraduateList $sucPcrGraduateList)
    {
        $graduate = $sucPcrGraduateList->load(['sucDetails', 'reportYear']);

        return response()->json([
            'status' => 'success',
            'data' => $graduate
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SucPcrGraduateList $sucPcrGraduateList)
    {
        $validator = Validator::make($request->all(), [
            'suc_details_id' => 'sometimes|exists:suc_details,id',
            'student_id' => 'sometimes|string|unique:suc_pcr_graduate_list,student_id,' . $sucPcrGraduateList->id,
            'date_of_birth' => 'sometimes|date',
            'last_name' => 'sometimes|string',
            'first_name' => 'sometimes|string',
            'middle_name' => 'nullable|string',
            'sex' => 'sometimes|in:M,F,Male,Female',
            'date_graduated' => 'nullable|date',
            'program_name' => 'sometimes|string',
            'program_major' => 'sometimes|string',
            'authority_number' => 'nullable|string',
            'year_granted' => 'nullable|integer',
            'report_year' => 'sometimes|exists:report_years,year'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $sucPcrGraduateList->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Graduate record updated successfully',
            'data' => $sucPcrGraduateList
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SucPcrGraduateList $sucPcrGraduateList)
    {
        $sucPcrGraduateList->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Graduate record deleted successfully'
        ]);
    }

    /**
     * Restore the specified soft deleted resource.
     */
    public function restore($id)
    {
        $graduate = SucPcrGraduateList::withTrashed()->findOrFail($id);
        $graduate->restore();

        return response()->json([
            'status' => 'success',
            'message' => 'Graduate record restored successfully',
            'data' => $graduate
        ]);
    }

    /**
     * Bulk store multiple graduate records.
     */
    public function bulkStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'graduates' => 'required|array',
            'graduates.*.suc_details_id' => 'required|exists:suc_details,id',
            'graduates.*.student_id' => 'required|string|unique:suc_pcr_graduate_list,student_id',
            'graduates.*.date_of_birth' => 'required|date',
            'graduates.*.last_name' => 'required|string',
            'graduates.*.first_name' => 'required|string',
            'graduates.*.middle_name' => 'nullable|string',
            'graduates.*.sex' => 'required|in:M,F,Male,Female',
            'graduates.*.date_graduated' => 'nullable|date',
            'graduates.*.program_name' => 'required|string',
            'graduates.*.program_major' => 'required|string',
            'graduates.*.authority_number' => 'nullable|string',
            'graduates.*.year_granted' => 'nullable|integer',
            'graduates.*.report_year' => 'required|exists:report_years,year'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $graduates = collect($request->graduates)->map(function ($graduate) {
                return SucPcrGraduateList::create($graduate);
            });

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => count($graduates) . ' graduate records created successfully',
                'data' => $graduates
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create graduate records',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}