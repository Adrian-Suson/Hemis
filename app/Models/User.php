<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Model
{
    use HasApiTokens;
    use Notifiable;

    protected $fillable = [
        'profile_image',
        'name',
        'email',
        'email_verified_at',
        'password',
        'role',
        'status',
        'institution_id',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class, 'institution_id', 'id'); // Updated to use institution_id
    }
}
