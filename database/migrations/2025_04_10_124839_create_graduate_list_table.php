<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('graduates_list', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->unsignedBigInteger('institution_id'); // Changed to reference institution id
            $table->foreign('institution_id')
                ->references('id')
                ->on('institutions')
                ->onDelete('cascade'); // Foreign key to institutions table
            $table->string('student_id')->unique(); // Unique student ID
            $table->date('date_of_birth'); // Date of birth
            $table->string('last_name'); // Last name
            $table->string('first_name'); // First name
            $table->string('middle_name')->nullable(); // Middle name (optional)
            $table->enum('sex', ['M', 'F']); // Sex (M/F)
            $table->date('date_graduated')->nullable(); // Date graduated (optional)
            $table->string('program_name'); // Program name
            $table->string('program_major')->nullable(); // Program major (optional)
            $table->string('program_authority_to_operate_graduate')->nullable(); // Program authority (optional)
            $table->integer('year_granted')->nullable(); // Year granted (optional)
            $table->integer('report_year'); // Changed to integer to reference report_years.year
            $table->foreign('report_year')
                ->references('year')
                ->on('report_years')
                ->onDelete('cascade'); // Foreign key to report_years table
            $table->timestamps(); // Created_at and updated_at timestamps
            $table->softDeletes(); // added soft delete support
        });
    }

    public function down()
    {
        Schema::dropIfExists('graduates_list');
    }
};
