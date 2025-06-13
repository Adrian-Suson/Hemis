<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up()
    {
        Schema::create('provinces', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Province name (e.g., "Milan")
            $table->foreignId('region_id')->constrained()->onDelete('cascade'); // Foreign key to regions
            $table->timestamps();

            // Ensure unique province names within a region
            $table->unique(['name', 'region_id']);
        });

        // Get Region 9 ID
        $region = DB::table('regions')->where('name', 'Zamboanga Peninsula')->first();
        if (!$region) {
            throw new \Exception("Region 'Zamboanga Peninsula' not found in the regions table.");
        }

        // Provinces for Region 9
        $provinces = [
            'Zamboanga del Norte',
            'Zamboanga del Sur',
            'Zamboanga Sibugay',
            'Basilan',
            'Sulu',
            'Tawi-Tawi',
        ];

        // Insert provinces
        foreach ($provinces as $provinceName) {
            DB::table('provinces')->insert([
                'name' => $provinceName,
                'region_id' => $region->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down()
    {
        Schema::dropIfExists('provinces');
    }
};
