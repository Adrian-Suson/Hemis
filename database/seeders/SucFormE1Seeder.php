<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SucFormE1;
use Illuminate\Support\Str;

class SucFormE1Seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $facultyTypes = ["A1", "B", "C1", "C2", "C3", "E"];
        $suc_details_id = 1;
        $totalPerType = 50;

        foreach ($facultyTypes as $type) {
            for ($i = 0; $i < $totalPerType; $i++) {
                SucFormE1::create([
                    'suc_details_id' => $suc_details_id,
                    'faculty_name' => fake()->name(),
                    'generic_faculty_rank' => fake()->randomElement(['Professor', 'Associate Professor', 'Assistant Professor', 'Instructor']),
                    'home_college' => fake()->company(),
                    'home_dept' => fake()->word(),
                    'is_tenured' => fake()->randomElement(['Yes', 'No']),
                    'ssl_salary_grade' => fake()->numberBetween(1, 33),
                    'annual_basic_salary' => fake()->randomFloat(2, 200000, 1200000),
                    'on_leave_without_pay' => fake()->randomElement(['Yes', 'No']),
                    'full_time_equivalent' => fake()->randomFloat(2, 0.5, 1.0),
                    'gender' => fake()->randomElement(['Male', 'Female']),
                    'highest_degree_attained' => fake()->randomElement(['Doctorate', 'Masters', 'Bachelors']),
                    'actively_pursuing_next_degree' => fake()->randomElement(['Yes', 'No']),
                    'primary_teaching_load_discipline_1' => fake()->word(),
                    'primary_teaching_load_discipline_2' => fake()->word(),
                    'bachelors_discipline' => fake()->word(),
                    'masters_discipline' => fake()->word(),
                    'doctorate_discipline' => fake()->word(),
                    'masters_with_thesis' => fake()->randomElement(['Yes', 'No']),
                    'doctorate_with_dissertation' => fake()->randomElement(['Yes', 'No']),
                    'lab_hours_elem_sec' => fake()->randomFloat(2, 0, 10),
                    'lecture_hours_elem_sec' => fake()->randomFloat(2, 0, 20),
                    'total_teaching_hours_elem_sec' => fake()->randomFloat(2, 0, 30),
                    'student_lab_contact_hours_elem_sec' => fake()->randomFloat(2, 0, 10),
                    'student_lecture_contact_hours_elem_sec' => fake()->randomFloat(2, 0, 20),
                    'total_student_contact_hours_elem_sec' => fake()->randomFloat(2, 0, 30),
                    'lab_hours_tech_voc' => fake()->randomFloat(2, 0, 10),
                    'lecture_hours_tech_voc' => fake()->randomFloat(2, 0, 20),
                    'total_teaching_hours_tech_voc' => fake()->randomFloat(2, 0, 30),
                    'student_lab_contact_hours_tech_voc' => fake()->randomFloat(2, 0, 10),
                    'student_lecture_contact_hours_tech_voc' => fake()->randomFloat(2, 0, 20),
                    'total_student_contact_hours_tech_voc' => fake()->randomFloat(2, 0, 30),
                    'official_research_load' => fake()->randomFloat(2, 0, 10),
                    'official_extension_services_load' => fake()->randomFloat(2, 0, 10),
                    'official_study_load' => fake()->randomFloat(2, 0, 10),
                    'official_load_for_production' => fake()->randomFloat(2, 0, 10),
                    'official_administrative_load' => fake()->randomFloat(2, 0, 10),
                    'other_official_load_credits' => fake()->randomFloat(2, 0, 10),
                    'total_work_load' => fake()->randomFloat(2, 0, 40),
                    'faculty_type' => $type,
                    'report_year' => now()->year,
                ]);
            }
        }
    }
}
