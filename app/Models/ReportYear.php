<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportYear extends Model
{
    use SoftDeletes;

    protected $table = 'report_years';

    protected $fillable = [
        'year',
    ];

    // No relationships defined, as this table is referenced by others
}
