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
        Schema::create('report_years', function (Blueprint $table) {
            $table->integer('year')->primary();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert report years from 2000 to current year
        $currentYear = now()->year;
        for ($year = 2000; $year <= $currentYear; $year++) {
            DB::table('report_years')->insert([
                'year' => $year,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_years');
    }
};
