<?php

namespace App\Http\Controllers;

use App\Services\PythonApiService;
use Inertia\Inertia;
use Inertia\Response;

class ModelEvaluationController extends Controller
{
    public function __construct(
        private PythonApiService $pythonApi
    ) {}

    /**
     * Display model evaluation metrics.
     */
    public function index(): Response
    {
        $modelInfo = $this->pythonApi->getModelInfo();

        return Inertia::render('evaluation/index', [
            'isApiHealthy' => $this->pythonApi->isHealthy(),
            'modelLoaded' => $modelInfo['success'] ? $modelInfo['data']['model_loaded'] : false,
            'diseaseClasses' => $modelInfo['success'] ? $modelInfo['data']['disease_classes'] : [],
            'metrics' => $modelInfo['success'] ? $modelInfo['data']['metrics'] : null,
            'trainingHistory' => $modelInfo['success'] ? $modelInfo['data']['training_history'] : null,
            'confusionMatrix' => $modelInfo['success'] ? $modelInfo['data']['confusion_matrix'] : null,
        ]);
    }
}
