<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            // Foreign keys for region, province, municipality
            $table->string('uuid', length: 255); // Changed from foreign key to a regular string column
            $table->foreignId('region_id')->constrained('regions')->onDelete('restrict');
            $table->foreignId('province_id')->nullable()->constrained('provinces')->onDelete('set null');
            $table->foreignId('municipality_id')->nullable()->constrained('municipalities')->onDelete('set null');
            $table->string('name', 255)->notNullable();
            $table->string('address_street', 255)->nullable();
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
            $table->integer('report_year')->nullable(); // added column for yearly report
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('institutions');
    }
};
