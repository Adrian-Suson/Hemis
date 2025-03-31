<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;

class InstitutionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('en_PH'); // Use 'en_PH' for Philippine context
        $institutionTypes = ['SUC', 'LUC', 'PHEI']; // Restrict to SUC, LUC, PHEI
        $headTitles = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '99']; // Head title numbers

        // Generate 100 sample institutions
        for ($i = 0; $i < 100; $i++) {
            DB::table('institutions')->insert([
                'name' => $faker->company . ' ' . $faker->randomElement(['University', 'College', 'Institute']),
                'region' => $faker->randomElement([
                    'Region I',
                    'Region II',
                    'Region III',
                    'Region IV-A',
                    'Region IV-B',
                    'Region V',
                    'Region VI',
                    'Region VII',
                    'Region VIII',
                    'Region IX',
                    'Region X',
                    'Region XI',
                    'Region XII',
                    'Region XIII',
                    'NCR',
                    'CAR',
                    'ARMM'
                ]),
                'address_street' => $faker->streetAddress,
                'municipality_city' => $faker->city,
                'province' => $faker->state,
                'postal_code' => $faker->postcode,
                'institutional_telephone' => $faker->phoneNumber,
                'institutional_fax' => $faker->optional(0.7)->phoneNumber, // 70% chance of being null
                'head_telephone' => $faker->optional(0.5)->phoneNumber, // 50% chance of being null
                'institutional_email' => $faker->unique()->safeEmail,
                'institutional_website' => $faker->optional(0.9, null)->url, // 90% chance of having a URL
                'year_established' => $faker->year(max: 'now'),
                'sec_registration' => 'SEC-' . $faker->unique()->numerify('#####'),
                'year_granted_approved' => $faker->optional(0.8)->year(max: 'now'), // 80% chance of value
                'year_converted_college' => $faker->optional(0.4)->year(max: 'now'), // 40% chance of value
                'year_converted_university' => $faker->optional(0.2)->year(max: 'now'), // 20% chance of value
                'head_name' => $faker->name,
                'head_title' => $faker->randomElement($headTitles), // Use the numeric codes (01-12, 99)
                'head_education' => $faker->randomElement([
                    'PhD in ' . $faker->word,
                    'Master’s in ' . $faker->word,
                    'MBA',
                    'EdD',
                    'Bachelor’s in ' . $faker->word
                ]),
                'institution_type' => $faker->randomElement($institutionTypes), // Only SUC, LUC, PHEI
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
