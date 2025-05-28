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
        Schema::create('luc_prc_graduate_list', function (Blueprint $table) {
            $table->id();
            $table->foreignId('luc_detail_id') // Define the column and foreign key in one step
                ->constrained('luc_details')
                ->onDelete('cascade');
            $table->string('student_id')->unique();

            // Personal Information
            $table->date('date_of_birth');
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->enum('sex', ['M', 'F', 'Male', 'Female'])->nullable();

            // Graduation Information
            $table->date('date_graduated')->nullable();

            // Program Information
            $table->string('program_name');
            $table->string('program_major');

            // PRC License Information
            $table->string('authority_number')->nullable();
            $table->year('year_granted')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Add indexes for faster queries
            $table->index('luc_detail_id'); // Index for faster lookups and joins
            $table->index('last_name'); // Index for filtering by last name
            $table->index('first_name'); // Index for filtering by first name
            $table->index('sex'); // Index for filtering by gender
            $table->index('program_name'); // Index for filtering by program name
            $table->index('year_granted'); // Index for filtering by year granted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('luc_prc_graduate_list');
    }
};