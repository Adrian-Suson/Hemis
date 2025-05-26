<?php

namespace Database\Seeders;

use App\Models\FacultyProfile;
use App\Models\Institution;
use Illuminate\Database\Seeder;

class FacultyProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $facultyProfiles = [
            [
                'institution_id' => 1,
                'faculty_group' => 'GROUP A1',
                'name' => 'Dr. Juan Dela Cruz',
                'generic_faculty_rank' => 1,
                'home_college' => 'College of Engineering',
                'home_department' => 'Computer Science',
                'is_tenured' => 'Yes',
                'ssl_salary_grade' => 20,
                'annual_basic_salary' => 1000000,
                'on_leave_without_pay' => 0,
                'full_time_equivalent' => 1.0,
                'gender' => 1,
                'highest_degree_attained' => 3,
                'pursuing_next_degree' => 0,
                'discipline_teaching_load_1' => 'Computer Science',
                'discipline_teaching_load_2' => 'Information Technology',
                'discipline_bachelors' => 'Computer Science',
                'discipline_masters' => 'Computer Science',
                'discipline_doctorate' => 'Computer Science',
                'masters_with_thesis' => 1,
                'doctorate_with_dissertation' => 1,
                'report_year' => 2024
            ],
            [
                'institution_id' => 1,
                'faculty_group' => 'GROUP A1',
                'name' => 'Dr. Maria Santos',
                'generic_faculty_rank' => 2,
                'home_college' => 'College of Engineering',
                'home_department' => 'Computer Science',
                'is_tenured' => 'Yes',
                'ssl_salary_grade' => 19,
                'annual_basic_salary' => 900000,
                'on_leave_without_pay' => 0,
                'full_time_equivalent' => 1.0,
                'gender' => 2,
                'highest_degree_attained' => 3,
                'pursuing_next_degree' => 0,
                'discipline_teaching_load_1' => 'Computer Science',
                'discipline_teaching_load_2' => 'Software Engineering',
                'discipline_bachelors' => 'Computer Science',
                'discipline_masters' => 'Computer Science',
                'discipline_doctorate' => 'Computer Science',
                'masters_with_thesis' => 1,
                'doctorate_with_dissertation' => 1,
                'report_year' => 2024
            ]
        ];

        foreach ($facultyProfiles as $profile) {
            FacultyProfile::create($profile);
        }

        // Generate random faculty profiles for each institution
        $institutions = Institution::all();
        foreach ($institutions as $institution) {
            for ($i = 1; $i <= 5; $i++) {
                $firstName = $this->getRandomFirstName();
                $lastName = $this->getRandomLastName();

                FacultyProfile::create([
                    'institution_id' => $institution->id,
                    'faculty_group' => $this->getRandomFacultyGroup(),
                    'name' => "Dr. {$firstName} {$lastName}",
                    'generic_faculty_rank' => rand(1, 5),
                    'home_college' => $this->getRandomCollege(),
                    'home_department' => $this->getRandomDepartment(),
                    'is_tenured' => rand(0, 1) ? 'Yes' : 'No',
                    'ssl_salary_grade' => rand(15, 25),
                    'annual_basic_salary' => rand(500000, 1500000),
                    'on_leave_without_pay' => rand(0, 1),
                    'full_time_equivalent' => rand(0, 1),
                    'gender' => rand(1, 2),
                    'highest_degree_attained' => rand(1, 3),
                    'pursuing_next_degree' => rand(0, 1),
                    'discipline_teaching_load_1' => $this->getRandomDepartment(),
                    'discipline_teaching_load_2' => $this->getRandomDepartment(),
                    'discipline_bachelors' => $this->getRandomDepartment(),
                    'discipline_masters' => $this->getRandomDepartment(),
                    'discipline_doctorate' => $this->getRandomDepartment(),
                    'masters_with_thesis' => rand(0, 1),
                    'doctorate_with_dissertation' => rand(0, 1),
                    'report_year' => 2024
                ]);
            }
        }
    }

    private function getRandomFirstName(): string
    {
        $firstNames = ['John', 'Jane', 'Michael', 'Maria', 'David', 'Sarah', 'James', 'Elizabeth', 'Robert', 'Mary'];
        return $firstNames[array_rand($firstNames)];
    }

    private function getRandomLastName(): string
    {
        $lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
        return $lastNames[array_rand($lastNames)];
    }

    private function getRandomFacultyGroup(): string
    {
        $groups = [
            'GROUP A1',
            'GROUP A2',
            'GROUP A3',
            'GROUP B',
            'GROUP C1',
            'GROUP C2',
            'GROUP C3',
            'GROUP D',
            'GROUP E'
        ];
        return $groups[array_rand($groups)];
    }

    private function getRandomCollege(): string
    {
        $colleges = [
            'College of Engineering',
            'College of Computer Studies',
            'College of Information Technology',
            'College of Science',
            'College of Arts and Sciences'
        ];
        return $colleges[array_rand($colleges)];
    }

    private function getRandomDepartment(): string
    {
        $departments = [
            'Computer Science',
            'Information Technology',
            'Information Systems',
            'Computer Engineering',
            'Electronics Engineering'
        ];
        return $departments[array_rand($departments)];
    }
}