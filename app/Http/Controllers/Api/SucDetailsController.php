<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SucDetail;
use Illuminate\Http\Request;

class SucDetailsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sucDetails = SucDetail::all();
        return response()->json($sucDetails);
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
        ]);

        $sucDetail = SucDetail::create($validatedData);
        return response()->json($sucDetail, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $sucDetail = SucDetail::findOrFail($id);
        return response()->json($sucDetail);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $sucDetail = SucDetail::findOrFail($id);

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
        ]);

        $sucDetail->update($validatedData);
        return response()->json($sucDetail);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sucDetail = SucDetail::findOrFail($id);
        $sucDetail->delete();
        return response()->json(['message' => 'Resource deleted successfully']);
    }
}
