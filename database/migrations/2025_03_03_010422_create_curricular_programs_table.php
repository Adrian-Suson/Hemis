<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('curricular_programs', function (Blueprint $table) {
            $table->id();
            $table->string('institution_uuid', 255); // Changed to string to reference uuid
            $table->date('data_date');
            $table->string('program_name', 255)->notNullable();
            $table->integer('program_code')->nullable();
            $table->string('major_name', 255)->nullable();
            $table->integer('major_code')->nullable();
            $table->string('category', 100)->nullable();
            $table->string('serial', 255)->nullable();
            $table->string('Year', 255)->nullable();
            $table->string('is_thesis_dissertation_required', 255)->nullable();
            $table->string('program_status', 255)->nullable();
            $table->string('calendar_use_code', 255)->nullable();
            $table->integer('program_normal_length_in_years')->nullable();
            $table->integer('lab_units')->nullable();
            $table->integer('lecture_units')->nullable();
            $table->integer('total_units')->nullable();
            $table->decimal('tuition_per_unit', 10, 2)->nullable();
            $table->decimal('program_fee', 10, 2)->nullable();
            $table->string('program_type', 255)->nullable();

            // Enrollment-related columns
            $table->integer('new_students_freshmen_male')->nullable();
            $table->integer('new_students_freshmen_female')->nullable();
            $table->unsignedInteger('1st_year_male')->nullable();
            $table->unsignedInteger('1st_year_female')->nullable();
            $table->unsignedInteger('2nd_year_male')->nullable();
            $table->unsignedInteger('2nd_year_female')->nullable();
            $table->unsignedInteger('3rd_year_male')->nullable();
            $table->unsignedInteger('3rd_year_female')->nullable();
            $table->unsignedInteger('4th_year_male')->nullable();
            $table->unsignedInteger('4th_year_female')->nullable();
            $table->unsignedInteger('5th_year_male')->nullable();
            $table->unsignedInteger('5th_year_female')->nullable();
            $table->unsignedInteger('6th_year_male')->nullable();
            $table->unsignedInteger('6th_year_female')->nullable();
            $table->unsignedInteger('7th_year_male')->nullable();
            $table->unsignedInteger('7th_year_female')->nullable();
            $table->integer('subtotal_male')->nullable();
            $table->integer('subtotal_female')->nullable();
            $table->integer('grand_total')->nullable();

            // Program statistics-related columns
            $table->integer('lecture_units_actual')->nullable();
            $table->integer('laboratory_units_actual')->nullable();
            $table->integer('total_units_actual')->nullable();
            $table->integer('graduates_males')->nullable();
            $table->integer('graduates_females')->nullable();
            $table->integer('graduates_total')->nullable();
            $table->integer('externally_funded_merit_scholars')->nullable();
            $table->integer('internally_funded_grantees')->nullable();
            $table->integer('suc_funded_grantees')->nullable();

            $table->foreign('institution_uuid')->references('uuid')->on('institutions')->onDelete('cascade');
            $table->integer('report_year')->nullable(); // Updated to reference report_years.year
            $table->foreign('report_year')
                ->references('year')
                ->on('report_years')
                ->onDelete('set null');
            $table->timestamps();
            $table->softDeletes(); // added soft delete support
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('curricular_programs');
    }
};
