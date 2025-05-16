<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InstitutionController extends Controller
{
    private function transformInstitution(Institution $institution): array
    {
        $data = $institution->toArray();
        $data['region'] = $institution->region ? $institution->region->name : null;
        $data['province'] = $institution->province ? $institution->province->name : null;
        $data['municipality'] = $institution->municipality ? $institution->municipality->name : null;
        $data['report_year'] = $institution->reportYear ? $institution->reportYear->year : null;
        return $data;
    }

    public function index(Request $request): JsonResponse
    {
        $institutions = Institution::query()
            ->when($request->has('type'), function ($query) use ($request) {
                return $query->where('institution_type', $request->type);
            })
            ->with('region', 'province', 'municipality', 'reportYear')
            ->get();

        $transformed = $institutions->map(function ($inst) {
            return $this->transformInstitution($inst);
        });

        return response()->json($transformed);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'uuid' => 'required|string|max:255|unique:institutions,uuid',
            'name' => 'required|string|max:255',
            'region_id' => 'required|integer|exists:regions,id',
            'address_street' => 'nullable|string|max:255',
            'municipality_id' => 'nullable|integer|exists:municipalities,id',
            'province_id' => 'nullable|integer|exists:provinces,id',
            'postal_code' => 'nullable|string|max:10',
            'institutional_Telephone' => 'nullable|string|max:20',
            'institutional_fax' => 'nullable|string|max:20',
            'head_telephone' => 'nullable|string|max:20',
            'institutional_email' => 'nullable|string|max:255',
            'institutional_website' => 'nullable|string|max:255',
            'year_established' => 'nullable|integer',
            'sec_registration' => 'nullable|string|max:255',
            'year_granted_approved' => 'nullable|integer',
            'year_converted_college' => 'nullable|integer',
            'year_converted_university' => 'nullable|integer',
            'head_name' => 'nullable|string|max:255',
            'head_title' => 'nullable|string|max:255',
            'head_education' => 'nullable|string|max:255',
            'institution_type' => 'nullable|string|max:255',
            'report_year' => 'nullable|integer|exists:report_years,year',
        ]);

        $institution = Institution::create($validated);
        $institution->load('region', 'province', 'municipality', 'reportYear');

        return response()->json($this->transformInstitution($institution), 201);
    }

    public function show(Institution $institution): JsonResponse
    {
        $institution->load('region', 'province', 'municipality', 'reportYear');

        return response()->json($this->transformInstitution($institution));
    }

    public function update(Request $request, Institution $institution): JsonResponse
    {
        $validated = $request->validate([
            'uuid' => 'required|string|max:255|unique:institutions,uuid,' . $institution->id,
            'name' => 'required|string|max:255',
            'region_id' => 'required|integer|exists:regions,id',
            'address_street' => 'nullable|string|max:255',
            'municipality_id' => 'nullable|integer|exists:municipalities,id',
            'province_id' => 'nullable|integer|exists:provinces,id',
            'postal_code' => 'nullable|string|max:10',
            'institutional_telephone' => 'nullable|string|max:20',
            'institutional_fax' => 'nullable|string|max:20',
            'head_telephone' => 'nullable|string|max:20',
            'institutional_email' => 'nullable|string|max:255',
            'institutional_website' => 'nullable|string|max:255',
            'year_established' => 'nullable|integer',
            'sec_registration' => 'nullable|string|max:255',
            'year_granted_approved' => 'nullable|integer',
            'year_converted_college' => 'nullable|integer',
            'year_converted_university' => 'nullable|integer',
            'head_name' => 'nullable|string|max:255',
            'head_title' => 'nullable|string|max:255',
            'head_education' => 'nullable|string|max:255',
            'institution_type' => 'nullable|string|max:255',
            'report_year' => 'nullable|integer|exists:report_years,year',
        ]);

        $institution->update($validated);
        $institution->load('region', 'province', 'municipality', 'reportYear');

        return response()->json($this->transformInstitution($institution));
    }

    public function destroy(Institution $institution): JsonResponse
    {
        $institution->delete();
        return response()->json(null, 204);
    }
}
