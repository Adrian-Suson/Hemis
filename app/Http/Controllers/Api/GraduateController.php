<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Graduate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class GraduateController extends Controller
{
    /**
     * Display a listing of the graduates.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $graduates = Graduate::latest()->paginate(10);
        return response()->json($graduates);
    }

    /**
     * Store a newly created graduate in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|string|max:50|unique:graduates',
            'date_of_birth' => 'required|date',
            'last_name' => 'required|string|max:100',
            'first_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'sex' => 'required|in:M,F',
            'date_graduated' => 'required|date',
            'program_name' => 'required|string|max:255',
            'program_major' => 'nullable|string|max:255',
            'authority_number' => 'nullable|string|max:255',
            'year_granted' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $graduate = Graduate::create($request->all());
        return response()->json($graduate, 201);
    }

    /**
     * Display the specified graduate.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $graduate = Graduate::findOrFail($id);
        return response()->json($graduate);
    }

    /**
     * Update the specified graduate in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $graduate = Graduate::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'student_id' => 'required|string|max:50|unique:graduates,student_id,' . $id,
            'date_of_birth' => 'required|date',
            'last_name' => 'required|string|max:100',
            'first_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'sex' => 'required|in:M,F',
            'date_graduated' => 'required|date',
            'program_name' => 'required|string|max:255',
            'program_major' => 'nullable|string|max:255',
            'authority_number' => 'nullable|string|max:255',
            'year_granted' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $graduate->update($request->all());
        return response()->json($graduate);
    }

    /**
     * Remove the specified graduate from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $graduate = Graduate::findOrFail($id);
        $graduate->delete();
        return response()->json(null, 204);
    }

    /**
     * Bulk store graduates.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function bulkStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'graduates' => 'required|array',
            'graduates.*.student_id' => 'required|string|max:50|distinct',
            'graduates.*.date_of_birth' => 'required|date',
            'graduates.*.last_name' => 'required|string|max:100',
            'graduates.*.first_name' => 'required|string|max:100',
            'graduates.*.middle_name' => 'nullable|string|max:100',
            'graduates.*.sex' => 'required|in:M,F',
            'graduates.*.date_graduated' => 'required|date',
            'graduates.*.program_name' => 'required|string|max:255',
            'graduates.*.program_major' => 'nullable|string|max:255',
            'graduates.*.authority_number' => 'nullable|string|max:255',
            'graduates.*.year_granted' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $graduates = collect($request->graduates)->map(function ($graduate) {
                return Graduate::create($graduate);
            });

            DB::commit();

            return response()->json([
                'message' => 'Graduates created successfully',
                'data' => $graduates
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error creating graduates',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search graduates by various criteria.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        $query = Graduate::query();

        if ($request->has('student_id')) {
            $query->where('student_id', 'like', '%' . $request->student_id . '%');
        }

        if ($request->has('last_name')) {
            $query->where('last_name', 'like', '%' . $request->last_name . '%');
        }

        if ($request->has('first_name')) {
            $query->where('first_name', 'like', '%' . $request->first_name . '%');
        }

        if ($request->has('program_name')) {
            $query->where('program_name', 'like', '%' . $request->program_name . '%');
        }

        if ($request->has('year_granted')) {
            $query->where('year_granted', $request->year_granted);
        }

        $graduates = $query->latest()->paginate(10);
        return response()->json($graduates);
    }
}