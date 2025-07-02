<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LucFormE5;

class LucFormE5Seeder extends Seeder
{
    public function run(): void
    {
        LucFormE5::truncate();
        LucFormE5::create([
            'luc_detail_id' => 1,
            'faculty_name' => 'Prof. Alan Turing',
            'full_time_part_time_code' => 'FT',
            'gender_code' => 'M',
            'primary_teaching_discipline_code' => 'CS',
            'highest_degree_attained_code' => 'PhD',
            'bachelors_program_name' => 'BS Math',
            'bachelors_program_code' => 'BSMATH',
            'masters_program_name' => 'MS Math',
            'masters_program_code' => 'MSMATH',
            'doctorate_program_name' => 'PhD Math',
            'doctorate_program_code' => 'PHDMATH',
            'professional_license_code' => '12345',
            'tenure_of_employment_code' => 'PERM',
            'faculty_rank_code' => 'Professor',
            'teaching_load_code' => 'TL1',
            'subjects_taught' => 'Algorithms, Discrete Math',
            'annual_salary_code' => 'SAL1',
        ]);
    }
} 