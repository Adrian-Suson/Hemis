<?php

namespace Database\Seeders;

use App\Models\Institution;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InstitutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $institutions = [
            [
                'uuid' => 'INST001',
                'name' => 'University of the Philippines',
                'region_id' => 1,
                'address_street' => 'Diliman',
                'municipality_id' => 1,
                'province_id' => 1,
                'postal_code' => '1101',
                'institutional_telephone' => '02-81234567',
                'institutional_fax' => '02-81234568',
                'head_telephone' => '09123456789',
                'institutional_email' => 'up@up.edu.ph',
                'institutional_website' => 'www.up.edu.ph',
                'year_established' => 1908,
                'sec_registration' => 'SEC001',
                'year_granted_approved' => 1908,
                'year_converted_college' => 1921,
                'year_converted_university' => 1949,
                'head_name' => 'Dr. Angelo Jimenez',
                'head_title' => 'President',
                'head_education' => 'Ph.D.',
                'institution_type' => 'SUC',
                'report_year' => 2024
            ],
            [
                'uuid' => 'INST002',
                'name' => 'Ateneo de Manila University',
                'region_id' => 1,
                'address_street' => 'Katipunan Avenue',
                'municipality_id' => 1,
                'province_id' => 1,
                'postal_code' => '1108',
                'institutional_telephone' => '02-84266001',
                'institutional_fax' => '02-84266002',
                'head_telephone' => '09123456790',
                'institutional_email' => 'info@ateneo.edu',
                'institutional_website' => 'www.ateneo.edu',
                'year_established' => 1859,
                'sec_registration' => 'SEC002',
                'year_granted_approved' => 1859,
                'year_converted_college' => 1865,
                'year_converted_university' => 1959,
                'head_name' => 'Fr. Roberto Yap',
                'head_title' => 'President',
                'head_education' => 'Ph.D.',
                'institution_type' => 'Private',
                'report_year' => 2024
            ]
        ];

        foreach ($institutions as $institution) {
            Institution::create($institution);
        }

        // Generate random institutions
        for ($i = 3; $i <= 10; $i++) {
            $firstName = $this->getRandomFirstName();
            $lastName = $this->getRandomLastName();
            $institutionName = "{$firstName} {$lastName} University";

            Institution::create([
                'uuid' => 'INST' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => $institutionName,
                'region_id' => rand(1, 17),
                'address_street' => $this->getRandomAddress(),
                'municipality_id' => rand(1, 100),
                'province_id' => rand(1, 100),
                'postal_code' => rand(1000, 9999),
                'institutional_telephone' => '02-' . str_pad(rand(0, 9999999), 7, '0', STR_PAD_LEFT),
                'institutional_fax' => '02-' . str_pad(rand(0, 9999999), 7, '0', STR_PAD_LEFT),
                'head_telephone' => '09' . str_pad(rand(0, 99999999), 8, '0', STR_PAD_LEFT),
                'institutional_email' => 'info@' . Str::slug($institutionName) . '.edu.ph',
                'institutional_website' => 'www.' . Str::slug($institutionName) . '.edu.ph',
                'year_established' => rand(1800, 2000),
                'sec_registration' => 'SEC' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'year_granted_approved' => rand(1800, 2000),
                'year_converted_college' => rand(1800, 2000),
                'year_converted_university' => rand(1800, 2000),
                'head_name' => "Dr. {$firstName} {$lastName}",
                'head_title' => $this->getRandomTitle(),
                'head_education' => $this->getRandomEducation(),
                'institution_type' => $this->getRandomInstitutionType(),
                'report_year' => 2024
            ]);
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

    private function getRandomAddress(): string
    {
        $streets = ['Main Street', 'University Avenue', 'Academic Drive', 'Campus Road', 'Education Boulevard'];
        $numbers = range(1, 100);
        return $numbers[array_rand($numbers)] . ' ' . $streets[array_rand($streets)];
    }

    private function getRandomTitle(): string
    {
        $titles = ['Professor', 'Associate Professor', 'Assistant Professor', 'Instructor', 'Lecturer'];
        return $titles[array_rand($titles)];
    }

    private function getRandomEducation(): string
    {
        $educations = ['Ph.D.', 'M.S.', 'M.A.', 'B.S.', 'B.A.'];
        return $educations[array_rand($educations)];
    }

    private function getRandomInstitutionType(): string
    {
        $types = ['SUC', 'LUC', 'Private'];
        return $types[array_rand($types)];
    }
}