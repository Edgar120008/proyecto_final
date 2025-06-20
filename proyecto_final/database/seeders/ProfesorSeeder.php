<?php

namespace Database\Seeders;

use App\Models\Profesor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProfesorSeeder extends Seeder
{
    public function run()
    {
        $profesores = [
            [
                'nombre' => 'Dr. Juan Pérez',
                'email' => 'juan.perez@escom.ipn.mx',
                'password' => Hash::make('password123'),
            ],
            [
                'nombre' => 'Dra. María García',
                'email' => 'maria.garcia@escom.ipn.mx',
                'password' => Hash::make('password123'),
            ],
            [
                'nombre' => 'Mtro. Carlos López',
                'email' => 'carlos.lopez@escom.ipn.mx',
                'password' => Hash::make('password123'),
            ],
            [
                'nombre' => 'Mtra. Ana Martínez',
                'email' => 'ana.martinez@escom.ipn.mx',
                'password' => Hash::make('password123'),
            ],
        ];

        foreach ($profesores as $profesor) {
            Profesor::create($profesor);
        }
    }
}
