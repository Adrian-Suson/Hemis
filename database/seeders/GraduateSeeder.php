<?php

namespace Database\Seeders;

use App\Models\Graduate;
use App\Models\Institution;
use Illuminate\Database\Seeder;

class GraduateSeeder extends Seeder
{
    private $studentIdCounter = 1;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $graduates = [
            [
                'institution_id' => 1,
                'student_id' => $this->generateUniqueStudentId(),
                'date_of_birth' => '2000-01-01',
                'last_name' => 'Doe',
                'first_name' => 'John',
                'middle_name' => 'Smith',
                'sex' => 'M',
                'date_graduated' => '2024-03-15',
                'program_name' => 'Bachelor of Science in Computer Science',
                'program_major' => 'Computer Science',
                'program_authority_to_operate_graduate' => 'GR',
                'year_granted' => 2020,
                'report_year' => 2024
            ],
            [
                'institution_id' => 1,
                'student_id' => $this->generateUniqueStudentId(),
                'date_of_birth' => '2000-02-02',
                'last_name' => 'Smith',
                'first_name' => 'Jane',
                'middle_name' => 'Doe',
                'sex' => 'F',
                'date_graduated' => '2024-03-15',
                'program_name' => 'Bachelor of Science in Computer Science',
                'program_major' => 'Computer Science',
                'program_authority_to_operate_graduate' => 'GR',
                'year_granted' => 2020,
                'report_year' => 2024
            ]
        ];

        foreach ($graduates as $graduate) {
            Graduate::create($graduate);
        }

        // Generate random graduates for each institution
        $institutions = Institution::all();
        foreach ($institutions as $institution) {
            for ($i = 1; $i <= 10; $i++) {
                $firstName = $this->getRandomFirstName();
                $lastName = $this->getRandomLastName();
                $middleName = $this->getRandomFirstName();

                Graduate::create([
                    'institution_id' => $institution->id,
                    'student_id' => $this->generateUniqueStudentId(),
                    'date_of_birth' => $this->getRandomDateOfBirth(),
                    'last_name' => $lastName,
                    'first_name' => $firstName,
                    'middle_name' => $middleName,
                    'sex' => $this->getRandomGender(),
                    'date_graduated' => $this->getRandomGraduationDate(),
                    'program_name' => $this->getRandomProgram(),
                    'program_major' => $this->getRandomMajor(),
                    'program_authority_to_operate_graduate' => $this->getRandomAopCategory(),
                    'year_granted' => rand(2010, 2024),
                    'report_year' => 2024
                ]);
            }
        }
    }

    private function generateUniqueStudentId(): string
    {
        $year = date('Y');
        $id = str_pad($this->studentIdCounter++, 5, '0', STR_PAD_LEFT);
        return "{$year}-{$id}";
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

    private function getRandomDateOfBirth(): string
    {
        $year = rand(1980, 2000);
        $month = str_pad(rand(1, 12), 2, '0', STR_PAD_LEFT);
        $day = str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT);
        return "{$year}-{$month}-{$day}";
    }

    private function getRandomGraduationDate(): string
    {
        $year = rand(2020, 2024);
        $month = str_pad(rand(1, 12), 2, '0', STR_PAD_LEFT);
        $day = str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT);
        return "{$year}-{$month}-{$day}";
    }

    private function getRandomGender(): string
    {
        return rand(0, 1) ? 'M' : 'F';
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
}