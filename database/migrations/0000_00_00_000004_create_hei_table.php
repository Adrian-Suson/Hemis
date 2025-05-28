<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('heis', function (Blueprint $table) {
            $table->string('uiid', 36)->primary(); // Define uiid as a string with a length of 36
            $table->string('name', 255)->notNullable();
            $table->enum('type', ['SUC', 'LUC', 'Private'])->notNullable();
            $table->timestamps();
            $table->softDeletes();

            // Add indexes for faster queries
            $table->index('name'); // Index for searching by name
            $table->index('type'); // Index for filtering by type
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('heis');
    }
};