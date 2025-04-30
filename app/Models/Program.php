<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $table = 'curricular_programs';

    protected $fillable = [
        'institution_id',
        'program_name',
        'program_code',
        'major_name',
        'major_code',
        'category',
        'serial',
        'Year',
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
        'data_date',
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
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }
}
