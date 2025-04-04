<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramStatistic extends Model
{
    use HasFactory;

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
        'data_date',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}
