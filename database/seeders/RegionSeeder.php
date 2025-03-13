<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Region;

class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regions = [
            ['name' => 'Region I - Ilocos Region', 'code' => 'I'],
            ['name' => 'Region II - Cagayan Valley', 'code' => 'II'],
            ['name' => 'Region III - Central Luzon', 'code' => 'III'],
            ['name' => 'Region IV-A - CALABARZON', 'code' => 'IV-A'],
            ['name' => 'Region IV-B - MIMAROPA', 'code' => 'IV-B'],
            ['name' => 'Region V - Bicol Region', 'code' => 'V'],
            ['name' => 'Region VI - Western Visayas', 'code' => 'VI'],
            ['name' => 'Region VII - Central Visayas', 'code' => 'VII'],
            ['name' => 'Region VIII - Eastern Visayas', 'code' => 'VIII'],
            ['name' => 'Region IX - Zamboanga Peninsula', 'code' => 'IX'],
            ['name' => 'Region X - Northern Mindanao', 'code' => 'X'],
            ['name' => 'Region XI - Davao Region', 'code' => 'XI'],
            ['name' => 'Region XII - SOCCSKSARGEN', 'code' => 'XII'],
            ['name' => 'Region XIII - Caraga', 'code' => 'XIII'],
            ['name' => 'National Capital Region (NCR)', 'code' => 'NCR'],
            ['name' => 'Cordillera Administrative Region (CAR)', 'code' => 'CAR'],
            ['name' => 'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)', 'code' => 'BARMM'],
        ];

        foreach ($regions as $region) {
            Region::updateOrCreate(
                ['code' => $region['code']], // Unique key
                ['name' => $region['name']]
            );
        }
    }
}
