<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FacultyProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class FacultyProfileController extends Controller
{
    /**
     * Display a listing of the faculty profiles.
     */
    public function index(Request $request): JsonResponse
    {
        $query = FacultyProfile::query()->with('institution', 'reportYear');

        if ($request->has('institution_id')) {
            $query->where('institution_id', $request->institution_id);
        }

        if ($request->has('faculty_group')) {
            $query->where('faculty_group', $request->faculty_group);
        }

        if ($request->has('report_year')) {
            $query->where('report_year', $request->report_year);
        }

        $facultyProfiles = $query->get();

        $transformed = $facultyProfiles->map(function ($profile) {
            return [
                'id' => $profile->id,
                'institution' => $profile->institution ? $profile->institution->name : null,
                'faculty_group' => $profile->faculty_group,
                'name' => $profile->name,
                'generic_faculty_rank' => $profile->generic_faculty_rank,
                'home_college' => $profile->home_college,
                'home_department' => $profile->home_department,
                'is_tenured' => $profile->is_tenured,
                'ssl_salary_grade' => $profile->ssl_salary_grade,
                'annual_basic_salary' => $profile->annual_basic_salary,
                'on_leave_without_pay' => $profile->on_leave_without_pay,
                'full_time_equivalent' => $profile->full_time_equivalent,
                'gender' => $profile->gender,
                'highest_degree_attained' => $profile->highest_degree_attained,
                'pursuing_next_degree' => $profile->pursuing_next_degree,
                'discipline_teaching_load_1' => $profile->discipline_teaching_load_1,
                'discipline_teaching_load_2' => $profile->discipline_teaching_load_2,
                'discipline_bachelors' => $profile->discipline_bachelors,
                'discipline_masters' => $profile->discipline_masters,
                'discipline_doctorate' => $profile->discipline_doctorate,
                'masters_with_thesis' => $profile->masters_with_thesis,
                'doctorate_with_dissertation' => $profile->doctorate_with_dissertation,
                'undergrad_lab_credit_units' => $profile->undergrad_lab_credit_units,
                'undergrad_lecture_credit_units' => $profile->undergrad_lecture_credit_units,
                'undergrad_total_credit_units' => $profile->undergrad_total_credit_units,
                'undergrad_lab_hours_per_week' => $profile->undergrad_lab_hours_per_week,
                'undergrad_lecture_hours_per_week' => $profile->undergrad_lecture_hours_per_week,
                'undergrad_total_hours_per_week' => $profile->undergrad_total_hours_per_week,
                'undergrad_lab_contact_hours' => $profile->undergrad_lab_contact_hours,
                'undergrad_lecture_contact_hours' => $profile->undergrad_lecture_contact_hours,
                'undergrad_total_contact_hours' => $profile->undergrad_total_contact_hours,
                'graduate_lab_credit_units' => $profile->graduate_lab_credit_units,
                'graduate_lecture_credit_units' => $profile->graduate_lecture_credit_units,
                'graduate_total_credit_units' => $profile->graduate_total_credit_units,
                'graduate_lab_contact_hours' => $profile->graduate_lab_contact_hours,
                'graduate_lecture_contact_hours' => $profile->graduate_lecture_contact_hours,
                'graduate_total_contact_hours' => $profile->graduate_total_contact_hours,
                'research_load' => $profile->research_load,
                'extension_services_load' => $profile->extension_services_load,
                'study_load' => $profile->study_load,
                'production_load' => $profile->production_load,
                'administrative_load' => $profile->administrative_load,
                'other_load_credits' => $profile->other_load_credits,
                'total_work_load' => $profile->total_work_load,
                'report_year' => $profile->reportYear ? $profile->reportYear->year : null,
                'created_at' => $profile->created_at,
                'updated_at' => $profile->updated_at,
            ];
        });

        return response()->json($transformed, Response::HTTP_OK);
    }

    /**
     * Store multiple faculty profiles in storage.
     */
    public function store(Request $request): JsonResponse
    {
        Log::info('FacultyProfile store request received', ['data' => $request->all()]);

        $data = $request->all();
        if (empty($data)) {
            return response()->json(['message' => 'No faculty profile data provided'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $validator = Validator::make($data, [
            '*.institution_id' => 'nullable|integer|exists:institutions,id',
            '*.faculty_group' => 'nullable|string',
            '*.name' => 'nullable|string|max:255',
            '*.generic_faculty_rank' => 'nullable|integer',
            '*.home_college' => 'nullable|string|max:255',
            '*.home_department' => 'nullable|string|max:255',
            '*.is_tenured' => 'nullable|string|max:255',
            '*.ssl_salary_grade' => 'nullable|integer',
            '*.annual_basic_salary' => 'nullable|integer',
            '*.on_leave_without_pay' => 'nullable|integer',
            '*.full_time_equivalent' => 'nullable|numeric',
            '*.gender' => 'nullable|integer',
            '*.highest_degree_attained' => 'nullable|integer',
            '*.pursuing_next_degree' => 'nullable|integer',
            '*.discipline_teaching_load_1' => 'nullable|string|max:255',
            '*.discipline_teaching_load_2' => 'nullable|string|max:255',
            '*.discipline_bachelors' => 'nullable|string|max:255',
            '*.discipline_masters' => 'nullable|string|max:255',
            '*.discipline_doctorate' => 'nullable|string|max:255',
            '*.masters_with_thesis' => 'nullable|integer',
            '*.doctorate_with_dissertation' => 'nullable|integer',
            '*.undergrad_lab_credit_units' => 'nullable|numeric',
            '*.undergrad_lecture_credit_units' => 'nullable|numeric',
            '*.undergrad_total_credit_units' => 'nullable|numeric',
            '*.undergrad_lab_hours_per_week' => 'nullable|numeric',
            '*.undergrad_lecture_hours_per_week' => 'nullable|numeric',
            '*.undergrad_total_hours_per_week' => 'nullable|numeric',
            '*.undergrad_lab_contact_hours' => 'nullable|numeric',
            '*.undergrad_lecture_contact_hours' => 'nullable|numeric',
            '*.undergrad_total_contact_hours' => 'nullable|numeric',
            '*.graduate_lab_credit_units' => 'nullable|numeric',
            '*.graduate_lecture_credit_units' => 'nullable|numeric',
            '*.graduate_total_credit_units' => 'nullable|numeric',
            '*.graduate_lab_contact_hours' => 'nullable|numeric',
            '*.graduate_lecture_contact_hours' => 'nullable|numeric',
            '*.graduate_total_contact_hours' => 'nullable|numeric',
            '*.research_load' => 'nullable|numeric',
            '*.extension_services_load' => 'nullable|numeric',
            '*.study_load' => 'nullable|numeric',
            '*.production_load' => 'nullable|numeric',
            '*.administrative_load' => 'nullable|numeric',
            '*.other_load_credits' => 'nullable|numeric',
            '*.total_work_load' => 'nullable|numeric',
            '*.report_year' => 'nullable|integer|exists:report_years,year',
        ]);

        if ($validator->fails()) {
            Log::error('FacultyProfile validation failed', ['errors' => $validator->errors()]);
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY); 
        }

        try {
            $validatedData = $validator->validated();

            $uniqueProfiles = [];
            $seen = [];

            foreach ($validatedData as $profile) {
                $profileString = json_encode($profile);
                if (!in_array($profileString, $seen)) {
                    $seen[] = $profileString;
                    $uniqueProfiles[] = $profile;
                }
            }

            if (empty($uniqueProfiles)) {
                return response()->json(['message' => 'No unique faculty profiles to insert'], Response::HTTP_OK);
            }

            date_default_timezone_set('Asia/Manila');
            $currentTime = Carbon::now('Asia/Manila');
            $uniqueProfiles = array_map(function ($profile) use ($currentTime) {
                $profile['created_at'] = $currentTime;
                $profile['updated_at'] = $currentTime;
                return $profile;
            }, $uniqueProfiles);

            FacultyProfile::insert($uniqueProfiles);

            Log::info('Faculty profiles inserted successfully', ['count' => count($uniqueProfiles)]);

            return response()->json([
                'message' => 'Faculty profiles created successfully',
                'count' => count($uniqueProfiles),
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            Log::error('Failed to create faculty profiles', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Failed to create faculty profiles.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified faculty profile.
     */
    public function show(FacultyProfile $facultyProfile): JsonResponse
    {
        $facultyProfile->load('institution', 'reportYear');

        return response()->json([
            'id' => $facultyProfile->id,
            'institution' => $facultyProfile->institution ? $facultyProfile->institution->name : null,
            'faculty_group' => $facultyProfile->faculty_group,
            'name' => $facultyProfile->name,
            'generic_faculty_rank' => $facultyProfile->generic_faculty_rank,
            'home_college' => $facultyProfile->home_college,
            'home_department' => $facultyProfile->home_department,
            'is_tenured' => $facultyProfile->is_tenured,
            'ssl_salary_grade' => $facultyProfile->ssl_salary_grade,
            'annual_basic_salary' => $facultyProfile->annual_basic_salary,
            'on_leave_without_pay' => $facultyProfile->on_leave_without_pay,
            'full_time_equivalent' => $facultyProfile->full_time_equivalent,
            'gender' => $facultyProfile->gender,
            'highest_degree_attained' => $facultyProfile->highest_degree_attained,
            'pursuing_next_degree' => $facultyProfile->pursuing_next_degree,
            'discipline_teaching_load_1' => $facultyProfile->discipline_teaching_load_1,
            'discipline_teaching_load_2' => $facultyProfile->discipline_teaching_load_2,
            'discipline_bachelors' => $facultyProfile->discipline_bachelors,
            'discipline_masters' => $facultyProfile->discipline_masters,
            'discipline_doctorate' => $facultyProfile->discipline_doctorate,
            'masters_with_thesis' => $facultyProfile->masters_with_thesis,
            'doctorate_with_dissertation' => $facultyProfile->doctorate_with_dissertation,
            'undergrad_lab_credit_units' => $facultyProfile->undergrad_lab_credit_units,
            'undergrad_lecture_credit_units' => $facultyProfile->undergrad_lecture_credit_units,
            'undergrad_total_credit_units' => $facultyProfile->undergrad_total_credit_units,
            'undergrad_lab_hours_per_week' => $facultyProfile->undergrad_lab_hours_per_week,
            'undergrad_lecture_hours_per_week' => $facultyProfile->undergrad_lecture_hours_per_week,
            'undergrad_total_hours_per_week' => $facultyProfile->undergrad_total_hours_per_week,
            'undergrad_lab_contact_hours' => $facultyProfile->undergrad_lab_contact_hours,
            'undergrad_lecture_contact_hours' => $facultyProfile->undergrad_lecture_contact_hours,
            'undergrad_total_contact_hours' => $facultyProfile->undergrad_total_contact_hours,
            'graduate_lab_credit_units' => $facultyProfile->graduate_lab_credit_units,
            'graduate_lecture_credit_units' => $facultyProfile->graduate_lecture_credit_units,
            'graduate_total_credit_units' => $facultyProfile->graduate_total_credit_units,
            'graduate_lab_contact_hours' => $facultyProfile->graduate_lab_contact_hours,
            'graduate_lecture_contact_hours' => $facultyProfile->graduate_lecture_contact_hours,
            'graduate_total_contact_hours' => $facultyProfile->graduate_total_contact_hours,
            'research_load' => $facultyProfile->research_load,
            'extension_services_load' => $facultyProfile->extension_services_load,
            'study_load' => $facultyProfile->study_load,
            'production_load' => $facultyProfile->production_load,
            'administrative_load' => $facultyProfile->administrative_load,
            'other_load_credits' => $facultyProfile->other_load_credits,
            'total_work_load' => $facultyProfile->total_work_load,
            'report_year' => $facultyProfile->reportYear ? $facultyProfile->reportYear->year : null,
            'created_at' => $facultyProfile->created_at,
            'updated_at' => $facultyProfile->updated_at,
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified faculty profile in storage.
     */
    public function update(Request $request, FacultyProfile $facultyProfile): JsonResponse
    {
        $validated = $request->validate([
            'institution_id' => 'nullable|integer|exists:institutions,id',
            'faculty_group' => 'nullable|string',
            'name' => 'nullable|string|max:255',
            'generic_faculty_rank' => 'nullable|integer',
            'home_college' => 'nullable|string|max:255',
            'home_department' => 'nullable|string|max:255',
            'is_tenured' => 'nullable|string|max:255',
            'ssl_salary_grade' => 'nullable|integer',
            'annual_basic_salary' => 'nullable|integer',
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
            'report_year' => 'nullable|integer|exists:report_years,year',
        ]);

        try {
            $facultyProfile->update($validated);
            $facultyProfile->load('institution', 'reportYear');

            return response()->json([
                'message' => 'Faculty profile updated successfully!',
                'data' => [
                    'id' => $facultyProfile->id,
                    'institution' => $facultyProfile->institution ? $facultyProfile->institution->name : null,
                    'faculty_group' => $facultyProfile->faculty_group,
                    'name' => $facultyProfile->name,
                    'generic_faculty_rank' => $facultyProfile->generic_faculty_rank,
                    'home_college' => $facultyProfile->home_college,
                    'home_department' => $facultyProfile->home_department,
                    'is_tenured' => $facultyProfile->is_tenured,
                    'ssl_salary_grade' => $facultyProfile->ssl_salary_grade,
                    'annual_basic_salary' => $facultyProfile->annual_basic_salary,
                    'on_leave_without_pay' => $facultyProfile->on_leave_without_pay,
                    'full_time_equivalent' => $facultyProfile->full_time_equivalent,
                    'gender' => $facultyProfile->gender,
                    'highest_degree_attained' => $facultyProfile->highest_degree_attained,
                    'pursuing_next_degree' => $facultyProfile->pursuing_next_degree,
                    'discipline_teaching_load_1' => $facultyProfile->discipline_teaching_load_1,
                    'discipline_teaching_load_2' => $facultyProfile->discipline_teaching_load_2,
                    'discipline_bachelors' => $facultyProfile->discipline_bachelors,
                    'discipline_masters' => $facultyProfile->discipline_masters,
                    'discipline_doctorate' => $facultyProfile->discipline_doctorate,
                    'masters_with_thesis' => $facultyProfile->masters_with_thesis,
                    'doctorate_with_dissertation' => $facultyProfile->doctorate_with_dissertation,
                    'undergrad_lab_credit_units' => $facultyProfile->undergrad_lab_credit_units,
                    'undergrad_lecture_credit_units' => $facultyProfile->undergrad_lecture_credit_units,
                    'undergrad_total_credit_units' => $facultyProfile->undergrad_total_credit_units,
                    'undergrad_lab_hours_per_week' => $facultyProfile->undergrad_lab_hours_per_week,
                    'undergrad_lecture_hours_per_week' => $facultyProfile->undergrad_lecture_hours_per_week,
                    'undergrad_total_hours_per_week' => $facultyProfile->undergrad_total_hours_per_week,
                    'undergrad_lab_contact_hours' => $facultyProfile->undergrad_lab_contact_hours,
                    'undergrad_lecture_contact_hours' => $facultyProfile->undergrad_lecture_contact_hours,
                    'undergrad_total_contact_hours' => $facultyProfile->undergrad_total_contact_hours,
                    'graduate_lab_credit_units' => $facultyProfile->graduate_lab_credit_units,
                    'graduate_lecture_credit_units' => $facultyProfile->graduate_lecture_credit_units,
                    'graduate_total_credit_units' => $facultyProfile->graduate_total_credit_units,
                    'graduate_lab_contact_hours' => $facultyProfile->graduate_lab_contact_hours,
                    'graduate_lecture_contact_hours' => $facultyProfile->graduate_lecture_contact_hours,
                    'graduate_total_contact_hours' => $facultyProfile->graduate_total_contact_hours,
                    'research_load' => $facultyProfile->research_load,
                    'extension_services_load' => $facultyProfile->extension_services_load,
                    'study_load' => $facultyProfile->study_load,
                    'production_load' => $facultyProfile->production_load,
                    'administrative_load' => $facultyProfile->administrative_load,
                    'other_load_credits' => $facultyProfile->other_load_credits,
                    'total_work_load' => $facultyProfile->total_work_load,
                    'report_year' => $facultyProfile->reportYear ? $facultyProfile->reportYear->year : null,
                    'created_at' => $facultyProfile->created_at,
                    'updated_at' => $facultyProfile->updated_at,
                ],
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Failed to update faculty profile', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Failed to update faculty profile.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified faculty profile from storage.
     */
    public function destroy(FacultyProfile $facultyProfile): JsonResponse
    {
        try {
            $facultyProfile->delete();
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            Log::error('Failed to delete faculty profile', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Failed to delete faculty profile.',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}