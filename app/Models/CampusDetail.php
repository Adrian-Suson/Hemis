<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampusDetail extends Model
{
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'institution_name',
        'street',
        'municipality_city',
        'province',
        'region',
        'postal_code',
        'telephone',
        'fax',
        'head_telephone',
        'email',
        'website',
        'year_established',
        'sec_registration',
        'year_granted',
        'year_college_status',
        'year_university_status',
        'head_name',
        'head_title',
        'head_education',
        'seq_no',
        'campus_name',
        'main_or_satellite',
        'year_first_operation',
        'land_area_hectares',
        'distance_from_main',
        'autonomous_status',
        'campus_official_title',
        'campus_official_name',
        'former_campus_name',
        'latitude',
        'longitude'
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class, 'code', 'code');
    }
}
