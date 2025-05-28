<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrivateDetail;
use Illuminate\Http\Request;

class PrivateDetailsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $privateDetails = PrivateDetail::with(['hei', 'reportYear'])->get();
        return response()->json($privateDetails);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'institution_uiid' => 'required|string|max:36',
            'region' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'municipality' => 'nullable|string|max:255',
            'address_street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'institutional_telephone' => 'nullable|string|max:20',
            'institutional_fax' => 'nullable|string|max:20',
            'head_telephone' => 'nullable|string|max:20',
            'institutional_email' => 'nullable|string|max:255',
            'institutional_website' => 'nullable|string|max:255',
            'year_established' => 'nullable|integer',
            'report_year' => 'required|integer',
            'head_name' => 'nullable|string|max:255',
            'head_title' => 'nullable|string|max:255',
            'head_education' => 'nullable|string|max:255',
            'sec_registration' => 'nullable|string|max:255',
            'year_granted_approved' => 'nullable|integer',
            'year_converted_college' => 'nullable|integer',
            'year_converted_university' => 'nullable|integer',
            'x_coordinate' => 'nullable|numeric',
            'y_coordinate' => 'nullable|numeric',
        ]);

        $privateDetail = PrivateDetail::create($validatedData);
        return response()->json($privateDetail, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $privateDetail = PrivateDetail::with(['hei', 'reportYear', 'deanProfiles', 'formE5s', 'formBCs', 'prcGraduates'])
            ->findOrFail($id);

        return response()->json($privateDetail);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $privateDetail = PrivateDetail::findOrFail($id);

        $validatedData = $request->validate([
            'institution_uiid' => 'sometimes|string|max:36',
            'region' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'municipality' => 'nullable|string|max:255',
            'address_street' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
            'institutional_telephone' => 'nullable|string|max:20',
            'institutional_fax' => 'nullable|string|max:20',
            'head_telephone' => 'nullable|string|max:20',
            'institutional_email' => 'nullable|string|max:255',
            'institutional_website' => 'nullable|string|max:255',
            'year_established' => 'nullable|integer',
            'report_year' => 'sometimes|integer',
            'head_name' => 'nullable|string|max:255',
            'head_title' => 'nullable|string|max:255',
            'head_education' => 'nullable|string|max:255',
            'sec_registration' => 'nullable|string|max:255',
            'year_granted_approved' => 'nullable|integer',
            'year_converted_college' => 'nullable|integer',
            'year_converted_university' => 'nullable|integer',
            'x_coordinate' => 'nullable|numeric',
            'y_coordinate' => 'nullable|numeric',
        ]);

        $privateDetail->update($validatedData);
        return response()->json($privateDetail);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $privateDetail = PrivateDetail::findOrFail($id);
        $privateDetail->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
