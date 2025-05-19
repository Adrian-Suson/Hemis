<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use Illuminate\Http\Request;

class InstitutionManagementController extends Controller
{
    public function getInstitutionData(Request $request)
    {
        try {
            // Fetch all institutions
            $institutions = Institution::all();

            return response()->json([
                'institutions' => $institutions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch institution data.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
