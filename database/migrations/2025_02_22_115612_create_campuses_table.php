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
            $table->string('suc_name');
            $table->string('campus_type');
            $table->string('institutional_code');
            $table->string('region');
            $table->string('municipality_city_province');
            $table->year('year_first_operation');
            $table->decimal('land_area_hectares', 8, 2);
            $table->decimal('distance_from_main', 8, 2);
            $table->string('autonomous_code');
            $table->string('position_title');
            $table->string('head_full_name');
            $table->string('former_name')->nullable();
            $table->decimal('latitude_coordinates', 10, 8);
            $table->decimal('longitude_coordinates', 11, 8);

            // Foreign key linking to the institutions table
            $table->foreignId('institution_id')->constrained('institutions')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('campuses');
    }
}
