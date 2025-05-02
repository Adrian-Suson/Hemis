<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Institution extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'region_id', // updated foreign key instead of string 'region'
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
        'province_id',      // added foreign key for province
        'municipality_id',  // added foreign key for municipality
    ];

    // Define the relationship with Region
    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    // Define the relationship with Province
    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    // Define the relationship with Municipality
    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    // Optionally, define the relationship with Campus
    public function campuses()
    {
        return $this->hasMany(Campus::class);
    }
}
