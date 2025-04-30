<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // List of all 18 regions in the Philippines, formatted as requested
        $regions = [
            ['name' => '1 - Region I'],
            ['name' => '2 - Region II'],
            ['name' => '3 - Region III'],
            ['name' => '4A - Region IV-A'],
            ['name' => '4B - Region IV-B'],
            ['name' => '5 - Region V'],
            ['name' => '6 - Region VI'],
            ['name' => '7 - Region VII'],
            ['name' => '8 - Region VIII'],
            ['name' => '9 - Region IX'],
            ['name' => '10 - Region X'],
            ['name' => '11 - Region XI'],
            ['name' => '12 - Region XII'],
            ['name' => '13 - Region XIII'],
            ['name' => 'NCR - National Capital Region'],
            ['name' => 'CAR - Cordillera Administrative Region'],
            ['name' => 'BARMM - Bangsamoro Autonomous Region in Muslim Mindanao'],
            ['name' => 'NIR - Negros Island Region'],
        ];

        // Insert regions into the database
        foreach ($regions as $region) {
            DB::table('regions')->updateOrInsert(
                ['name' => $region['name']],
                [
                    'name' => $region['name'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}
