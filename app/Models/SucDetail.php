<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SucDetail extends Model
{
    use SoftDeletes;

    protected $table = 'suc_details';

    protected $fillable = [
        'institution_uiid',
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
        'year_converted_university',
    ];

    protected $casts = [
        'year_established' => 'integer',
        'report_year' => 'integer',
        'year_granted_approved' => 'integer',
        'year_converted_college' => 'integer',
        'year_converted_university' => 'integer',
    ];

    public function hei()
    {
        return $this->belongsTo(Hei::class, 'institution_uiid', 'uiid');
    }

    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }

    public function pcrGraduates()
    {
        return $this->hasMany(SucPcrGraduate::class, 'suc_details_id');
    }

    public function researchForms()
    {
        return $this->hasMany(SucNfResearchForm::class, 'suc_details_id');
    }

    public function formE2s()
    {
        return $this->hasMany(SucFormE2::class, 'suc_details_id');
    }

    public function formE1s()
    {
        return $this->hasMany(SucFormE1::class, 'suc_details_id');
    }

    public function campuses()
    {
        return $this->hasMany(Campus::class, 'suc_details_id');
    }

    public function formBs()
    {
        return $this->hasMany(SucFormB::class, 'suc_details_id');
    }
}
