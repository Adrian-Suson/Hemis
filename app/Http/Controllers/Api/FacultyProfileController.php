<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FacultyProfile;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FacultyProfileController extends Controller
{
    /**
     * Display a listing of the faculty profiles.
     */
    public function index(Request $request)
    {
        $query = FacultyProfile::with('institution');

        if ($request->has('institution_id')) {
            $query->where('institution_id', $request->institution_id);
        }

        $facultyProfiles = $query->get();

        return response()->json($facultyProfiles, Response::HTTP_OK);
    }


    /**
     * Store a newly created faculty profile in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            '*.institution_id' => 'nullable|exists:institutions,id',
            '*.faculty_group' => 'nullable|string',
            '*.name' => 'nullable|string|max:255',
            '*.generic_faculty_rank' => 'nullable|integer',
            '*.home_college' => 'nullable|string|max:255',
            '*.home_department' => 'nullable|string|max:255',
            '*.is_tenured' => 'nullable|boolean',
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

        // Remove duplicates by converting each profile to a unique string and filtering
        $uniqueProfiles = [];
        $seen = [];

        foreach ($validatedData as $profile) {
            $profileString = json_encode($profile); // Stringify for comparison
            if (!in_array($profileString, $seen)) {
                $seen[] = $profileString;
                $uniqueProfiles[] = $profile;
            }
        }

        if (empty($uniqueProfiles)) {
            return response()->json(['message' => 'No unique faculty profiles to insert'], Response::HTTP_OK);
        }

        // Bulk insert the unique validated data
        FacultyProfile::insert($uniqueProfiles);

        return response()->json([
            'message' => 'Faculty profiles created successfully',
            'count' => count($uniqueProfiles)
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified faculty profile.
     */
    public function show(FacultyProfile $facultyProfile)
    {
        return response()->json($facultyProfile->load('institution'), Response::HTTP_OK);
    }

    /**
     * Update the specified faculty profile in storage.
     */
    public function update(Request $request, FacultyProfile $facultyProfile)
    {
        $validated = $request->validate([
            'institution_id' => 'nullable|exists:institutions,id',
            'faculty_group' => 'nullable|string|in:A1,A2,A3,B,C1,C2,C3,D,E',
            'name' => 'nullable|string|max:255',
            'generic_faculty_rank' => 'nullable|integer',
            'home_college' => 'nullable|string|max:255',
            'home_department' => 'nullable|string|max:255',
            'is_tenured' => 'nullable|boolean',
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
        ]);

        $facultyProfile->update($validated);
        return response()->json($facultyProfile, Response::HTTP_OK);
    }

    /**
     * Remove the specified faculty profile from storage.
     */
    public function destroy(FacultyProfile $facultyProfile)
    {
        $facultyProfile->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
