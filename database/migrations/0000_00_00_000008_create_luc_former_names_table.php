<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('luc_former_names', function (Blueprint $table) {
            $table->id();
            $table->foreignId('luc_detail_id') // Foreign key to luc_details table
                ->constrained('luc_details')
                ->onDelete('cascade');
            $table->string('former_name'); // Former name of the institution
            $table->integer('year_used')->nullable(); // Year the name was used
            $table->timestamps();

            // Add indexes for faster queries
            $table->index('luc_detail_id'); // Index for faster lookups and joins
            $table->index('former_name'); // Index for filtering by former name
            $table->index('year_used'); // Index for filtering by year used
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('luc_former_names');
    }
};
