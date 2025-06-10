<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearchTb4 extends Model
{
    protected $table = 'research_tb4';

    protected $fillable = [
        'hei_uiid',
        'keywords',
        'researchers',
        'citing_authors',
        'citing_article_title',
        'journal_title',
        'vol_issue_page_no',
        'city_year_published',
        'publisher_name'
    ];

    public function hei(): BelongsTo
    {
        return $this->belongsTo(Hei::class, 'hei_uiid', 'uiid');
    }
}
