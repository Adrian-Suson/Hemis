<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Institution extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'string';

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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($institution) {
            if (self::where('uuid', $institution->uuid)
                ->where('report_year', $institution->report_year)
                ->exists()
            ) {
                throw new \Exception('An institution with the same UUID and report year already exists.');
            }
        });

        static::updating(function ($institution) {
            if (self::where('uuid', $institution->uuid)
                ->where('report_year', $institution->report_year)
                ->where('id', '!=', $institution->id)
                ->exists()
            ) {
                throw new \Exception('An institution with the same UUID and report year already exists.');
            }
        });
    }

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }
}
