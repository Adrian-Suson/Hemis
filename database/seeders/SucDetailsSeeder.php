<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SucDetailsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all SUCs from the heis table
        $sucs = DB::table('heis')
            ->where('type', 'SUC')
            ->get();

        // Get the current year for report_year
        $currentYear = date('Y');

        // Create SUC details for each SUC
        foreach ($sucs as $suc) {
            DB::table('suc_details')->insert([
                'hei_uiid' => $suc->uiid,
                'region' => 'Region IX (Zamboanga Peninsula)',
                'province' => $this->getProvinceForSuc($suc->name),
                'municipality' => $this->getMunicipalityForSuc($suc->name),
                'address_street' => $this->getAddressForSuc($suc->name),
                'postal_code' => $this->getPostalCodeForSuc($suc->name),
                'institutional_telephone' => $this->getTelephoneForSuc($suc->name),
                'institutional_fax' => null,
                'head_telephone' => null,
                'institutional_email' => $this->getEmailForSuc($suc->name),
                'institutional_website' => $this->getWebsiteForSuc($suc->name),
                'year_established' => $this->getYearEstablishedForSuc($suc->name),
                'report_year' => $currentYear,
                'head_name' => null,
                'head_title' => null,
                'head_education' => null,
                'sec_registration' => null,
                'year_granted_approved' => null,
                'year_converted_college' => null,
                'year_converted_university' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function getProvinceForSuc($name)
    {
        $provinces = [
            'Western Mindanao State University' => 'Zamboanga City',
            'Zamboanga Peninsula Polytechnic State University' => 'Zamboanga City',
            'Zamboanga State College of Marine Sciences and Technology' => 'Zamboanga City',
            'J. H. Cerilles State College' => 'Zamboanga del Sur',
            'Jose Rizal Memorial State University' => 'Zamboanga del Norte',
            'Mindanao State University - Buug Campus' => 'Zamboanga Sibugay',
            'Basilan State College' => 'Basilan',
            'Hadji Butu School of Arts and Trades' => 'Sulu',
            'Lapak Agricultural School' => 'Sulu',
            'Mindanao State University - Sulu Development Technical College' => 'Sulu',
            'Mindanao State University - Tawi-Tawi College of Technology and Oceonography' => 'Tawi-Tawi',
            'Sulu State College' => 'Sulu',
            'Tawi-Tawi Regional Agricultural College' => 'Tawi-Tawi',
        ];

        foreach ($provinces as $suc => $province) {
            if (str_contains($name, $suc)) {
                return $province;
            }
        }

        return 'Zamboanga City'; // Default province
    }

    private function getMunicipalityForSuc($name)
    {
        $municipalities = [
            'Western Mindanao State University' => 'Zamboanga City',
            'Zamboanga Peninsula Polytechnic State University' => 'Zamboanga City',
            'Zamboanga State College of Marine Sciences and Technology' => 'Zamboanga City',
            'J. H. Cerilles State College' => 'Pagadian City',
            'Jose Rizal Memorial State University' => 'Dipolog City',
            'Mindanao State University - Buug Campus' => 'Buug',
            'Basilan State College' => 'Isabela City',
            'Hadji Butu School of Arts and Trades' => 'Jolo',
            'Lapak Agricultural School' => 'Jolo',
            'Mindanao State University - Sulu Development Technical College' => 'Jolo',
            'Mindanao State University - Tawi-Tawi College of Technology and Oceonography' => 'Bongao',
            'Sulu State College' => 'Jolo',
            'Tawi-Tawi Regional Agricultural College' => 'Bongao',
        ];

        foreach ($municipalities as $suc => $municipality) {
            if (str_contains($name, $suc)) {
                return $municipality;
            }
        }

        return 'Zamboanga City'; // Default municipality
    }

    private function getAddressForSuc($name)
    {
        $addresses = [
            'Western Mindanao State University' => 'Normal Road, Baliwasan',
            'Zamboanga Peninsula Polytechnic State University' => 'R.T. Lim Boulevard',
            'Zamboanga State College of Marine Sciences and Technology' => 'Fort Pilar',
            'J. H. Cerilles State College' => 'Main Campus, Mati',
            'Jose Rizal Memorial State University' => 'Dapitan City',
            'Mindanao State University - Buug Campus' => 'Buug, Zamboanga Sibugay',
            'Basilan State College' => 'Isabela City, Basilan',
            'Hadji Butu School of Arts and Trades' => 'Jolo, Sulu',
            'Lapak Agricultural School' => 'Jolo, Sulu',
            'Mindanao State University - Sulu Development Technical College' => 'Jolo, Sulu',
            'Mindanao State University - Tawi-Tawi College of Technology and Oceonography' => 'Bongao, Tawi-Tawi',
            'Sulu State College' => 'Jolo, Sulu',
            'Tawi-Tawi Regional Agricultural College' => 'Bongao, Tawi-Tawi',
        ];

        foreach ($addresses as $suc => $address) {
            if (str_contains($name, $suc)) {
                return $address;
            }
        }

        return 'Main Campus'; // Default address
    }

    private function getPostalCodeForSuc($name)
    {
        $postalCodes = [
            'Western Mindanao State University' => '7000',
            'Zamboanga Peninsula Polytechnic State University' => '7000',
            'Zamboanga State College of Marine Sciences and Technology' => '7000',
            'J. H. Cerilles State College' => '7016',
            'Jose Rizal Memorial State University' => '7101',
            'Mindanao State University - Buug Campus' => '7009',
            'Basilan State College' => '7300',
            'Hadji Butu School of Arts and Trades' => '7400',
            'Lapak Agricultural School' => '7400',
            'Mindanao State University - Sulu Development Technical College' => '7400',
            'Mindanao State University - Tawi-Tawi College of Technology and Oceonography' => '7500',
            'Sulu State College' => '7400',
            'Tawi-Tawi Regional Agricultural College' => '7500',
        ];

        foreach ($postalCodes as $suc => $postalCode) {
            if (str_contains($name, $suc)) {
                return $postalCode;
            }
        }

        return '7000'; // Default postal code
    }

    private function getTelephoneForSuc($name)
    {
        $telephones = [
            'Western Mindanao State University' => '+63-62-991-8888',
            'Zamboanga Peninsula Polytechnic State University' => '+63-62-991-7777',
            'Zamboanga State College of Marine Sciences and Technology' => '+63-62-991-6666',
            'J. H. Cerilles State College' => '+63-62-925-5555',
            'Jose Rizal Memorial State University' => '+63-65-212-4444',
            'Mindanao State University - Buug Campus' => '+63-62-333-3333',
            'Basilan State College' => '+63-62-200-2222',
            'Hadji Butu School of Arts and Trades' => '+63-68-111-1111',
            'Lapak Agricultural School' => '+63-68-222-2222',
            'Mindanao State University - Sulu Development Technical College' => '+63-68-333-3333',
            'Mindanao State University - Tawi-Tawi College of Technology and Oceonography' => '+63-68-444-4444',
            'Sulu State College' => '+63-68-555-5555',
            'Tawi-Tawi Regional Agricultural College' => '+63-68-666-6666',
        ];

        foreach ($telephones as $suc => $telephone) {
            if (str_contains($name, $suc)) {
                return $telephone;
            }
        }

        return '+63-62-991-8888'; // Default telephone
    }

    private function getEmailForSuc($name)
    {
        $emails = [
            'Western Mindanao State University' => 'info@wmsu.edu.ph',
            'Zamboanga Peninsula Polytechnic State University' => 'info@zppsu.edu.ph',
            'Zamboanga State College of Marine Sciences and Technology' => 'info@zscmst.edu.ph',
            'J. H. Cerilles State College' => 'info@jhcs.edu.ph',
            'Jose Rizal Memorial State University' => 'info@jrmsu.edu.ph',
            'Mindanao State University - Buug Campus' => 'info@msubuug.edu.ph',
            'Basilan State College' => 'info@bsc.edu.ph',
            'Hadji Butu School of Arts and Trades' => 'info@hbsat.edu.ph',
            'Lapak Agricultural School' => 'info@las.edu.ph',
            'Mindanao State University - Sulu Development Technical College' => 'info@msusdtc.edu.ph',
            'Mindanao State University - Tawi-Tawi College of Technology and Oceonography' => 'info@msuttco.edu.ph',
            'Sulu State College' => 'info@ssc.edu.ph',
            'Tawi-Tawi Regional Agricultural College' => 'info@trac.edu.ph',
        ];

        foreach ($emails as $suc => $email) {
            if (str_contains($name, $suc)) {
                return $email;
            }
        }

        return 'info@wmsu.edu.ph'; // Default email
    }

    private function getWebsiteForSuc($name)
    {
        $websites = [
            'Western Mindanao State University' => 'https://wmsu.edu.ph',
            'Zamboanga Peninsula Polytechnic State University' => 'https://zppsu.edu.ph',
            'Zamboanga State College of Marine Sciences and Technology' => 'https://zscmst.edu.ph',
            'J. H. Cerilles State College' => 'https://jhcs.edu.ph',
            'Jose Rizal Memorial State University' => 'https://jrmsu.edu.ph',
            'Mindanao State University - Buug Campus' => 'https://msubuug.edu.ph',
            'Basilan State College' => 'https://bsc.edu.ph',
            'Hadji Butu School of Arts and Trades' => 'https://hbsat.edu.ph',
            'Lapak Agricultural School' => 'https://las.edu.ph',
            'Mindanao State University - Sulu Development Technical College' => 'https://msusdtc.edu.ph',
            'Mindanao State University - Tawi-Tawi College of Technology and Oceonography' => 'https://msuttco.edu.ph',
            'Sulu State College' => 'https://ssc.edu.ph',
            'Tawi-Tawi Regional Agricultural College' => 'https://trac.edu.ph',
        ];

        foreach ($websites as $suc => $website) {
            if (str_contains($name, $suc)) {
                return $website;
            }
        }

        return 'https://wmsu.edu.ph'; // Default website
    }

    private function getYearEstablishedForSuc($name)
    {
        $years = [
            'Western Mindanao State University' => 1901,
            'Zamboanga Peninsula Polytechnic State University' => 1965,
            'Zamboanga State College of Marine Sciences and Technology' => 1963,
            'J. H. Cerilles State College' => 1960,
            'Jose Rizal Memorial State University' => 1960,
            'Mindanao State University - Buug Campus' => 1961,
            'Basilan State College' => 1963,
            'Hadji Butu School of Arts and Trades' => 1965,
            'Lapak Agricultural School' => 1963,
            'Mindanao State University - Sulu Development Technical College' => 1961,
            'Mindanao State University - Tawi-Tawi College of Technology and Oceonography' => 1961,
            'Sulu State College' => 1963,
            'Tawi-Tawi Regional Agricultural College' => 1963,
        ];

        foreach ($years as $suc => $year) {
            if (str_contains($name, $suc)) {
                return $year;
            }
        }

        return 1960; // Default year
    }
}
