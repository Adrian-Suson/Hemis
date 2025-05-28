<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LucDetail extends Model
{
    use SoftDeletes;

    protected $table = 'luc_details';

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
        'x_coordinate',
        'y_coordinate',
    ];

    protected $casts = [
        'year_established' => 'integer',
        'report_year' => 'integer',
        'year_granted_approved' => 'integer',
        'year_converted_college' => 'integer',
        'year_converted_university' => 'integer',
        'x_coordinate' => 'decimal:7',
        'y_coordinate' => 'decimal:7',
    ];

    public function hei()
    {
        return $this->belongsTo(Hei::class, 'institution_uiid', 'uiid');
    }

    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }

    public function prcGraduates()
    {
        return $this->hasMany(LucPrcGraduate::class, 'luc_detail_id');
    }

    public function formBCs()
    {
        return $this->hasMany(LucFormBC::class, 'luc_detail_id');
    }

    public function deanProfiles()
    {
        return $this->hasMany(LucDeanProfile::class, 'luc_detail_id');
    }

    public function formE5s()
    {
        return $this->hasMany(LucFormE5::class, 'luc_detail_id');
    }
}
