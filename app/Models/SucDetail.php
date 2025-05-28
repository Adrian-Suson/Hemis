<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SucDetail extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'suc_details';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'hei_uiid',
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
        'sec_registration',
        'year_granted_approved',
        'year_converted_college',
        'year_converted_university',
    ];

    /**
     * Get the HEI associated with the SUC detail.
     */
    public function hei()
    {
        return $this->belongsTo(Hei::class, 'hei_uiid', 'uiid');
    }

    /**
     * Get the report year associated with the SUC detail.
     */
    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }
}