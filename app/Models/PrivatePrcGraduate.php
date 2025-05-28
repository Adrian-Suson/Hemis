<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PrivatePrcGraduate extends Model
{
    use SoftDeletes;

    protected $table = 'private_prc_graduate_list';

    protected $fillable = [
        'private_detail_id',
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

    public function privateDetail()
    {
        return $this->belongsTo(PrivateDetail::class, 'private_detail_id');
    }
}
