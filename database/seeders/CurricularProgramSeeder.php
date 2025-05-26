<?php

namespace Database\Seeders;

use App\Models\CurricularProgram;
use App\Models\Institution;
use Illuminate\Database\Seeder;

class CurricularProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            [
                'institution_id' => 1,
                'program_name' => 'Bachelor of Science in Computer Science',
                'program_code' => 1001,
                'major_name' => 'Computer Science',
                'major_code' => 101,
                'aop_category' => 'GR',
                'aop_serial' => '001',
                'aop_year' => '2020',
                'is_thesis_dissertation_required' => '1',
                'program_status' => '1',
                'calendar_use_code' => '1',
                'program_normal_length_in_years' => 4,
                'lab_units' => 6,
                'lecture_units' => 18,
                'total_units' => 24,
                'tuition_per_unit' => 1500,
                'program_fee' => 5000,
                'program_type' => 'BACCALAUREATE',
                'report_year' => 2024
            ],
            [
                'institution_id' => 1,
                'program_name' => 'Master of Science in Computer Science',
                'program_code' => 1002,
                'major_name' => 'Computer Science',
                'major_code' => 101,
                'aop_category' => 'GR',
                'aop_serial' => '002',
                'aop_year' => '2020',
                'is_thesis_dissertation_required' => '1',
                'program_status' => '1',
                'calendar_use_code' => '1',
                'program_normal_length_in_years' => 2,
                'lab_units' => 3,
                'lecture_units' => 9,
                'total_units' => 12,
                'tuition_per_unit' => 2000,
                'program_fee' => 6000,
                'program_type' => 'MASTERS',
                'report_year' => 2024
            ]
        ];

        foreach ($programs as $program) {
            CurricularProgram::create($program);
        }

        // Generate random programs for each institution
        $institutions = Institution::all();
        foreach ($institutions as $institution) {
            for ($i = 1; $i <= 5; $i++) {
                CurricularProgram::create([
                    'institution_id' => $institution->id,
                    'program_name' => $this->getRandomProgram(),
                    'program_code' => 1000 + $i,
                    'major_name' => $this->getRandomMajor(),
                    'major_code' => 100 + $i,
                    'aop_category' => $this->getRandomAopCategory(),
                    'aop_serial' => str_pad($i, 3, '0', STR_PAD_LEFT),
                    'aop_year' => (string)rand(2010, 2024),
                    'is_thesis_dissertation_required' => (string)rand(1, 3),
                    'program_status' => (string)rand(1, 3),
                    'calendar_use_code' => (string)rand(1, 4),
                    'program_normal_length_in_years' => rand(2, 5),
                    'lab_units' => rand(0, 6),
                    'lecture_units' => rand(0, 18),
                    'total_units' => rand(0, 24),
                    'tuition_per_unit' => rand(1000, 3000),
                    'program_fee' => rand(5000, 10000),
                    'program_type' => $this->getRandomProgramType(),
                    'report_year' => 2024
                ]);
            }
        }
    }

    private function getRandomProgram(): string
    {
        $programs = [
            'Bachelor of Science in Computer Science',
            'Bachelor of Science in Information Technology',
            'Bachelor of Science in Information Systems',
            'Bachelor of Science in Computer Engineering',
            'Bachelor of Science in Electronics Engineering'
        ];
        return $programs[array_rand($programs)];
    }

    private function getRandomMajor(): string
    {
        $majors = [
            'Computer Science',
            'Information Technology',
            'Information Systems',
            'Computer Engineering',
            'Electronics Engineering'
        ];
        return $majors[array_rand($majors)];
    }

    private function getRandomAopCategory(): string
    {
        $categories = ['GP', 'GR', 'BR'];
        return $categories[array_rand($categories)];
    }

    private function getRandomProgramType(): string
    {
        $types = [
            'DOCTORATE',
            'MASTERS',
            'POST-BACCALAUREATE',
            'BACCALAUREATE',
            'PRE-BACCALAUREATE',
            'VOC-TECH',
            'BASIC EDUCATION'
        ];
        return $types[array_rand($types)];
    }
}