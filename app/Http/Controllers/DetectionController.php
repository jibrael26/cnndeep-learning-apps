<?php

namespace App\Http\Controllers;

use App\Http\Requests\DetectionRequest;
use App\Models\DetectionHistory;
use App\Models\Disease;
use App\Services\PythonApiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DetectionController extends Controller
{
    public function __construct(
        private PythonApiService $pythonApi
    ) {}

    /**
     * Display the detection page.
     */
    public function index(): Response
    {
        return Inertia::render('detection/index', [
            'isApiHealthy' => $this->pythonApi->isHealthy(),
        ]);
    }

    /**
     * Process image detection.
     */
    public function detect(DetectionRequest $request): RedirectResponse
    {
        // Store uploaded image
        $image = $request->file('image');
        $originalFilename = $image->getClientOriginalName();
        $path = $image->store('detections', 'public');
        $fullPath = Storage::disk('public')->path($path);

        // Send to Python API for prediction
        $result = $this->pythonApi->predict($fullPath);

        if (!$result['success']) {
            // Delete the uploaded image on failure
            Storage::disk('public')->delete($path);

            return back()->withErrors([
                'detection' => $result['error'] ?? 'Terjadi kesalahan saat mendeteksi penyakit.',
            ]);
        }

        $prediction = $result['prediction'];

        // Find matching disease in database
        $disease = Disease::where('name', $prediction['disease'])->first();

        // Save to detection history
        $history = DetectionHistory::create([
            'user_id' => $request->user()->id,
            'disease_id' => $disease?->id,
            'image_path' => $path,
            'original_filename' => $originalFilename,
            'predicted_disease' => $prediction['disease'],
            'confidence' => $prediction['confidence'] / 100, // Convert to 0-1 range
            'all_predictions' => $prediction['all_predictions'],
        ]);

        return redirect()->route('detection.result', $history);
    }

    /**
     * Display detection result.
     */
    public function result(DetectionHistory $history): Response
    {
        // Ensure user can only view their own results
        if ($history->user_id !== auth()->id()) {
            abort(403);
        }

        $history->load('disease');

        return Inertia::render('detection/result', [
            'history' => $history,
            'imageUrl' => Storage::disk('public')->url($history->image_path),
        ]);
    }

    /**
     * Display detection history.
     */
    public function history(): Response
    {
        $histories = DetectionHistory::query()
            ->where('user_id', auth()->id())
            ->with('disease')
            ->latest()
            ->paginate(12);

        return Inertia::render('detection/history', [
            'histories' => $histories,
        ]);
    }
}
