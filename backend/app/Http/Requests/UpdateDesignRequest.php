<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDesignRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Ensure user owns this design
        $design = $this->route('design');

        return $design && $design->user_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $design = $this->route('design');
        $fileRules = ['nullable', 'file', 'mimes:jpeg,jpg,png,webp,pdf', 'max:10240'];

        // Reject file upload if image is locked
        if ($design && $design->image_locked) {
            $fileRules[] = function ($attribute, $value, $fail) {
                if ($value) {
                    $fail('The design image cannot be changed after publishing.');
                }
            };
        }

        return [
            'design_file' => $fileRules,
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'category' => ['sometimes', 'string', Rule::in([
                'tops',
                'bottoms',
                'dresses',
                'outerwear',
                'accessories',
                'footwear',
                'activewear',
                'swimwear',
            ])],
            'season' => ['nullable', 'string', Rule::in([
                'spring_summer',
                'fall_winter',
                'resort',
                'pre_fall',
                'year_round',
            ])],
            'target_demographic' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'string', Rule::in(['draft', 'active', 'archived'])],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.max' => 'Title cannot exceed 255 characters.',
            'category.in' => 'Please select a valid category.',
            'season.in' => 'Please select a valid season.',
            'status.in' => 'Please select a valid status.',
        ];
    }
}
