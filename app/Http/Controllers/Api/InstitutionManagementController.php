<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use App\Models\Region;
use App\Models\Province;
use App\Models\Municipality;
use Illuminate\Http\Request;

class InstitutionManagementController extends Controller
{
    public function getInstitutionData(Request $request)
    {
        $institutionUuid = $request->query('institution_uuid');
        $reportYear = $request->query('report_year');

        if (!$institutionUuid || !$reportYear) {
            return response()->json([
                'error' => 'Institution UUID and report year are required.',
            ], 400);
        }

        try {
            // Fetch institution
            $institution = Institution::where('uuid', $institutionUuid)
                ->where('report_year', $reportYear)
                ->first();

            if (!$institution) {
                return response()->json([
                    'error' => 'Institution not found.',
                ], 404);
            }

            // Fetch location data
            $region = Region::find($institution->region_id);
            $province = Province::find($institution->province_id);
            $municipality = Municipality::find($institution->municipality_id);

            $location = [
                'region' => $region ? $region->name : null,
                'province' => $province ? $province->name : null,
                'municipality' => $municipality ? $municipality->name : null,
            ];

            return response()->json([
                'institution' => $institution,
                'location' => $location,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch institution data.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
