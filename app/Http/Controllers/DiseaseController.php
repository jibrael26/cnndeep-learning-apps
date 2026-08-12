<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DiseaseController extends Controller
{
    /**
     * Python API base URL
     */
    protected string $apiBaseUrl;

    public function __construct()
    {
        $this->apiBaseUrl = env('PYTHON_API_URL', 'http://127.0.0.1:5001');
    }

    /**
     * Display a listing of diseases from Python API.
     */
    public function index(): Response
    {
        $diseases = $this->getDiseasesFromApi();

        return Inertia::render('diseases/index', [
            'diseases' => $diseases,
            'apiConnected' => !empty($diseases),
        ]);
    }

    /**
     * Display the specified disease.
     */
    public function show(string $slug): Response
    {
        $diseases = $this->getDiseasesFromApi();
        $disease = collect($diseases)->firstWhere('slug', $slug);

        if (!$disease) {
            abort(404, 'Penyakit tidak ditemukan');
        }

        return Inertia::render('diseases/show', [
            'disease' => $disease,
        ]);
    }

    /**
     * Get diseases from Python API
     */
    protected function getDiseasesFromApi(): array
    {
        try {
            $response = Http::timeout(5)->get("{$this->apiBaseUrl}/classes");

            if ($response->successful()) {
                $diseases = $response->json('diseases', []);
                
                // Add slug and id to each disease
                return collect($diseases)->map(function ($disease, $index) {
                    return array_merge($disease, [
                        'id' => $index + 1,
                        'slug' => Str::slug($disease['name']),
                    ]);
                })->toArray();
            }
        } catch (ConnectionException $e) {
            // API not available
        } catch (\Exception $e) {
            // Other error
        }

        return [];
    }
}

