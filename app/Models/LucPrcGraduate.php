<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LucPrcGraduate extends Model
{
    use SoftDeletes;

    protected $table = 'luc_prc_graduate_list';

    protected $fillable = [
        'luc_detail_id',
        'student_id',
        'date_of_birth',
        'last_name',
        'first_name',
        'middle_name',
        'sex',
        'date_graduated',
        'program_name',
        'program_major',
        'authority_number',
        'year_granted',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_graduated' => 'date',
        'sex' => 'string',
        'year_granted' => 'integer',
    ];

    public function lucDetail()
    {
        return $this->belongsTo(LucDetail::class, 'luc_detail_id');
    }
}
