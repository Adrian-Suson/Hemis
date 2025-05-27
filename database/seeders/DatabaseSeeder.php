<?php

namespace Database\Seeders;

use app\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call(AdminSeeder::class);
        $this->call([
            RegionSeeder::class,
            ProvinceSeeder::class,
            MunicipalitySeeder::class,
            ReportYearsSeeder::class,
            HeiSeeder::class,
        ]);
    }
}