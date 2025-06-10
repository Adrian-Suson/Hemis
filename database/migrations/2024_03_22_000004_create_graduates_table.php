<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('graduates', function (Blueprint $table) {
            $table->id();
            $table->string('student_id', 50)->unique();
            $table->date('date_of_birth');
            $table->string('last_name', 100);
            $table->string('first_name', 100);
            $table->string('middle_name', 100)->nullable();
            $table->enum('sex', ['M', 'F']);
            $table->date('date_graduated');
            $table->string('program_name', 255);
            $table->string('program_major', 255)->nullable();
            $table->string('authority_number', 255)->nullable();
            $table->integer('year_granted')->nullable();
            $table->timestamps();

            $table->index('student_id');
            $table->index('last_name');
            $table->index('first_name');
            $table->index('date_graduated');
            $table->index('program_name');
            $table->index('year_granted');
            $table->index('sex');
        });
    }

    public function down()
    {
        Schema::dropIfExists('graduates');
    }
};