<?php

namespace Database\Seeders;

use App\Models\Horario;
use App\Models\Profesor;
use Illuminate\Database\Seeder;

class HorarioSeeder extends Seeder
{
    public function run()
    {
        $profesores = Profesor::all();

        foreach ($profesores as $profesor) {
            Horario::create([
                'profesor_id' => $profesor->id,
                'dia' => 'Lunes',
                'hora_inicio' => '07:00:00',
                'hora_fin' => '09:00:00',
            ]);

            Horario::create([
                'profesor_id' => $profesor->id,
                'dia' => 'Miércoles',
                'hora_inicio' => '09:00:00',
                'hora_fin' => '11:00:00',
            ]);

            Horario::create([
                'profesor_id' => $profesor->id,
                'dia' => 'Viernes',
                'hora_inicio' => '11:00:00',
                'hora_fin' => '13:00:00',
            ]);
        }
    }
}
