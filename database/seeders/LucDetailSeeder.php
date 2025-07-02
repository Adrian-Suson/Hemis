<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LucDetail;
use Illuminate\Support\Facades\DB;

class LucDetailSeeder extends Seeder
{
    public function run(): void
    {
        LucDetail::query()->delete();
        DB::statement('ALTER TABLE luc_details AUTO_INCREMENT = 1');
        LucDetail::create([
            'hei_uiid' => 'SUC001',
            'region' => 'Region IX',
            'province' => 'Zamboanga del Sur',
            'municipality' => 'Pagadian City',
            'address_street' => 'Main St.',
            'postal_code' => '7000',
            'institutional_telephone' => '+63-62-991-8888',
            'institutional_fax' => null,
            'head_telephone' => null,
            'institutional_email' => 'info@hei.edu.ph',
            'institutional_website' => 'https://hei.edu.ph',
            'year_established' => 1960,
            'report_year' => 2024,
            'head_name' => 'Dr. John Doe',
            'head_title' => 'President',
            'head_education' => 'PhD',
            'sec_registration' => null,
            'year_granted_approved' => null,
            'year_converted_college' => null,
            'year_converted_university' => null,
            'x_coordinate' => null,
            'y_coordinate' => null,
        ]);
        LucDetail::create([
            'hei_uiid' => 'SUC002',
            'region' => 'Region IX',
            'province' => 'Zamboanga City',
            'municipality' => 'Zamboanga City',
            'address_street' => 'Second St.',
            'postal_code' => '7001',
            'institutional_telephone' => '+63-62-991-7777',
            'institutional_fax' => null,
            'head_telephone' => null,
            'institutional_email' => 'info2@hei.edu.ph',
            'institutional_website' => 'https://hei2.edu.ph',
            'year_established' => 1970,
            'report_year' => 2024,
            'head_name' => 'Dr. Jane Smith',
            'head_title' => 'President',
            'head_education' => 'PhD',
            'sec_registration' => null,
            'year_granted_approved' => null,
            'year_converted_college' => null,
            'year_converted_university' => null,
            'x_coordinate' => null,
            'y_coordinate' => null,
        ]);
    }
} 