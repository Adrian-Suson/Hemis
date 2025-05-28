<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrivateFormerName extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'private_former_names';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'private_detail_id',
        'former_name',
        'year_used',
    ];

    /**
     * Get the associated private detail.
     */
    public function privateDetail()
    {
        return $this->belongsTo(PrivateDetail::class, 'private_detail_id');
    }
}
