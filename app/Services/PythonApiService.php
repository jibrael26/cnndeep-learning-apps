<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PythonApiService
{
    private string $baseUrl;
    private int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.python_api.url', 'http://localhost:5000');
        $this->timeout = config('services.python_api.timeout', 60);
    }

    /**
     * Get HTTP client for Python API
     */
    private function client(): PendingRequest
    {
        return Http::baseUrl($this->baseUrl)
            ->timeout($this->timeout)
            ->acceptJson();
    }

    /**
     * Check if Python API is healthy
     */
    public function isHealthy(): bool
    {
        try {
            $response = $this->client()->get('/health');
            return $response->successful() && $response->json('status') === 'healthy';
        } catch (\Exception $e) {
            Log::error('Python API health check failed', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Send image for disease prediction
     *
     * @param string $imagePath Path to the image file
     * @return array{success: bool, prediction?: array, error?: string}
     */
    public function predict(string $imagePath): array
    {
        try {
            $response = Http::baseUrl($this->baseUrl)
                ->timeout($this->timeout)
                ->attach('image', file_get_contents($imagePath), basename($imagePath))
                ->post('/predict');

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'prediction' => $data['prediction'] ?? null,
                    'timestamp' => $data['timestamp'] ?? now()->toISOString(),
                ];
            }

            return [
                'success' => false,
                'error' => $response->json('message') ?? 'Prediction failed',
            ];
        } catch (\Exception $e) {
            Log::error('Python API prediction failed', [
                'error' => $e->getMessage(),
                'image' => $imagePath,
            ]);

            return [
                'success' => false,
                'error' => 'Failed to connect to prediction service: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get model information and evaluation metrics
     *
     * @return array{success: bool, data?: array, error?: string}
     */
    public function getModelInfo(): array
    {
        try {
            $response = $this->client()->get('/model-info');

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json(),
                ];
            }

            return [
                'success' => false,
                'error' => $response->json('message') ?? 'Failed to get model info',
            ];
        } catch (\Exception $e) {
            Log::error('Python API model info failed', ['error' => $e->getMessage()]);

            return [
                'success' => false,
                'error' => 'Failed to connect to prediction service',
            ];
        }
    }

    /**
     * Get list of disease classes
     *
     * @return array<string>
     */
    public function getClasses(): array
    {
        try {
            $response = $this->client()->get('/classes');

            if ($response->successful()) {
                return $response->json('classes') ?? [];
            }

            return [];
        } catch (\Exception $e) {
            Log::error('Python API get classes failed', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Reload the model
     *
     * @return bool
     */
    public function reloadModel(): bool
    {
        try {
            $response = $this->client()->post('/reload-model');
            return $response->successful() && $response->json('success') === true;
        } catch (\Exception $e) {
            Log::error('Python API reload model failed', ['error' => $e->getMessage()]);
            return false;
        }
    }
}
