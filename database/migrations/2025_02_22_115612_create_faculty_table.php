<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacultyTable extends Migration
{
    public function up()
    {
        Schema::create('faculty', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('campus_id')->constrained('campuses')->onDelete('cascade');
            $table->string('title');
            $table->string('education_level');
            $table->boolean('is_autonomous');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('faculty');
    }
}
