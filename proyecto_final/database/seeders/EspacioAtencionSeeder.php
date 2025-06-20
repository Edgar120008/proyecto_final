<?php

namespace Database\Seeders;

use App\Models\EspacioAtencion;
use App\Models\Profesor;
use Illuminate\Database\Seeder;

class EspacioAtencionSeeder extends Seeder
{
    public function run()
    {
        $profesores = Profesor::all();
        $lugares = ['A-101', 'A-202', 'B-103', 'C-204'];

        foreach ($profesores as $index => $profesor) {
            EspacioAtencion::create([
                'profesor_id' => $profesor->id,
                'lugar' => $lugares[$index % count($lugares)],
                'hora_inicio' => '13:00:00',
                'hora_fin' => '15:00:00',
            ]);

            EspacioAtencion::create([
                'profesor_id' => $profesor->id,
                'lugar' => $lugares[$index % count($lugares)],
                'hora_inicio' => '16:00:00',
                'hora_fin' => '18:00:00',
            ]);
        }
    }
}
