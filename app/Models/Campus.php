<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campus extends Model
{
    protected $fillable = [
        'suc_name',
        'campus_type',
        'institutional_code',
        'region_id',      // updated to use foreign key
        'province_id',    // added foreign key for province
        'municipality_id',// added foreign key for municipality
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
    ];

    // Relationship with Institution
    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    // Relationship with Region
    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    // Relationship with Province
    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    // Relationship with Municipality
    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }
}
