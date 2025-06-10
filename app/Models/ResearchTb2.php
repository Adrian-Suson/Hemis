<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearchTb2 extends Model
{
    protected $table = 'research_tb2';

    protected $fillable = [
        'hei_uiid',
        'title_of_research_paper',
        'keywords',
        'researchers',
        'conference_title',
        'conference_venue',
        'conference_date',
        'conference_organizer',
        'type_of_conference',
        'points'
    ];

    public function hei(): BelongsTo
    {
        return $this->belongsTo(Hei::class, 'hei_uiid', 'uiid');
    }
}