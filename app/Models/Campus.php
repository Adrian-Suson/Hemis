<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // added import

class Campus extends Model
{
    use SoftDeletes; // added soft delete support

    protected $fillable = [
        'suc_name',
        'campus_type',
        'institutional_code',
        'region',                   // updated field name
        'province/municipality',    // combined field for province and municipality
        'year_first_operation',
        'land_area_hectares',
        'distance_from_main',
        'autonomous_code',
        'position_title',
        'head_full_name',
        'former_name',
        'latitude_coordinates',
        'longitude_coordinates',
        'institution_id',
        'report_year',
    ];

    // Relationship with Institution
    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }
}
