<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SucNfResearchForm extends Model
{
    protected $table = 'suc_nf_research_form';

    protected $fillable = [
        'suc_details_id',
        'title_of_article',
        'keywords',
        'authors',
        'book_or_journal_name',
        'editors',
        'volume_or_issue',
        'number_of_pages',
        'year_of_publication',
        'type_of_publication',
    ];

    protected $casts = [
        'number_of_pages' => 'integer',
        'year_of_publication' => 'integer',
    ];

    public function sucDetail()
    {
        return $this->belongsTo(SucDetail::class, 'suc_details_id');
    }
}
