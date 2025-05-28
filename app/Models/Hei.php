<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hei extends Model
{
    use HasFactory;

    protected $fillable = ['uiid', 'name', 'type'];

    /**
     * Relationship with LucDetail.
     */
    public function lucDetails()
    {
        return $this->hasMany(LucDetail::class, 'hei_id');
    }

    /**
     * Relationship with PrivateDetail.
     */
    public function privateDetails()
    {
        return $this->hasMany(PrivateDetail::class, 'hei_id');
    }

    /**
     * Relationship with SucDetail.
     */
    public function sucDetails()
    {
        return $this->hasMany(SucDetail::class, 'hei_id');
    }
}
