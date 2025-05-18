<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Institution extends Model
{
    use SoftDeletes;

    protected $table = 'institutions';

    protected $fillable = [
        'uuid',
        'region_id',
        'province_id',
        'municipality_id',
        'name',
        'address_street',
        'postal_code',
        'institutional_telephone',
        'institutional_fax',
        'head_telephone',
        'institutional_email',
        'institutional_website',
        'year_established',
        'sec_registration',
        'year_granted_approved',
        'year_converted_college',
        'year_converted_university',
        'head_name',
        'head_title',
        'head_education',
        'institution_type',
        'report_year',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class, 'region_id');
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id');
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class, 'municipality_id');
    }

    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }

    public function facultyProfiles()
    {
        return $this->hasMany(FacultyProfile::class, 'institution_id', 'id'); // Updated to use institution_id
    }

    public function users()
    {
        return $this->hasMany(User::class, 'institution_id', 'id'); // Updated to use institution_id
    }

    public function curricularPrograms()
    {
        return $this->hasMany(CurricularProgram::class, 'institution_id', 'id'); // Updated to use institution_id
    }

    public function graduates()
    {
        return $this->hasMany(Graduate::class, 'institution_id', 'id'); // Updated to use institution_id
    }

    public function campuses()
    {
        return $this->hasMany(Campus::class, 'institution_id', 'id'); // Updated to use institution_id
    }
}
