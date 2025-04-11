<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Graduate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator; // Add this import

class GraduateController extends Controller
{
    /**
     * Display a listing of the graduates.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Graduate::query();

        if ($search = $request->input('search')) {
            $query->where('student_id', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('first_name', 'like', "%{$search}%")
                  ->orWhere('middle_name', 'like', "%{$search}%")
                  ->orWhere('program_name', 'like', "%{$search}%");
        }

        $graduates = $query->paginate(10);

        return response()->json([
            'data' => $graduates->items(),
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
        // Log the incoming request for debugging
        Log::info('Graduate store request received', ['data' => $request->all()]);

        // Check if the request contains data
        $data = $request->all();
        if (empty($data)) {
            return response()->json([
                'message' => 'No graduate data provided.',
            ], 422);
        }

        // Validate the request expecting an array of graduates
        $validator = Validator::make($data, [
            '*.institution_id' => 'required|integer|exists:institutions,id',
            '*.student_id' => 'required|string|max:50|unique:graduates_list,student_id',
            '*.date_of_birth' => 'required|date|before:today',
            '*.last_name' => 'required|string|max:255',
            '*.first_name' => 'required|string|max:255',
            '*.middle_name' => 'nullable|string|max:255',
            '*.sex' => 'required|in:M,F',
            '*.date_graduated' => 'nullable|date|before_or_equal:today',
            '*.program_name' => 'required|string|max:255',
            '*.program_major' => 'nullable|string|max:255',
            '*.program_authority_to_operate_graduate' => 'nullable|string|max:255',
            '*.year_granted' => 'nullable|integer|min:1900|max:' . date('Y'),
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Get validated data
            $validatedData = $validator->validated();

            // Add timestamps to each record
            $currentTime = now();
            $validatedData = array_map(function ($graduate) use ($currentTime) {
                $graduate['created_at'] = $currentTime;
                $graduate['updated_at'] = $currentTime;
                return $graduate;
            }, $validatedData);

            // Bulk insert graduates
            Graduate::insert($validatedData);

            // Log success
            Log::info('Graduates inserted successfully', ['count' => count($validatedData)]);

            return response()->json([
                'message' => 'Graduates added successfully',
                'count' => count($validatedData),
            ], 201);
        } catch (\Exception $e) {
            // Log the error
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
        return response()->json([
            'data' => $graduate,
        ], 200);
    }

    /**
     * Update the specified graduate in storage.
     */
    public function update(Request $request, Graduate $graduate): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|string|unique:graduates_list,student_id,' . $graduate->id,
            'date_of_birth' => 'required|date',
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'sex' => 'required|in:M,F',
            'date_graduated' => 'nullable|date',
            'program_name' => 'required|string|max:255',
            'program_major' => 'nullable|string|max:255',
            'program_authority_to_operate_graduate' => 'nullable|string|max:255',
            'year_granted' => 'nullable|integer|min:1900|max:' . date('Y'),
        ]);

        try {
            $graduate->update($validated);

            return response()->json([
                'message' => 'Graduate updated successfully!',
                'data' => $graduate,
            ], 200);
        } catch (\Exception $e) {
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