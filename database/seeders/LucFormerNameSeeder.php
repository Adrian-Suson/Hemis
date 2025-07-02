<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LucFormerName;

class LucFormerNameSeeder extends Seeder
{
    public function run(): void
    {
        LucFormerName::truncate();
        LucFormerName::create([
            'luc_detail_id' => 1,
            'former_name' => 'Old College Name',
            'year_used' => 1990,
        ]);
        LucFormerName::create([
            'luc_detail_id' => 2,
            'former_name' => 'Another Old Name',
            'year_used' => 1980,
        ]);
    }
} 