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
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['uiid', 'name', 'type'];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'type' => 'string',
    ];

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

    /**
     * Check if the HEI is a SUC.
     *
     * @return bool
     */
    public function isSUC(): bool
    {
        return $this->type === 'SUC';
    }

    /**
     * Check if the HEI is a LUC.
     *
     * @return bool
     */
    public function isLUC(): bool
    {
        return $this->type === 'LUC';
    }

    /**
     * Check if the HEI is Private.
     *
     * @return bool
     */
    public function isPrivate(): bool
    {
        return $this->type === 'Private';
    }

    /**
     * Get the appropriate details based on the HEI type.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany|null
     */
    public function getDetails()
    {
        return match ($this->type) {
            'SUC' => $this->sucDetails(),
            'LUC' => $this->lucDetails(),
            'Private' => $this->privateDetails(),
            default => null,
        };
    }
}
