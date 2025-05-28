<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LucFormE5 extends Model
{
    protected $table = 'luc_form_e5';

    protected $fillable = [
        'luc_detail_id',
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

    public function lucDetail()
    {
        return $this->belongsTo(LucDetail::class, 'luc_detail_id');
    }
}
