<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('heis', function (Blueprint $table) {
            $table->string('uiid', 36)->primary();
            $table->string('name', 255)->notNullable();
            $table->enum('type', ['SUC', 'LUC', 'Private'])->notNullable();
            $table->unsignedBigInteger('cluster_id')->nullable();
            $table->enum('status', ['open', 'close'])->default('open');
            $table->enum('campus_type', ['Main', 'Extension'])->default('Main');
            $table->string('parent_uiid', 36)->nullable(); // New column to link Extension to Main
            $table->timestamps();
            $table->softDeletes();

            $table->index('name');
            $table->index('type');
            $table->index('cluster_id');
            $table->index('parent_uiid'); // Index for faster queries on parent_uiid

            // Foreign key constraint for cluster_id
            $table->foreign('cluster_id')
                ->references('id')
                ->on('clusters')
                ->onDelete('set null');

            // Foreign key constraint for parent_uiid
            $table->foreign('parent_uiid')
                ->references('uiid')
                ->on('heis')
                ->onDelete('set null');
        });

        $clusters = DB::table('clusters')->get();
        $clusterMap = [];
        foreach ($clusters as $cluster) {
            $clusterMap[$cluster->name] = $cluster->id;
        }

        $heis = [
            // SUC Examples
            ['uiid' => 'SUC001', 'name' => 'Western Mindanao State University', 'type' => 'SUC', 'cluster' => 'Zamboanga City', 'status' => 'open', 'campus_type' => 'Main', 'parent_uiid' => null],
            ['uiid' => 'SUC002', 'name' => 'Zamboanga Peninsula Polytechnic State University', 'type' => 'SUC', 'cluster' => 'Zamboanga City', 'status' => 'open', 'campus_type' => 'Main', 'parent_uiid' => null],
            ['uiid' => 'SUC003', 'name' => 'Jose Rizal Memorial State University', 'type' => 'SUC', 'cluster' => 'Zamboanga del Norte', 'status' => 'open', 'campus_type' => 'Main', 'parent_uiid' => null],
            ['uiid' => 'SUC004', 'name' => 'Mindanao State University - Buug Campus', 'type' => 'SUC', 'cluster' => 'Zamboanga del Sur', 'status' => 'open', 'campus_type' => 'Extension', 'parent_uiid' => 'SUC005'], // Linked to Basilan State College
            ['uiid' => 'SUC005', 'name' => 'Basilan State College', 'type' => 'SUC', 'cluster' => 'Basulta', 'status' => 'open', 'campus_type' => 'Main', 'parent_uiid' => null],

            // LUC Examples
            ['uiid' => 'LUC001', 'name' => 'Zamboanga del Sur Provincial Government College', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur', 'status' => 'open', 'campus_type' => 'Main', 'parent_uiid' => null],
            ['uiid' => 'LUC002', 'name' => 'Zamboanga del Sur Provincial Government College - Molave', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur', 'status' => 'open', 'campus_type' => 'Extension', 'parent_uiid' => 'LUC001'], // Linked to Zamboanga del Sur Provincial Government College
            ['uiid' => 'LUC003', 'name' => 'Pagadian City Government College', 'type' => 'LUC', 'cluster' => 'Pagadian City', 'status' => 'open', 'campus_type' => 'Main', 'parent_uiid' => null],
            ['uiid' => 'LUC004', 'name' => 'Zamboanga del Sur Provincial Government College - Tabina', 'type' => 'LUC', 'cluster' => 'Zamboanga del Sur', 'status' => 'open', 'campus_type' => 'Extension', 'parent_uiid' => 'LUC001'], // Linked to Zamboanga del Sur Provincial Government College
            ['uiid' => 'LUC005', 'name' => 'Zamboanga City Local College', 'type' => 'LUC', 'cluster' => 'Zamboanga City', 'status' => 'open', 'campus_type' => 'Main', 'parent_uiid' => null],

            // Private Examples
            ['uiid' => 'PRV001', 'name' => 'Ateneo de Zamboanga University', 'type' => 'Private', 'cluster' => 'Zamboanga City', 'status' => 'open', 'campus_type' => 'Main', 'parent_uiid' => null],
            ['uiid' => 'PRV002', 'name' => 'Universidad de Zamboanga', 'type' => 'Private', 'cluster' => 'Zamboanga City', 'status' => 'open', 'campus_type' => 'Main', 'parent_uiid' => null],
            ['uiid' => 'PRV003', 'name' => 'Universidad de Zamboanga - Pagadian Branch Inc.', 'type' => 'Private', 'cluster' => 'Pagadian City', 'status' => 'open', 'campus_type' => 'Extension', 'parent_uiid' => 'PRV002'], // Linked to Universidad de Zamboanga
            ['uiid' => 'PRV004', 'name' => 'AMA Computer College - Zamboanga', 'type' => 'Private', 'cluster' => 'Zamboanga City', 'status' => 'open', 'campus_type' => 'Extension', 'parent_uiid' => 'PRV001'], // Linked to Ateneo de Zamboanga University (example linkage)
            ['uiid' => 'PRV005', 'name' => 'Notre Dame Jolo College', 'type' => 'Private', 'cluster' => 'Basulta', 'status' => 'open', 'campus_type' => 'Main', 'parent_uiid' => null],
        ];

        // 1. Insert all main campuses first
        foreach ($heis as $hei) {
            if ($hei['campus_type'] === 'Main') {
                DB::table('heis')->insert([
                    'uiid' => $hei['uiid'],
                    'name' => $hei['name'],
                    'type' => $hei['type'],
                    'cluster_id' => $clusterMap[$hei['cluster']] ?? null,
                    'status' => $hei['status'],
                    'campus_type' => $hei['campus_type'],
                    'parent_uiid' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 2. Insert all extension campuses
        foreach ($heis as $hei) {
            if ($hei['campus_type'] === 'Extension') {
                DB::table('heis')->insert([
                    'uiid' => $hei['uiid'],
                    'name' => $hei['name'],
                    'type' => $hei['type'],
                    'cluster_id' => $clusterMap[$hei['cluster']] ?? null,
                    'status' => $hei['status'],
                    'campus_type' => $hei['campus_type'],
                    'parent_uiid' => $hei['parent_uiid'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('heis');
    }
};