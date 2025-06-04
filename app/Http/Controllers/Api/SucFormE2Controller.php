<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SucFormE2;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SucFormE2Controller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = SucFormE2::with(['sucDetails', 'reportYear']);

        // Apply filters if provided
        if ($request->has('suc_id')) {
            $query->bySuc($request->suc_id);
        }

        if ($request->has('year')) {
            $query->byYear($request->year);
        }

        if ($request->has('faculty_type')) {
            $query->where('faculty_type', $request->faculty_type);
        }

        $sucFormE2s = $query->get();
        return response()->json($sucFormE2s);
    }

    /**
     * Get Form E2 records for a specific SUC detail ID.
     */
    public function getBySucDetailId($sucDetailId): JsonResponse
    {
        $sucFormE2s = SucFormE2::with(['sucDetails', 'reportYear'])
            ->where('suc_details_id', $sucDetailId)
            ->get();

        return response()->json($sucFormE2s);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'suc_details_id' => 'required|exists:suc_details,id',
            'name' => 'required|string|max:255',
            'generic_faculty_rank' => 'nullable|integer',
            'home_college' => 'nullable|string|max:255',
            'home_department' => 'nullable|string|max:255',
            'is_tenured' => 'nullable|string',
            'ssl_salary_grade' => 'nullable|integer',
            'annual_basic_salary' => 'nullable|numeric',
            'on_leave_without_pay' => 'nullable|integer',
            'full_time_equivalent' => 'nullable|numeric',
            'gender' => 'nullable|integer',
            'highest_degree_attained' => 'nullable|integer',
            'pursuing_next_degree' => 'nullable|integer',
            'discipline_teaching_load_1' => 'nullable|string|max:255',
            'discipline_teaching_load_2' => 'nullable|string|max:255',
            'discipline_bachelors' => 'nullable|string|max:255',
            'discipline_masters' => 'nullable|string|max:255',
            'discipline_doctorate' => 'nullable|string|max:255',
            'masters_with_thesis' => 'nullable|integer',
            'doctorate_with_dissertation' => 'nullable|integer',
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
            'faculty_type' => 'nullable|string|in:A1,B,C1,C2,C3,E',
        ]);

        $sucFormE2 = SucFormE2::create($validatedData);
        return response()->json([
            'message' => 'Form E2 record created successfully',
            'data' => $sucFormE2->load(['sucDetails', 'reportYear'])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        $sucFormE2 = SucFormE2::with(['sucDetails', 'reportYear'])->findOrFail($id);
        return response()->json($sucFormE2);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $sucFormE2 = SucFormE2::findOrFail($id);

        $validatedData = $request->validate([
            'suc_details_id' => 'sometimes|exists:suc_details,id',
            'name' => 'sometimes|string|max:255',
            'generic_faculty_rank' => 'nullable|integer',
            'home_college' => 'nullable|string|max:255',
            'home_department' => 'nullable|string|max:255',
            'is_tenured' => 'nullable|string',
            'ssl_salary_grade' => 'nullable|integer',
            'annual_basic_salary' => 'nullable|numeric',
            'on_leave_without_pay' => 'nullable|integer',
            'full_time_equivalent' => 'nullable|numeric',
            'gender' => 'nullable|integer',
            'highest_degree_attained' => 'nullable|integer',
            'pursuing_next_degree' => 'nullable|integer',
            'discipline_teaching_load_1' => 'nullable|string|max:255',
            'discipline_teaching_load_2' => 'nullable|string|max:255',
            'discipline_bachelors' => 'nullable|string|max:255',
            'discipline_masters' => 'nullable|string|max:255',
            'discipline_doctorate' => 'nullable|string|max:255',
            'masters_with_thesis' => 'nullable|integer',
            'doctorate_with_dissertation' => 'nullable|integer',
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
            'faculty_type' => 'sometimes|string|in:A1,B,C1,C2,C3,E',
        ]);

        $sucFormE2->update($validatedData);
        return response()->json([
            'message' => 'Form E2 record updated successfully',
            'data' => $sucFormE2->load(['sucDetails', 'reportYear'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        $sucFormE2 = SucFormE2::findOrFail($id);
        $sucFormE2->delete();
        return response()->json([
            'message' => 'Form E2 record deleted successfully'
        ]);
    }

    /**
     * Get faculty statistics for a specific SUC
     */
    public function getFacultyStats($sucId): JsonResponse
    {
        $stats = [
            'total_faculty' => SucFormE2::bySuc($sucId)->count(),
            'full_time' => SucFormE2::bySuc($sucId)->fullTime()->count(),
            'part_time' => SucFormE2::bySuc($sucId)->partTime()->count(),
            'tenured' => SucFormE2::bySuc($sucId)->where('is_tenured', '1')->count(),
            'with_doctorate' => SucFormE2::bySuc($sucId)
                ->where('highest_degree_attained', 3) // Assuming 3 represents doctorate
                ->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Handle bulk operations for Form E2 records
     */
    public function bulk(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'operation' => 'required|string|in:create,update,delete',
            'records' => 'required|array',
            'records.*.id' => 'required_if:operation,update,delete|exists:suc_form_e2s,id',
            'records.*.suc_details_id' => 'required|exists:suc_details,id',
            'records.*.name' => 'required|string|max:255',
            'records.*.generic_faculty_rank' => 'nullable|integer',
            'records.*.home_college' => 'nullable|string|max:255',
            'records.*.home_department' => 'nullable|string|max:255',
            'records.*.is_tenured' => 'nullable|string',
            'records.*.ssl_salary_grade' => 'nullable|integer',
            'records.*.annual_basic_salary' => 'nullable|numeric',
            'records.*.on_leave_without_pay' => 'nullable|integer',
            'records.*.full_time_equivalent' => 'nullable|numeric',
            'records.*.gender' => 'nullable|integer',
            'records.*.highest_degree_attained' => 'nullable|integer',
            'records.*.pursuing_next_degree' => 'nullable|integer',
            'records.*.discipline_teaching_load_1' => 'nullable|string|max:255',
            'records.*.discipline_teaching_load_2' => 'nullable|string|max:255',
            'records.*.discipline_bachelors' => 'nullable|string|max:255',
            'records.*.discipline_masters' => 'nullable|string|max:255',
            'records.*.discipline_doctorate' => 'nullable|string|max:255',
            'records.*.masters_with_thesis' => 'nullable|integer',
            'records.*.doctorate_with_dissertation' => 'nullable|integer',
            'records.*.undergrad_lab_credit_units' => 'nullable|numeric',
            'records.*.undergrad_lecture_credit_units' => 'nullable|numeric',
            'records.*.undergrad_total_credit_units' => 'nullable|numeric',
            'records.*.undergrad_lab_hours_per_week' => 'nullable|numeric',
            'records.*.undergrad_lecture_hours_per_week' => 'nullable|numeric',
            'records.*.undergrad_total_hours_per_week' => 'nullable|numeric',
            'records.*.undergrad_lab_contact_hours' => 'nullable|numeric',
            'records.*.undergrad_lecture_contact_hours' => 'nullable|numeric',
            'records.*.undergrad_total_contact_hours' => 'nullable|numeric',
            'records.*.graduate_lab_credit_units' => 'nullable|numeric',
            'records.*.graduate_lecture_credit_units' => 'nullable|numeric',
            'records.*.graduate_total_credit_units' => 'nullable|numeric',
            'records.*.graduate_lab_contact_hours' => 'nullable|numeric',
            'records.*.graduate_lecture_contact_hours' => 'nullable|numeric',
            'records.*.graduate_total_contact_hours' => 'nullable|numeric',
            'records.*.research_load' => 'nullable|numeric',
            'records.*.extension_services_load' => 'nullable|numeric',
            'records.*.study_load' => 'nullable|numeric',
            'records.*.production_load' => 'nullable|numeric',
            'records.*.administrative_load' => 'nullable|numeric',
            'records.*.other_load_credits' => 'nullable|numeric',
            'records.*.total_work_load' => 'nullable|numeric',
            'records.*.report_year' => 'required|integer|exists:report_years,year',
            'records.*.faculty_type' => 'nullable|string|in:A1,B,C1,C2,C3,E',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $operation = $request->input('operation');
            $records = $request->input('records');
            $results = [];

            switch ($operation) {
                case 'create':
                    foreach ($records as $record) {
                        $faculty = SucFormE2::create($record);
                        $results[] = $faculty->load(['sucDetails', 'reportYear']);
                    }
                    $message = 'Records created successfully';
                    break;

                case 'update':
                    foreach ($records as $record) {
                        $faculty = SucFormE2::findOrFail($record['id']);
                        $faculty->update($record);
                        $results[] = $faculty->load(['sucDetails', 'reportYear']);
                    }
                    $message = 'Records updated successfully';
                    break;

                case 'delete':
                    foreach ($records as $record) {
                        $faculty = SucFormE2::findOrFail($record['id']);
                        $faculty->delete();
                        $results[] = ['id' => $record['id'], 'deleted' => true];
                    }
                    $message = 'Records deleted successfully';
                    break;

                default:
                    throw new \InvalidArgumentException('Invalid operation specified');
            }

            DB::commit();

            return response()->json([
                'message' => $message,
                'data' => $results
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Operation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}