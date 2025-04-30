<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('provinces', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Province name (e.g., "Milan")
            $table->foreignId('region_id')->constrained()->onDelete('cascade'); // Foreign key to regions
            $table->timestamps();

            // Ensure unique province names within a region
            $table->unique(['name', 'region_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('provinces');
    }
};