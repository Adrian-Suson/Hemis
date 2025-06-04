<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SucFormE2 extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'suc_form_e2';

    protected $fillable = [
        'suc_details_id',
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
        'faculty_type'
    ];

    protected $casts = [
        'is_tenured' => 'string',
        'on_leave_without_pay' => 'integer',
        'pursuing_next_degree' => 'integer',
        'masters_with_thesis' => 'integer',
        'doctorate_with_dissertation' => 'integer',
        'full_time_equivalent' => 'float',
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
        'total_work_load' => 'float'
    ];

    // Relationships
    public function sucDetails()
    {
        return $this->belongsTo(SucDetails::class, 'suc_details_id');
    }

    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }

    // Scopes
    public function scopeFullTime($query)
    {
        return $query->where('faculty_type', 'A1')
            ->orWhere('faculty_type', 'B')
            ->orWhere('faculty_type', 'C1')
            ->orWhere('faculty_type', 'C2')
            ->orWhere('faculty_type', 'C3');
    }

    public function scopePartTime($query)
    {
        return $query->where('faculty_type', 'E');
    }

    public function scopeByYear($query, $year)
    {
        return $query->where('report_year', $year);
    }

    public function scopeBySuc($query, $sucId)
    {
        return $query->where('suc_details_id', $sucId);
    }

    // Accessors & Mutators
    public function getFacultyTypeTextAttribute()
    {
        $types = [
            'A1' => 'GROUP A1: FULL-TIME FACULTY MEMBERS WITH THEIR OWN FACULTY PLANTILLA ITEMS TEACHING AT ELEM, SECONDARY AND TECH/VOC',
            'B' => 'GROUP B: FULL-TIME FACULTY MEMBERS WITH NO PS ITEMS BUT DRAWING SALARIES FROM THE PS ITEMS OF FACULTY ON LEAVE WITHOUT PAY',
            'C1' => 'GROUP C1: FULL-TIME FACULTY MEMBERS WITH NO PS ITEMS DRAWING SALARIES FROM GAA PS LUMP SUMS',
            'C2' => 'GROUP C2: FULL-TIME FACULTY MEMBERS WITH NO PS ITEMS DRAWING SALARIES FROM SUC INCOME',
            'C3' => 'GROUP C3: FULL-TIME FACULTY MEMBERS WITH NO PS ITEMS DRAWING SALARIES FROM LGU FUNDS',
            'E' => 'GROUP E: LECTURERS AND OTHER PART-TIME FACULTY WITH NO ITEMS TEACHING AT ELEMENTARY, SECONDARY OR TECH/VOC LEVELS'
        ];
        return $types[$this->faculty_type] ?? 'Unknown';
    }

    public function getIsTenuredTextAttribute()
    {
        return $this->is_tenured ? 'Yes' : 'No';
    }

    public function getOnLeaveTextAttribute()
    {
        return $this->on_leave_without_pay ? 'Yes' : 'No';
    }

    public function getMastersThesisTextAttribute()
    {
        return $this->masters_with_thesis ? 'Yes' : 'No';
    }

    public function getDoctorateDissertationTextAttribute()
    {
        return $this->doctorate_with_dissertation ? 'Yes' : 'No';
    }
}