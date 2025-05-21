<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CurricularProgram extends Model
{
    use SoftDeletes;


    protected $fillable = [
        'institution_id',
        'program_name',
        'program_code',
        'major_name',
        'major_code',
        'category',
        'serial',
        'year',
        'is_thesis_dissertation_required',
        'program_status',
        'calendar_use_code',
        'program_normal_length_in_years',
        'lab_units',
        'lecture_units',
        'total_units',
        'tuition_per_unit',
        'program_fee',
        'program_type',
        'new_students_freshmen_male',
        'new_students_freshmen_female',
        '1st_year_male',
        '1st_year_female',
        '2nd_year_male',
        '2nd_year_female',
        '3rd_year_male',
        '3rd_year_female',
        '4th_year_male',
        '4th_year_female',
        '5th_year_male',
        '5th_year_female',
        '6th_year_male',
        '6th_year_female',
        '7th_year_male',
        '7th_year_female',
        'subtotal_male',
        'subtotal_female',
        'grand_total',
        'lecture_units_actual',
        'laboratory_units_actual',
        'total_units_actual',
        'graduates_males',
        'graduates_females',
        'graduates_total',
        'externally_funded_merit_scholars',
        'internally_funded_grantees',
        'suc_funded_grantees',
        'report_year',
    ];

    protected $casts = [
        'tuition_per_unit' => 'decimal:2',
        'program_fee' => 'decimal:2',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class, 'institution_id', 'id'); // Updated to use institution_id
    }

    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }
}