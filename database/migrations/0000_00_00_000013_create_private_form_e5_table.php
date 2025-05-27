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
        Schema::create('private_form_e5', function (Blueprint $table) {
            $table->id();
            $table->string('faculty_name_ln')->nullable();
            $table->string('faculty_name_fn')->nullable();
            $table->string('faculty_name_mi')->nullable();
            $table->string('full_time_part_time_code')->nullable();
            $table->string('gender_code')->nullable();
            $table->string('primary_teaching_discipline_code')->nullable();
            $table->string('highest_degree_attained_code')->nullable();

            // Specific Discipline - Bachelor's Degree
            $table->string('bachelors_program_name')->nullable();
            $table->string('bachelors_program_code')->nullable();

            // Specific Discipline - Master's Degree
            $table->string('masters_program_name')->nullable();
            $table->string('masters_program_code')->nullable();

            // Specific Discipline - Doctorate Degree
            $table->string('doctorate_program_name')->nullable();
            $table->string('doctorate_program_code')->nullable();

            $table->string('professional_license_code')->nullable();
            $table->string('tenure_of_employment_code')->nullable();
            $table->string('faculty_rank_code')->nullable();
            $table->string('teaching_load_code')->nullable();
            $table->text('subjects_taught')->nullable()->comment('please enumerate');
            $table->string('annual_salary_code')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('private_form_e5');
    }
};
