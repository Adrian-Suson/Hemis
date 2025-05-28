<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('luc_details', function (Blueprint $table) {
            $table->id();
            $table->string('hei_uiid', 36);
            $table->foreign('hei_uiid')
                ->references('uiid')
                ->on('heis')
                ->onDelete('cascade');
            $table->string('region', 255)->nullable();
            $table->string('province', 255)->nullable();
            $table->string('municipality', 255)->nullable();
            $table->string('address_street', 255)->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->string('institutional_telephone', 20)->nullable();
            $table->string('institutional_fax', 20)->nullable();
            $table->string('head_telephone', 20)->nullable();
            $table->string('institutional_email', 255)->nullable();
            $table->string('institutional_website', 255)->nullable();
            $table->integer('year_established')->nullable();
            $table->integer('report_year');
            $table->foreign('report_year')
                ->references('year')
                ->on('report_years')
                ->onDelete('cascade');
            $table->string('head_name', 255)->nullable();
            $table->string('head_title', 255)->nullable();
            $table->string('head_education', 255)->nullable();
            $table->string('sec_registration', 255)->nullable();
            $table->integer('year_granted_approved')->nullable();
            $table->integer('year_converted_college')->nullable();
            $table->integer('year_converted_university')->nullable();
            $table->decimal('x_coordinate', 10, 7)->nullable();
            $table->decimal('y_coordinate', 10, 7)->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Add indexes for faster queries
            $table->index('hei_uiid'); // Index for faster lookups and joins
            $table->index('region'); // Index for filtering by region
            $table->index('province'); // Index for filtering by province
            $table->index('municipality'); // Index for filtering by municipality
            $table->index('report_year'); // Index for filtering by report year
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('luc_details');
    }
};
