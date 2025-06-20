<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            ProfesorSeeder::class,
            AlumnoSeeder::class,
            HorarioSeeder::class,
            EspacioAtencionSeeder::class,
            AlumnoProfesorSeeder::class,
        ]);
    }
}
