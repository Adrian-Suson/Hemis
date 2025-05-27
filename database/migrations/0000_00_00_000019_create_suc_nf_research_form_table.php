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
        Schema::create('suc_nf_research_form', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->unsignedBigInteger('suc_details_id'); // Foreign key for suc_details table
            $table->foreign('suc_details_id')
                ->references('id')
                ->on('suc_details')
                ->onDelete('cascade'); // Delete research form if associated details are deleted
            $table->string('title_of_article'); // Title of Article
            $table->text('keywords')->nullable(); // Keywords
            $table->string('authors'); // Author(s)
            $table->string('book_or_journal_name'); // Name of Book/Journal
            $table->string('editors')->nullable(); // Editor(s)
            $table->string('volume_or_issue')->nullable(); // Vol. No. / Issue No.
            $table->integer('number_of_pages')->nullable(); // No. of Pages
            $table->year('year_of_publication'); // Year of Publication
            $table->string('type_of_publication'); // Type of Publication
            $table->timestamps(); // Created at and Updated at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suc_nf_research_form');
    }
};