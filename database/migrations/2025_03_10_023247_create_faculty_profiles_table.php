<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacultyProfilesTable extends Migration
{
    public function up()
    {
        // Create faculty_profiles table with institution relationship
        Schema::create('faculty_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('institution_uuid', 255)
                ->nullable(); // Changed to string to reference uuid
            $table->foreign('institution_uuid')
                ->references('uuid')
                ->on('institutions')
                ->onDelete('cascade'); // Links to institutions table

            $table->string('data_date'); // Added date column to track when data was recorded
            $table->string('faculty_group')->nullable(); // New column for faculty groups (A1, A2, A3, B, C1, C2, C3, D, E)
            $table->string('name')->nullable(); // NAME OF FACULTY (A2)
            $table->integer('generic_faculty_rank')->nullable(); // GENERIC FACULTY RANK (A3)
            $table->string('home_college')->nullable(); // HOME COLLEGE (A4)
            $table->string('home_department')->nullable(); // HOME DEPT (A5)
            $table->boolean('is_tenured')->nullable(); // IS FACULTY MEMBER TENURED? (A6)
            $table->integer('ssl_salary_grade')->nullable(); // SSL SALARY GRADE (A7)
            $table->integer('annual_basic_salary')->nullable(); // ANNUAL BASIC SALARY (A8)
            $table->integer('on_leave_without_pay')->nullable(); // ON LEAVE WITHOUT PAY? (A9)
            $table->float('full_time_equivalent')->nullable(); // FULL-TIME EQUIVALENT (A10)
            $table->integer('gender')->nullable(); // GENDER OF FACULTY (A11)

            // Education
            $table->integer('highest_degree_attained')->nullable(); // HIGHEST DEGREE ATTAINED (B1)
            $table->integer('pursuing_next_degree')->nullable(); // ACTIVELY PURSUING NEXT DEGREE? (B2)
            $table->string('discipline_teaching_load_1')->nullable(); // SPECIFIC DISCIPLINE (1) (B3)
            $table->string('discipline_teaching_load_2')->nullable(); // SPECIFIC DISCIPLINE (2) (B4)
            $table->string('discipline_bachelors')->nullable(); // SPECIFIC DISCIPLINE OF BACHELORS (B5)
            $table->string('discipline_masters')->nullable(); // SPECIFIC DISCIPLINE OF MASTERS (B6)
            $table->string('discipline_doctorate')->nullable(); // SPECIFIC DISCIPLINE OF DOCTORATE (B7)
            $table->integer('masters_with_thesis')->nullable(); // MASTERS DEGREE WITH THESIS? (B8)
            $table->integer('doctorate_with_dissertation')->nullable(); // DOCTORATE WITH DISSERTATION? (B9)

            // Undergraduate Teaching Load
            $table->float('undergrad_lab_credit_units')->nullable(); // LAB CREDIT UNITS Undergrad (C1)
            $table->float('undergrad_lecture_credit_units')->nullable(); // LECTURE CREDIT UNITS Undergrad (C2)
            $table->float('undergrad_total_credit_units')->nullable(); // TOTAL TEACHING CREDIT UNITS Undergrad (C3)
            $table->float('undergrad_lab_hours_per_week')->nullable(); // LAB HOURS PER WEEK Undergrad (C4)
            $table->float('undergrad_lecture_hours_per_week')->nullable(); // LECTURE HOURS PER WEEK Undergrad (C5)
            $table->float('undergrad_total_hours_per_week')->nullable(); // TOTAL TEACHING HOURS PER WEEK Undergrad (C6)
            $table->float('undergrad_lab_contact_hours')->nullable(); // Student Contact Hours Lab Undergrad (C7)
            $table->float('undergrad_lecture_contact_hours')->nullable(); // Student Contact Hours Lecture Undergrad (C8)
            $table->float('undergrad_total_contact_hours')->nullable(); // STUDENT CONTACT-HOURS Undergrad (C9)

            // Graduate Teaching Load
            $table->float('graduate_lab_credit_units')->nullable(); // LAB CREDIT UNITS Graduate (D1)
            $table->float('graduate_lecture_credit_units')->nullable(); // LECTURE CREDIT UNITS Graduate (D2)
            $table->float('graduate_total_credit_units')->nullable(); // TOTAL TEACHING CREDIT UNITS Graduate (D3)
            $table->float('graduate_lab_contact_hours')->nullable(); // Student ContactHrs LAB Graduate (D7)
            $table->float('graduate_lecture_contact_hours')->nullable(); // Student ContactHrs LECTURE Graduate (D8)
            $table->float('graduate_total_contact_hours')->nullable(); // Student ContactHrs GRADUATE (D9)

            // Other Loads
            $table->float('research_load')->nullable(); // OFFICIAL RESEARCH LOAD (E1)
            $table->float('extension_services_load')->nullable(); // Official EXTENSION SERVICES LOAD (E2)
            $table->float('study_load')->nullable(); // OFFICIAL STUDY LOAD (E3)
            $table->float('production_load')->nullable(); // OFFICIAL LOAD FOR PRODUCTION (E4)
            $table->float('administrative_load')->nullable(); // OFFICIAL ADMINISTRATIVE LOAD (E5)
            $table->float('other_load_credits')->nullable(); // OTHER OFFICIAL LOAD CREDITS (E6)
            $table->float('total_work_load')->nullable(); // TOTAL WORK LOAD (E7)

            $table->integer('report_year')->nullable(); // Updated to reference report_years.year
            $table->foreign('report_year')
                ->references('year')
                ->on('report_years')
                ->onDelete('set null');
            $table->timestamps();
            $table->softDeletes(); // added soft delete support
        });
    }

    public function down()
    {
        Schema::dropIfExists('faculty_profiles');
    }
}
