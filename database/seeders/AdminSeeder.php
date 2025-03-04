<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'), // Set a strong password here
            'role' => 'admin',
            'status' => 'Active',
            'profile_image' => null, // Optional, you can set a base64 image string if needed
        ]);
    }
}
