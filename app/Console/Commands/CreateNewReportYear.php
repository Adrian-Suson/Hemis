<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ReportYear;

class CreateNewReportYear extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'report-year:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically create a new report year if it does not exist';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $currentYear = now()->year;

        // Check if the current year already exists
        if (!ReportYear::where('year', $currentYear)->exists()) {
            // Create the new report year
            ReportYear::create(['year' => $currentYear]);
            $this->info("Report year {$currentYear} created successfully.");
        } else {
            $this->info("Report year {$currentYear} already exists.");
        }
    }
}
