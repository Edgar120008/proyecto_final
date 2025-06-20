<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfesorController;
use App\Http\Controllers\HorarioController;
use App\Http\Controllers\AlumnoController;
use App\Http\Controllers\EspacioAtencionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Autenticación pública
Route::post('/admin/login', [AuthController::class, 'adminLogin']);
Route::post('/alumno/login', [AuthController::class, 'alumnoLogin']);

// Rutas protegidas (requieren autenticación)
Route::middleware(['auth:sanctum'])->group(function () {
    // Cierre de sesión (accesible para ambos roles)
    Route::post('/logout', [AuthController::class, 'logout']);

    // Subsistema de Consulta (acceso para alumnos y admin)
    Route::get('profesores', [ProfesorController::class, 'index']);
    Route::get('profesores/{profesor}', [ProfesorController::class, 'show']);
    Route::get('horarios', [HorarioController::class, 'index']);
    Route::get('horarios/{horario}', [HorarioController::class, 'show']);
    Route::get('espacio-atencions', [EspacioAtencionController::class, 'index']);
    Route::get('espacio-atencions/{espacioAtencion}', [EspacioAtencionController::class, 'show']);

    // Rutas específicas para alumnos
    Route::middleware(['ability:alumno'])->group(function () {
        Route::get('mis-profesores', [AlumnoController::class, 'misProfesores']);
        Route::get('mis-horarios', [AlumnoController::class, 'misHorarios']);
        Route::get('mis-espacios-atencion', [AlumnoController::class, 'misEspaciosAtencion']);
    });

    // Subsistema de Administración (solo para admin)
    Route::middleware(['ability:admin'])->group(function () {
        // CRUD completo para profesores
        Route::post('profesores', [ProfesorController::class, 'store']);
        Route::put('profesores/{profesor}', [ProfesorController::class, 'update']);
        Route::delete('profesores/{profesor}', [ProfesorController::class, 'destroy']);

        // CRUD completo para horarios
        Route::post('horarios', [HorarioController::class, 'store']);
        Route::put('horarios/{horario}', [HorarioController::class, 'update']);
        Route::delete('horarios/{horario}', [HorarioController::class, 'destroy']);

        // CRUD completo para alumnos
        Route::post('alumnos', [AlumnoController::class, 'store']);
        Route::put('alumnos/{alumno}', [AlumnoController::class, 'update']);
        Route::delete('alumnos/{alumno}', [AlumnoController::class, 'destroy']);

        // CRUD completo para espacios de atención
        Route::post('espacio-atencions', [EspacioAtencionController::class, 'store']);
        Route::put('espacio-atencions/{espacioAtencion}', [EspacioAtencionController::class, 'update']);
        Route::delete('espacio-atencions/{espacioAtencion}', [EspacioAtencionController::class, 'destroy']);

        // Gestión de relación alumno-profesor
        Route::post('profesores/{profesor}/alumnos', [ProfesorController::class, 'attachAlumno']);
        Route::delete('profesores/{profesor}/alumnos', [ProfesorController::class, 'detachAlumno']);
        Route::get('profesores/{profesor}/alumnos', [ProfesorController::class, 'listAlumnos']);

        Route::post('alumnos/{alumno}/profesores', [AlumnoController::class, 'attachProfesor']);
        Route::delete('alumnos/{alumno}/profesores', [AlumnoController::class, 'detachProfesor']);
        Route::get('alumnos/{alumno}/profesores', [AlumnoController::class, 'listProfesores']);
    });
});

// Ruta de prueba para verificar que el servidor está funcionando
Route::get('/status', function () {
    return response()->json(['status' => 'OK', 'message' => 'El servidor está funcionando']);
});
