<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MunicipalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Municipalities for Region 9 provinces, including Basilan, Tawi-Tawi, and Sulu
        $municipalitiesByProvince = [
            'Basilan' => [
                'Akbar',
                'Al-Barka',
                'Hadji Mohammad Ajul',
                'Hadji Muhtamad',
                'Isabela City', // ICC
                'Lamitan City', // Capital
                'Lantawan',
                'Maluso',
                'Sumisip',
                'Tabuan-Lasa',
                'Tipo-Tipo',
                'Tuburan',
                'Ungkaya Pukan', // Total: 11 municipalities, 2 cities
            ],
            'Zamboanga del Norte' => [
                'Bacungan',
                'Baliguian',
                'Dapitan City',
                'Dipolog City', // Capital
                'Godod',
                'Gutalac',
                'Jose Dalman',
                'Kalawit',
                'Katipunan',
                'La Libertad',
                'Labason',
                'Liloy',
                'Manukan',
                'Mutia',
                'Piñan',
                'Polanco',
                'President Manuel A. Roxas',
                'Rizal',
                'Salug',
                'Sergio Osmeña Sr.',
                'Siayan',
                'Sibuco',
                'Sibutad',
                'Sindangan',
                'Siocon',
                'Sirawai',
                'Tampilisan', // Total: 25 municipalities, 2 cities
            ],
            'Zamboanga del Sur' => [
                'Aurora',
                'Bayog',
                'Dimataling',
                'Dinas',
                'Dumalinao',
                'Dumingag',
                'Guipos',
                'Josefina',
                'Kumalarang',
                'Labangan',
                'Lakewood',
                'Lapuyan',
                'Mahayag',
                'Margosatubig',
                'Midsalip',
                'Molave',
                'Pagadian City', // Capital
                'Pitogo',
                'Ramon Magsaysay',
                'San Miguel',
                'San Pablo',
                'Sominot',
                'Tabina',
                'Tambulig',
                'Tigbao',
                'Tukuran',
                'Vincenzo A. Sagun',
                'Zamboanga City', // HUC
            ],
            'Zamboanga Sibugay' => [
                'Alicia',
                'Buug',
                'Diplahan',
                'Imelda',
                'Ipil', // Capital
                'Kabasalan',
                'Mabuhay',
                'Malangas',
                'Naga',
                'Olutanga',
                'Payao',
                'Roseller Lim',
                'Siay',
                'Talusan',
                'Titay',
                'Tungawan', // Total: 16 municipalities
            ],
            'Tawi-Tawi' => [
                'Bongao', // Capital
                'Languyan',
                'Mapun',
                'Panglima Sugala',
                'Sapa-Sapa',
                'Sibutu',
                'Simunul',
                'Sitangkai',
                'South Ubian',
                'Tandubas',
                'Turtle Islands', // Total: 11 municipalities
            ],
            'Sulu' => [
                'Banguingui',
                'Hadji Panglima Tahil',
                'Indanan',
                'Jolo', // Capital
                'Kalingalan Caluang',
                'Lugus',
                'Luuk',
                'Maimbung',
                'Old Panamao',
                'Omar',
                'Pandami',
                'Panglima Estino',
                'Pangutaran',
                'Parang',
                'Pata',
                'Patikul',
                'Siasi',
                'Talipao',
                'Tapul', // Total: 19 municipalities
            ],
        ];

        // Insert municipalities into the database
        foreach ($municipalitiesByProvince as $provinceName => $municipalities) {
            // Skip provinces with no municipalities
            if (empty($municipalities)) {
                continue;
            }

            // Get the province ID
            $province = DB::table('provinces')->where('name', $provinceName)->first();

            if (!$province) {
                throw new \Exception("Province '$provinceName' not found in the provinces table.");
            }

            foreach ($municipalities as $municipalityName) {
                DB::table('municipalities')->updateOrInsert(
                    [
                        'name' => $municipalityName,
                        'province_id' => $province->id,
                    ],
                    [
                        'name' => $municipalityName,
                        'province_id' => $province->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}
