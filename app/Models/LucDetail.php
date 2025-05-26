<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LucDetail extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'luc_details';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
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
        'year_converted_university',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'year_established' => 'integer',
        'report_year' => 'integer',
        'year_granted_approved' => 'integer',
        'year_converted_college' => 'integer',
        'year_converted_university' => 'integer',
    ];

    /**
     * Get the HEI associated with the LUC detail.
     */
    public function hei()
    {
        return $this->belongsTo(Hei::class, 'institution_uiid', 'uiid');
    }
}
