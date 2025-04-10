<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Graduate; // Updated model name
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GraduateController extends Controller
{
    /**
     * Display a listing of the graduates.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Graduate::query();

        // Search functionality
        if ($search = $request->input('search')) {
            $query->where('student_id', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('first_name', 'like', "%{$search}%")
                  ->orWhere('middle_name', 'like', "%{$search}%")
                  ->orWhere('program_name', 'like', "%{$search}%");
        }

        // Pagination
        $graduates = $query->paginate(10);

        // Format the response to include raw data and pagination metadata
        return response()->json([
            'data' => $graduates->items(), // Raw model data
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
     * Store a newly created graduate in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // Validate the request
        $validated = $request->validate([
            'student_id' => 'required|string|unique:graduates_list,student_id',
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
            // Create the graduate
            $graduate = Graduate::create($validated);

            return response()->json([
                'message' => 'Graduate created successfully!',
                'data' => $graduate, // Raw model data
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create graduate.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified graduate.
     *
     * @param  \App\Models\Graduate  $graduate
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Graduate $graduate): JsonResponse
    {
        return response()->json([
            'data' => $graduate, // Raw model data
        ], 200);
    }

    /**
     * Update the specified graduate in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Graduate  $graduate
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Graduate $graduate): JsonResponse
    {
        // Validate the request
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
            // Update the graduate
            $graduate->update($validated);

            return response()->json([
                'message' => 'Graduate updated successfully!',
                'data' => $graduate, // Raw model data
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
     *
     * @param  \App\Models\Graduate  $graduate
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Graduate $graduate): JsonResponse
    {
        try {
            // Delete the graduate
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
