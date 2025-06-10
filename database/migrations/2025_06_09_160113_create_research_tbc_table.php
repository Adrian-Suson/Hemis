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
        Schema::create('research_tbc', function (Blueprint $table) {
            $table->id();
            $table->string('hei_uiid', 36);
            $table->foreign('hei_uiid')->references('uiid')->on('heis');
            $table->text('title');
            $table->text('keywords')->nullable();
            $table->string('duration_number_of_hours');
            $table->string('number_of_trainees_beneficiaries');
            $table->text('citation_title')->nullable();
            $table->text('citation_confering_agency_body')->nullable();
            $table->string('citation_year_received')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research_tbc');
    }
};