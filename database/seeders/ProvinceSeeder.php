<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Provinces for Region 9, including Basilan
        $provincesByRegion = [
            '9 - Region IX' => [
                'Zamboanga del Norte',
                'Zamboanga del Sur',
                'Zamboanga Sibugay',
                'Basilan',
                'Sulu',
                'Tawi-Tawi',
            ],
        ];

        // Insert provinces into the database
        foreach ($provincesByRegion as $regionName => $provinces) {
            // Skip regions with no provinces
            if (empty($provinces)) {
                continue;
            }

            // Get the region ID
            $region = DB::table('regions')->where('name', $regionName)->first();
            if (!$region) {
                throw new \Exception("Region '$regionName' not found in the regions table.");
            }

            foreach ($provinces as $provinceName) {
                DB::table('provinces')->updateOrInsert(
                    [
                        'name' => $provinceName,
                        'region_id' => $region->id,
                    ],
                    [
                        'name' => $provinceName,
                        'region_id' => $region->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}
