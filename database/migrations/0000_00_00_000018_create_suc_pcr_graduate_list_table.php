<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('suc_pcr_graduate_list', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->foreign('suc_details_id')
                ->references('id')
                ->on('suc_details')
                ->onDelete('cascade'); // Delete research form if associated details are deleted
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
        Schema::dropIfExists('suc_pcr_graduate_list');
    }
};
