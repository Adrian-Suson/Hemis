<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;

class Region9InstitutionSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('en_PH');

        $facultyGroups = [
            'GROUP A1',
            'GROUP A2',
            'GROUP A3',
            'GROUP B',
            'GROUP C1',
            'GROUP C2',
            'GROUP C3',
            'GROUP D',
            'GROUP E',
        ];

        $institutionPrefixes = [
            'Zamboanga',
            'Peninsula',
            'Sibugay',
            'Basilan',
            'Dipolog',
            'Pagadian',
            'Dapitan',
            'Isabela',
            'Sindangan',
            'Ipil'
        ];
        $institutionTypes = ['SUC', 'LUC', 'Private'];

        $region9Locations = [
            ['city' => 'Zamboanga City', 'province' => 'Zamboanga del Sur', 'lat' => 6.9214, 'lon' => 122.0790],
            ['city' => 'Dipolog City', 'province' => 'Zamboanga del Norte', 'lat' => 8.5863, 'lon' => 123.3409],
            ['city' => 'Pagadian City', 'province' => 'Zamboanga del Sur', 'lat' => 7.8257, 'lon' => 123.4393],
            ['city' => 'Isabela City', 'province' => 'Basilan', 'lat' => 6.7041, 'lon' => 121.9710],
            ['city' => 'Dapitan City', 'province' => 'Zamboanga del Norte', 'lat' => 8.6549, 'lon' => 123.4226],
            ['city' => 'Sindangan', 'province' => 'Zamboanga del Norte', 'lat' => 8.2333, 'lon' => 122.9999],
            ['city' => 'Ipil', 'province' => 'Zamboanga Sibugay', 'lat' => 7.7829, 'lon' => 122.5860],
            ['city' => 'Molave', 'province' => 'Zamboanga del Sur', 'lat' => 8.0916, 'lon' => 123.4910],
            ['city' => 'Kabasalan', 'province' => 'Zamboanga Sibugay', 'lat' => 7.7987, 'lon' => 122.7662],
        ];

        for ($i = 0; $i < 10; $i++) {
            $prefix = $faker->unique()->randomElement($institutionPrefixes);
            $type = $faker->randomElement($institutionTypes);
            $institutionName = "$prefix " . ($type === 'SUC' ? 'State University' : ($type === 'LUC' ? 'Local College' : 'College')) .
                ($i > 0 && $faker->boolean(50) ? " $i" : '');

            $institutionId = DB::table('institutions')->insertGetId([
                'name' => $institutionName,
                'region' => 'Region 9',
                'address_street' => $faker->streetAddress,
                'municipality_city' => $faker->randomElement(array_column($region9Locations, 'city')),
                'province' => $faker->randomElement(array_column($region9Locations, 'province')),
                'postal_code' => $faker->postcode,
                'institutional_telephone' => $faker->phoneNumber,
                'institutional_fax' => $faker->phoneNumber,
                'head_telephone' => $faker->phoneNumber,
                'institutional_email' => $faker->safeEmail,
                'institutional_website' => $faker->domainName,
                'year_established' => $faker->year($max = '2000'),
                'sec_registration' => 'SEC-' . $faker->unique()->numerify('####-###'),
                'year_granted_approved' => $faker->year($max = '2010'),
                'year_converted_college' => $type !== 'SUC' ? $faker->year($max = '2015') : null,
                'year_converted_university' => $type === 'SUC' ? $faker->year($max = '2020') : null,
                'head_name' => $faker->name,
                'head_title' => $faker->randomElement(['University President', 'Chancellor', 'Rector', 'College Dean']),
                'head_education' => $faker->randomElement(['PhD in Education', 'EdD', 'PhD in Management', 'MA']),
                'institution_type' => $type,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($region9Locations as $index => $location) {
                $campusName = "$institutionName - " . $location['city'] . ($index === 0 ? ' Main Campus' : ' Campus');
                DB::table('campuses')->insert([
                    'institution_id' => $institutionId,
                    'suc_name' => $campusName,
                    'campus_type' => $index === 0 ? 'Main' : $faker->randomElement(['Satellite', 'Extension']),
                    'institutional_code' => strtoupper(substr($prefix, 0, 3)) . '-' .
                        strtoupper(substr($location['city'], 0, 3)) . $faker->numerify('###'),
                    'region' => 'Region 9',
                    'municipality_city_province' => "{$location['city']}, {$location['province']}",
                    'year_first_operation' => $faker->year($max = '2020'),
                    'land_area_hectares' => $faker->randomFloat(2, 2, 15),
                    'distance_from_main' => $index === 0 ? 0.0 : $faker->randomFloat(2, 10, 250),
                    'autonomous_code' => 'AUT-' . $faker->unique()->numerify('###'),
                    'position_title' => $faker->randomElement(['Campus Director', 'Campus Administrator', 'Campus Head']),
                    'head_full_name' => $faker->name,
                    'former_name' => $faker->boolean(20) ? $faker->company : null,
                    'latitude_coordinates' => $location['lat'] + $faker->randomFloat(8, -0.01, 0.01),
                    'longitude_coordinates' => $location['lon'] + $faker->randomFloat(8, -0.01, 0.01),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $programCount = $faker->numberBetween(5, 15);
            $programCategories = ['GP', 'GR', 'BR'];
            $programNames = [
                'GP' => ['BS Information Technology', 'BS Computer Science', 'MS Information Systems'],
                'GR' => ['B Elementary Education', 'B Secondary Education', 'MA Education'],
                'BR' => ['BS Agriculture', 'BS Forestry', 'MS Agribusiness'],
                'Health Sciences' => ['BS Nursing', 'BS Pharmacy', 'Master of Public Health'],
                'Engineering' => ['BS Civil Engineering', 'BS Electrical Engineering', 'MS Engineering'],
            ];

            $programTypes = [
                'DOCTORAL',
                'MASTERS',
                'POST-BACCALAUREATE',
                'BACCALAUREATE',
                'PRE-BACCALAUREATE',
                'VOC/TECH',
                'BASIC EDUCATION'
            ];

            for ($j = 0; $j < $programCount; $j++) {
                $category = $faker->randomElement($programCategories);
                $programName = $faker->randomElement($programNames[$category]);
                $programType = $faker->randomElement($programTypes);

                $isGraduate = strpos($programName, 'MS') !== false || strpos($programName, 'MA') !== false;
                $maleFreshmen = $faker->numberBetween(5, 30);
                $femaleFreshmen = $faker->numberBetween(5, 30);
                $maleFirstYear = $faker->numberBetween(5, 30);
                $femaleFirstYear = $faker->numberBetween(5, 30);
                $maleSecondYear = $faker->numberBetween(5, 30);
                $femaleSecondYear = $faker->numberBetween(5, 30);
                $maleThirdYear = $faker->numberBetween(5, 30);
                $femaleThirdYear = $faker->numberBetween(5, 30);
                $maleFourthYear = $faker->numberBetween(5, 30);
                $femaleFourthYear = $faker->numberBetween(5, 30);
                $maleFifthYear = $faker->numberBetween(5, 30);
                $femaleFifthYear = $faker->numberBetween(5, 30);
                $maleSixthYear = $faker->numberBetween(5, 30);
                $femaleSixthYear = $faker->numberBetween(5, 30);
                $maleSeventhYear = $faker->numberBetween(5, 30);
                $femaleSeventhYear = $faker->numberBetween(5, 30);

                $labUnits = $faker->numberBetween(0, 15);
                $lectureUnits = $faker->numberBetween(30, 60);

                DB::table('curricular_programs')->insert([
                    'institution_id' => $institutionId,
                    'data_date' => Carbon::now(),
                    'program_name' => $programName,
                    'program_code' => $faker->unique()->numberBetween(100000, 999999),
                    'major_name' => $faker->boolean(50) ? $faker->word : null,
                    'major_code' => $faker->boolean(50) ? $faker->numberBetween(200000, 299999) : null,
                    'category' => $category,
                    'serial' => strtoupper(substr($programName, 0, 3)) . '-' . $faker->numerify('###'),
                    'year' => '2025',
                    'is_thesis_dissertation_required' => $faker->numberBetween(1, 3),
                    'program_status' => $faker->numberBetween(1, 3),
                    'calendar_use_code' => $faker->numberBetween(1, 4),
                    'program_normal_length_in_years' => $isGraduate ? 2 : 4,
                    'lab_units' => $labUnits,
                    'lecture_units' => $lectureUnits,
                    'total_units' => $labUnits + $lectureUnits,
                    'tuition_per_unit' => $faker->randomFloat(2, 400, 1000),
                    'program_fee' => $faker->randomFloat(2, 1000, 4000),
                    'program_type' => $programType,
                    'new_students_freshmen_male' => $maleFreshmen,
                    'new_students_freshmen_female' => $femaleFreshmen,
                    '1st_year_male' => $maleFirstYear,
                    '1st_year_female' => $femaleFirstYear,
                    '2nd_year_male' => $maleSecondYear,
                    '2nd_year_female' => $femaleSecondYear,
                    '3rd_year_male' => $maleThirdYear,
                    '3rd_year_female' => $femaleThirdYear,
                    '4th_year_male' => $maleFourthYear,
                    '4th_year_female' => $femaleFourthYear,
                    '5th_year_male' => $maleFifthYear,
                    '5th_year_female' => $femaleFifthYear,
                    '6th_year_male' => $maleSixthYear,
                    '6th_year_female' => $femaleSixthYear,
                    '7th_year_male' => $maleSeventhYear,
                    '7th_year_female' => $femaleSeventhYear,
                    'laboratory_units_actual' => $labUnits,
                    'total_units_actual' => $labUnits + $lectureUnits,
                    'graduates_males' => $faker->numberBetween(5, 50),
                    'graduates_females' => $faker->numberBetween(5, 50),
                    'graduates_total' => $faker->numberBetween(10, 100),
                    'externally_funded_merit_scholars' => $faker->numberBetween(0, 20),
                    'internally_funded_grantees' => $faker->numberBetween(0, 20),
                    'suc_funded_grantees' => $faker->numberBetween(0, 20),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $facultyCount = $faker->numberBetween(20, 70);
            $departments = ['Teacher Education', 'Computer Engineering', 'Nursing', 'Agriculture', 'Civil Engineering'];

            for ($k = 0; $k < $facultyCount; $k++) {
                $gender = $faker->numberBetween(0, 1);
                $highestDegree = $faker->numberBetween(1, 3);
                $department = $faker->randomElement($departments);
                $isFullTime = $faker->boolean(70);
                $hasPlantilla = $faker->boolean(50);

                $labCredits = $faker->randomFloat(1, 0, $isFullTime ? 12 : 6);
                $lectureCredits = $faker->randomFloat(1, 0, $isFullTime ? 15 : 9);

                DB::table('faculty_profiles')->insert([
                    'institution_id' => $institutionId,
                    'data_date' => Carbon::now(),
                    'faculty_group' => $faker->randomElement($facultyGroups), // Fixed: Single string value
                    'name' => $faker->name($gender === 0 ? 'female' : 'male'),
                    'generic_faculty_rank' => $faker->numberBetween(1, 5),
                    'home_college' => "College of " . str_replace(' Education', '', $department),
                    'home_department' => $department,
                    'is_tenured' => $hasPlantilla && $faker->boolean($type === 'SUC' ? 80 : 60),
                    'ssl_salary_grade' => $faker->numberBetween($type === 'Private' ? 10 : 12, $type === 'Private' ? 18 : 20),
                    'annual_basic_salary' => $faker->numberBetween(
                        $type === 'Private' ? 250000 : 300000,
                        $type === 'Private' ? 700000 : 800000
                    ) * ($isFullTime ? 1 : 0.5),
                    'on_leave_without_pay' => $faker->numberBetween(1, 4),
                    'full_time_equivalent' => $isFullTime ? $faker->randomFloat(2, 0.75, 1.0) : $faker->randomFloat(2, 0.25, 0.75),
                    'gender' => $gender,
                    'highest_degree_attained' => $highestDegree,
                    'pursuing_next_degree' => $faker->boolean(30) ? 1 : 0,
                    'discipline_teaching_load_1' => str_replace(' Education', '', $department),
                    'discipline_bachelors' => str_replace(' Education', '', $department),
                    'discipline_masters' => $highestDegree >= 2 ? $faker->word : null,
                    'discipline_doctorate' => $highestDegree === 3 ? $faker->word : null,
                    'masters_with_thesis' => $highestDegree >= 2 ? $faker->numberBetween(0, 1) : null,
                    'doctorate_with_dissertation' => $highestDegree === 3 ? $faker->numberBetween(0, 1) : null,
                    'undergrad_lab_credit_units' => $labCredits,
                    'undergrad_lecture_credit_units' => $lectureCredits,
                    'undergrad_total_credit_units' => $labCredits + $lectureCredits,
                    'undergrad_lab_hours_per_week' => $labCredits * 3,
                    'undergrad_lecture_hours_per_week' => $lectureCredits,
                    'undergrad_total_hours_per_week' => ($labCredits * 3) + $lectureCredits,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}