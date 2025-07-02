<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hei;
use Illuminate\Http\Request;

class PublicDashboardController extends Controller
{
    public function index(Request $request)
{
    $fieldsToSum = [
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
        'subtotal_male',
        'subtotal_female',
        'grand_total',
        'lecture_units_actual',
        'laboratory_units_actual',
        'total_units_actual',
        'graduates_males',
        'graduates_females',
        'graduates_total',
    ];

    $heis = Hei::with(['cluster', 'lucDetails', 'privateDetails', 'sucDetails.formBs'])->get();

    $heis = $heis->map(function ($hei) use ($fieldsToSum) {
        $totals = [];
        foreach ($fieldsToSum as $field) {
            $totals[$field] = 0;
        }

        foreach ($hei->sucDetails as $sucDetail) {
            foreach ($sucDetail->formBs as $formB) {
                foreach ($fieldsToSum as $field) {
                    $totals[$field] += (int) ($formB[$field] ?? 0);
                }
            }
        }

        // You can add more HEI fields as needed
        return [
            'id' => $hei->id,
            'uiid' => $hei->uiid,
            'name' => $hei->name,
            'type' => $hei->type,
            'region' => $hei->region,
            'students' => $totals['grand_total'], // for compatibility with your frontend
            'totals' => $totals, // all summed fields
        ];
    });

    return response()->json([
        'heis' => $heis
    ]);
}
}
