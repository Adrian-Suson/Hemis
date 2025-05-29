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
        Schema::create('luc_form_e5', function (Blueprint $table) {
            $table->id();
            $table->foreignId('luc_detail_id') // Define the column and foreign key in one step
                ->constrained('luc_details')
                ->onDelete('cascade');
            $table->string('faculty_name')->nullable();
            $table->string('full_time_part_time_code')->nullable();
            $table->string('gender_code')->nullable();
            $table->string('primary_teaching_discipline_code')->nullable();
            $table->string('highest_degree_attained_code')->nullable();
            $table->string('bachelors_program_name')->nullable();
            $table->string('bachelors_program_code')->nullable();
            $table->string('masters_program_name')->nullable();
            $table->string('masters_program_code')->nullable();
            $table->string('doctorate_program_name')->nullable();
            $table->string('doctorate_program_code')->nullable();
            $table->string('professional_license_code')->nullable();
            $table->string('tenure_of_employment_code')->nullable();
            $table->string('faculty_rank_code')->nullable();
            $table->string('teaching_load_code')->nullable();
            $table->text('subjects_taught')->nullable()->comment('please enumerate');
            $table->string('annual_salary_code')->nullable();

            $table->string('faculty_type')->nullable();
            $table->timestamps();

            // Add indexes for faster queries
            $table->index('luc_detail_id'); // Index for faster lookups and joins
            $table->index('faculty_name'); // Index for filtering by faculty name
            $table->index('gender_code'); // Index for filtering by gender
            $table->index('primary_teaching_discipline_code'); // Index for filtering by teaching discipline
            $table->index('highest_degree_attained_code'); // Index for filtering by highest degree
            $table->index('faculty_rank_code'); // Index for filtering by faculty rank
            $table->index('faculty_type'); // Index for filtering by faculty type
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('luc_form_e5');
    }
};
