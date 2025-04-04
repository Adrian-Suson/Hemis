<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'new_students_freshmen_male',
        'new_students_freshmen_female',
        'first_year_old_male',
        'first_year_old_female',
        'second_year_male',
        'second_year_female',
        'third_year_male',
        'third_year_female',
        'fourth_year_male',
        'fourth_year_female',
        'fifth_year_male',
        'fifth_year_female',
        'sixth_year_male',
        'sixth_year_female',
        'seventh_year_male',
        'seventh_year_female',
        'subtotal_male',
        'subtotal_female',
        'grand_total',
        'data_date',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}
