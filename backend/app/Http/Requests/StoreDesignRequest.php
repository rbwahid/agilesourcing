<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDesignRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'category' => ['required', 'string', Rule::in([
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
            'design_file' => [
                'required',
                'file',
                'mimes:jpeg,jpg,png,pdf',
                'max:10240', // 10MB
            ],
            'status' => ['nullable', 'string', Rule::in(['draft', 'active'])],
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
            'title.required' => 'Please enter a title for your design.',
            'title.max' => 'Title cannot exceed 255 characters.',
            'category.required' => 'Please select a category.',
            'category.in' => 'Please select a valid category.',
            'season.in' => 'Please select a valid season.',
            'design_file.required' => 'Please upload a design file.',
            'design_file.file' => 'The uploaded file is invalid.',
            'design_file.mimes' => 'Design must be a JPG, PNG, or PDF file.',
            'design_file.max' => 'Design file cannot exceed 10MB.',
        ];
    }
}
