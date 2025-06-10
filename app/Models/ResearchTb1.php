<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearchTb1 extends Model
{
    protected $table = 'research_tb1';

    protected $fillable = [
        'hei_uiid',
        'title_of_article',
        'keywords',
        'authors',
        'name_of_book_journal',
        'editors',
        'vol_no_issue_no',
        'no_of_pages',
        'year_of_publication'
    ];

    public function hei(): BelongsTo
    {
        return $this->belongsTo(Hei::class, 'hei_uiid', 'uiid');
    }
}
