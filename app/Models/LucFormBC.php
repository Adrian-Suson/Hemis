<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LucFormBC extends Model
{
    protected $table = 'luc_form_b_c';

    protected $fillable = [
        'luc_detail_id',
        'program_name',
        'program_code',
        'major_name',
        'major_code',
        'with_thesis_dissertation',
        'code',
        'year_implemented',
        'aop_category',
        'aop_serial',
        'aop_year',
        'remarks',
        'program_mode_code',
        'program_mode_program',
        'normal_length_years',
        'program_credit_units',
        'tuition_per_unit_peso',
        'program_fee_peso',
        'enrollment_new_students_m',
        'enrollment_new_students_f',
        'enrollment_1st_year_m',
        'enrollment_1st_year_f',
        'enrollment_2nd_year_m',
        'enrollment_2nd_year_f',
        'enrollment_3rd_year_m',
        'enrollment_3rd_year_f',
        'enrollment_4th_year_m',
        'enrollment_4th_year_f',
        'enrollment_5th_year_m',
        'enrollment_5th_year_f',
        'enrollment_6th_year_m',
        'enrollment_6th_year_f',
        'enrollment_7th_year_m',
        'enrollment_7th_year_f',
        'enrollment_sub_total_m',
        'enrollment_sub_total_f',
        'enrollment_total',
        'graduates_m',
        'graduates_f',
        'graduates_total',
    ];

    protected $casts = [
        'with_thesis_dissertation' => 'integer',
        'code' => 'integer',
        'year_implemented' => 'integer',
        'aop_year' => 'integer',
        'normal_length_years' => 'integer',
        'program_credit_units' => 'integer',
        'tuition_per_unit_peso' => 'decimal:2',
        'program_fee_peso' => 'decimal:2',
        'enrollment_new_students_m' => 'integer',
        'enrollment_new_students_f' => 'integer',
        'enrollment_1st_year_m' => 'integer',
        'enrollment_1st_year_f' => 'integer',
        'enrollment_2nd_year_m' => 'integer',
        'enrollment_2nd_year_f' => 'integer',
        'enrollment_3rd_year_m' => 'integer',
        'enrollment_3rd_year_f' => 'integer',
        'enrollment_4th_year_m' => 'integer',
        'enrollment_4th_year_f' => 'integer',
        'enrollment_5th_year_m' => 'integer',
        'enrollment_5th_year_f' => 'integer',
        'enrollment_6th_year_m' => 'integer',
        'enrollment_6th_year_f' => 'integer',
        'enrollment_7th_year_m' => 'integer',
        'enrollment_7th_year_f' => 'integer',
        'enrollment_sub_total_m' => 'integer',
        'enrollment_sub_total_f' => 'integer',
        'enrollment_total' => 'integer',
        'graduates_m' => 'integer',
        'graduates_f' => 'integer',
        'graduates_total' => 'integer',
    ];

    public function lucDetail()
    {
        return $this->belongsTo(LucDetail::class, 'luc_detail_id');
    }
}
