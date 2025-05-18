<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportYear extends Model
{
    protected $table = 'report_years';

    protected $fillable = [
        'year',
    ];

    public $timestamps = false;

    public function institutions()
    {
        return $this->hasMany(Institution::class, 'report_year', 'year');
    }
}