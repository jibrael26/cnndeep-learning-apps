<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DetectionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'image' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:16384', // 16MB
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'image.required' => 'Silakan pilih gambar untuk dideteksi.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format gambar yang didukung: JPEG, JPG, PNG, WEBP.',
            'image.max' => 'Ukuran gambar maksimal 16MB.',
        ];
    }
}
