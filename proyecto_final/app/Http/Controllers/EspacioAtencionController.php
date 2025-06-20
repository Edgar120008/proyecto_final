<?php
namespace App\Http\Controllers;

use App\Models\EspacioAtencion;
use Illuminate\Http\Request;

class EspacioAtencionController extends Controller
{
    public function index()
    {
        return EspacioAtencion::with('profesor')->get();
    }

    public function store(Request $request)
    {
        return EspacioAtencion::create($request->all());
    }

    public function show(EspacioAtencion $espacioAtencion)
    {
        return $espacioAtencion->load('profesor');
    }

    public function update(Request $request, EspacioAtencion $espacioAtencion)
    {
        $espacioAtencion->update($request->all());
        return $espacioAtencion;
    }

    public function destroy(EspacioAtencion $espacioAtencion)
    {
        $espacioAtencion->delete();
        return response()->json(null, 204);
    }
}
