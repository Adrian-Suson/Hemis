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
            $table->string('region', 255)->nullable();
            $table->string('province_municipality', 255)->nullable();
            $table->integer('year_first_operation')->nullable();
            $table->decimal('land_area_hectares', 10, 2)->nullable();
            $table->decimal('distance_from_main', 10, 2)->nullable();
            $table->string('autonomous_code', 255)->nullable();
            $table->string('position_title', 255)->nullable();
            $table->string('head_full_name', 255)->nullable();
            $table->string('former_name', 255)->nullable();
            $table->decimal('latitude_coordinates', 9, 6)->nullable();
            $table->decimal('longitude_coordinates', 9, 6)->nullable();
            $table->integer('report_year')->nullable(); // Updated to reference report_years.year
            $table->foreign('report_year')
                ->references('year')
                ->on('report_years')
                ->onDelete('set null');
            $table->unsignedBigInteger('institution_id'); // Changed to reference institution id
            $table->foreign('institution_id')
                ->references('id')
                ->on('institutions')
                ->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes(); // added soft delete support
        });
    }

    public function down()
    {
        Schema::dropIfExists('campuses');
    }
}
