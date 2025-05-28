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
        Schema::create('private_dean_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('suc_details_id');
            $table->foreignId('private_detail_id')->constrained('private_details')->onDelete('cascade');
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_initial')->nullable();
            $table->string('designation')->nullable();
            $table->string('college_discipline_assignment')->nullable();
            $table->string('baccalaureate_degree')->nullable();
            $table->string('masters_degree')->nullable();
            $table->string('doctorate_degree')->nullable();
            $table->timestamps();

            // Add indexes for faster queries
            $table->index('suc_details_id'); // Index for faster lookups and joins
            $table->index('private_detail_id'); // Index for faster lookups and joins
            $table->index('last_name'); // Index for filtering by last name
            $table->index('first_name'); // Index for filtering by first name
            $table->index('designation'); // Index for filtering by designation
            $table->index('college_discipline_assignment'); // Index for filtering by college discipline assignment
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('private_dean_profiles');
    }
};