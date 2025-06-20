<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Alumno extends Model
{
    use HasFactory, HasApiTokens;

    protected $fillable = ['nombre', 'email', 'matricula'];

    public function profesores()
    {
        return $this->belongsToMany(Profesor::class, 'alumno_profesor')
                    ->withTimestamps()
                    ->withPivot('created_at', 'updated_at');
    }
}
