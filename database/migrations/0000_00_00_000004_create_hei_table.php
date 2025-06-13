<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('heis', function (Blueprint $table) {
            $table->string('uiid', 36)->primary(); // Define uiid as a string with a length of 36
            $table->string('name', 255)->notNullable();
            $table->enum('type', ['SUC', 'LUC', 'Private'])->notNullable();
            $table->unsignedBigInteger('cluster_id')->nullable(); // Add cluster_id column
            $table->timestamps();
            $table->softDeletes();

            // Add indexes for faster queries
            $table->index('name'); // Index for searching by name
            $table->index('type'); // Index for filtering by type
            $table->index('cluster_id'); // Index for cluster relationship

            // Add foreign key constraint
            $table->foreign('cluster_id')
                ->references('id')
                ->on('clusters')
                ->onDelete('set null');
        });

        // Get all clusters from the database
        $clusters = DB::table('clusters')->get();

        // Create a mapping of cluster names to their IDs
        $clusterMap = [];
        foreach ($clusters as $cluster) {
            $clusterMap[$cluster->name] = $cluster->id;
        }

        $heis = [
            // Zamboanga City HEIs
            ['uiid' => '9001', 'name' => 'Andres Bonifacio College, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9002', 'name' => 'Ateneo de Zamboanga University', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9004', 'name' => 'Brent Hospital and Colleges Incorporated', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9009', 'name' => 'Immaculate Conception Archdiocesan School', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9010', 'name' => 'Juan S. Alano Memorial School, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9014', 'name' => 'Marian College, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9016', 'name' => 'Blancia Carreon College', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9018', 'name' => 'Pilar College of Zamboanga City, Inc', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9027', 'name' => 'Southern City Colleges, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9028', 'name' => 'Southern Mindanao Colleges', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9029', 'name' => 'Southern Philippine College', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9030', 'name' => 'Western Mindanao State University', 'type' => 'SUC', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9031', 'name' => 'Universidad de Zamboanga', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9032', 'name' => 'Zamboanga Peninsula Polytechnic State University', 'type' => 'SUC', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9035', 'name' => 'Zamboanga State College of Marine Sciences and Technology', 'type' => 'SUC', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9055', 'name' => 'AMA Computer College - Zamboanga', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9058', 'name' => 'Computer Technologies Institute of Zamboanga City, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9059', 'name' => 'HMIJ Foundation - Philippine Islamic College, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9083', 'name' => 'Nuevo Zamboanga College, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9095', 'name' => 'ZAMSULA Everlasting College', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9098', 'name' => 'Colegio de la Ciudad de Zamboanga', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9100', 'name' => 'Ferndale College - Zamboanga Peninsula, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9101', 'name' => 'Metro Zampen College, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga City'],
            ['uiid' => '9106', 'name' => 'Helping Hands College and Wellness Center, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga City'],

            // Isabela City HEIs
            ['uiid' => '15035', 'name' => 'Mindanao Autonomous College Foundation Inc. of Isabela City', 'type' => 'Private', 'cluster' => 'Isabela City'],

            // Pagadian City HEIs
            ['uiid' => '9043', 'name' => 'Pagadian Capitol College, Inc.', 'type' => 'Private', 'cluster' => 'Pagadian City'],
            ['uiid' => '9074', 'name' => 'Universidad de Zamboanga - Pagadian Branch Inc.', 'type' => 'Private', 'cluster' => 'Pagadian City'],
            ['uiid' => '9076', 'name' => 'Aim High Colleges, Inc.', 'type' => 'Private', 'cluster' => 'Pagadian City'],
            ['uiid' => '9077', 'name' => 'Ave Maria College', 'type' => 'Private', 'cluster' => 'Pagadian City'],
            ['uiid' => '9079', 'name' => 'Hyrons College Philippines, Inc.', 'type' => 'Private', 'cluster' => 'Pagadian City'],
            ['uiid' => '9099', 'name' => 'Zamboanga del Sur Provincial Government College - Pagadian', 'type' => 'LUC', 'cluster' => 'Pagadian City'],
            ['uiid' => '9103', 'name' => 'Pagadian City International College', 'type' => 'Private', 'cluster' => 'Pagadian City'],

            // Zamboanga del Norte HEIs
            ['uiid' => '9005', 'name' => 'Claret College of Isabela', 'type' => 'Private', 'cluster' => 'Zamboanga del Norte'],
            ['uiid' => '9006', 'name' => 'DMC College Foundation, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga del Norte'],
            ['uiid' => '9008', 'name' => 'Dr. Aurelio Mendoza Memorial Colleges', 'type' => 'Private', 'cluster' => 'Zamboanga del Norte'],
            ['uiid' => '9048', 'name' => 'Jose Rizal Memorial State University', 'type' => 'SUC', 'cluster' => 'Zamboanga del Norte'],
            ['uiid' => '9049', 'name' => 'Ebenezer Bible College and Seminary, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga del Norte'],
            ['uiid' => '9050', 'name' => 'St. Mary\'s College of Labason, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga del Norte'],
            ['uiid' => '9051', 'name' => 'J. H. Cerilles State College - Canuto M.S. Enerio Campus', 'type' => 'SUC', 'cluster' => 'Zamboanga del Norte'],
            ['uiid' => '9056', 'name' => 'Colegio de San Francisco Javier of Rizal, Zamboanga del Norte, Incorporated', 'type' => 'Private', 'cluster' => 'Zamboanga del Norte'],
            ['uiid' => 'NEW-Pag', 'name' => 'J. H. Cerilles State College - Pagadian', 'type' => 'SUC', 'cluster' => 'Zamboanga del Norte'],

            // Dipolog City HEIs
            ['uiid' => '9047', 'name' => 'Dipolog City Institute of Technology', 'type' => 'Private', 'cluster' => 'Dipolog City'],

            // Dapitan City HEIs
            ['uiid' => '9019', 'name' => 'Rizal Memorial Institute of Dapitan City, Inc.', 'type' => 'Private', 'cluster' => 'Dapitan City'],

            // Zamboanga Sibugay HEIs
            ['uiid' => '9062', 'name' => 'Universidad de Zamboanga - Ipil', 'type' => 'Private', 'cluster' => 'Zamboanga Sibugay'],
            ['uiid' => '9065', 'name' => 'Medina College Ipil, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga Sibugay'],
            ['uiid' => '9068', 'name' => 'Philippine Technological and Marine Sciences', 'type' => 'Private', 'cluster' => 'Zamboanga Sibugay'],
            ['uiid' => '9070', 'name' => 'Southern Peninsula College, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga Sibugay'],
            ['uiid' => '9071', 'name' => 'Lucan Central Colleges, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga Sibugay'],
            ['uiid' => '9072', 'name' => 'Sibugay Technical Institute Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga Sibugay'],

            // Zamboanga del Sur HEIs
            ['uiid' => '9017', 'name' => 'Philippine Advent College - Sindangan', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9021', 'name' => 'St. John College of Buug Foundation, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9022', 'name' => 'Saint Joseph College of Sindangan Incorporated', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9023', 'name' => 'St. Vincent\'s College Incorporated', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9024', 'name' => 'Saint Estanislao Kostka College, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9026', 'name' => 'Southern Mindanao Colleges Agro-Tech', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9041', 'name' => 'Medina College, Incorporated', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9046', 'name' => 'Aurora Pioneers Memorial College, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9060', 'name' => 'Mindanao State University - Buug Campus', 'type' => 'SUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9085', 'name' => 'Philippine Advent College - Salug Campus', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9087', 'name' => 'Yllana Bay View College, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9089', 'name' => 'Alhadeetha Mindanao College, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9090', 'name' => 'Zamboanga del Sur Provincial Government College - Aurora', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9094', 'name' => 'Southern City Colleges - West Campus', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9096', 'name' => 'Our Lady of Triumph Institute of Technology, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9097', 'name' => 'West Prime Horizon Institute, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9102', 'name' => 'Emmaus College of Theology Foundation, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9104', 'name' => 'Philippine Advent College - Leon B. Postigo Campus', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => '9105', 'name' => 'Zamboanga del Sur Provincial Government College - Dimataling', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => 'NEW-Mar', 'name' => 'Zamboanga del Sur Provincial Government College - Margosatubig', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => 'NEW-Mol', 'name' => 'Zamboanga del Sur Provincial Government College - Molave', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => 'NEW-Tab', 'name' => 'Zamboanga del Sur Provincial Government College - Tabina', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => 'NEW-Mal', 'name' => 'Philippine Malaya College, Inc.', 'type' => 'Private', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => 'NEW-Jos', 'name' => 'Zamboanga del Sur Provincial Government College - Josefina', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => 'NEW-Lap', 'name' => 'Zamboanga del Sur Provincial Government College - Lapuyan', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => 'NEW-Mah', 'name' => 'Zamboanga del Sur Provincial Government College - Mahayag', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => 'NEW-Mid', 'name' => 'Zamboanga del Sur Provincial Government College - Midsalip', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => 'NEW-Ram', 'name' => 'Zamboanga del Sur Provincial Government College - Ramon Magsaysay', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => 'NEW-Tam', 'name' => 'Zamboanga del Sur Provincial Government College - Tambulig', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => 'NEW-Tig', 'name' => 'Zamboanga del Sur Provincial Government College - Tigbao', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => 'NEW-Tuk', 'name' => 'Zamboanga del Sur Provincial Government College - Tukuran', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],
            ['uiid' => 'NEW-Vin', 'name' => 'Zamboanga del Sur Provincial Government College - Vincenzo Sagun', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur'],

            // Basulta HEIs (Combined Basilan, Sulu, and Tawi-Tawi)
            ['uiid' => '9003', 'name' => 'Basilan State College', 'type' => 'SUC', 'cluster' => 'Basulta'],
            ['uiid' => '15002', 'name' => 'Central Sulu College', 'type' => 'Private', 'cluster' => 'Basulta'],
            ['uiid' => '15003', 'name' => 'Hadji Butu School of Arts and Trades', 'type' => 'SUC', 'cluster' => 'Basulta'],
            ['uiid' => '15005', 'name' => 'Lapak Agricultural School', 'type' => 'SUC', 'cluster' => 'Basulta'],
            ['uiid' => '15007', 'name' => 'Mindanao State University - Sulu Development Technical College', 'type' => 'SUC', 'cluster' => 'Basulta'],
            ['uiid' => '15008', 'name' => 'Mindanao State University - Tawi-Tawi College of Technology and Oceonography', 'type' => 'SUC', 'cluster' => 'Basulta'],
            ['uiid' => '15009', 'name' => 'Notre Dame Jolo College', 'type' => 'Private', 'cluster' => 'Basulta'],
            ['uiid' => '15013', 'name' => 'Sulu State College', 'type' => 'SUC', 'cluster' => 'Basulta'],
            ['uiid' => '15014', 'name' => 'Tawi-Tawi Regional Agricultural College', 'type' => 'SUC', 'cluster' => 'Basulta'],
            ['uiid' => '15025', 'name' => 'Southwestern Mindanao Islamic Institute', 'type' => 'Private', 'cluster' => 'Basulta'],
            ['uiid' => '15065', 'name' => 'Sulu College of Technology, Inc.', 'type' => 'Private', 'cluster' => 'Basulta'],
        ];

        foreach ($heis as $hei) {
            DB::table('heis')->insert([
                'uiid' => $hei['uiid'],
                'name' => $hei['name'],
                'type' => $hei['type'],
                'cluster_id' => $clusterMap[$hei['cluster']] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('heis');
    }
};
