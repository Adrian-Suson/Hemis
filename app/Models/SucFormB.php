<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SucFormB extends Model
{
    use SoftDeletes;

    protected $table = 'suc_form_b';

    protected $fillable = [
        'suc_details_id',
        'program_name',
        'program_code',
        'major_name',
        'major_code',
        'aop_category',
        'aop_serial',
        'aop_year',
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
        'funded_grantees',
        'report_year',
    ];

    protected $casts = [
        'program_code' => 'integer',
        'major_code' => 'integer',
        'program_normal_length_in_years' => 'integer',
        'lab_units' => 'integer',
        'lecture_units' => 'integer',
        'total_units' => 'integer',
        'tuition_per_unit' => 'decimal:2',
        'program_fee' => 'decimal:2',
        'new_students_freshmen_male' => 'integer',
        'new_students_freshmen_female' => 'integer',
        '1st_year_male' => 'integer',
        '1st_year_female' => 'integer',
        '2nd_year_male' => 'integer',
        '2nd_year_female' => 'integer',
        '3rd_year_male' => 'integer',
        '3rd_year_female' => 'integer',
        '4th_year_male' => 'integer',
        '4th_year_female' => 'integer',
        '5th_year_male' => 'integer',
        '5th_year_female' => 'integer',
        '6th_year_male' => 'integer',
        '6th_year_female' => 'integer',
        '7th_year_male' => 'integer',
        '7th_year_female' => 'integer',
        'subtotal_male' => 'integer',
        'subtotal_female' => 'integer',
        'grand_total' => 'integer',
        'lecture_units_actual' => 'integer',
        'laboratory_units_actual' => 'integer',
        'total_units_actual' => 'integer',
        'graduates_males' => 'integer',
        'graduates_females' => 'integer',
        'graduates_total' => 'integer',
        'externally_funded_merit_scholars' => 'integer',
        'internally_funded_grantees' => 'integer',
        'funded_grantees' => 'integer',
        'report_year' => 'integer',
    ];

    public function sucDetail()
    {
        return $this->belongsTo(SucDetail::class, 'suc_details_id');
    }

    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }
}
