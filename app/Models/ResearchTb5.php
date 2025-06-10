<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearchTb5 extends Model
{
    protected $table = 'research_tb5';

    protected $fillable = [
        'hei_uiid',
        'name_of_researcher',
        'title_of_research_output_award',
        'year_published_accepted_presented_received',
        'publisher_conference_organizer_confering_body'
    ];

    public function hei(): BelongsTo
    {
        return $this->belongsTo(Hei::class, 'hei_uiid', 'uiid');
    }
}
