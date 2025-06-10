<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResearchTbc extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'research_tbc';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'hei_uiid',
        'title',
        'keywords',
        'duration_number_of_hours',
        'number_of_trainees_beneficiaries',
        'citation_title',
        'citation_confering_agency_body',
        'citation_year_received',
        'points'
    ];

    /**
     * Get the HEI that owns the research.
     */
    public function hei()
    {
        return $this->belongsTo(Hei::class, 'hei_uiid', 'uiid');
    }
}