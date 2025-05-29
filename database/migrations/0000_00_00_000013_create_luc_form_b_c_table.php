<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('luc_form_b_c', function (Blueprint $table) {
            $table->id();
            $table->foreignId('luc_detail_id') // Define the column and foreign key in one step
                ->constrained('luc_details')
                ->onDelete('cascade');
            $table->string('program_name')->nullable();
            $table->string('program_code')->nullable();
            $table->string('major_name')->nullable();
            $table->string('major_code')->nullable();
            $table->integer('with_thesis_dissertation')->nullable()->comment('1 - Yes, 2 - No');
            $table->integer('code')->nullable();
            $table->integer('year_implemented')->nullable()->comment('Year Implemented (if PO/DO)');
            $table->string('aop_category')->nullable();
            $table->string('aop_serial')->nullable();
            $table->integer('aop_year')->nullable();
            $table->text('remarks')->nullable();
            $table->string('program_mode_code')->nullable();
            $table->string('program_mode_program')->nullable()->comment('if OT');
            $table->integer('normal_length_years')->nullable();
            $table->integer('program_credit_units')->nullable();
            $table->decimal('tuition_per_unit_peso', 10, 2)->nullable();
            $table->decimal('program_fee_peso', 10, 2)->nullable();

            // Enrollment - 1st Semester/1st Trimester/Term
            $table->integer('enrollment_new_students_m')->nullable();
            $table->integer('enrollment_new_students_f')->nullable();
            $table->integer('enrollment_1st_year_m')->nullable();
            $table->integer('enrollment_1st_year_f')->nullable();
            $table->integer('enrollment_2nd_year_m')->nullable();
            $table->integer('enrollment_2nd_year_f')->nullable();
            $table->integer('enrollment_3rd_year_m')->nullable();
            $table->integer('enrollment_3rd_year_f')->nullable();
            $table->integer('enrollment_4th_year_m')->nullable();
            $table->integer('enrollment_4th_year_f')->nullable();
            $table->integer('enrollment_5th_year_m')->nullable();
            $table->integer('enrollment_5th_year_f')->nullable();
            $table->integer('enrollment_6th_year_m')->nullable();
            $table->integer('enrollment_6th_year_f')->nullable();
            $table->integer('enrollment_7th_year_m')->nullable();
            $table->integer('enrollment_7th_year_f')->nullable();
            $table->integer('enrollment_sub_total_m')->nullable();
            $table->integer('enrollment_sub_total_f')->nullable();
            $table->integer('enrollment_total')->nullable();

            // Graduates - Total of 1st, 2nd Sem/Term & Summer
            $table->integer('graduates_m')->nullable();
            $table->integer('graduates_f')->nullable();
            $table->integer('graduates_total')->nullable();

            $table->integer('program_type')->nullable();
            $table->timestamps();

            // Add indexes for faster queries
            $table->index('luc_detail_id'); // Index for faster lookups and joins
            $table->index('program_name'); // Index for filtering by program name
            $table->index('program_code'); // Index for filtering by program code
            $table->index('year_implemented'); // Index for filtering by year implemented
            $table->index('aop_year'); // Index for filtering by authority to offer year
            $table->index('program_type'); // Index for filtering by program type
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('luc_form_b_c');
    }
};
