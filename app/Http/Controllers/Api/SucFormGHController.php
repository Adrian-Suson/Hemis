<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Income;
use App\Models\Expenditure;
use App\Models\Allotment;
use Illuminate\Http\Request;

class SucFormGHController extends Controller
{
    public function show($sucDetailId)
    {
        $income = Income::where('suc_details_id', $sucDetailId)->get();
        $expenditure = Expenditure::where('suc_details_id', $sucDetailId)->get();
        $allotment = Allotment::where('suc_details_id', $sucDetailId)->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'income' => $income,
                'expenditure' => $expenditure,
                'allotment' => $allotment,
            ]
        ]);
    }
} 