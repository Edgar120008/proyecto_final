<?php

namespace Database\Seeders;

use App\Models\Alumno;
use Illuminate\Database\Seeder;

class AlumnoSeeder extends Seeder
{
    public function run()
    {
        $alumnos = [
            [
                'nombre' => 'Luis Hernández',
                'email' => 'luis.hernandez@alumno.escom.ipn.mx',
                'matricula' => '2020630001',
            ],
            [
                'nombre' => 'Sofía Ramírez',
                'email' => 'sofia.ramirez@alumno.escom.ipn.mx',
                'matricula' => '2020630002',
            ],
            [
                'nombre' => 'Jorge Domínguez',
                'email' => 'jorge.dominguez@alumno.escom.ipn.mx',
                'matricula' => '2020630003',
            ],
            [
                'nombre' => 'Patricia Sánchez',
                'email' => 'patricia.sanchez@alumno.escom.ipn.mx',
                'matricula' => '2020630004',
            ],
        ];

        foreach ($alumnos as $alumno) {
            Alumno::create($alumno);
        }
    }
}
