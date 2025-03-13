<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramStatistic extends Model
{
    protected $table = 'program_statistics'; // Match the table name from migration

    protected $fillable = [
        'program_id',
        'lecture_units_actual',
        'laboratory_units_actual',
        'total_units_actual',
        'graduates_males',
        'graduates_females',
        'graduates_total',
        'externally_funded_merit_scholars',
        'internally_funded_grantees',
        'suc_funded_grantees',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }
}
