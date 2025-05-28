<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('suc_details', function (Blueprint $table) {
            $table->id();
            $table->string('institution_uiid', 36);
            $table->foreign('institution_uiid')
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
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suc_details');
    }
};
