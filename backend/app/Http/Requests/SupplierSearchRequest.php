<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SupplierSearchRequest extends FormRequest
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
            'query' => ['nullable', 'string', 'max:100'],
            'service_type' => [
                'nullable',
                'string',
                Rule::in(['fabric', 'cmt', 'full_production']),
            ],
            'certifications' => ['nullable', 'array'],
            'certifications.*' => [
                'string',
                Rule::in([
                    'GOTS',
                    'OEKO_TEX',
                    'FAIR_TRADE',
                    'ISO_9001',
                    'ISO_14001',
                    'WRAP',
                    'BSCI',
                    'SA8000',
                ]),
            ],
            'location' => ['nullable', 'string', 'max:100'],
            'min_moq' => ['nullable', 'integer', 'min:1'],
            'max_moq' => ['nullable', 'integer', 'min:1'],
            'is_verified' => ['nullable', 'boolean'],
            'sort_by' => [
                'nullable',
                'string',
                Rule::in(['relevance', 'rating', 'lead_time', 'moq', 'newest']),
            ],
            'per_page' => ['nullable', 'integer', 'min:10', 'max:50'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert string boolean to actual boolean
        if ($this->has('is_verified')) {
            $this->merge([
                'is_verified' => filter_var($this->is_verified, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            ]);
        }
    }
}
