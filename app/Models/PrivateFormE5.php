<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrivateFormE5 extends Model
{
    protected $table = 'private_form_e5';

    protected $fillable = [
        'private_detail_id',
        'faculty_name',
        'full_time_part_time_code',
        'gender_code',
        'primary_teaching_discipline_code',
        'highest_degree_attained_code',
        'bachelors_program_name',
        'bachelors_program_code',
        'masters_program_name',
        'masters_program_code',
        'doctorate_program_name',
        'doctorate_program_code',
        'professional_license_code',
        'tenure_of_employment_code',
        'faculty_rank_code',
        'teaching_load_code',
        'subjects_taught',
        'annual_salary_code',
    ];

    public function privateDetail()
    {
        return $this->belongsTo(PrivateDetail::class, 'private_detail_id');
    }
}
