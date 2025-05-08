<?php

// app/Models/User.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'institution_id',
        'profile_image',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'role' => 'string',
        'status' => 'string',
    ];

    /**
     * Get the institution this user belongs to.
     */
    public function institution()
    {
        return $this->belongsTo(\App\Models\Institution::class);
    }

    /**
     * New relation: one user can own many institutions.
     */
    public function institutions()
    {
        return $this->hasMany(\App\Models\Institution::class, 'user_id', 'id');
    }

    /**
     * Check if the user is a Super Admin.
     */
    public function isSuperAdmin()
    {
        return $this->role === 'Super Admin';
    }
}
