<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Allotment;
use App\Models\SucDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AllotmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Allotment::with(['sucDetail', 'reportYear']);

        // Filter by SUC details ID if provided
        if ($request->has('suc_details_id')) {
            $query->where('suc_details_id', $request->suc_details_id);
        }

        // Filter by report year if provided
        if ($request->has('report_year')) {
            $query->where('report_year', $request->report_year);
        }

        // Filter by campus if provided
        if ($request->has('campus')) {
            $query->where('campus', $request->campus);
        }

        $allotments = $query->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $allotments
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'suc_details_id' => 'required|exists:suc_details,id',
            'campus' => 'nullable|string|max:100',
            'function_name' => 'required|string|max:100',
            'fund_101_ps' => 'required|numeric|min:0',
            'fund_101_mooe' => 'required|numeric|min:0',
            'fund_101_co' => 'required|numeric|min:0',
            'fund_101_total' => 'required|numeric|min:0',
            'fund_164_ps' => 'required|numeric|min:0',
            'fund_164_mooe' => 'required|numeric|min:0',
            'fund_164_co' => 'required|numeric|min:0',
            'fund_164_total' => 'required|numeric|min:0',
            'total_ps' => 'required|numeric|min:0',
            'total_mooe' => 'required|numeric|min:0',
            'total_co' => 'required|numeric|min:0',
            'total_allot' => 'required|numeric|min:0',
            'report_year' => 'required|integer|exists:report_years,year'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $allotment = Allotment::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Allotment created successfully',
            'data' => $allotment
        ], 201);
    }

    public function show(Allotment $allotment)
    {
        $allotment->load(['sucDetail', 'reportYear']);

        return response()->json([
            'status' => 'success',
            'data' => $allotment
        ]);
    }

    public function update(Request $request, Allotment $allotment)
    {
        $validator = Validator::make($request->all(), [
            'campus' => 'nullable|string|max:100',
            'function_name' => 'string|max:100',
            'fund_101_ps' => 'numeric|min:0',
            'fund_101_mooe' => 'numeric|min:0',
            'fund_101_co' => 'numeric|min:0',
            'fund_101_total' => 'numeric|min:0',
            'fund_164_ps' => 'numeric|min:0',
            'fund_164_mooe' => 'numeric|min:0',
            'fund_164_co' => 'numeric|min:0',
            'fund_164_total' => 'numeric|min:0',
            'total_ps' => 'numeric|min:0',
            'total_mooe' => 'numeric|min:0',
            'total_co' => 'numeric|min:0',
            'total_allot' => 'numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $allotment->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Allotment updated successfully',
            'data' => $allotment
        ]);
    }

    public function destroy(Allotment $allotment)
    {
        $allotment->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Allotment deleted successfully'
        ]);
    }

    public function bulkCreate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'records' => 'required|array',
            'records.*.suc_details_id' => 'required|exists:suc_details,id',
            'records.*.campus' => 'nullable|string|max:100',
            'records.*.function_name' => 'required|string|max:100',
            'records.*.fund_101_ps' => 'required|numeric|min:0',
            'records.*.fund_101_mooe' => 'required|numeric|min:0',
            'records.*.fund_101_co' => 'required|numeric|min:0',
            'records.*.fund_101_total' => 'required|numeric|min:0',
            'records.*.fund_164_ps' => 'required|numeric|min:0',
            'records.*.fund_164_mooe' => 'required|numeric|min:0',
            'records.*.fund_164_co' => 'required|numeric|min:0',
            'records.*.fund_164_total' => 'required|numeric|min:0',
            'records.*.total_ps' => 'required|numeric|min:0',
            'records.*.total_mooe' => 'required|numeric|min:0',
            'records.*.total_co' => 'required|numeric|min:0',
            'records.*.total_allot' => 'required|numeric|min:0',
            'records.*.report_year' => 'required|integer|exists:report_years,year'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $allotments = collect($request->records)->map(function ($record) {
            return Allotment::create($record);
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Allotments created successfully',
            'data' => $allotments
        ], 201);
    }
} 