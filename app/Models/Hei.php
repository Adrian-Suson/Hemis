<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hei extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'uiid';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['uiid', 'name'];

    /**
     * Get the SUC details for the HEI.
     */
    public function sucDetails()
    {
        return $this->hasMany(SucDetail::class, 'institution_uiid', 'uiid');
    }

    /**
     * Get the LUC details for the HEI.
     */
    public function lucDetails()
    {
        return $this->hasMany(LucDetail::class, 'institution_uiid', 'uiid');
    }

    /**
     * Get the Private details for the HEI.
     */
    public function privateDetails()
    {
        return $this->hasMany(PrivateDetail::class, 'institution_uiid', 'uiid');
    }
}
