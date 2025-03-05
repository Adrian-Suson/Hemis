<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

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
        'program_type'
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function statistics()
    {
        return $this->hasOne(ProgramStatistic::class);
    }
}
