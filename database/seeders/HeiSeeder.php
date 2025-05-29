<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HeiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $heis = [
            ['uiid' => '9001', 'name' => 'Andres Bonifacio College, Inc.', 'type' => 'Private'],
            ['uiid' => '9002', 'name' => 'Ateneo de Zamboanga University', 'type' => 'Private'],
            ['uiid' => '9003', 'name' => 'Basilan State College', 'type' => 'SUC'],
            ['uiid' => '9004', 'name' => 'Brent Hospital and Colleges Incorporated', 'type' => 'Private'],
            ['uiid' => '9005', 'name' => 'Claret College of Isabela', 'type' => 'Private'],
            ['uiid' => '9006', 'name' => 'DMC College Foundation, Inc.', 'type' => 'Private'],
            ['uiid' => '9008', 'name' => 'Dr. Aurelio Mendoza Memorial Colleges', 'type' => 'Private'],
            ['uiid' => '9009', 'name' => 'Immaculate Conception Archdiocesan School', 'type' => 'Private'],
            ['uiid' => '9010', 'name' => 'Juan S. Alano Memorial School, Inc.', 'type' => 'Private'],
            ['uiid' => '9014', 'name' => 'Marian College, Inc.', 'type' => 'Private'],
            ['uiid' => '9016', 'name' => 'Blancia Carreon College', 'type' => 'Private'],
            ['uiid' => '9017', 'name' => 'Philippine Advent College - Sindangan', 'type' => 'Private'],
            ['uiid' => '9018', 'name' => 'Pilar College of Zamboanga City, Inc', 'type' => 'Private'],
            ['uiid' => '9019', 'name' => 'Rizal Memorial Institute of Dapitan City, Inc.', 'type' => 'Private'],
            ['uiid' => '9020', 'name' => 'Saint Columban College, Inc.', 'type' => 'Private'],
            ['uiid' => '9021', 'name' => 'St. John College of Buug Foundation, Inc.', 'type' => 'Private'],
            ['uiid' => '9022', 'name' => 'Saint Joseph College of Sindangan Incorporated', 'type' => 'Private'],
            ['uiid' => '9023', 'name' => 'St. Vincent\'s College Incorporated', 'type' => 'Private'],
            ['uiid' => '9024', 'name' => 'Saint Estanislao Kostka College, Inc.', 'type' => 'Private'],
            ['uiid' => '9026', 'name' => 'Southern Mindanao Colleges Agro-Tech', 'type' => 'Private'],
            ['uiid' => '9027', 'name' => 'Southern City Colleges, Inc.', 'type' => 'Private'],
            ['uiid' => '9028', 'name' => 'Southern Mindanao Colleges', 'type' => 'Private'],
            ['uiid' => '9029', 'name' => 'Southern Philippine College', 'type' => 'Private'],
            ['uiid' => '9030', 'name' => 'Western Mindanao State University', 'type' => 'SUC'],
            ['uiid' => '9031', 'name' => 'Universidad de Zamboanga', 'type' => 'Private'],
            ['uiid' => '9032', 'name' => 'Zamboanga Peninsula Polytechnic State University', 'type' => 'SUC'],
            ['uiid' => '9035', 'name' => 'Zamboanga State College of Marine Sciences and Technology', 'type' => 'SUC'],
            ['uiid' => '9036', 'name' => 'J. H. Cerilles State College Main - Mati', 'type' => 'SUC'],
            ['uiid' => '9041', 'name' => 'Medina College, Incorporated', 'type' => 'Private'],
            ['uiid' => '9043', 'name' => 'Pagadian Capitol College, Inc.', 'type' => 'Private'],
            ['uiid' => '9046', 'name' => 'Aurora Pioneers Memorial College, Inc.', 'type' => 'Private'],
            ['uiid' => '9047', 'name' => 'Dipolog City Institute of Technology', 'type' => 'Private'],
            ['uiid' => '9048', 'name' => 'Jose Rizal Memorial State University', 'type' => 'SUC'],
            ['uiid' => '9049', 'name' => 'Ebenezer Bible College and Seminary, Inc.', 'type' => 'Private'],
            ['uiid' => '9050', 'name' => 'St. Mary\'s College of Labason, Inc.', 'type' => 'Private'],
            ['uiid' => '9051', 'name' => 'J. H. Cerilles State College - Canuto M.S. Enerio Campus', 'type' => 'SUC'],
            ['uiid' => '9055', 'name' => 'AMA Computer College - Zamboanga', 'type' => 'Private'],
            ['uiid' => '9056', 'name' => 'Colegio de San Francisco Javier of Rizal, Zamboanga del Norte, Incorporated', 'type' => 'Private'],
            ['uiid' => '9058', 'name' => 'Computer Technologies Institute of Zamboanga City, Inc.', 'type' => 'Private'],
            ['uiid' => '9059', 'name' => 'HMIJ Foundation - Philippine Islamic College, Inc.', 'type' => 'Private'],
            ['uiid' => '9060', 'name' => 'Mindanao State University - Buug Campus', 'type' => 'SUC'],
            ['uiid' => '9061', 'name' => 'Eastern Mindanao College of Technology', 'type' => 'Private'],
            ['uiid' => '9062', 'name' => 'Universidad de Zamboanga - Ipil', 'type' => 'Private'],
            ['uiid' => '9065', 'name' => 'Medina College Ipil, Inc.', 'type' => 'Private'],
            ['uiid' => '9068', 'name' => 'Philippine Technological and Marine Sciences', 'type' => 'Private'],
            ['uiid' => '9070', 'name' => 'Southern Peninsula College, Inc.', 'type' => 'Private'],
            ['uiid' => '9071', 'name' => 'Lucan Central Colleges, Inc.', 'type' => 'Private'],
            ['uiid' => '9072', 'name' => 'Sibugay Technical Institute Inc.', 'type' => 'Private'],
            ['uiid' => '9074', 'name' => 'Universidad de Zamboanga - Pagadian Branch Inc.', 'type' => 'Private'],
            ['uiid' => '9076', 'name' => 'Aim High Colleges, Inc.', 'type' => 'Private'],
            ['uiid' => '9077', 'name' => 'Ave Maria College', 'type' => 'Private'],
            ['uiid' => '9079', 'name' => 'Hyrons College Philippines, Inc.', 'type' => 'Private'],
            ['uiid' => '9083', 'name' => 'Nuevo Zamboanga College, Inc.', 'type' => 'Private'],
            ['uiid' => '9085', 'name' => 'Philippine Advent College - Salug Campus', 'type' => 'Private'],
            ['uiid' => '9087', 'name' => 'Yllana Bay View College, Inc.', 'type' => 'Private'],
            ['uiid' => '9089', 'name' => 'Alhadeetha Mindanao College, Inc.', 'type' => 'Private'],
            ['uiid' => '9090', 'name' => 'Zamboanga del Sur Provincial Government College - Aurora', 'type' => 'LUC'],
            ['uiid' => '9094', 'name' => 'Southern City Colleges - West Campus', 'type' => 'Private'],
            ['uiid' => '9095', 'name' => 'ZAMSULA Everlasting College', 'type' => 'Private'],
            ['uiid' => '9096', 'name' => 'Our Lady of Triumph Institute of Technology, Inc.', 'type' => 'Private'],
            ['uiid' => '9097', 'name' => 'West Prime Horizon Institute, Inc.', 'type' => 'Private'],
            ['uiid' => '9098', 'name' => 'Colegio de la Ciudad de Zamboanga', 'type' => 'Private'],
            ['uiid' => '9099', 'name' => 'Zamboanga del Sur Provincial Government College - Pagadian', 'type' => 'LUC'],
            ['uiid' => '9100', 'name' => 'Ferndale College - Zamboanga Peninsula, Inc.', 'type' => 'Private'],
            ['uiid' => '9101', 'name' => 'Metro Zampen College, Inc.', 'type' => 'Private'],
            ['uiid' => '9102', 'name' => 'Emmaus College of Theology Foundation, Inc.', 'type' => 'Private'],
            ['uiid' => '9103', 'name' => 'Pagadian City International College', 'type' => 'Private'],
            ['uiid' => '9104', 'name' => 'Philippine Advent College - Leon B. Postigo Campus', 'type' => 'Private'],
            ['uiid' => '9105', 'name' => 'Zamboanga del Sur Provincial Government College - Dimataling', 'type' => 'LUC'],
            ['uiid' => '9106', 'name' => 'Helping Hands College and Wellness Center, Inc.', 'type' => 'Private'],
            ['uiid' => '15002', 'name' => 'Central Sulu College', 'type' => 'Private'],
            ['uiid' => '15003', 'name' => 'Hadji Butu School of Arts and Trades', 'type' => 'SUC'],
            ['uiid' => '15005', 'name' => 'Lapak Agricultural School', 'type' => 'SUC'],
            ['uiid' => '15007', 'name' => 'Mindanao State University - Sulu Development Technical College', 'type' => 'SUC'],
            ['uiid' => '15008', 'name' => 'Mindanao State University - Tawi-Tawi College of Technology and Oceonography', 'type' => 'SUC'],
            ['uiid' => '15009', 'name' => 'Notre Dame Jolo College', 'type' => 'Private'],
            ['uiid' => '15013', 'name' => 'Sulu State College', 'type' => 'SUC'],
            ['uiid' => '15014', 'name' => 'Tawi-Tawi Regional Agricultural College', 'type' => 'SUC'],
            ['uiid' => '15025', 'name' => 'Southwestern Mindanao Islamic Institute', 'type' => 'Private'],
            ['uiid' => '15035', 'name' => 'Mindanao Autonomous College Foundation Inc. of Isabela City', 'type' => 'Private'],
            ['uiid' => '15065', 'name' => 'Sulu College of Technology, Inc.', 'type' => 'Private'],
            ['uiid' => 'NEW-Mar', 'name' => 'Zamboanga del Sur Provincial Government College - Margosatubig', 'type' => 'LUC'],
            ['uiid' => 'NEW-Mol', 'name' => 'Zamboanga del Sur Provincial Government College - Molave', 'type' => 'LUC'],
            ['uiid' => 'NEW-Tab', 'name' => 'Zamboanga del Sur Provincial Government College - Tabina', 'type' => 'LUC'],
            ['uiid' => 'NEW-Mal', 'name' => 'Philippine Malaya College, Inc.', 'type' => 'Private'],
            ['uiid' => 'NEW-Pag', 'name' => 'J. H. Cerilles State College - Pagadian', 'type' => 'SUC'],
            ['uiid' => 'NEW-Jos', 'name' => 'Zamboanga del Sur Provincial Government College - Josefina', 'type' => 'LUC'],
            ['uiid' => 'NEW-Lap', 'name' => 'Zamboanga del Sur Provincial Government College - Lapuyan', 'type' => 'LUC'],
            ['uiid' => 'NEW-Mah', 'name' => 'Zamboanga del Sur Provincial Government College - Mahayag', 'type' => 'LUC'],
            ['uiid' => 'NEW-Mid', 'name' => 'Zamboanga del Sur Provincial Government College - Midsalip', 'type' => 'LUC'],
            ['uiid' => 'NEW-Ram', 'name' => 'Zamboanga del Sur Provincial Government College - Ramon Magsaysay', 'type' => 'LUC'],
            ['uiid' => 'NEW-Tam', 'name' => 'Zamboanga del Sur Provincial Government College - Tambulig', 'type' => 'LUC'],
            ['uiid' => 'NEW-Tig', 'name' => 'Zamboanga del Sur Provincial Government College - Tigbao', 'type' => 'LUC'],
            ['uiid' => 'NEW-Tuk', 'name' => 'Zamboanga del Sur Provincial Government College - Tukuran', 'type' => 'LUC'],
            ['uiid' => 'NEW-Vin', 'name' => 'Zamboanga del Sur Provincial Government College - Vincenzo Sagun', 'type' => 'LUC'],
        ];

        foreach ($heis as $hei) {
            DB::table('heis')->insert([
                'uiid' => $hei['uiid'],
                'name' => $hei['name'],
                'type' => $hei['type'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
