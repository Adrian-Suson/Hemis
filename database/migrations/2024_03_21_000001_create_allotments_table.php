<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('suc_allotments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('suc_details_id')->constrained('suc_details')->onDelete('cascade');
            $table->string('function_name', 100);
            $table->decimal('fund_101_ps', 15, 2)->default(0);
            $table->decimal('fund_101_mooe', 15, 2)->default(0);
            $table->decimal('fund_101_co', 15, 2)->default(0);
            $table->decimal('fund_101_total', 15, 2)->default(0);
            $table->decimal('fund_164_ps', 15, 2)->default(0);
            $table->decimal('fund_164_mooe', 15, 2)->default(0);
            $table->decimal('fund_164_co', 15, 2)->default(0);
            $table->decimal('fund_164_total', 15, 2)->default(0);
            $table->decimal('total_ps', 15, 2)->default(0);
            $table->decimal('total_mooe', 15, 2)->default(0);
            $table->decimal('total_co', 15, 2)->default(0);
            $table->decimal('total_allot', 15, 2)->default(0);
            $table->integer('report_year');
            $table->foreign('report_year')
                ->references('year')
                ->on('report_years')
                ->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            // Add indexes for faster queries
            $table->index('suc_details_id');
            $table->index('campus');
            $table->index('function_name');
            $table->index('report_year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suc_allotments');
    }
}; 