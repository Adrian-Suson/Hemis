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
        Schema::create('suc_form_e1', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('suc_details_id');
            $table->foreign('suc_details_id')
                ->references('id')
                ->on('suc_details')
                ->onDelete('cascade'); // Delete research form if associated details are deleted
            $table->string('faculty_name')->nullable();
            $table->string('generic_faculty_rank')->nullable();
            $table->string('home_college')->nullable();
            $table->string('home_dept')->nullable();
            $table->string('is_tenured')->nullable()->comment('Use code');
            $table->string('ssl_salary_grade')->nullable();
            $table->decimal('annual_basic_salary', 10, 2)->nullable();
            $table->string('on_leave_without_pay')->nullable()->comment('Use code');
            $table->string('full_time_equivalent')->nullable();
            $table->string('gender')->nullable()->comment('Use code');
            $table->string('highest_degree_attained')->nullable()->comment('Use 3-digit code');
            $table->string('actively_pursuing_next_degree')->nullable();

            // Specific Disciplines of Primary Teaching Load
            $table->string('primary_teaching_load_discipline_1')->nullable()->comment('Use 6-digit code');
            $table->string('primary_teaching_load_discipline_2')->nullable()->comment('Use 6-digit code');

            // Specific Disciplines of Degrees
            $table->string('bachelors_discipline')->nullable()->comment('Use 6-digit code');
            $table->string('masters_discipline')->nullable()->comment('Use 6-digit code');
            $table->string('doctorate_discipline')->nullable()->comment('Use 6-digit code');

            $table->string('masters_with_thesis')->nullable()->comment('Use code');
            $table->string('doctorate_with_dissertation')->nullable()->comment('Use code');

            // Teaching Hours per Week (Elem & Secondary)
            $table->decimal('lab_hours_elem_sec', 4, 2)->nullable()->comment('Hours per week teaching');
            $table->decimal('lecture_hours_elem_sec', 4, 2)->nullable()->comment('Hours per week teaching');
            $table->decimal('total_teaching_hours_elem_sec', 4, 2)->nullable()->comment('Hours per week teaching');

            // Student Contact Hours (Elem & Secondary)
            $table->decimal('student_lab_contact_hours_elem_sec', 4, 2)->nullable()->comment('Contact hours');
            $table->decimal('student_lecture_contact_hours_elem_sec', 4, 2)->nullable()->comment('Contact hours');
            $table->decimal('total_student_contact_hours_elem_sec', 4, 2)->nullable()->comment('Contact hours');

            // Teaching Hours per Week (Tech/Voc)
            $table->decimal('lab_hours_tech_voc', 4, 2)->nullable()->comment('Hours per week teaching TECH/VOC');
            $table->decimal('lecture_hours_tech_voc', 4, 2)->nullable()->comment('Hours per week teaching TECH/VOC');
            $table->decimal('total_teaching_hours_tech_voc', 4, 2)->nullable()->comment('Hours per week teaching TECH/VOC');

            // Student Contact Hours (Tech/Voc)
            $table->decimal('student_lab_contact_hours_tech_voc', 4, 2)->nullable()->comment('Contact hours TECH/VOC');
            $table->decimal('student_lecture_contact_hours_tech_voc', 4, 2)->nullable()->comment('Contact hours TECH/VOC');
            $table->decimal('total_student_contact_hours_tech_voc', 4, 2)->nullable()->comment('Contact hours TECH/VOC');

            // Official Loads (Credit Units)
            $table->decimal('official_research_load', 4, 2)->nullable()->comment('Credit Units');
            $table->decimal('official_extension_services_load', 4, 2)->nullable()->comment('Credit Units');
            $table->decimal('official_study_load', 4, 2)->nullable()->comment('Credit Units');
            $table->decimal('official_load_for_production', 4, 2)->nullable()->comment('Credit Units');
            $table->decimal('official_administrative_load', 4, 2)->nullable()->comment('Credit Units');
            $table->decimal('other_official_load_credits', 4, 2)->nullable()->comment('Credit Units');
            $table->decimal('total_work_load', 4, 2)->nullable();
            $table->integer('report_year')->nullable();
            $table->foreign('report_year')
                ->references('year')
                ->on('report_years')
                ->onDelete('set null');
            $table->string('faculty_type')->nullable();
            $table->timestamps();

            // Add indexes for faster queries
            $table->index('suc_details_id'); // Index for faster lookups and joins
            $table->index('faculty_name'); // Index for filtering by faculty name
            $table->index('generic_faculty_rank'); // Index for filtering by faculty rank
            $table->index('gender'); // Index for filtering by gender
            $table->index('highest_degree_attained'); // Index for filtering by highest degree
            $table->index('faculty_type'); // Index for filtering by faculty type
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suc_form_e1');
    }
};
