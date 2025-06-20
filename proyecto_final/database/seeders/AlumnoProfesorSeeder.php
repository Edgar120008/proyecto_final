<?php

namespace Database\Seeders;

use App\Models\Alumno;
use App\Models\Profesor;
use Illuminate\Database\Seeder;

class AlumnoProfesorSeeder extends Seeder
{
    public function run()
    {
        $alumnos = Alumno::all();
        $profesores = Profesor::all();

        // Cada alumno tendrá 2 profesores asignados
        foreach ($alumnos as $alumno) {
            $profesoresAleatorios = $profesores->random(2);
            $alumno->profesores()->attach($profesoresAleatorios);
        }

        // Cada profesor tendrá al menos 1 alumno adicional
        foreach ($profesores as $profesor) {
            if ($profesor->alumnos->isEmpty()) {
                $alumnoAleatorio = $alumnos->random();
                $profesor->alumnos()->attach($alumnoAleatorio);
            }
        }
    }
}
