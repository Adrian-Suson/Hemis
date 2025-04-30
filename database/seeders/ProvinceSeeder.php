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
        // List of all 82 provinces grouped by their respective regions
        $provincesByRegion = [
            '1 - Region I' => [
                'Ilocos Norte',
                'Ilocos Sur',
                'La Union',
                'Pangasinan',
            ],
            '2 - Region II' => [
                'Batanes',
                'Cagayan',
                'Isabela',
                'Nueva Vizcaya',
                'Quirino',
            ],
            '3 - Region III' => [
                'Aurora',
                'Bataan',
                'Bulacan',
                'Nueva Ecija',
                'Pampanga',
                'Tarlac',
                'Zambales',
            ],
            '4A - Region IV-A' => [
                'Batangas',
                'Cavite',
                'Laguna',
                'Quezon',
                'Rizal',
            ],
            '4B - Region IV-B' => [
                'Marinduque',
                'Occidental Mindoro',
                'Oriental Mindoro',
                'Palawan',
                'Romblon',
            ],
            '5 - Region V' => [
                'Albay',
                'Camarines Norte',
                'Camarines Sur',
                'Catanduanes',
                'Masbate',
                'Sorsogon',
            ],
            '6 - Region VI' => [
                'Aklan',
                'Antique',
                'Capiz',
                'Guimaras',
                'Iloilo',
                'Negros Occidental',
            ],
            '7 - Region VII' => [
                'Bohol',
                'Cebu',
            ],
            '8 - Region VIII' => [
                'Biliran',
                'Eastern Samar',
                'Leyte',
                'Northern Samar',
                'Samar',
                'Southern Leyte',
            ],
            '9 - Region IX' => [
                'Zamboanga del Norte',
                'Zamboanga del Sur',
                'Zamboanga Sibugay',
            ],
            '10 - Region X' => [
                'Bukidnon',
                'Camiguin',
                'Lanao del Norte',
                'Misamis Occidental',
                'Misamis Oriental',
            ],
            '11 - Region XI' => [
                'Davao de Oro',
                'Davao del Norte',
                'Davao del Sur',
                'Davao Occidental',
                'Davao Oriental',
            ],
            '12 - Region XII' => [
                'Cotabato',
                'Sarangani',
                'South Cotabato',
                'Sultan Kudarat',
            ],
            '13 - Region XIII' => [
                'Agusan del Norte',
                'Agusan del Sur',
                'Dinagat Islands',
                'Surigao del Norte',
                'Surigao del Sur',
            ],
            'NCR - National Capital Region' => [
                'Caloocan City', // HUC
                'Las Piñas City', // HUC
                'Makati City', // HUC
                'Malabon City', // HUC
                'Mandaluyong City', // HUC
                'Manila', // HUC
                'Marikina City', // HUC
                'Muntinlupa City', // HUC
                'Navotas City', // HUC
                'Parañaque City', // HUC
                'Pasay City', // HUC
                'Pasig City', // HUC
                'Pateros', // Municipality
                'Quezon City', // HUC
                'San Juan City', // HUC
                'Taguig City', // HUC
                'Valenzuela City', // HUC
            ], // No provinces in NCR
            'CAR - Cordillera Administrative Region' => [
                'Abra',
                'Apayao',
                'Benguet',
                'Ifugao',
                'Kalinga',
                'Mountain Province',
            ],
            'BARMM - Bangsamoro Autonomous Region in Muslim Mindanao' => [
                'Basilan',
                'Lanao del Sur',
                'Maguindanao del Norte',
                'Maguindanao del Sur',
                'Sulu',
                'Tawi-Tawi',
            ],
            'NIR - Negros Island Region' => [
                'Negros Oriental',
                'Siquijor',
            ],
        ];

        // Insert provinces into the database
        foreach ($provincesByRegion as $regionName => $provinces) {
            // Skip regions with no provinces (e.g., NCR)
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
