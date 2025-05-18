<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campus extends Model
{
    use SoftDeletes;

    protected $table = 'campuses';

    protected $fillable = [
        'suc_name',
        'campus_type',
        'institutional_code',
        'region',
        'province_municipality',
        'year_first_operation',
        'land_area_hectares',
        'distance_from_main',
        'autonomous_code',
        'position_title',
        'head_full_name',
        'former_name',
        'latitude_coordinates',
        'longitude_coordinates',
        'report_year',
        'institution_id', // Updated to institution_id
    ];

    protected $casts = [
        'land_area_hectares' => 'decimal:2',
        'distance_from_main' => 'decimal:2',
        'latitude_coordinates' => 'decimal:6',
        'longitude_coordinates' => 'decimal:6',
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
