<?php

use App\Models\Program;

class CurricularProgramsExport {

    protected $category;

    public function __construct($category)
    {
        $this->category = $category;
    }

    public function getData()
    {
        // Fetch data from your model (e.g., Eloquent)
        $programs = Program::where('program_type', $this->category)->with('enrollments', 'statistics')->get();
        $data = [];

        foreach ($programs as $program) {
            $enrollment = $program->enrollments->first() ?: new stdClass();
            $stats = $program->statistics ?: new stdClass();
            $data[] = [
                $program->program_name ?: "N/A",
                $program->program_code ?: "0",
                $program->major_name ?: "N/A",
                $program->major_code ?: "0",
                $program->category ?: "N/A",
                $program->serial ?: "N/A",
                $program->year ?: "N/A",
                "BR No.", // Placeholder
                $program->is_thesis_dissertation_required ?: "N/A",
                $program->program_status ?: "N/A",
                $program->calendar_use_code ?: "2",
                $program->program_normal_length_in_years ?: 0,
                $program->total_units ?: 0,
                $program->lab_units ?: 0,
                $program->lecture_units ?: 0,
                $program->total_units ?: 0,
                $program->tuition_per_unit ?: 0,
                $program->program_fee ?: 0,
                ($enrollment->new_students_freshmen_male ?? 0) + ($enrollment->new_students_freshmen_female ?? 0),
                $enrollment->first_year_old_male ?? 0,
                $enrollment->first_year_old_female ?? 0,
                $enrollment->second_year_male ?? 0,
                $enrollment->second_year_female ?? 0,
                $enrollment->third_year_male ?? 0,
                $enrollment->third_year_female ?? 0,
                $enrollment->fourth_year_male ?? 0,
                $enrollment->fourth_year_female ?? 0,
                $enrollment->fifth_year_male ?? 0,
                $enrollment->fifth_year_female ?? 0,
                $enrollment->sixth_year_male ?? 0,
                $enrollment->sixth_year_female ?? 0,
                $enrollment->seventh_year_male ?? 0,
                $enrollment->seventh_year_female ?? 0,
                ($enrollment->subtotal_male ?? 0) + ($enrollment->subtotal_female ?? 0),
                $enrollment->grand_total ?? 0,
                $stats->total_units_actual ?? 0,
                ($stats->graduates_males ?? 0) + ($stats->graduates_females ?? 0),
                $stats->externally_funded_merit_scholars ?? 0,
                $stats->internally_funded_grantees ?? 0,
                $stats->suc_funded_grantees ?? 0,
            ];
        }
        return $data;
    }
}
