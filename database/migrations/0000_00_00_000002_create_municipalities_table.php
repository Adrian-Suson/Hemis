<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('municipalities', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Municipality name (e.g., "Como")
            $table->foreignId('province_id')->constrained()->onDelete('cascade'); // Foreign key to provinces
            $table->timestamps();

            // Ensure unique municipality names within a province
            $table->unique(['name', 'province_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('municipalities');
    }
};