<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SucFormE1;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SucFormE1Controller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sucFormE1s = SucFormE1::with(['sucDetail'])->get();
        return response()->json($sucFormE1s);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'suc_details_id' => 'required|exists:suc_details,id',
            'faculty_name' => 'required|string|max:255',
            'generic_faculty_rank' => 'nullable|string|max:255',
            'home_college' => 'nullable|string|max:255',
            'home_dept' => 'nullable|string|max:255',
            'is_tenured' => 'nullable|string|max:10',
            'ssl_salary_grade' => 'nullable|string|max:255',
            'annual_basic_salary' => 'nullable|numeric',
            'on_leave_without_pay' => 'nullable|string|max:10',
            'full_time_equivalent' => 'nullable|numeric',
            'gender' => 'nullable|string|max:10',
            'highest_degree_attained' => 'nullable|string|max:255',
            'actively_pursuing_next_degree' => 'nullable|string|max:10',
            'primary_teaching_load_discipline_1' => 'nullable|string|max:255',
            'primary_teaching_load_discipline_2' => 'nullable|string|max:255',
            'bachelors_discipline' => 'nullable|string|max:255',
            'masters_discipline' => 'nullable|string|max:255',
            'doctorate_discipline' => 'nullable|string|max:255',
            'masters_with_thesis' => 'nullable|string|max:10',
            'doctorate_with_dissertation' => 'nullable|string|max:10',
            'lab_hours_elem_sec' => 'nullable|numeric',
            'lecture_hours_elem_sec' => 'nullable|numeric',
            'total_teaching_hours_elem_sec' => 'nullable|numeric',
            'student_lab_contact_hours_elem_sec' => 'nullable|numeric',
            'student_lecture_contact_hours_elem_sec' => 'nullable|numeric',
            'total_student_contact_hours_elem_sec' => 'nullable|numeric',
            'lab_hours_tech_voc' => 'nullable|numeric',
            'lecture_hours_tech_voc' => 'nullable|numeric',
            'total_teaching_hours_tech_voc' => 'nullable|numeric',
            'student_lab_contact_hours_tech_voc' => 'nullable|numeric',
            'student_lecture_contact_hours_tech_voc' => 'nullable|numeric',
            'total_student_contact_hours_tech_voc' => 'nullable|numeric',
            'official_research_load' => 'nullable|numeric',
            'official_extension_services_load' => 'nullable|numeric',
            'official_study_load' => 'nullable|numeric',
            'official_load_for_production' => 'nullable|numeric',
            'official_administrative_load' => 'nullable|numeric',
            'other_official_load_credits' => 'nullable|numeric',
            'total_work_load' => 'nullable|numeric',
            'faculty_type' => 'nullable|string|max:255'
        ]);

        $sucFormE1 = SucFormE1::create($validatedData);
        return response()->json($sucFormE1, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $sucFormE1 = SucFormE1::with(['sucDetail'])->findOrFail($id);
        return response()->json($sucFormE1);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $sucFormE1 = SucFormE1::findOrFail($id);

        $validatedData = $request->validate([
            'suc_details_id' => 'sometimes|exists:suc_details,id',
            'faculty_name' => 'sometimes|string|max:255',
            'generic_faculty_rank' => 'nullable|string|max:255',
            'home_college' => 'nullable|string|max:255',
            'home_dept' => 'nullable|string|max:255',
            'is_tenured' => 'nullable|string|max:10',
            'ssl_salary_grade' => 'nullable|string|max:255',
            'annual_basic_salary' => 'nullable|numeric',
            'on_leave_without_pay' => 'nullable|string|max:10',
            'full_time_equivalent' => 'nullable|numeric',
            'gender' => 'nullable|string|max:10',
            'highest_degree_attained' => 'nullable|string|max:255',
            'actively_pursuing_next_degree' => 'nullable|string|max:10',
            'primary_teaching_load_discipline_1' => 'nullable|string|max:255',
            'primary_teaching_load_discipline_2' => 'nullable|string|max:255',
            'bachelors_discipline' => 'nullable|string|max:255',
            'masters_discipline' => 'nullable|string|max:255',
            'doctorate_discipline' => 'nullable|string|max:255',
            'masters_with_thesis' => 'nullable|string|max:10',
            'doctorate_with_dissertation' => 'nullable|string|max:10',
            'lab_hours_elem_sec' => 'nullable|numeric',
            'lecture_hours_elem_sec' => 'nullable|numeric',
            'total_teaching_hours_elem_sec' => 'nullable|numeric',
            'student_lab_contact_hours_elem_sec' => 'nullable|numeric',
            'student_lecture_contact_hours_elem_sec' => 'nullable|numeric',
            'total_student_contact_hours_elem_sec' => 'nullable|numeric',
            'lab_hours_tech_voc' => 'nullable|numeric',
            'lecture_hours_tech_voc' => 'nullable|numeric',
            'total_teaching_hours_tech_voc' => 'nullable|numeric',
            'student_lab_contact_hours_tech_voc' => 'nullable|numeric',
            'student_lecture_contact_hours_tech_voc' => 'nullable|numeric',
            'total_student_contact_hours_tech_voc' => 'nullable|numeric',
            'official_research_load' => 'nullable|numeric',
            'official_extension_services_load' => 'nullable|numeric',
            'official_study_load' => 'nullable|numeric',
            'official_load_for_production' => 'nullable|numeric',
            'official_administrative_load' => 'nullable|numeric',
            'other_official_load_credits' => 'nullable|numeric',
            'total_work_load' => 'nullable|numeric',
            'faculty_type' => 'nullable|string|max:255'
        ]);

        $sucFormE1->update($validatedData);
        return response()->json($sucFormE1);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sucFormE1 = SucFormE1::findOrFail($id);
        $sucFormE1->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }

    /**
     * Handle bulk operations for Form E1 records
     */
    public function bulk(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'operation' => 'required|string|in:create,update,delete',
            'records' => 'required|array',
            'records.*.id' => 'required_if:operation,update,delete|exists:suc_form_e1s,id',
            'records.*.suc_details_id' => 'required|exists:suc_details,id',
            'records.*.faculty_name' => 'required|string|max:255',
            'records.*.generic_faculty_rank' => 'nullable|string|max:255',
            'records.*.home_college' => 'nullable|string|max:255',
            'records.*.home_dept' => 'nullable|string|max:255',
            'records.*.is_tenured' => 'nullable|string|max:10',
            'records.*.ssl_salary_grade' => 'nullable|string|max:255',
            'records.*.annual_basic_salary' => 'nullable|numeric',
            'records.*.on_leave_without_pay' => 'nullable|string|max:10',
            'records.*.full_time_equivalent' => 'nullable|numeric',
            'records.*.gender' => 'nullable|string|max:10',
            'records.*.highest_degree_attained' => 'nullable|string|max:255',
            'records.*.actively_pursuing_next_degree' => 'nullable|string|max:10',
            'records.*.primary_teaching_load_discipline_1' => 'nullable|string|max:255',
            'records.*.primary_teaching_load_discipline_2' => 'nullable|string|max:255',
            'records.*.bachelors_discipline' => 'nullable|string|max:255',
            'records.*.masters_discipline' => 'nullable|string|max:255',
            'records.*.doctorate_discipline' => 'nullable|string|max:255',
            'records.*.masters_with_thesis' => 'nullable|string|max:10',
            'records.*.doctorate_with_dissertation' => 'nullable|string|max:10',
            'records.*.lab_hours_elem_sec' => 'nullable|numeric',
            'records.*.lecture_hours_elem_sec' => 'nullable|numeric',
            'records.*.total_teaching_hours_elem_sec' => 'nullable|numeric',
            'records.*.student_lab_contact_hours_elem_sec' => 'nullable|numeric',
            'records.*.student_lecture_contact_hours_elem_sec' => 'nullable|numeric',
            'records.*.total_student_contact_hours_elem_sec' => 'nullable|numeric',
            'records.*.lab_hours_tech_voc' => 'nullable|numeric',
            'records.*.lecture_hours_tech_voc' => 'nullable|numeric',
            'records.*.total_teaching_hours_tech_voc' => 'nullable|numeric',
            'records.*.student_lab_contact_hours_tech_voc' => 'nullable|numeric',
            'records.*.student_lecture_contact_hours_tech_voc' => 'nullable|numeric',
            'records.*.total_student_contact_hours_tech_voc' => 'nullable|numeric',
            'records.*.official_research_load' => 'nullable|numeric',
            'records.*.official_extension_services_load' => 'nullable|numeric',
            'records.*.official_study_load' => 'nullable|numeric',
            'records.*.official_load_for_production' => 'nullable|numeric',
            'records.*.official_administrative_load' => 'nullable|numeric',
            'records.*.other_official_load_credits' => 'nullable|numeric',
            'records.*.total_work_load' => 'nullable|numeric',
            'records.*.faculty_type' => 'nullable|string|max:255',
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
                        $faculty = SucFormE1::create($record);
                        $results[] = $faculty->load(['sucDetail']);
                    }
                    $message = 'Records created successfully';
                    break;

                case 'update':
                    foreach ($records as $record) {
                        $faculty = SucFormE1::findOrFail($record['id']);
                        $faculty->update($record);
                        $results[] = $faculty->load(['sucDetail']);
                    }
                    $message = 'Records updated successfully';
                    break;

                case 'delete':
                    foreach ($records as $record) {
                        $faculty = SucFormE1::findOrFail($record['id']);
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