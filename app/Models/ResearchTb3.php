<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearchTb3 extends Model
{
    protected $table = 'research_tb3';

    protected $fillable = [
        'hei_uiid',
        'inventions',
        'patent_number',
        'date_of_issue',
        'utilization_development',
        'utilization_service',
        'utilization_end_product',
        'name_of_commercial_product',
        'points_invention',
        'points_commercial'
    ];

    public function hei(): BelongsTo
    {
        return $this->belongsTo(Hei::class, 'hei_uiid', 'uiid');
    }
}