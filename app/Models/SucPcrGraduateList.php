<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SucPcrGraduateList extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'suc_pcr_graduate_list';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
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
        'authority_number',
        'year_granted',
        'report_year',
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
        'report_year' => 'integer',
    ];

    /**
     * Get the SUC details that owns the graduate.
     */
    public function sucDetails()
    {
        return $this->belongsTo(SucDetails::class, 'suc_details_id');
    }

    /**
     * Get the report year that owns the graduate.
     */
    public function reportYear()
    {
        return $this->belongsTo(ReportYear::class, 'report_year', 'year');
    }
}