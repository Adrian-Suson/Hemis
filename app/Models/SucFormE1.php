<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SucFormE1 extends Model
{
    protected $table = 'suc_form_e1';

    protected $fillable = [
        'suc_details_id',
        'faculty_name_ln',
        'faculty_name_fn',
        'faculty_name_mi',
        'generic_faculty_rank',
        'home_college',
        'home_dept',
        'is_tenured',
        'ssl_salary_grade',
        'annual_basic_salary',
        'on_leave_without_pay',
        'full_time_equivalent',
        'gender',
        'highest_degree_attained',
        'actively_pursuing_next_degree',
        'primary_teaching_load_discipline_1',
        'primary_teaching_load_discipline_2',
        'bachelors_discipline',
        'masters_discipline',
        'doctorate_discipline',
        'masters_with_thesis',
        'doctorate_with_dissertation',
        'lab_hours_elem_sec',
        'lecture_hours_elem_sec',
        'total_teaching_hours_elem_sec',
        'student_lab_contact_hours_elem_sec',
        'student_lecture_contact_hours_elem_sec',
        'total_student_contact_hours_elem_sec',
        'lab_hours_tech_voc',
        'lecture_hours_tech_voc',
        'total_teaching_hours_tech_voc',
        'student_lab_contact_hours_tech_voc',
        'student_lecture_contact_hours_tech_voc',
        'total_student_contact_hours_tech_voc',
        'official_research_load',
        'official_extension_services_load',
        'official_study_load',
        'official_load_for_production',
        'official_administrative_load',
        'other_official_load_credits',
        'total_work_load',
    ];

    protected $casts = [
        'annual_basic_salary' => 'decimal:2',
        'lab_hours_elem_sec' => 'decimal:2',
        'lecture_hours_elem_sec' => 'decimal:2',
        'total_teaching_hours_elem_sec' => 'decimal:2',
        'student_lab_contact_hours_elem_sec' => 'decimal:2',
        'student_lecture_contact_hours_elem_sec' => 'decimal:2',
        'total_student_contact_hours_elem_sec' => 'decimal:2',
        'lab_hours_tech_voc' => 'decimal:2',
        'lecture_hours_tech_voc' => 'decimal:2',
        'total_teaching_hours_tech_voc' => 'decimal:2',
        'student_lab_contact_hours_tech_voc' => 'decimal:2',
        'student_lecture_contact_hours_tech_voc' => 'decimal:2',
        'total_student_contact_hours_tech_voc' => 'decimal:2',
        'official_research_load' => 'decimal:2',
        'official_extension_services_load' => 'decimal:2',
        'official_study_load' => 'decimal:2',
        'official_load_for_production' => 'decimal:2',
        'official_administrative_load' => 'decimal:2',
        'other_official_load_credits' => 'decimal:2',
        'total_work_load' => 'decimal:2',
    ];

    public function sucDetail()
    {
        return $this->belongsTo(SucDetail::class, 'suc_details_id');
    }
}
