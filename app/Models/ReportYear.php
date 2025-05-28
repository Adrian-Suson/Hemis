<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportYear extends Model
{
    use SoftDeletes;

    protected $table = 'report_years';

    protected $primaryKey = 'year';
    public $incrementing = false;
    protected $keyType = 'integer';

    protected $fillable = [
        'year',
    ];

    public function sucDetails()
    {
        return $this->hasMany(SucDetail::class, 'report_year', 'year');
    }

    public function lucDetails()
    {
        return $this->hasMany(LucDetail::class, 'report_year', 'year');
    }

    public function privateDetails()
    {
        return $this->hasMany(PrivateDetail::class, 'report_year', 'year');
    }
}
