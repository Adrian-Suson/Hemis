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
        // Only Region 9
        $regions = [
            ['name' => '9 - Region IX'],
        ];

        // Insert region into the database
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