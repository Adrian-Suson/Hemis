<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255)->notNullable();
            $table->unsignedBigInteger('region_id')->notNullable();
            $table->string('address_street', 255)->nullable();
            $table->string('municipality_city', 255)->nullable();
            $table->string('province', 255)->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->string('institutional_telephone', 20)->nullable();
            $table->string('institutional_fax', 20)->nullable();
            $table->string('head_telephone', 20)->nullable();
            $table->string('institutional_email', 255)->nullable();
            $table->string('institutional_website', 255)->nullable();
            $table->integer('year_established')->nullable();
            $table->string('sec_registration', 255)->nullable();
            $table->integer('year_granted_approved')->nullable();
            $table->integer('year_converted_college')->nullable();
            $table->integer('year_converted_university')->nullable();
            $table->string('head_name', 255)->nullable();
            $table->string('head_title', 255)->nullable();
            $table->string('head_education', 255)->nullable();
            $table->string('institution_type', 255)->nullable();
            $table->timestamps();

            $table->foreign('region_id')->references('id')->on('regions')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('institutions');
    }
};
