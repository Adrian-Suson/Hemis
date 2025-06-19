<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SucFormE1 extends Model
{
    protected $table = 'suc_form_e1';

    protected $fillable = [
        'suc_details_id',
        'faculty_name',
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
        'faculty_type',
        'report_year',
    ];

    protected $casts = [
        'suc_details_id' => 'integer',
        'is_tenured' => 'string',
        'on_leave_without_pay' => 'string',
        'full_time_equivalent' => 'float',
        'actively_pursuing_next_degree' => 'string',
        'masters_with_thesis' => 'string',
        'doctorate_with_dissertation' => 'string',
        'lab_hours_elem_sec' => 'float',
        'lecture_hours_elem_sec' => 'float',
        'total_teaching_hours_elem_sec' => 'float',
        'student_lab_contact_hours_elem_sec' => 'float',
        'student_lecture_contact_hours_elem_sec' => 'float',
        'total_student_contact_hours_elem_sec' => 'float',
        'lab_hours_tech_voc' => 'float',
        'lecture_hours_tech_voc' => 'float',
        'total_teaching_hours_tech_voc' => 'float',
        'student_lab_contact_hours_tech_voc' => 'float',
        'student_lecture_contact_hours_tech_voc' => 'float',
        'total_student_contact_hours_tech_voc' => 'float',
        'official_research_load' => 'float',
        'official_extension_services_load' => 'float',
        'official_study_load' => 'float',
        'official_load_for_production' => 'float',
        'official_administrative_load' => 'float',
        'other_official_load_credits' => 'float',
        'total_work_load' => 'float',
        'faculty_type' => 'string',
        'report_year' => 'integer',
        'annual_basic_salary' => 'float',
        'ssl_salary_grade' => 'integer',
    ];

    /**
     * Relationship with SucDetail model.
     */
    public function sucDetail()
    {
        return $this->belongsTo(SucDetails::class, 'suc_details_id');
    }

    /**
     * Scope for filtering by faculty type.
     */
    public function scopeByFacultyType($query, $type)
    {
        return $query->where('faculty_type', $type);
    }

    /**
     * Scope for filtering by gender.
     */
    public function scopeByGender($query, $gender)
    {
        return $query->where('gender', $gender);
    }

    /**
     * Scope for filtering by highest degree attained.
     */
    public function scopeByHighestDegree($query, $degree)
    {
        return $query->where('highest_degree_attained', $degree);
    }

    /**
     * Scope for filtering by report year.
     */
    public function scopeByReportYear($query, $year)
    {
        return $query->where('report_year', $year);
    }

    /**
     * Scope for filtering by tenure status.
     */
    public function scopeByTenureStatus($query, $status)
    {
        return $query->where('is_tenured', $status);
    }

    /**
     * Scope for filtering by leave status.
     */
    public function scopeByLeaveStatus($query, $status)
    {
        return $query->where('on_leave_without_pay', $status);
    }
}