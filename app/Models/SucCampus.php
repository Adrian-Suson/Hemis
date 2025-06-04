<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SucCampus extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'suc_campuses';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'suc_details_id',
        'name',
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
    ];

    /**
     * Define the relationship with the SucDetail model.
     */
    public function sucDetail()
    {
        return $this->belongsTo(SucDetails::class, 'suc_details_id');
    }

    /**
     * Define the relationship with the ReportYear model.
     */
    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }
}