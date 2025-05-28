<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hei extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'uiid';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'uiid',
        'name',
        'type',
    ];

    protected $casts = [
        'type' => 'string',
    ];

    public function sucDetail()
    {
        return $this->hasOne(SucDetail::class, 'institution_uiid', 'uiid');
    }

    public function lucDetail()
    {
        return $this->hasOne(LucDetail::class, 'institution_uiid', 'uiid');
    }

    public function privateDetail()
    {
        return $this->hasOne(PrivateDetail::class, 'institution_uiid', 'uiid');
    }
}
