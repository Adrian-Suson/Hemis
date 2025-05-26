<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HeiDetail extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'institution_uiid',
        'region',
        'province',
        'municipality',
        'address_street',
        'postal_code',
        'institutional_telephone',
        'institutional_fax',
        'head_telephone',
        'institutional_email',
        'institutional_website',
        'year_established',
        'report_year',
        'head_name',
        'head_title',
        'head_education',
        'institution_type',
        'sec_registration',
        'year_granted_approved',
        'year_converted_college',
        'year_converted_university'
    ];

    public function hei(): BelongsTo
    {
        return $this->belongsTo(Hei::class, 'institution_uiid', 'uiid');
    }
}
