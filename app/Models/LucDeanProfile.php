<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LucDeanProfile extends Model
{
    protected $table = 'luc_dean_profiles';

    protected $fillable = [
        'luc_detail_id',
        'last_name',
        'first_name',
        'middle_initial',
        'designation',
        'college_discipline_assignment',
        'baccalaureate_degree',
        'masters_degree',
        'doctorate_degree',
    ];

    public function lucDetail()
    {
        return $this->belongsTo(LucDetail::class, 'luc_detail_id');
    }
}
