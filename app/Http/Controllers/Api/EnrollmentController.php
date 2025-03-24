<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EnrollmentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'new_students_freshmen_male' => 'nullable|integer',
            'new_students_freshmen_female' => 'nullable|integer',
            'first_year_old_male' => 'nullable|integer',
            'first_year_old_female' => 'nullable|integer',
            'second_year_male' => 'nullable|integer',
            'second_year_female' => 'nullable|integer',
            'third_year_male' => 'nullable|integer',
            'third_year_female' => 'nullable|integer',
            'fourth_year_male' => 'nullable|integer',
            'fourth_year_female' => 'nullable|integer',
            'fifth_year_male' => 'nullable|integer',
            'fifth_year_female' => 'nullable|integer',
            'sixth_year_male' => 'nullable|integer',
            'sixth_year_female' => 'nullable|integer',
            'seventh_year_male' => 'nullable|integer',
            'seventh_year_female' => 'nullable|integer',
            'subtotal_male' => 'nullable|integer',
            'subtotal_female' => 'nullable|integer',
            'grand_total' => 'nullable|integer',
        ]);

        $enrollment = Enrollment::create($validated);
        return response()->json($enrollment->load('program'), 201);
    }

    public function update(Request $request, Enrollment $enrollment): JsonResponse
    {
        $validated = $request->validate([
            'program_id' => 'sometimes|required|exists:programs,id',
            'new_students_freshmen_male' => 'nullable|integer',
            'new_students_freshmen_female' => 'nullable|integer',
            'first_year_old_male' => 'nullable|integer',
            'first_year_old_female' => 'nullable|integer',
            'second_year_male' => 'nullable|integer',
            'second_year_female' => 'nullable|integer',
            'third_year_male' => 'nullable|integer',
            'third_year_female' => 'nullable|integer',
            'fourth_year_male' => 'nullable|integer',
            'fourth_year_female' => 'nullable|integer',
            'fifth_year_male' => 'nullable|integer',
            'fifth_year_female' => 'nullable|integer',
            'sixth_year_male' => 'nullable|integer',
            'sixth_year_female' => 'nullable|integer',
            'seventh_year_male' => 'nullable|integer',
            'seventh_year_female' => 'nullable|integer',
            'subtotal_male' => 'nullable|integer',
            'subtotal_female' => 'nullable|integer',
            'grand_total' => 'nullable|integer',
        ]);

        $enrollment->update($validated);
        return response()->json($enrollment->load('program'));
    }
}
