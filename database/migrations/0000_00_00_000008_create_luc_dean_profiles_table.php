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
        Schema::create('luc_dean_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('luc_detail_id') // Define the column and foreign key in one step
                ->constrained('luc_details')
                ->onDelete('cascade');
            $table->string('name');
            $table->string('designation')->nullable();
            $table->string('college_discipline_assignment')->nullable();
            $table->string('baccalaureate_degree')->nullable();
            $table->string('masters_degree')->nullable();
            $table->string('doctorate_degree')->nullable();
            $table->timestamps();

            // Add indexes for faster queries
            $table->index('luc_detail_id'); // Index for faster lookups and joins
            $table->index('name'); // Index for filtering by last name
            $table->index('designation'); // Index for filtering by designation
            $table->index('college_discipline_assignment'); // Index for filtering by college discipline assignment
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('luc_dean_profiles');
    }
};