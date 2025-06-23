<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LucFormerName extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'luc_former_names';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'luc_detail_id',
        'former_name',
        'year_used',
    ];

    /**
     * Get the associated luc detail.
     */
    public function lucDetail()
    {
        return $this->belongsTo(LucDetail::class, 'luc_detail_id');
    }
}