<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cluster extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'regionID'
    ];

    /**
     * Relationship with Region.
     */
    public function region()
    {
        return $this->belongsTo(Region::class, 'regionID');
    }

    /**
     * Relationship with HEIs.
     */
    public function heis()
    {
        return $this->hasMany(Hei::class);
    }
}
