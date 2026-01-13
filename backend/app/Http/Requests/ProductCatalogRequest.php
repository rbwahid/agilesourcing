<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductCatalogRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'category' => ['required', 'string', 'max:100'],
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['file', 'mimes:jpg,jpeg,png', 'max:5120'], // 5MB per image
            'specifications' => ['nullable', 'array'],
            'specifications.*' => ['string', 'max:255'],
            'price_range_min' => ['nullable', 'numeric', 'min:0'],
            'price_range_max' => ['nullable', 'numeric', 'min:0', 'gt:price_range_min'],
            'is_active' => ['nullable', 'boolean'],
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
            'name.required' => 'Please enter a product name.',
            'name.max' => 'Product name cannot exceed 255 characters.',
            'description.max' => 'Description cannot exceed 1000 characters.',
            'category.required' => 'Please select a category.',
            'images.max' => 'You can upload up to 5 images.',
            'images.*.mimes' => 'Images must be JPG or PNG files.',
            'images.*.max' => 'Each image cannot exceed 5MB.',
            'price_range_max.gt' => 'Maximum price must be greater than minimum price.',
        ];
    }
}
