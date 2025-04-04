<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $table = 'curricular_programs'; // Ensure this matches the table name in the migration

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
        'data_date',
        'new_students_freshmen_male',
        'new_students_freshmen_female',
        'first_year_old_male',
        'first_year_old_female',
        'second_year_male',
        'second_year_female',
        'third_year_male',
        'third_year_female',
        'fourth_year_male',
        'fourth_year_female',
        'fifth_year_male',
        'fifth_year_female',
        'sixth_year_male',
        'sixth_year_female',
        'seventh_year_male',
        'seventh_year_female',
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
