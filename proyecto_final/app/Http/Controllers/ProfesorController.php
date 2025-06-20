<?php

namespace App\Http\Controllers;

use App\Models\Profesor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // ¡Esta línea es crucial!

class ProfesorController extends Controller
{
    public function index()
    {
        return Profesor::with(['horarios', 'espaciosAtencion'])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:profesors,email',
            'password' => 'required|string|min:8'
        ]);

        $profesor = Profesor::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'password' => Hash::make($request->password) // Usando Hash correctamente
        ]);

        return response()->json($profesor, 201);
    }

    public function show(Profesor $profesor)
    {
        return $profesor->load(['horarios', 'espaciosAtencion']);
    }

    public function update(Request $request, Profesor $profesor)
    {
        $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:profesors,email,'.$profesor->id,
            'password' => 'sometimes|string|min:8'
        ]);

        $data = $request->only(['nombre', 'email']);

        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $profesor->update($data);

        return response()->json($profesor);
    }

    public function destroy(Profesor $profesor)
    {
        $profesor->delete();
        return response()->json(null, 204);
    }

    // En ProfesorController o AlumnoController
public function attachAlumno(Request $request, Profesor $profesor)
{
    $request->validate([
        'alumno_id' => 'required|exists:alumnos,id'
    ]);

    $profesor->alumnos()->syncWithoutDetaching([$request->alumno_id]);

    return response()->json([
        'message' => 'Alumno asociado correctamente',
        'profesor' => $profesor->load('alumnos')
    ]);
}

public function detachAlumno(Request $request, Profesor $profesor)
{
    $request->validate([
        'alumno_id' => 'required|exists:alumnos,id'
    ]);

    $profesor->alumnos()->detach($request->alumno_id);

    return response()->json([
        'message' => 'Alumno desasociado correctamente',
        'profesor' => $profesor->load('alumnos')
    ]);
}

public function listAlumnos(Profesor $profesor)
{
    return $profesor->alumnos()->get();
}
}
