<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Profesor extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $fillable = ['nombre', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];

    public function horarios()
    {
        return $this->hasMany(Horario::class);
    }

    public function espaciosAtencion()
    {
        return $this->hasMany(EspacioAtencion::class);
    }

    public function alumnos()
    {
        return $this->belongsToMany(Alumno::class, 'alumno_profesor')
                   ->withTimestamps()
                   ->withPivot('created_at', 'updated_at');
    }
}
