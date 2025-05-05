<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCampusesTable extends Migration
{
    public function up()
    {
        Schema::create('campuses', function (Blueprint $table) {
            $table->id();
            $table->string('suc_name', 255)->nullable();
            $table->string('campus_type', 255)->nullable();
            $table->string('institutional_code', 255)->nullable();
            // Foreign key for region (nullable)
            $table->foreignId('region_id')->nullable()->constrained('regions')->onDelete('set null');
            // Remove separate province -> merged with municipality:
            $table->foreignId('municipality_id')->nullable()->constrained('municipalities')->onDelete('set null');
            $table->integer('year_first_operation')->nullable();
            $table->decimal('land_area_hectares', 10, 2)->nullable();
            $table->decimal('distance_from_main', 10, 2)->nullable();
            $table->string('autonomous_code', 255)->nullable();
            $table->string('position_title', 255)->nullable();
            $table->string('head_full_name', 255)->nullable();
            $table->string('former_name', 255)->nullable();
            $table->decimal('latitude_coordinates', 9, 6)->nullable();
            $table->decimal('longitude_coordinates', 9, 6)->nullable();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('campuses');
    }
}