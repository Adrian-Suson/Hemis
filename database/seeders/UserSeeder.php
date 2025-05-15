<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert Super Admin
        DB::table('users')->insert([
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@example.com',
                'password' => Hash::make('password'),
                'role' => 'Super Admin',
                'status' => 'Active',
                'institution_id' => null,
                'profile_image' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Insert HEI Admin
        DB::table('users')->insert([
            [
                'name' => 'HEI Admin',
                'email' => 'heiadmin@example.com',
                'password' => Hash::make('password'),
                'role' => 'HEI Admin',
                'status' => 'Active',
                'institution_id' => 13,
                'profile_image' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Insert 50+ HEI Staff
        $staffUsers = [];
        for ($i = 1; $i <= 50; $i++) {
            $staffUsers[] = [
                'name' => "HEI Staff $i",
                'email' => "heistaff$i@example.com",
                'password' => Hash::make('password'),
                'role' => 'HEI Staff',
                'status' => 'Active',
                'institution_id' => 13,
                'profile_image' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('users')->insert($staffUsers);

        // Insert Viewer
        DB::table('users')->insert([
            [
                'name' => 'Viewer',
                'email' => 'viewer@example.com',
                'password' => Hash::make('password'),
                'role' => 'Viewer',
                'status' => 'Active',
                'institution_id' => null,
                'profile_image' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
