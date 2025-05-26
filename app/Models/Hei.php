<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hei extends Model
{
    use HasUuids, SoftDeletes;

    protected $table = 'institutions';
    protected $primaryKey = 'uiid';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name'
    ];

    public function details(): HasMany
    {
        return $this->hasMany(HeiDetail::class, 'institution_uiid', 'uiid');
    }
}