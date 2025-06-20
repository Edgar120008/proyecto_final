<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfesorsTable extends Migration
{
    public function up()
{
    Schema::create('profesors', function (Blueprint $table) {
        $table->id();
        $table->string('nombre');
        $table->string('email')->unique();
        $table->string('password'); // Añade esta línea
        $table->rememberToken(); // Añade esta línea
        $table->timestamps();
    });
}

    public function down()
    {
        Schema::dropIfExists('profesors');
    }
}
