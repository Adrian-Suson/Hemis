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
        Schema::create('research_tb4', function (Blueprint $table) {
            $table->id();
            $table->string('hei_uiid', 36);
            $table->foreign('hei_uiid')->references('uiid')->on('heis');
            $table->text('keywords')->nullable();
            $table->text('researchers')->nullable();
            $table->text('citing_authors');
            $table->text('citing_article_title');
            $table->text('journal_title')->nullable();
            $table->string('vol_issue_page_no')->nullable();
            $table->string('city_year_published')->nullable();
            $table->string('publisher_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research_tb4');
    }
};