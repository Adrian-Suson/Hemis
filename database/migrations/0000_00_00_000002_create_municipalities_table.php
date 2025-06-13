<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::create('municipalities', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Municipality name (e.g., "Como")
            $table->string('postal_code', 10)->nullable(); // Postal code for the municipality
            $table->foreignId('province_id')->constrained()->onDelete('cascade'); // Foreign key to provinces
            $table->timestamps();

            // Ensure unique municipality names within a province
            $table->unique(['name', 'province_id']);
        });

        // Municipalities data for Region 9 provinces
        $municipalitiesByProvince = [
            'Basilan' => [
                ['name' => 'Akbar', 'postal_code' => '7301'],
                ['name' => 'Al-Barka', 'postal_code' => '7302'],
                ['name' => 'Hadji Mohammad Ajul', 'postal_code' => '7303'],
                ['name' => 'Hadji Muhtamad', 'postal_code' => '7304'],
                ['name' => 'Isabela City', 'postal_code' => '7300'],
                ['name' => 'Lamitan City', 'postal_code' => '7302'],
                ['name' => 'Lantawan', 'postal_code' => '7305'],
                ['name' => 'Maluso', 'postal_code' => '7303'],
                ['name' => 'Sumisip', 'postal_code' => '7305'],
                ['name' => 'Tabuan-Lasa', 'postal_code' => '7305'],
                ['name' => 'Tipo-Tipo', 'postal_code' => '7304'],
                ['name' => 'Tuburan', 'postal_code' => '7306'],
                ['name' => 'Ungkaya Pukan', 'postal_code' => '7307'],
            ],
            'Zamboanga del Norte' => [
                ['name' => 'Bacungan', 'postal_code' => '7117'],
                ['name' => 'Baliguian', 'postal_code' => '7123'],
                ['name' => 'Dapitan City', 'postal_code' => '7101'],
                ['name' => 'Dipolog City', 'postal_code' => '7100'],
                ['name' => 'Godod', 'postal_code' => '7120'],
                ['name' => 'Gutalac', 'postal_code' => '7118'],
                ['name' => 'Jose Dalman', 'postal_code' => '7111'],
                ['name' => 'Kalawit', 'postal_code' => '7124'],
                ['name' => 'Katipunan', 'postal_code' => '7116'],
                ['name' => 'La Libertad', 'postal_code' => '7119'],
                ['name' => 'Labason', 'postal_code' => '7117'],
                ['name' => 'Liloy', 'postal_code' => '7115'],
                ['name' => 'Manukan', 'postal_code' => '7110'],
                ['name' => 'Mutia', 'postal_code' => '7107'],
                ['name' => 'Piñan', 'postal_code' => '7105'],
                ['name' => 'Polanco', 'postal_code' => '7106'],
                ['name' => 'President Manuel A. Roxas', 'postal_code' => '7108'],
                ['name' => 'Rizal', 'postal_code' => '7104'],
                ['name' => 'Salug', 'postal_code' => '7114'],
                ['name' => 'Sergio Osmeña Sr.', 'postal_code' => '7109'],
                ['name' => 'Siayan', 'postal_code' => '7113'],
                ['name' => 'Sibuco', 'postal_code' => '7122'],
                ['name' => 'Sibutad', 'postal_code' => '7103'],
                ['name' => 'Sindangan', 'postal_code' => '7112'],
                ['name' => 'Siocon', 'postal_code' => '7120'],
                ['name' => 'Sirawai', 'postal_code' => '7121'],
                ['name' => 'Tampilisan', 'postal_code' => '7116'],
            ],
            'Zamboanga del Sur' => [
                ['name' => 'Aurora', 'postal_code' => '7020'],
                ['name' => 'Bayog', 'postal_code' => '7011'],
                ['name' => 'Dimataling', 'postal_code' => '7032'],
                ['name' => 'Dinas', 'postal_code' => '7030'],
                ['name' => 'Dumalinao', 'postal_code' => '7015'],
                ['name' => 'Dumingag', 'postal_code' => '7028'],
                ['name' => 'Guipos', 'postal_code' => '7042'],
                ['name' => 'Josefina', 'postal_code' => '7027'],
                ['name' => 'Kumalarang', 'postal_code' => '7013'],
                ['name' => 'Labangan', 'postal_code' => '7017'],
                ['name' => 'Lakewood', 'postal_code' => '7014'],
                ['name' => 'Lapuyan', 'postal_code' => '7037'],
                ['name' => 'Mahayag', 'postal_code' => '7026'],
                ['name' => 'Margosatubig', 'postal_code' => '7035'],
                ['name' => 'Midsalip', 'postal_code' => '7021'],
                ['name' => 'Molave', 'postal_code' => '7023'],
                ['name' => 'Pagadian City', 'postal_code' => '7016'],
                ['name' => 'Pitogo', 'postal_code' => '7033'],
                ['name' => 'Ramon Magsaysay', 'postal_code' => '7024'],
                ['name' => 'San Miguel', 'postal_code' => '7029'],
                ['name' => 'San Pablo', 'postal_code' => '7031'],
                ['name' => 'Sominot', 'postal_code' => '7022'],
                ['name' => 'Tabina', 'postal_code' => '7034'],
                ['name' => 'Tambulig', 'postal_code' => '7025'],
                ['name' => 'Tigbao', 'postal_code' => '7043'],
                ['name' => 'Tukuran', 'postal_code' => '7019'],
                ['name' => 'Vincenzo A. Sagun', 'postal_code' => '7036'],
                ['name' => 'Zamboanga City', 'postal_code' => '7000'],
            ],
            'Zamboanga Sibugay' => [
                ['name' => 'Alicia', 'postal_code' => '7040'],
                ['name' => 'Buug', 'postal_code' => '7009'],
                ['name' => 'Diplahan', 'postal_code' => '7039'],
                ['name' => 'Imelda', 'postal_code' => '7007'],
                ['name' => 'Ipil', 'postal_code' => '7001'],
                ['name' => 'Kabasalan', 'postal_code' => '7005'],
                ['name' => 'Mabuhay', 'postal_code' => '7010'],
                ['name' => 'Malangas', 'postal_code' => '7038'],
                ['name' => 'Naga', 'postal_code' => '7004'],
                ['name' => 'Olutanga', 'postal_code' => '7041'],
                ['name' => 'Payao', 'postal_code' => '7008'],
                ['name' => 'Roseller Lim', 'postal_code' => '7002'],
                ['name' => 'Siay', 'postal_code' => '7006'],
                ['name' => 'Talusan', 'postal_code' => '7012'],
                ['name' => 'Titay', 'postal_code' => '7003'],
                ['name' => 'Tungawan', 'postal_code' => '7018'],
            ],
            'Tawi-Tawi' => [
                ['name' => 'Bongao', 'postal_code' => '7500'],
                ['name' => 'Languyan', 'postal_code' => '7508'],
                ['name' => 'Mapun', 'postal_code' => '7507'],
                ['name' => 'Panglima Sugala', 'postal_code' => '7501'],
                ['name' => 'Sapa-Sapa', 'postal_code' => '7503'],
                ['name' => 'Sibutu', 'postal_code' => '7505'],
                ['name' => 'Simunul', 'postal_code' => '7505'],
                ['name' => 'Sitangkai', 'postal_code' => '7506'],
                ['name' => 'South Ubian', 'postal_code' => '7504'],
                ['name' => 'Tandubas', 'postal_code' => '7502'],
                ['name' => 'Turtle Islands', 'postal_code' => '7509'],
            ],
            'Sulu' => [
                ['name' => 'Banguingui', 'postal_code' => '7407'],
                ['name' => 'Hadji Panglima Tahil', 'postal_code' => '7413'],
                ['name' => 'Indanan', 'postal_code' => '7407'],
                ['name' => 'Jolo', 'postal_code' => '7400'],
                ['name' => 'Kalingalan Caluang', 'postal_code' => '7416'],
                ['name' => 'Lugus', 'postal_code' => '7411'],
                ['name' => 'Luuk', 'postal_code' => '7404'],
                ['name' => 'Maimbung', 'postal_code' => '7409'],
                ['name' => 'Old Panamao', 'postal_code' => '7402'],
                ['name' => 'Omar', 'postal_code' => '7414'],
                ['name' => 'Pandami', 'postal_code' => '7405'],
                ['name' => 'Panglima Estino', 'postal_code' => '7415'],
                ['name' => 'Pangutaran', 'postal_code' => '7412'],
                ['name' => 'Parang', 'postal_code' => '7408'],
                ['name' => 'Pata', 'postal_code' => '7405'],
                ['name' => 'Patikul', 'postal_code' => '7401'],
                ['name' => 'Siasi', 'postal_code' => '7412'],
                ['name' => 'Talipao', 'postal_code' => '7403'],
                ['name' => 'Tapul', 'postal_code' => '7410'],
            ],
        ];

        // Insert municipalities
        foreach ($municipalitiesByProvince as $provinceName => $municipalities) {
            // Get the province ID
            $province = DB::table('provinces')->where('name', $provinceName)->first();
            if (!$province) {
                throw new \Exception("Province '$provinceName' not found in the provinces table.");
            }

            foreach ($municipalities as $municipality) {
                DB::table('municipalities')->insert([
                    'name' => $municipality['name'],
                    'postal_code' => $municipality['postal_code'],
                    'province_id' => $province->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down()
    {
        Schema::dropIfExists('municipalities');
    }
};