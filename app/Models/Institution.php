<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Institution extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
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

    public function parent()
    {
        return $this->belongsTo(Institution::class, 'parent_code', 'code');
    }

    public function satellites()
    {
        return $this->hasMany(Institution::class, 'parent_code', 'code');
    }

    public function campusDetails()
    {
        return $this->hasOne(CampusDetail::class, 'code', 'code');
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
