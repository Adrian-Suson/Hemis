<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Income;
use App\Models\SucDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IncomeController extends Controller
{
    public function index(Request $request)
    {
        $query = Income::with(['sucDetail', 'reportYear']);

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

        // Filter by income category if provided
        if ($request->has('income_category')) {
            $query->where('income_category', $request->income_category);
        }

        $incomes = $query->paginate(10);

        return response()->json([
            'status' => 'success',
            'data' => $incomes
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'suc_details_id' => 'required|exists:suc_details,id',
            'campus' => 'nullable|string|max:100',
            'income_category' => 'required|string|max:100',
            'tuition_fees' => 'required|numeric|min:0',
            'miscellaneous_fees' => 'required|numeric|min:0',
            'other_income' => 'required|numeric|min:0',
            'total_income' => 'required|numeric|min:0',
            'report_year' => 'required|integer|exists:report_years,year'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $income = Income::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Income created successfully',
            'data' => $income
        ], 201);
    }

    public function show(Income $income)
    {
        $income->load(['sucDetail', 'reportYear']);

        return response()->json([
            'status' => 'success',
            'data' => $income
        ]);
    }

    public function update(Request $request, Income $income)
    {
        $validator = Validator::make($request->all(), [
            'campus' => 'nullable|string|max:100',
            'income_category' => 'string|max:100',
            'tuition_fees' => 'numeric|min:0',
            'miscellaneous_fees' => 'numeric|min:0',
            'other_income' => 'numeric|min:0',
            'total_income' => 'numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $income->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Income updated successfully',
            'data' => $income
        ]);
    }

    public function destroy(Income $income)
    {
        $income->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Income deleted successfully'
        ]);
    }

    public function bulkCreate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'records' => 'required|array',
            'records.*.suc_details_id' => 'required|exists:suc_details,id',
            'records.*.campus' => 'nullable|string|max:100',
            'records.*.income_category' => 'required|string|max:100',
            'records.*.tuition_fees' => 'required|numeric|min:0',
            'records.*.miscellaneous_fees' => 'required|numeric|min:0',
            'records.*.other_income' => 'required|numeric|min:0',
            'records.*.total_income' => 'required|numeric|min:0',
            'records.*.report_year' => 'required|integer|exists:report_years,year'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $incomes = collect($request->records)->map(function ($record) {
            return Income::create($record);
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Incomes created successfully',
            'data' => $incomes
        ], 201);
    }
} 