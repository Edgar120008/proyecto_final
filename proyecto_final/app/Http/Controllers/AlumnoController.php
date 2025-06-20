<?php

namespace App\Http\Controllers;

use App\Models\Alumno;
use Illuminate\Http\Request;

class AlumnoController extends Controller
{
    public function index()
    {
        return Alumno::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:alumnos,email',
            'matricula' => 'required|string|unique:alumnos,matricula'
        ]);

        return Alumno::create($request->all());
    }

    public function show(Alumno $alumno)
    {
        return $alumno->load('profesores');
    }

    public function update(Request $request, Alumno $alumno)
    {
        $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:alumnos,email,'.$alumno->id,
            'matricula' => 'sometimes|string|unique:alumnos,matricula,'.$alumno->id
        ]);

        $alumno->update($request->all());
        return $alumno;
    }

    public function destroy(Alumno $alumno)
    {
        $alumno->delete();
        return response()->json(null, 204);
    }

    public function misProfesores(Request $request)
{
    return $request->user()->profesores()->with(['horarios', 'espaciosAtencion'])->get();
}

public function misHorarios(Request $request)
{
    return $request->user()->profesores()->with('horarios')->get()
        ->pluck('horarios')
        ->flatten()
        ->unique('id')
        ->values();
}

public function misEspaciosAtencion(Request $request)
{
    return $request->user()->profesores()->with('espaciosAtencion')->get()
        ->pluck('espaciosAtencion')
        ->flatten()
        ->unique('id')
        ->values();
}

public function attachProfesor(Request $request, Alumno $alumno)
{
    $request->validate([
        'profesor_id' => 'required|exists:profesors,id'
    ]);

    $alumno->profesores()->syncWithoutDetaching([$request->profesor_id]);

    return response()->json([
        'message' => 'Profesor asociado correctamente',
        'alumno' => $alumno->load('profesores')
    ]);
}

public function detachProfesor(Request $request, Alumno $alumno)
{
    $request->validate([
        'profesor_id' => 'required|exists:profesors,id'
    ]);

    $alumno->profesores()->detach($request->profesor_id);

    return response()->json([
        'message' => 'Profesor desasociado correctamente',
        'alumno' => $alumno->load('profesores')
    ]);
}

public function listProfesores(Alumno $alumno)
{
    return $alumno->profesores()->with(['horarios', 'espaciosAtencion'])->get();
}

}
