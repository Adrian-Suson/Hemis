<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('institution_id');
            $table->string('program_name', 255)->notNullable();
            $table->integer('program_code')->nullable();
            $table->string('major_name', 255)->nullable();
            $table->integer('major_code')->nullable();
            $table->string('category', 100)->nullable();
            $table->integer('serial')->nullable();
            $table->integer('year')->nullable();
            $table->enum('is_thesis_dissertation_required', ['1', '2', '3'])->nullable();
            $table->enum('program_status', ['1', '2', '3', '4'])->nullable();
            $table->enum('calendar_use_code', ['1', '2', '3'])->nullable();
            $table->integer('program_normal_length_in_years')->nullable();
            $table->decimal('lab_units', 5, 2)->nullable();
            $table->decimal('lecture_units', 5, 2)->nullable();
            $table->decimal('total_units', 5, 2)->nullable();
            $table->decimal('tuition_per_unit', 10, 2)->nullable();
            $table->decimal('program_fee', 10, 2)->nullable();
            $table->string ('program_type', 255)->nullable();
            $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('program_id');
            $table->integer('new_students_freshmen_male')->nullable(); // New Students (Freshmen) - Male
            $table->integer('new_students_freshmen_female')->nullable(); // New Students (Freshmen) - Female
            $table->integer('first_year_old_male')->nullable(); // 1st Year (Old First Year) - Male
            $table->integer('first_year_old_female')->nullable(); // 1st Year (Old First Year) - Female
            $table->integer('second_year_male')->nullable(); // 2nd Year - Male
            $table->integer('second_year_female')->nullable(); // 2nd Year - Female
            $table->integer('third_year_male')->nullable(); // 3rd Year - Male
            $table->integer('third_year_female')->nullable(); // 3rd Year - Female
            $table->integer('fourth_year_male')->nullable(); // 4th Year - Male
            $table->integer('fourth_year_female')->nullable(); // 4th Year - Female
            $table->integer('fifth_year_male')->nullable(); // 5th Year - Male
            $table->integer('fifth_year_female')->nullable(); // 5th Year - Female
            $table->integer('sixth_year_male')->nullable(); // 6th Year - Male
            $table->integer('sixth_year_female')->nullable(); // 6th Year - Female
            $table->integer('seventh_year_male')->nullable(); // 7th Year - Male
            $table->integer('seventh_year_female')->nullable(); // 7th Year - Female
            $table->integer('subtotal_male')->nullable(); // Sub-Total - Male
            $table->integer('subtotal_female')->nullable(); // Sub-Total - Female
            $table->integer('grand_total')->nullable(); // TOTAL
            $table->foreign('program_id')->references('id')->on('programs')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('program_statistics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('program_id');
            $table->integer('lecture_units_actual')->nullable(); // Lecture Units (Actual Enrolled Units 1st Sem)
            $table->integer('laboratory_units_actual' )->nullable(); // Laboratory Units (Actual Enrolled Units 1st Sem)
            $table->integer('total_units_actual')->nullable(); // Total (Actual Enrolled Units 1st Sem)
            $table->integer('graduates_males')->nullable(); // Graduates 2023/24 (Sem1+Sem2+Summ+ER) - Males
            $table->integer('graduates_females')->nullable(); // Graduates 2023/24 (Sem1+Sem2+Summ+ER) - Females
            $table->integer('graduates_total')->nullable(); // Graduates 2023/24 (Sem1+Sem2+Summ+ER) - Total
            $table->integer('externally_funded_merit_scholars')->nullable(); // No. of Externally-Funded Merit Scholars 1st Sem
            $table->integer('internally_funded_grantees')->nullable(); // No. of Internally Funded Grantees 1st Sem
            $table->integer('suc_funded_grantees')->nullable(); // SUC-Funded Grantees
            $table->foreign('program_id')->references('id')->on('programs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_statistics');
        Schema::dropIfExists('enrollments');
        Schema::dropIfExists('programs');
    }
};
