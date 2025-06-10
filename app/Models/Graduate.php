<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Graduate extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
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
        'authority_number',
        'year_granted'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_birth' => 'date',
        'date_graduated' => 'date',
        'year_granted' => 'integer',
    ];

    /**
     * Get the full name of the graduate.
     *
     * @return string
     */
    public function getFullNameAttribute()
    {
        return $this->last_name . ', ' . $this->first_name .
            ($this->middle_name ? ' ' . $this->middle_name : '');
    }

    /**
     * Get the age at graduation.
     *
     * @return int
     */
    public function getAgeAtGraduationAttribute()
    {
        return $this->date_of_birth->diffInYears($this->date_graduated);
    }
}