<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LucFormBC;

class LucFormBCSeeder extends Seeder
{
    public function run(): void
    {
        LucFormBC::truncate();
        LucFormBC::create([
            'luc_detail_id' => 1,
            'program_name' => 'BS Computer Science',
            'program_code' => 'BSCS',
            'major_name' => 'Software Engineering',
            'major_code' => 'SE',
            'with_thesis_dissertation' => 1,
            'code' => 101,
            'year_implemented' => 2010,
            'aop_category' => 'A',
            'aop_serial' => '001',
            'aop_year' => 2010,
            'remarks' => 'Active',
            'program_mode_code' => 'REG',
            'program_mode_program' => 'Regular',
            'normal_length_years' => 4,
            'program_credit_units' => 150,
            'tuition_per_unit_peso' => 500.00,
            'program_fee_peso' => 10000.00,
            'enrollment_new_students_m' => 50,
            'enrollment_new_students_f' => 60,
            'enrollment_1st_year_m' => 40,
            'enrollment_1st_year_f' => 50,
            'enrollment_2nd_year_m' => 30,
            'enrollment_2nd_year_f' => 40,
            'enrollment_3rd_year_m' => 20,
            'enrollment_3rd_year_f' => 30,
            'enrollment_4th_year_m' => 10,
            'enrollment_4th_year_f' => 20,
            'enrollment_5th_year_m' => 0,
            'enrollment_5th_year_f' => 0,
            'enrollment_6th_year_m' => 0,
            'enrollment_6th_year_f' => 0,
            'enrollment_7th_year_m' => 0,
            'enrollment_7th_year_f' => 0,
            'enrollment_sub_total_m' => 150,
            'enrollment_sub_total_f' => 200,
            'enrollment_total' => 350,
            'graduates_m' => 30,
            'graduates_f' => 40,
            'graduates_total' => 70,
        ]);
    }
} 