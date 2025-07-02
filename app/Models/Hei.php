<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hei extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'uiid';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'uiid',
        'name',
        'type',
        'cluster_id',
        'status',
        'campus_type',
        'parent_uiid',
    ];

    /**
     * Relationship with Cluster.
     */
    public function cluster()
    {
        return $this->belongsTo(Cluster::class);
    }

    /**
     * Relationship with LucDetail.
     */
    public function lucDetails()
    {
        return $this->hasMany(LucDetail::class, 'hei_uiid', 'uiid');
    }

    /**
     * Relationship with PrivateDetail.
     */
    public function privateDetails()
    {
        return $this->hasMany(PrivateDetail::class, 'hei_uiid', 'uiid');
    }

    /**
     * Relationship with SucDetail.
     */
    public function sucDetails()
    {
        return $this->hasMany(SucDetails::class, 'hei_uiid', 'uiid');
    }
}
