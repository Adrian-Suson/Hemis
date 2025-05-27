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
        Schema::create('Private_prc_graduate_list', function (Blueprint $table) {
            $table->id();

            // Student Identification
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
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Private_prc_graduate_list');
    }
};
