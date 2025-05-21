<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CurricularProgram;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CurricularProgramController extends Controller
{
    /**
     * Display a listing of the curricular programs.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = CurricularProgram::query()->with('institution', 'reportYear');

            if ($request->has('institution_id')) {
                $query->where('institution_id', $request->institution_id);
            }

            if ($request->has('program_type')) {
                $query->where('program_type', $request->program_type);
            }

            if ($request->has('report_year')) {
                $query->where('report_year', $request->report_year);
            }

            $programs = $query->get();

            $transformed = $programs->map(function ($program) {
                return [
                    'id' => $program->id,
                    'institution' => $program->institution ? $program->institution->name : null,
                    'program_name' => $program->program_name,
                    'program_code' => $program->program_code,
                    'major_name' => $program->major_name,
                    'major_code' => $program->major_code,
                    'aop_category' => $program->aop_category,
                    'aop_serial' => $program->aop_serial,
                    'aop_year' => $program->aop_year,
                    'is_thesis_dissertation_required' => $program->is_thesis_dissertation_required,
                    'program_status' => $program->program_status,
                    'calendar_use_code' => $program->calendar_use_code,
                    'program_normal_length_in_years' => $program->program_normal_length_in_years,
                    'lab_units' => $program->lab_units,
                    'lecture_units' => $program->lecture_units,
                    'total_units' => $program->total_units,
                    'tuition_per_unit' => $program->tuition_per_unit,
                    'program_fee' => $program->program_fee,
                    'program_type' => $program->program_type,
                    'new_students_freshmen_male' => $program->new_students_freshmen_male,
                    'new_students_freshmen_female' => $program->new_students_freshmen_female,
                    '1st_year_male' => $program->{'1st_year_male'},
                    '1st_year_female' => $program->{'1st_year_female'},
                    '2nd_year_male' => $program->{'2nd_year_male'},
                    '2nd_year_female' => $program->{'2nd_year_female'},
                    '3rd_year_male' => $program->{'3rd_year_male'},
                    '3rd_year_female' => $program->{'3rd_year_female'},
                    '4th_year_male' => $program->{'4th_year_male'},
                    '4th_year_female' => $program->{'4th_year_female'},
                    '5th_year_male' => $program->{'5th_year_male'},
                    '5th_year_female' => $program->{'5th_year_female'},
                    '6th_year_male' => $program->{'6th_year_male'},
                    '6th_year_female' => $program->{'6th_year_female'},
                    '7th_year_male' => $program->{'7th_year_male'},
                    '7th_year_female' => $program->{'7th_year_female'},
                    'subtotal_male' => $program->subtotal_male,
                    'subtotal_female' => $program->subtotal_female,
                    'grand_total' => $program->grand_total,
                    'lecture_units_actual' => $program->lecture_units_actual,
                    'laboratory_units_actual' => $program->laboratory_units_actual,
                    'total_units_actual' => $program->total_units_actual,
                    'graduates_males' => $program->graduates_males,
                    'graduates_females' => $program->graduates_females,
                    'graduates_total' => $program->graduates_total,
                    'externally_funded_merit_scholars' => $program->externally_funded_merit_scholars,
                    'internally_funded_grantees' => $program->internally_funded_grantees,
                    'suc_funded_grantees' => $program->suc_funded_grantees,
                    'report_year' => $program->reportYear ? $program->reportYear->year : null,
                    'created_at' => $program->created_at,
                    'updated_at' => $program->updated_at,
                ];
            });

            return response()->json($transformed, Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error("Error fetching programs: {$e->getMessage()}", [
                'request' => $request->all(),
                'exception' => $e,
            ]);
            return response()->json(['error' => 'Failed to fetch programs.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Store a newly created curricular program in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'institution_id' => 'required|integer|exists:institutions,id',
                'program_name' => 'required|string|max:255',
                'program_code' => 'nullable|integer|min:0',
                'major_name' => 'nullable|string|max:255',
                'major_code' => 'nullable|integer|min:0',
                'aop_category' => 'nullable|string|max:255',
                'aop_serial' => 'nullable|string|max:255',
                'aop_year' => 'nullable|string|max:255',
                'is_thesis_dissertation_required' => 'nullable|string|max:255',
                'program_status' => 'nullable|string|max:255',
                'calendar_use_code' => 'nullable|string|max:255',
                'program_normal_length_in_years' => 'nullable|integer|min:0',
                'lab_units' => 'nullable|integer|min:0',
                'lecture_units' => 'nullable|integer|min:0',
                'total_units' => 'nullable|integer|min:0',
                'tuition_per_unit' => 'nullable|numeric|min:0',
                'program_fee' => 'nullable|numeric|min:0',
                'program_type' => 'nullable|string|max:255',
                'new_students_freshmen_male' => 'nullable|integer|min:0',
                'new_students_freshmen_female' => 'nullable|integer|min:0',
                '1st_year_male' => 'nullable|integer|min:0',
                '1st_year_female' => 'nullable|integer|min:0',
                '2nd_year_male' => 'nullable|integer|min:0',
                '2nd_year_female' => 'nullable|integer|min:0',
                '3rd_year_male' => 'nullable|integer|min:0',
                '3rd_year_female' => 'nullable|integer|min:0',
                '4th_year_male' => 'nullable|integer|min:0',
                '4th_year_female' => 'nullable|integer|min:0',
                '5th_year_male' => 'nullable|integer|min:0',
                '5th_year_female' => 'nullable|integer|min:0',
                '6th_year_male' => 'nullable|integer|min:0',
                '6th_year_female' => 'nullable|integer|min:0',
                '7th_year_male' => 'nullable|integer|min:0',
                '7th_year_female' => 'nullable|integer|min:0',
                'subtotal_male' => 'nullable|integer|min:0',
                'subtotal_female' => 'nullable|integer|min:0',
                'grand_total' => 'nullable|integer|min:0',
                'lecture_units_actual' => 'nullable|integer|min:0',
                'laboratory_units_actual' => 'nullable|integer|min:0',
                'total_units_actual' => 'nullable|integer|min:0',
                'graduates_males' => 'nullable|integer|min:0',
                'graduates_females' => 'nullable|integer|min:0',
                'graduates_total' => 'nullable|integer|min:0',
                'externally_funded_merit_scholars' => 'nullable|integer|min:0',
                'internally_funded_grantees' => 'nullable|integer|min:0',
                'suc_funded_grantees' => 'nullable|integer|min:0',
                'report_year' => 'required|integer|exists:report_years,year',
            ]);

            // Calculate enrollment totals
            $maleTotal =
                ($validated['new_students_freshmen_male'] ?? 0) +
                ($validated['1st_year_male'] ?? 0) +
                ($validated['2nd_year_male'] ?? 0) +
                ($validated['3rd_year_male'] ?? 0) +
                ($validated['4th_year_male'] ?? 0) +
                ($validated['5th_year_male'] ?? 0) +
                ($validated['6th_year_male'] ?? 0) +
                ($validated['7th_year_male'] ?? 0);
            $femaleTotal =
                ($validated['new_students_freshmen_female'] ?? 0) +
                ($validated['1st_year_female'] ?? 0) +
                ($validated['2nd_year_female'] ?? 0) +
                ($validated['3rd_year_female'] ?? 0) +
                ($validated['4th_year_female'] ?? 0) +
                ($validated['5th_year_female'] ?? 0) +
                ($validated['6th_year_female'] ?? 0) +
                ($validated['7th_year_female'] ?? 0);
            $validated['subtotal_male'] = $maleTotal;
            $validated['subtotal_female'] = $femaleTotal;
            $validated['grand_total'] = $maleTotal + $femaleTotal;

            // Calculate statistics totals
            $validated['total_units_actual'] =
                ($validated['lecture_units_actual'] ?? 0) +
                ($validated['laboratory_units_actual'] ?? 0);
            $validated['graduates_total'] =
                ($validated['graduates_males'] ?? 0) +
                ($validated['graduates_females'] ?? 0);

            $program = CurricularProgram::create($validated);
            $program->load('institution', 'reportYear');

            return response()->json([
                'message' => 'Curricular program created successfully!',
                'data' => $program,
            ], Response::HTTP_CREATED);
        } catch (ValidationException $e) {
            Log::error("Validation error storing program: {$e->getMessage()}", [
                'request' => $request->all(),
                'errors' => $e->errors(),
            ]);
            return response()->json(['errors' => $e->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            Log::error("Error storing program: {$e->getMessage()}", [
                'request' => $request->all(),
                'exception' => $e,
            ]);
            return response()->json(['error' => 'Failed to store program.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified curricular program.
     */
    public function show(CurricularProgram $program): JsonResponse
    {
        $program->load('institution', 'reportYear');

        return response()->json([
            'data' => [
                'id' => $program->id,
                'institution' => $program->institution ? $program->institution->name : null,
                'program_name' => $program->program_name,
                'program_code' => $program->program_code,
                'major_name' => $program->major_name,
                'major_code' => $program->major_code,
                'aop_category' => $program->aop_category,
                'aop_serial' => $program->aop_serial,
                'aop_year' => $program->aop_year,
                'is_thesis_dissertation_required' => $program->is_thesis_dissertation_required,
                'program_status' => $program->program_status,
                'calendar_use_code' => $program->calendar_use_code,
                'program_normal_length_in_years' => $program->program_normal_length_in_years,
                'lab_units' => $program->lab_units,
                'lecture_units' => $program->lecture_units,
                'total_units' => $program->total_units,
                'tuition_per_unit' => $program->tuition_per_unit,
                'program_fee' => $program->program_fee,
                'program_type' => $program->program_type,
                'new_students_freshmen_male' => $program->new_students_freshmen_male,
                'new_students_freshmen_female' => $program->new_students_freshmen_female,
                '1st_year_male' => $program->{'1st_year_male'},
                '1st_year_female' => $program->{'1st_year_female'},
                '2nd_year_male' => $program->{'2nd_year_male'},
                '2nd_year_female' => $program->{'2nd_year_female'},
                '3rd_year_male' => $program->{'3rd_year_male'},
                '3rd_year_female' => $program->{'3rd_year_female'},
                '4th_year_male' => $program->{'4th_year_male'},
                '4th_year_female' => $program->{'4th_year_female'},
                '5th_year_male' => $program->{'5th_year_male'},
                '5th_year_female' => $program->{'5th_year_female'},
                '6th_year_male' => $program->{'6th_year_male'},
                '6th_year_female' => $program->{'6th_year_female'},
                '7th_year_male' => $program->{'7th_year_male'},
                '7th_year_female' => $program->{'7th_year_female'},
                'subtotal_male' => $program->subtotal_male,
                'subtotal_female' => $program->subtotal_female,
                'grand_total' => $program->grand_total,
                'lecture_units_actual' => $program->lecture_units_actual,
                'laboratory_units_actual' => $program->laboratory_units_actual,
                'total_units_actual' => $program->total_units_actual,
                'graduates_males' => $program->graduates_males,
                'graduates_females' => $program->graduates_females,
                'graduates_total' => $program->graduates_total,
                'externally_funded_merit_scholars' => $program->externally_funded_merit_scholars,
                'internally_funded_grantees' => $program->internally_funded_grantees,
                'suc_funded_grantees' => $program->suc_funded_grantees,
                'report_year' => $program->reportYear ? $program->reportYear->year : null,
                'created_at' => $program->created_at,
                'updated_at' => $program->updated_at,
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified curricular program in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            // Find the program manually to ensure it exists
            $program = CurricularProgram::find($id);
            if (!$program) {
                Log::error("Program not found for ID: {$id}");
                return response()->json([
                    'error' => 'Program not found.'
                ], Response::HTTP_NOT_FOUND);
            }

            // Log the incoming request payload
            Log::info("Update request payload for program ID {$program->id}", $request->all());

            // Check if exactly one field is provided
            if (count($request->all()) !== 1) {
                Log::warning("Invalid number of fields provided for program ID {$program->id}", ['count' => count($request->all())]);
                return response()->json([
                    'error' => 'Exactly one field must be provided for update.'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Define validation rules
            $validationRules = [
                'institution_id' => 'sometimes|integer|exists:institutions,id',
                'program_name' => 'sometimes|string|max:255',
                'program_code' => 'nullable|integer|min:0',
                'major_name' => 'nullable|string|max:255',
                'major_code' => 'nullable|integer|min:0',
                'aop_category' => 'nullable|string|max:255',
                'aop_serial' => 'nullable|string|max:255',
                'aop_year' => 'nullable|string|max:255',
                'is_thesis_dissertation_required' => 'nullable|string|max:255',
                'program_status' => 'nullable|string|max:255',
                'calendar_use_code' => 'nullable|string|max:255',
                'program_normal_length_in_years' => 'nullable|integer|min:0',
                'lab_units' => 'nullable|integer|min:0',
                'lecture_units' => 'nullable|integer|min:0',
                'total_units' => 'nullable|integer|min:0',
                'tuition_per_unit' => 'nullable|numeric|min:0',
                'program_fee' => 'nullable|numeric|min:0',
                'program_type' => 'nullable|string|max:255',
                'new_students_freshmen_male' => 'nullable|integer|min:0',
                'new_students_freshmen_female' => 'nullable|integer|min:0',
                '1st_year_male' => 'nullable|integer|min:0',
                '1st_year_female' => 'nullable|integer|min:0',
                '2nd_year_male' => 'nullable|integer|min:0',
                '2nd_year_female' => 'nullable|integer|min:0',
                '3rd_year_male' => 'nullable|integer|min:0',
                '3rd_year_female' => 'nullable|integer|min:0',
                '4th_year_male' => 'nullable|integer|min:0',
                '4th_year_female' => 'nullable|integer|min:0',
                '5th_year_male' => 'nullable|integer|min:0',
                '5th_year_female' => 'nullable|integer|min:0',
                '6th_year_male' => 'nullable|integer|min:0',
                '6th_year_female' => 'nullable|integer|min:0',
                '7th_year_male' => 'nullable|integer|min:0',
                '7th_year_female' => 'nullable|integer|min:0',
                'subtotal_male' => 'nullable|integer|min:0',
                'subtotal_female' => 'nullable|integer|min:0',
                'grand_total' => 'nullable|integer|min:0',
                'lecture_units_actual' => 'nullable|integer|min:0',
                'laboratory_units_actual' => 'nullable|integer|min:0',
                'total_units_actual' => 'nullable|integer|min:0',
                'graduates_males' => 'nullable|integer|min:0',
                'graduates_females' => 'nullable|integer|min:0',
                'graduates_total' => 'nullable|integer|min:0',
                'externally_funded_merit_scholars' => 'nullable|integer|min:0',
                'internally_funded_grantees' => 'nullable|integer|min:0',
                'suc_funded_grantees' => 'nullable|integer|min:0',
                'report_year' => 'sometimes|integer|exists:report_years,year',
            ];

            // Get the single field from the request
            $field = array_key_first($request->all());

            // Validate only the provided field
            $validated = $request->validate([
                $field => $validationRules[$field] ?? 'sometimes',
            ]);

            Log::info("Validated data for program ID {$program->id}", $validated);

            // Prevent updates to calculated fields
            $calculatedFields = [
                'subtotal_male',
                'subtotal_female',
                'grand_total',
                'total_units_actual',
                'graduates_total',
            ];

            if (in_array($field, $calculatedFields)) {
                Log::warning("Attempt to update calculated field for program ID {$program->id}: {$field}");
                return response()->json([
                    'error' => 'Cannot directly update calculated field: ' . $field,
                ], Response::HTTP_BAD_REQUEST);
            }

            // Calculate totals only if relevant fields are updated
            if (in_array($field, [
                'new_students_freshmen_male',
                'new_students_freshmen_female',
                '1st_year_male',
                '1st_year_female',
                '2nd_year_male',
                '2nd_year_female',
                '3rd_year_male',
                '3rd_year_female',
                '4th_year_male',
                '4th_year_female',
                '5th_year_male',
                '5th_year_female',
                '6th_year_male',
                '6th_year_female',
                '7th_year_male',
                '7th_year_female',
            ])) {
                $maleTotal =
                    ($field === 'new_students_freshmen_male' ? $validated[$field] : $program->new_students_freshmen_male ?? 0) +
                    ($field === '1st_year_male' ? $validated[$field] : $program->{'1st_year_male'} ?? 0) +
                    ($field === '2nd_year_male' ? $validated[$field] : $program->{'2nd_year_male'} ?? 0) +
                    ($field === '3rd_year_male' ? $validated[$field] : $program->{'3rd_year_male'} ?? 0) +
                    ($field === '4th_year_male' ? $validated[$field] : $program->{'4th_year_male'} ?? 0) +
                    ($field === '5th_year_male' ? $validated[$field] : $program->{'5th_year_male'} ?? 0) +
                    ($field === '6th_year_male' ? $validated[$field] : $program->{'6th_year_male'} ?? 0) +
                    ($field === '7th_year_male' ? $validated[$field] : $program->{'7th_year_male'} ?? 0);
                $femaleTotal =
                    ($field === 'new_students_freshmen_female' ? $validated[$field] : $program->new_students_freshmen_female ?? 0) +
                    ($field === '1st_year_female' ? $validated[$field] : $program->{'1st_year_female'} ?? 0) +
                    ($field === '2nd_year_female' ? $validated[$field] : $program->{'2nd_year_female'} ?? 0) +
                    ($field === '3rd_year_female' ? $validated[$field] : $program->{'3rd_year_female'} ?? 0) +
                    ($field === '4th_year_female' ? $validated[$field] : $program->{'4th_year_female'} ?? 0) +
                    ($field === '5th_year_female' ? $validated[$field] : $program->{'5th_year_female'} ?? 0) +
                    ($field === '6th_year_female' ? $validated[$field] : $program->{'6th_year_female'} ?? 0) +
                    ($field === '7th_year_female' ? $validated[$field] : $program->{'7th_year_female'} ?? 0);
                $validated['subtotal_male'] = $maleTotal;
                $validated['subtotal_female'] = $femaleTotal;
                $validated['grand_total'] = $maleTotal + $femaleTotal;
            }

            if (in_array($field, ['lecture_units_actual', 'laboratory_units_actual'])) {
                $validated['total_units_actual'] =
                    ($field === 'lecture_units_actual' ? $validated[$field] : $program->lecture_units_actual ?? 0) +
                    ($field === 'laboratory_units_actual' ? $validated[$field] : $program->laboratory_units_actual ?? 0);
            }

            if (in_array($field, ['graduates_males', 'graduates_females'])) {
                $validated['graduates_total'] =
                    ($field === 'graduates_males' ? $validated[$field] : $program->graduates_males ?? 0) +
                    ($field === 'graduates_females' ? $validated[$field] : $program->graduates_females ?? 0);
            }

            // Log the SQL query
            DB::enableQueryLog();
            $updated = $program->update($validated);
            Log::info("Executed queries for program ID {$program->id}", DB::getQueryLog());

            if (!$updated) {
                Log::error("Update failed for program ID {$program->id}", ['validated' => $validated]);
                return response()->json([
                    'error' => 'Failed to update program. No changes applied.'
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            // Fetch fresh data to ensure no caching issues
            $program = CurricularProgram::find($program->id)->load('institution', 'reportYear');
            Log::info("Updated program data for ID {$program->id}", $program->toArray());

            return response()->json([
                'message' => 'Curricular program updated successfully!',
                'data' => $program,
            ], Response::HTTP_OK);
        } catch (ValidationException $e) {
            Log::error("Validation error updating program ID {$id}: {$e->getMessage()}", [
                'request' => $request->all(),
                'errors' => $e->errors(),
            ]);
            return response()->json(['errors' => $e->errors()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error("Database error updating program ID {$id}: {$e->getMessage()}", [
                'request' => $request->all(),
                'exception' => $e,
            ]);
            return response()->json(['error' => 'Database error occurred.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            Log::error("General error updating program ID {$id}: {$e->getMessage()}", [
                'request' => $request->all(),
                'exception' => $e,
            ]);
            return response()->json(['error' => 'Failed to update program.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified curricular program from storage.
     */
    public function destroy(CurricularProgram $program): JsonResponse
    {
        try {
            $program->delete();
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            Log::error("Error deleting program ID {$program->id}: {$e->getMessage()}", [
                'exception' => $e,
            ]);
            return response()->json(['error' => 'Failed to delete program.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
