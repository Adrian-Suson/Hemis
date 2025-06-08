<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Income extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'suc_income';

    protected $fillable = [
        'suc_details_id',
        'income_category',
        'tuition_fees',
        'miscellaneous_fees',
        'other_income',
        'total_income',
        'report_year'
    ];

    protected $casts = [
        'tuition_fees' => 'decimal:2',
        'miscellaneous_fees' => 'decimal:2',
        'other_income' => 'decimal:2',
        'total_income' => 'decimal:2',
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
