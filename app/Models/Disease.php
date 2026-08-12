<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Disease extends Model
{
    /** @use HasFactory<\Database\Factories\DiseaseFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'name_scientific',
        'slug',
        'description',
        'symptoms',
        'causes',
        'treatment',
        'prevention',
        'image_path',
    ];

    /**
     * Get the detection histories for this disease.
     */
    public function detectionHistories(): HasMany
    {
        return $this->hasMany(DetectionHistory::class);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
