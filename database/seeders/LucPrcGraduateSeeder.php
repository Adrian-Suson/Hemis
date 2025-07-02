<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LucPrcGraduate;

class LucPrcGraduateSeeder extends Seeder
{
    public function run(): void
    {
        LucPrcGraduate::truncate();
        LucPrcGraduate::create([
            'luc_detail_id' => 1,
            'student_id' => 'STU001',
            'date_of_birth' => '1995-01-01',
            'last_name' => 'Garcia',
            'first_name' => 'Maria',
            'middle_name' => 'L.',
            'sex' => 'F',
            'date_graduated' => '2017-04-01',
            'program_name' => 'BS Nursing',
            'program_major' => 'General',
            'authority_number' => 'AUTH123',
            'year_granted' => 2017,
        ]);
        LucPrcGraduate::create([
            'luc_detail_id' => 2,
            'student_id' => 'STU002',
            'date_of_birth' => '1994-05-10',
            'last_name' => 'Santos',
            'first_name' => 'Juan',
            'middle_name' => 'D.',
            'sex' => 'M',
            'date_graduated' => '2016-04-01',
            'program_name' => 'BS Accountancy',
            'program_major' => 'General',
            'authority_number' => 'AUTH456',
            'year_granted' => 2016,
        ]);
    }
} 