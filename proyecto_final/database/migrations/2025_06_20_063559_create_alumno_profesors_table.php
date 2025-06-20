<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('alumno_profesor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumno_id')->constrained()->onDelete('cascade');
            $table->foreignId('profesor_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Añadir índice único para evitar duplicados
            $table->unique(['alumno_id', 'profesor_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('alumno_profesor');
    }
};
