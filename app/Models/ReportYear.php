<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportYear extends Model
{

    protected $table = 'report_years';

    protected $fillable = [
        'year',
    ];

    // No relationships defined, as this table is referenced by others
}
