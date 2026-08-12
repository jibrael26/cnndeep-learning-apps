<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetectionHistory extends Model
{
    /** @use HasFactory<\Database\Factories\DetectionHistoryFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'disease_id',
        'image_path',
        'original_filename',
        'predicted_disease',
        'confidence',
        'all_predictions',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'all_predictions' => 'array',
            'confidence' => 'float',
        ];
    }

    /**
     * Get the user that owns the detection history.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the disease associated with this detection.
     */
    public function disease(): BelongsTo
    {
        return $this->belongsTo(Disease::class);
    }
}
