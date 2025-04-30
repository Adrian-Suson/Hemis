<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('regions', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('name')->unique(); // Region name (e.g., "Lombardy")
            $table->timestamps(); // Created_at and updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regions');
    }
};
