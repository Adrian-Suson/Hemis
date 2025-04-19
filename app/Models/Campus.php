<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campus extends Model
{
    protected $fillable = [
        'suc_name',
        'campus_type',
        'institutional_code',
        'region',
        'municipality_city_province',
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
        'created_at',
        'updated_at',
    ];

    // Define the relationship with Institution
    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }
}
