<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Graduate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class GraduateController extends Controller
{
    /**
     * Display a listing of the graduates.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Graduate::query()->with('institution', 'reportYear');

        if ($search = $request->input('search')) {
            $query->where('student_id', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('first_name', 'like', "%{$search}%")
                ->orWhere('middle_name', 'like', "%{$search}%")
                ->orWhere('program_name', 'like', "%{$search}%");
        }

        $graduates = $query->paginate(10);

        $transformed = $graduates->map(function ($graduate) {
            return [
                'id' => $graduate->id,
                'institution' => $graduate->institution ? $graduate->institution->name : null,
                'student_id' => $graduate->student_id,
                'date_of_birth' => $graduate->date_of_birth->toDateString(),
                'last_name' => $graduate->last_name,
                'first_name' => $graduate->first_name,
                'middle_name' => $graduate->middle_name,
                'sex' => $graduate->sex,
                'date_graduated' => $graduate->date_graduated ? $graduate->date_graduated->toDateString() : null,
                'program_name' => $graduate->program_name,
                'program_major' => $graduate->program_major,
                'program_authority_to_operate_graduate' => $graduate->program_authority_to_operate_graduate,
                'year_granted' => $graduate->year_granted,
                'report_year' => $graduate->reportYear ? $graduate->reportYear->year : null,
                'created_at' => $graduate->created_at,
                'updated_at' => $graduate->updated_at,
            ];
        });

        return response()->json([
            'data' => $transformed, // Remove items() here
            'pagination' => [
                'total' => $graduates->total(),
                'per_page' => $graduates->perPage(),
                'current_page' => $graduates->currentPage(),
                'last_page' => $graduates->lastPage(),
                'from' => $graduates->firstItem(),
                'to' => $graduates->lastItem(),
            ],
        ], 200);
    }

    /**
     * Store multiple graduates in storage from an array.
     */
    public function store(Request $request): JsonResponse
    {
        Log::info('Graduate store request received', ['data' => $request->all()]);

        $data = $request->all();
        if (empty($data)) {
            return response()->json([
                'message' => 'No graduate data provided.',
            ], 422);
        }

        $validator = Validator::make($data, [
            '*.institution_id' => 'required|string|exists:institutions,id',
            '*.student_id' => 'required|string|max:50|unique:graduates_list,student_id',
            '*.date_of_birth' => 'required|date|before_or_equal:today',
            '*.last_name' => 'required|string|max:255',
            '*.first_name' => 'required|string|max:255',
            '*.middle_name' => 'nullable|string|max:255',
            '*.sex' => 'required|in:M,F',
            '*.date_graduated' => 'nullable|date|before_or_equal:today',
            '*.program_name' => 'required|string|max:255',
            '*.program_major' => 'nullable|string|max:255',
            '*.program_authority_to_operate_graduate' => 'nullable|string|max:255',
            '*.year_granted' => 'nullable|integer|min:1900|max:' . date('Y'),
            '*.report_year' => 'required|integer|exists:report_years,year',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $validatedData = $validator->validated();

            $currentTime = now();
            $validatedData = array_map(function ($graduate) use ($currentTime) {
                $graduate['created_at'] = $currentTime;
                $graduate['updated_at'] = $currentTime;
                return $graduate;
            }, $validatedData);

            Graduate::insert($validatedData);

            Log::info('Graduates inserted successfully', ['count' => count($validatedData)]);

            return response()->json([
                'message' => 'Graduates added successfully',
                'count' => count($validatedData),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to create graduates', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Failed to create graduates.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified graduate.
     */
    public function show(Graduate $graduate): JsonResponse
    {
        $graduate->load('institution', 'reportYear');

        return response()->json([
            'data' => [
                'id' => $graduate->id,
                'institution' => $graduate->institution ? $graduate->institution->name : null,
                'student_id' => $graduate->student_id,
                'date_of_birth' => $graduate->date_of_birth->toDateString(),
                'last_name' => $graduate->last_name,
                'first_name' => $graduate->first_name,
                'middle_name' => $graduate->middle_name,
                'sex' => $graduate->sex,
                'date_graduated' => $graduate->date_graduated ? $graduate->date_graduated->toDateString() : null,
                'program_name' => $graduate->program_name,
                'program_major' => $graduate->program_major,
                'program_authority_to_operate_graduate' => $graduate->program_authority_to_operate_graduate,
                'year_granted' => $graduate->year_granted,
                'report_year' => $graduate->reportYear ? $graduate->reportYear->year : null,
                'created_at' => $graduate->created_at,
                'updated_at' => $graduate->updated_at,
            ],
        ], 200);
    }

    /**
     * Update the specified graduate in storage.
     */
    public function update(Request $request, Graduate $graduate): JsonResponse
    {
        $validated = $request->validate([
            'institution_id' => 'sometimes|required|string|exists:institutions,id',
            'student_id' => 'sometimes|required|string|max:50|unique:graduates_list,student_id,' . $graduate->id,
            'date_of_birth' => 'sometimes|required|date|before_or_equal:today',
            'last_name' => 'sometimes|required|string|max:255',
            'first_name' => 'sometimes|required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'sex' => 'sometimes|required|in:M,F',
            'date_graduated' => 'nullable|date|before_or_equal:today',
            'program_name' => 'sometimes|required|string|max:255',
            'program_major' => 'nullable|string|max:255',
            'program_authority_to_operate_graduate' => 'nullable|string|max:255',
            'year_granted' => 'nullable|integer|min:1900|max:' . date('Y'),
            'report_year' => 'sometimes|required|integer|exists:report_years,year',
        ]);

        try {
            $updated = $graduate->update($validated);

            if (!$updated) {
                Log::warning('Graduate update had no effect', [
                    'graduate_id' => $graduate->id,
                    'payload' => $validated,
                ]);
                return response()->json([
                    'message' => 'No changes made to graduate.',
                    'data' => [
                        'id' => $graduate->id,
                        'institution' => $graduate->institution ? $graduate->institution->name : null,
                        'student_id' => $graduate->student_id,
                        'date_of_birth' => $graduate->date_of_birth->toDateString(),
                        'last_name' => $graduate->last_name,
                        'first_name' => $graduate->first_name,
                        'middle_name' => $graduate->middle_name,
                        'sex' => $graduate->sex,
                        'date_graduated' => $graduate->date_graduated ? $graduate->date_graduated->toDateString() : null,
                        'program_name' => $graduate->program_name,
                        'program_major' => $graduate->program_major,
                        'program_authority_to_operate_graduate' => $graduate->program_authority_to_operate_graduate,
                        'year_granted' => $graduate->year_granted,
                        'report_year' => $graduate->reportYear ? $graduate->reportYear->year : null,
                        'created_at' => $graduate->created_at,
                        'updated_at' => $graduate->updated_at,
                    ],
                ], 200);
            }

            $graduate->load('institution', 'reportYear');

            Log::info('Graduate updated successfully', [
                'graduate_id' => $graduate->id,
                'payload' => $validated,
            ]);

            return response()->json([
                'message' => 'Graduate updated successfully!',
                'data' => [
                    'id' => $graduate->id,
                    'institution' => $graduate->institution ? $graduate->institution->name : null,
                    'student_id' => $graduate->student_id,
                    'date_of_birth' => $graduate->date_of_birth->toDateString(),
                    'last_name' => $graduate->last_name,
                    'first_name' => $graduate->first_name,
                    'middle_name' => $graduate->middle_name,
                    'sex' => $graduate->sex,
                    'date_graduated' => $graduate->date_graduated ? $graduate->date_graduated->toDateString() : null,
                    'program_name' => $graduate->program_name,
                    'program_major' => $graduate->program_major,
                    'program_authority_to_operate_graduate' => $graduate->program_authority_to_operate_graduate,
                    'year_granted' => $graduate->year_granted,
                    'report_year' => $graduate->reportYear ? $graduate->reportYear->year : null,
                    'created_at' => $graduate->created_at,
                    'updated_at' => $graduate->updated_at,
                ],
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to update graduate', [
                'graduate_id' => $graduate->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Failed to update graduate.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified graduate from storage.
     */
    public function destroy(Graduate $graduate): JsonResponse
    {
        try {
            $graduate->delete();

            return response()->json([
                'message' => 'Graduate deleted successfully!',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete graduate.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}