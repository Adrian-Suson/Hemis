<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Graduate extends Model
{
    protected $table = 'graduates_list';

    protected $fillable = [
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
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'date_graduated' => 'date',
    ];
}
