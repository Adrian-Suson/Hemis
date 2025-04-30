<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PhilippineMunicipalitiesSeeder extends Seeder
{
    public function run()
    {
        // Sample municipalities with their associated region names.
        $municipalities = [
            ['name' => 'Laoag', 'region_name' => 'Region I - Ilocos Region'],
            ['name' => 'Vigan', 'region_name' => 'Region I - Ilocos Region'],
            ['name' => 'Tuguegarao', 'region_name' => 'Region II - Cagayan Valley'],
            ['name' => 'San Fernando', 'region_name' => 'Region III - Central Luzon'],
            // ...add more municipalities as needed...
        ];

        foreach ($municipalities as $municipality) {
            $regionId = DB::table('regions')
                ->where('name', $municipality['region_name'])
                ->value('id');
            if ($regionId) {
                DB::table('municipalities')->insertOrIgnore([
                    'name' => $municipality['name'],
                    'region_id' => $regionId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}