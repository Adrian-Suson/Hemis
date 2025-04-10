<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class GraduatesListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        $graduates = [];

        // Get all institution IDs from the institutions table
        $institutionIds = DB::table('institutions')->pluck('id')->toArray();

        if (empty($institutionIds)) {
            // If no institutions exist, seed some default ones or throw an error
            throw new \Exception('No institutions found. Please seed the institutions table first.');
        }

        // Generate 10 graduates for each institution
        foreach ($institutionIds as $institutionId) {
            for ($i = 1; $i <= 10; $i++) {
                $studentNumber = str_pad(count($graduates) + 1, 3, '0', STR_PAD_LEFT); // Ensures unique student_id
                $graduates[] = [
                    'institution_id' => $institutionId,
                    'student_id' => "STU{$institutionId}{$studentNumber}", // e.g., STU1001, STU2001
                    'date_of_birth' => $faker->date('Y-m-d', '2005-01-01'), // Random DOB before 2005
                    'last_name' => $faker->lastName,
                    'first_name' => $faker->firstName,
                    'middle_name' => $faker->optional(0.7)->firstName, // 70% chance of having a middle name
                    'sex' => $faker->randomElement(['M', 'F']),
                    'date_graduated' => $faker->optional(0.8, null)->date('Y-m-d', 'now'), // 80% graduated
                    'program_name' => $faker->randomElement([
                        'Bachelor of Science in Computer Science',
                        'Bachelor of Arts in Psychology',
                        'Bachelor of Engineering',
                        'Bachelor of Business Administration',
                        'Bachelor of Education',
                    ]),
                    'program_major' => $faker->optional(0.6)->word, // 60% chance of a major
                    'program_authority_to_operate_graduate' => $faker->optional(0.9, 'CHED')->company, // 90% CHED
                    'year_granted' => $faker->optional(0.8, null)->year('now'), // 80% have a year
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Insert all graduates into the graduates_list table
        DB::table('graduates_list')->insert($graduates);
    }
}
