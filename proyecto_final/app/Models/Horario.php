<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    use HasFactory;

    protected $fillable = ['profesor_id', 'dia', 'hora_inicio', 'hora_fin'];

    public function profesor()
    {
        return $this->belongsTo(Profesor::class);
    }
}
