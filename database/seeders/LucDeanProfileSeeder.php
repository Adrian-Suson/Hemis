<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LucDeanProfile;

class LucDeanProfileSeeder extends Seeder
{
    public function run(): void
    {
        LucDeanProfile::truncate();
        LucDeanProfile::create([
            'luc_detail_id' => 1,
            'name' => 'Dean John Doe',
            'designation' => 'Dean',
            'college_discipline_assignment' => 'Engineering',
            'baccalaureate_degree' => 'BS Engineering',
            'masters_degree' => 'MS Engineering',
            'doctorate_degree' => 'PhD Engineering',
        ]);
        LucDeanProfile::create([
            'luc_detail_id' => 2,
            'name' => 'Dean Jane Smith',
            'designation' => 'Dean',
            'college_discipline_assignment' => 'Science',
            'baccalaureate_degree' => 'BS Biology',
            'masters_degree' => 'MS Biology',
            'doctorate_degree' => 'PhD Biology',
        ]);
    }
} 