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
        Schema::create('research_tb3', function (Blueprint $table) {
            $table->id();
            $table->string('hei_uiid', 36);
            $table->foreign('hei_uiid')->references('uiid')->on('heis');
            $table->text('inventions');
            $table->string('patent_number');
            $table->string('date_of_issue')->nullable();
            $table->string('utilization_development')->nullable();
            $table->string('utilization_service')->nullable();
            $table->text('name_of_commercial_product')->nullable();
            $table->string('points')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research_tb3');
    }
};