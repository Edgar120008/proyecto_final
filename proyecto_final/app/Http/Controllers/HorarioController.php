<?php

namespace App\Http\Controllers;

use App\Models\Horario;
use Illuminate\Http\Request;

class HorarioController extends Controller
{
    public function index()
    {
        return Horario::with('profesor')->get();
    }

    public function store(Request $request)
    {
        return Horario::create($request->all());
    }

    public function show(Horario $horario)
    {
        return $horario->load('profesor');
    }

    public function update(Request $request, Horario $horario)
    {
        $horario->update($request->all());
        return $horario;
    }

    public function destroy(Horario $horario)
    {
        $horario->delete();
        return response()->json(null, 204);
    }
}
