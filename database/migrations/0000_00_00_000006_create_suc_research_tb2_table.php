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
        Schema::create('research_tb2', function (Blueprint $table) {
            $table->id();
            $table->string('hei_uiid', 36);
            $table->foreign('hei_uiid')->references('uiid')->on('heis');
            $table->text('title_of_research_paper');
            $table->text('keywords')->nullable();
            $table->text('researchers');
            $table->text('conference_title')->nullable();
            $table->string('conference_venue')->nullable();
            $table->string('conference_date')->nullable();
            $table->string('conference_organizer')->nullable();
            $table->string('type_of_conference')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research_tb2');
    }
};