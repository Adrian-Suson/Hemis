<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReportYearsSeeder extends Seeder
{
    public function run()
    {
        $currentYear = now()->year;
        for ($year = 2000; $year <= $currentYear; $year++) {
            DB::table('report_years')->insert(['year' => $year, 'created_at' => now(), 'updated_at' => now()]);
        }
    }
}