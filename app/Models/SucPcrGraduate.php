<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SucPcrGraduate extends Model
{
    use SoftDeletes;

    protected $table = 'suc_pcr_graduate_list';

    protected $fillable = [
        'suc_details_id',
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
        'year_granted' => 'integer',
        'report_year' => 'integer',
    ];

    public function sucDetail()
    {
        return $this->belongsTo(SucDetails::class, 'suc_details_id');
    }

    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }
}