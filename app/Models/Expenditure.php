<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expenditure extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'suc_expenditures';

    protected $fillable = [
        'suc_details_id',
        'function_name',
        'fund_101_ps',
        'fund_101_mooe',
        'fund_101_co',
        'fund_101_total',
        'fund_164_ps',
        'fund_164_mooe',
        'fund_164_co',
        'fund_164_total',
        'total_ps',
        'total_mooe',
        'total_co',
        'total_expend',
        'report_year'
    ];

    protected $casts = [
        'fund_101_ps' => 'decimal:2',
        'fund_101_mooe' => 'decimal:2',
        'fund_101_co' => 'decimal:2',
        'fund_101_total' => 'decimal:2',
        'fund_164_ps' => 'decimal:2',
        'fund_164_mooe' => 'decimal:2',
        'fund_164_co' => 'decimal:2',
        'fund_164_total' => 'decimal:2',
        'total_ps' => 'decimal:2',
        'total_mooe' => 'decimal:2',
        'total_co' => 'decimal:2',
        'total_expend' => 'decimal:2',
        'report_year' => 'integer'
    ];

    // Relationships
    public function sucDetail()
    {
        return $this->belongsTo(SucDetails::class, 'suc_details_id');
    }

    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }
}
