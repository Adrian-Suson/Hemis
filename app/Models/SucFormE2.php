<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SucFormE2 extends Model
{
    use SoftDeletes;

    protected $table = 'faculty_profiles';

    protected $fillable = [
        'suc_details_id',
        'faculty_group',
        'name',
        'generic_faculty_rank',
        'home_college',
        'home_department',
        'is_tenured',
        'ssl_salary_grade',
        'annual_basic_salary',
        'on_leave_without_pay',
        'full_time_equivalent',
        'gender',
        'highest_degree_attained',
        'pursuing_next_degree',
        'discipline_teaching_load_1',
        'discipline_teaching_load_2',
        'discipline_bachelors',
        'discipline_masters',
        'discipline_doctorate',
        'masters_with_thesis',
        'doctorate_with_dissertation',
        'undergrad_lab_credit_units',
        'undergrad_lecture_credit_units',
        'undergrad_total_credit_units',
        'undergrad_lab_hours_per_week',
        'undergrad_lecture_hours_per_week',
        'undergrad_total_hours_per_week',
        'undergrad_lab_contact_hours',
        'undergrad_lecture_contact_hours',
        'undergrad_total_contact_hours',
        'graduate_lab_credit_units',
        'graduate_lecture_credit_units',
        'graduate_total_credit_units',
        'graduate_lab_contact_hours',
        'graduate_lecture_contact_hours',
        'graduate_total_contact_hours',
        'research_load',
        'extension_services_load',
        'study_load',
        'production_load',
        'administrative_load',
        'other_load_credits',
        'total_work_load',
        'report_year',
    ];

    protected $casts = [
        'generic_faculty_rank' => 'integer',
        'ssl_salary_grade' => 'integer',
        'annual_basic_salary' => 'integer',
        'on_leave_without_pay' => 'integer',
        'full_time_equivalent' => 'float',
        'gender' => 'integer',
        'highest_degree_attained' => 'integer',
        'pursuing_next_degree' => 'integer',
        'masters_with_thesis' => 'integer',
        'doctorate_with_dissertation' => 'integer',
        'undergrad_lab_credit_units' => 'float',
        'undergrad_lecture_credit_units' => 'float',
        'undergrad_total_credit_units' => 'float',
        'undergrad_lab_hours_per_week' => 'float',
        'undergrad_lecture_hours_per_week' => 'float',
        'undergrad_total_hours_per_week' => 'float',
        'undergrad_lab_contact_hours' => 'float',
        'undergrad_lecture_contact_hours' => 'float',
        'undergrad_total_contact_hours' => 'float',
        'graduate_lab_credit_units' => 'float',
        'graduate_lecture_credit_units' => 'float',
        'graduate_total_credit_units' => 'float',
        'graduate_lab_contact_hours' => 'float',
        'graduate_lecture_contact_hours' => 'float',
        'graduate_total_contact_hours' => 'float',
        'research_load' => 'float',
        'extension_services_load' => 'float',
        'study_load' => 'float',
        'production_load' => 'float',
        'administrative_load' => 'float',
        'other_load_credits' => 'float',
        'total_work_load' => 'float',
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
