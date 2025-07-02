<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SucDetails extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'hei_uiid',
        'region',
        'province',
        'municipality',
        'address_street',
        'postal_code',
        'institutional_telephone',
        'institutional_fax',
        'head_telephone',
        'institutional_email',
        'institutional_website',
        'year_established',
        'report_year',
        'head_name',
        'head_title',
        'head_education',
        'sec_registration',
        'year_granted_approved',
        'year_converted_college',
        'year_converted_university'
    ];

    protected $casts = [
        'year_established' => 'integer',
        'report_year' => 'integer',
        'year_granted_approved' => 'integer',
        'year_converted_college' => 'integer',
        'year_converted_university' => 'integer'
    ];

    protected $appends = ['total_students'];

    // Relationships
    public function hei()
    {
        return $this->belongsTo(Hei::class, 'hei_uiid', 'uiid');
    }

    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }

    public function allotments()
    {
        return $this->hasMany(Allotment::class, 'suc_details_id');
    }

    public function expenditures()
    {
        return $this->hasMany(Expenditure::class, 'suc_details_id');
    }

    public function incomes()
    {
        return $this->hasMany(Income::class, 'suc_details_id');
    }

    public function formBs()
    {
        return $this->hasMany(SucFormB::class, 'suc_details_id');
    }

    public function getTotalStudentsAttribute()
    {
        // Sums the grand_total field from all related SucFormB records
        return $this->formBs()->sum('grand_total');
    }
} 