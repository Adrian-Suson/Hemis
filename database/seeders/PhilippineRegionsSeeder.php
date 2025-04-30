<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PhilippineRegionsSeeder extends Seeder
{
    public function run()
    {
        $regions = [
            'Cordillera Administrative Region',
            'National Capital Region (NCR)',
            'Region I - Ilocos Region',
            'Region II - Cagayan Valley',
            'Region III - Central Luzon',
            'Region IV-A - CALABARZON',
            'Region IV-B - MIMAROPA',
            'Region V - Bicol Region',
            'Region VI - Western Visayas',
            'Region VII - Central Visayas',
            'Region VIII - Eastern Visayas',
            'Region IX - Zamboanga Peninsula',
            'Region X - Northern Mindanao',
            'Region XI - Davao Region',
            'Region XII - SOCCSKSARGEN',
            'Region XIII - Caraga',
            'BARMM - Bangsamoro Autonomous Region in Muslim Mindanao',
        ];

        foreach ($regions as $region) {
            DB::table('regions')->insertOrIgnore([
                'name' => $region,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}