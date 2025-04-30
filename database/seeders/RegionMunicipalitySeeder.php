<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RegionMunicipalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Disable foreign key checks before truncating
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // Clear existing data to avoid unique constraint violations
        DB::table('municipalities')->truncate();
        DB::table('regions')->truncate();

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Define all 17 Philippine regions
        $regions = [
            ['name' => 'National Capital Region (NCR)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Cordillera Administrative Region (CAR)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Region I (Ilocos Region)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Region II (Cagayan Valley)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Region III (Central Luzon)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Region IV-A (CALABARZON)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'MIMAROPA Region', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Region V (Bicol Region)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Region VI (Western Visayas)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Region VII (Central Visayas)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Region VIII (Eastern Visayas)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Region IX (Zamboanga Peninsula)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Region X (Northern Mindanao)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Region XI (Davao Region)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Region XII (SOCCSKSARGEN)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Region XIII (Caraga)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ];

        // Insert regions and get their IDs
        $regionIds = [];
        foreach ($regions as $region) {
            $regionId = DB::table('regions')->insertGetId($region);
            $regionIds[$region['name']] = $regionId;
        }

        // Define municipalities for each region (3–5 per region)
        $municipalities = [
            // National Capital Region (NCR)
            [
                'name' => 'Quezon City',
                'region_id' => $regionIds['National Capital Region (NCR)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Manila',
                'region_id' => $regionIds['National Capital Region (NCR)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Makati City',
                'region_id' => $regionIds['National Capital Region (NCR)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Pasig City',
                'region_id' => $regionIds['National Capital Region (NCR)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Cordillera Administrative Region (CAR)
            [
                'name' => 'Baguio City',
                'region_id' => $regionIds['Cordillera Administrative Region (CAR)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'La Trinidad',
                'region_id' => $regionIds['Cordillera Administrative Region (CAR)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Tabuk City',
                'region_id' => $regionIds['Cordillera Administrative Region (CAR)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Region I (Ilocos Region)
            [
                'name' => 'San Fernando City',
                'region_id' => $regionIds['Region I (Ilocos Region)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Vigan City',
                'region_id' => $regionIds['Region I (Ilocos Region)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Laoag City',
                'region_id' => $regionIds['Region I (Ilocos Region)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Region II (Cagayan Valley)
            [
                'name' => 'Tuguegarao City',
                'region_id' => $regionIds['Region II (Cagayan Valley)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Santiago City',
                'region_id' => $regionIds['Region II (Cagayan Valley)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Cauayan City',
                'region_id' => $regionIds['Region II (Cagayan Valley)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Region III (Central Luzon)
            [
                'name' => 'San Fernando City',
                'region_id' => $regionIds['Region III (Central Luzon)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Angeles City',
                'region_id' => $regionIds['Region III (Central Luzon)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Olongapo City',
                'region_id' => $regionIds['Region III (Central Luzon)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Region IV-A (CALABARZON)
            [
                'name' => 'Dasmariñas City',
                'region_id' => $regionIds['Region IV-A (CALABARZON)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Antipolo City',
                'region_id' => $regionIds['Region IV-A (CALABARZON)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Bacoor City',
                'region_id' => $regionIds['Region IV-A (CALABARZON)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // MIMAROPA Region
            [
                'name' => 'Puerto Princesa City',
                'region_id' => $regionIds['MIMAROPA Region'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Calapan City',
                'region_id' => $regionIds['MIMAROPA Region'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'San Jose',
                'region_id' => $regionIds['MIMAROPA Region'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Region V (Bicol Region)
            [
                'name' => 'Legazpi City',
                'region_id' => $regionIds['Region V (Bicol Region)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Naga City',
                'region_id' => $regionIds['Region V (Bicol Region)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Sorsogon City',
                'region_id' => $regionIds['Region V (Bicol Region)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Region VI (Western Visayas)
            [
                'name' => 'Iloilo City',
                'region_id' => $regionIds['Region VI (Western Visayas)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Bacolod City',
                'region_id' => $regionIds['Region VI (Western Visayas)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Roxas City',
                'region_id' => $regionIds['Region VI (Western Visayas)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Region VII (Central Visayas)
            [
                'name' => 'Cebu City',
                'region_id' => $regionIds['Region VII (Central Visayas)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Mandaue City',
                'region_id' => $regionIds['Region VII (Central Visayas)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Dumaguete City',
                'region_id' => $regionIds['Region VII (Central Visayas)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Region VIII (Eastern Visayas)
            [
                'name' => 'Tacloban City',
                'region_id' => $regionIds['Region VIII (Eastern Visayas)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Ormoc City',
                'region_id' => $regionIds['Region VIII (Eastern Visayas)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Catbalogan City',
                'region_id' => $regionIds['Region VIII (Eastern Visayas)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Region IX (Zamboanga Peninsula)
            [
                'name' => 'Zamboanga City',
                'region_id' => $regionIds['Region IX (Zamboanga Peninsula)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Dapitan City',
                'region_id' => $regionIds['Region IX (Zamboanga Peninsula)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Dipolog City',
                'region_id' => $regionIds['Region IX (Zamboanga Peninsula)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Region X (Northern Mindanao)
            [
                'name' => 'Cagayan de Oro City',
                'region_id' => $regionIds['Region X (Northern Mindanao)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Iligan City',
                'region_id' => $regionIds['Region X (Northern Mindanao)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Malaybalay City',
                'region_id' => $regionIds['Region X (Northern Mindanao)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Region XI (Davao Region)
            [
                'name' => 'Davao City',
                'region_id' => $regionIds['Region XI (Davao Region)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Tagum City',
                'region_id' => $regionIds['Region XI (Davao Region)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Digos City',
                'region_id' => $regionIds['Region XI (Davao Region)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Region XII (SOCCSKSARGEN)
            [
                'name' => 'General Santos City',
                'region_id' => $regionIds['Region XII (SOCCSKSARGEN)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Koronadal City',
                'region_id' => $regionIds['Region XII (SOCCSKSARGEN)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Kidapawan City',
                'region_id' => $regionIds['Region XII (SOCCSKSARGEN)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Region XIII (Caraga)
            [
                'name' => 'Butuan City',
                'region_id' => $regionIds['Region XIII (Caraga)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Surigao City',
                'region_id' => $regionIds['Region XIII (Caraga)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Bislig City',
                'region_id' => $regionIds['Region XIII (Caraga)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            // Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)
            [
                'name' => 'Marawi City',
                'region_id' => $regionIds['Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Cotabato City',
                'region_id' => $regionIds['Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Lamitan City',
                'region_id' => $regionIds['Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        // Insert municipalities
        DB::table('municipalities')->insert($municipalities);
    }
}
