<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EspacioAtencion extends Model
{
    use HasFactory;

    protected $fillable = ['profesor_id', 'lugar', 'hora_inicio', 'hora_fin'];

    public function profesor()
    {
        return $this->belongsTo(Profesor::class);
    }
}
