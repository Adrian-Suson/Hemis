<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInstitutionsTable extends Migration
{
    public function up()
    {
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('region');
            $table->string('accreditation_status');
            $table->string('institution_code')->nullable();
            $table->string('address_street')->nullable();
            $table->string('municipality_city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('institutional_telephone')->nullable();
            $table->string('institutional_fax')->nullable();
            $table->string('head_telephone')->nullable();
            $table->string('institutional_email')->nullable();
            $table->string('institutional_website')->nullable();
            $table->year('year_established')->nullable();
            $table->string('sec_registration')->nullable();
            $table->year('year_granted_approved')->nullable();
            $table->year('year_converted_college')->nullable();
            $table->year('year_converted_university')->nullable();
            $table->string('head_name')->nullable();
            $table->string('head_title')->nullable();
            $table->string('head_education')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('institutions');
    }
}

