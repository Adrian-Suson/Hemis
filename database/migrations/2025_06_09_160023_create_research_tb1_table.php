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
        Schema::create('research_tb1', function (Blueprint $table) {
            $table->id();
            $table->string('hei_uiid', 36);
            $table->foreign('hei_uiid')->references('uiid')->on('heis');
            $table->text('title_of_article');
            $table->text('keywords')->nullable();
            $table->text('authors');
            $table->text('name_of_book_journal');
            $table->string('editors')->nullable();
            $table->string('vol_no_issue_no')->nullable();
            $table->string('no_of_pages')->nullable();
            $table->string('year_of_publication')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('research_tb1');
    }
};