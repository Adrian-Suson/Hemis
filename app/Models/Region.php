<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    protected $fillable = [
        'name',
        'code',
    ];

    /**
     * Relationships
     */
    public function institutions()
    {
        return $this->hasMany(Institution::class, 'region_id');
    }

    public function campuses()
    {
        return $this->hasMany(Campus::class, 'region_id');
    }

    public function users()
    {
        return $this->hasMany(User::class, 'region_id');
    }
}
