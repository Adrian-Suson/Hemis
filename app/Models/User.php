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
        'name',
        'email',
        'password',
        'role',
        'institution_id',
        'status',
        'profile_image',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class, 'institution_id', 'id'); // Updated to use institution_id
    }
}