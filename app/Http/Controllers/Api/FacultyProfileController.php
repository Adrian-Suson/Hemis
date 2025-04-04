<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FacultyProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FacultyProfileController extends Controller
{
    public function index(Request $request)
    {
        $query = FacultyProfile::with('institution');

        if ($request->has('institution_id')) {
            $query->where('institution_id', $request->institution_id);
        }

        if ($request->has('faculty_group')) {
            $query->where('faculty_group', $request->faculty_group);
        }

        $facultyProfiles = $query->get();

        return response()->json($facultyProfiles, Response::HTTP_OK);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            '*.institution_id' => 'nullable|exists:institutions,id',
            '*.data_date' => 'required|date', // Added data_date
            '*.faculty_group' => 'nullable|string',
            '*.name' => 'nullable|string|max:255',
            '*.generic_faculty_rank' => 'nullable|integer',
            '*.home_college' => 'nullable|string|max:255',
            '*.home_department' => 'nullable|string|max:255',
            '*.is_tenured' => 'nullable|integer',
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
        ]);

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

        return response()->json([
            'message' => 'Faculty profiles created successfully',
            'count' => count($uniqueProfiles)
        ], Response::HTTP_CREATED);
    }

    public function show(FacultyProfile $facultyProfile)
    {
        return response()->json($facultyProfile->load('institution'), Response::HTTP_OK);
    }

    public function update(Request $request, FacultyProfile $facultyProfile)
    {
        $validated = $request->validate([
            'institution_id' => 'nullable|exists:institutions,id',
            'data_date' => 'sometimes|required|date',
            'faculty_group' => 'nullable|string',
            'name' => 'nullable|string|max:255',
            'generic_faculty_rank' => 'nullable|integer',
            'home_college' => 'nullable|string|max:255',
            'home_department' => 'nullable|string|max:255',
            'is_tenured' => 'nullable|integer',
            'ssl_salary_grade' => 'nullable|integer',
            'annual_basic_salary' => 'nullable|integer',
            'on_leave_without_pay' => 'nullable|integer',
            'full_time_equivalent' => 'nullable|numeric',
            'gender' => 'nullable|integer',
            'highest_degree_attained' => 'nullable|numeric',
            'pursuing_next_degree' => 'nullable|numeric',
            'discipline_teaching_load_1' => 'nullable|numeric',
            'discipline_teaching_load_2' => 'nullable|numeric',
            'discipline_bachelors' => 'nullable|numeric',
            'discipline_masters' => 'nullable|numeric',
            'discipline_doctorate' => 'nullable|numeric',
            'masters_with_thesis' => 'nullable|numeric',
            'doctorate_with_dissertation' => 'nullable|numeric',
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
        ]);

        $facultyProfile->update($validated);
        return response()->json($facultyProfile, Response::HTTP_OK);
    }

    public function destroy(FacultyProfile $facultyProfile)
    {
        $facultyProfile->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
