<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clusters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('regionID')
                ->nullable()
                ->constrained('regions', 'id')
                ->onDelete('set null')
                ->onUpdate('cascade');
            $table->string('name');
            $table->timestamps();
        });

        // Insert clusters for Region 9
        $clusters = [
            ['regionID' => 9, 'name' => 'Zamboanga City'],
            ['regionID' => 9, 'name' => 'Isabela City'],
            ['regionID' => 9, 'name' => 'Pagadian City'],
            ['regionID' => 9, 'name' => 'Zamboanga del Sur'],
            ['regionID' => 9, 'name' => 'Zamboanga del Norte'],
            ['regionID' => 9, 'name' => 'Dipolog City'],
            ['regionID' => 9, 'name' => 'Dapitan City'],
            ['regionID' => 9, 'name' => 'Zamboanga Sibugay'],
            ['regionID' => 9, 'name' => 'Basulta'],
        ];

        foreach ($clusters as $cluster) {
            DB::table('clusters')->insert([
                'regionID' => $cluster['regionID'],
                'name' => $cluster['name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clusters');
    }
};
