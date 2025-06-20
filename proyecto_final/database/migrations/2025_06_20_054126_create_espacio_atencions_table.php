<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEspacioAtencionsTable extends Migration
{
    public function up()
    {
        Schema::create('espacio_atencions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profesor_id')->constrained();
            $table->string('lugar');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('espacio_atencions');
    }
}
