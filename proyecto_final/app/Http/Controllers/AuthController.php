<?php

namespace App\Http\Controllers;

use App\Models\Alumno;
use App\Models\Profesor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Login para administradores (prefectura)
    public function adminLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['token' => $request->user()->createToken('admin')->plainTextToken]);
        }

        return response()->json(['error' => 'Credenciales inválidas'], 401);
    }

    // Login para alumnos
    public function alumnoLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $alumno = Alumno::where('email', $request->email)->first();

        if (!$alumno) {
            return response()->json(['error' => 'Alumno no encontrado'], 404);
        }

        // En un sistema real aquí habría más validación
        return response()->json(['token' => $alumno->createToken('alumno')->plainTextToken]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }
}
