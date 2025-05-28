<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSucCampusesTable extends Migration
{
    public function up()
    {
        Schema::create('suc_campuses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('suc_details_id');
            $table->foreign('suc_details_id')
                ->references('id')
                ->on('suc_details')
                ->onDelete('cascade');
            $table->string('name', 255)->nullable();
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
            $table->timestamps();
            $table->softDeletes(); // added soft delete support

            // Add indexes for faster queries
            $table->index('suc_details_id'); // Index for faster lookups and joins
            $table->index('name'); // Index for filtering by campus name
            $table->index('region'); // Index for filtering by region
            $table->index('province_municipality'); // Index for filtering by province or municipality
            $table->index('year_first_operation'); // Index for filtering by year of first operation
            $table->index('report_year'); // Index for filtering by report year
        });
    }

    public function down()
    {
        Schema::dropIfExists('suc_campuses');
    }
}
