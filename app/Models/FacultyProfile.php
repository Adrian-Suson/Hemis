<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FacultyProfile extends Model
{
    use SoftDeletes;

    protected $table = 'faculty_profiles';

    protected $fillable = [
        'institution_id', // Updated to institution_id
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

    public function institution()
    {
        return $this->belongsTo(Institution::class, 'institution_id', 'id'); // Updated to use institution_id
    }

    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }
}
