<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Graduate extends Model
{
    use SoftDeletes;

    protected $table = 'graduates_list';

    protected $fillable = [
        'institution_uuid',
        'student_id',
        'date_of_birth',
        'last_name',
        'first_name',
        'middle_name',
        'sex',
        'date_graduated',
        'program_name',
        'program_major',
        'program_authority_to_operate_graduate',
        'year_granted',
        'report_year',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_graduated' => 'date',
        'sex' => 'string',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class, 'institution_uuid', 'uuid');
    }

    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }
}
