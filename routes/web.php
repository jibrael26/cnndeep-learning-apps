<?php

use App\Http\Controllers\DetectionController;
use App\Http\Controllers\DiseaseController;
use App\Http\Controllers\ModelEvaluationController;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    // Fetch disease classes from Python API
    $diseases = [];
    try {
        $pythonApiUrl = env('PYTHON_API_URL', 'http://localhost:5001');
        $response = Http::timeout(5)->get("{$pythonApiUrl}/classes");
        if ($response->successful()) {
            $diseases = $response->json('diseases', []);
        }
    } catch (\Exception $e) {
        // API not available, use empty array
    }

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'diseases' => $diseases,
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Detection routes
    Route::get('detection', [DetectionController::class, 'index'])->name('detection.index');
    Route::post('detection', [DetectionController::class, 'detect'])->name('detection.detect');
    Route::get('detection/result/{history}', [DetectionController::class, 'result'])->name('detection.result');
    Route::get('detection/history', [DetectionController::class, 'history'])->name('detection.history');

    // Disease information routes
    Route::get('diseases', [DiseaseController::class, 'index'])->name('diseases.index');
    Route::get('diseases/{disease}', [DiseaseController::class, 'show'])->name('diseases.show');

    // Model evaluation routes
    Route::get('evaluation', [ModelEvaluationController::class, 'index'])->name('evaluation.index');
});

require __DIR__.'/settings.php';
