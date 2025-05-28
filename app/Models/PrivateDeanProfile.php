<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrivateDeanProfile extends Model
{
    protected $table = 'private_dean_profiles';

    protected $fillable = [
        'private_detail_id',
        'last_name',
        'first_name',
        'middle_initial',
        'designation',
        'college_discipline_assignment',
        'baccalaureate_degree',
        'masters_degree',
        'doctorate_degree',
    ];

    public function privateDetail()
    {
        return $this->belongsTo(PrivateDetail::class, 'private_detail_id');
    }
}
