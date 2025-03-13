<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Program extends Model
{
    protected $fillable = [
        'institution_id',
        'program_name',
        'program_code',
        'major_name',
        'major_code',
        'category',
        'serial',
        'year',
        'is_thesis_dissertation_required',
        'program_status',
        'calendar_use_code',
        'program_normal_length_in_years',
        'lab_units',
        'lecture_units',
        'total_units',
        'tuition_per_unit',
        'program_fee',
        'program_type',
    ];

    protected $casts = [
        'is_thesis_dissertation_required' => 'integer',
        'program_status' => 'integer',
        'calendar_use_code' => 'integer',
        'tuition_per_unit' => 'decimal:2',
        'program_fee' => 'decimal:2',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function enrollment(): HasOne
    {
        return $this->hasOne(Enrollment::class);
    }

    public function programStatistic(): HasOne
    {
        return $this->hasOne(ProgramStatistic::class);
    }
}
