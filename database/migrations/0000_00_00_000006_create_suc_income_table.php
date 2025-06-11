<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('suc_income', function (Blueprint $table) {
            $table->id();
            $table->foreignId('suc_details_id')->constrained('suc_details')->onDelete('cascade');
            $table->string('income_category', 100);
            $table->decimal('tuition_fees', 15, 2)->default(0);
            $table->decimal('miscellaneous_fees', 15, 2)->default(0);
            $table->decimal('other_income', 15, 2)->default(0);
            $table->decimal('total_income', 15, 2)->default(0);
            $table->integer('report_year');
            $table->foreign('report_year')
                ->references('year')
                ->on('report_years')
                ->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            // Add indexes for faster queries
            $table->index('suc_details_id');
            $table->index('income_category');
            $table->index('report_year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suc_income');
    }
};