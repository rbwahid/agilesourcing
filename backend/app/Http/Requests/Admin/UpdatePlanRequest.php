<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasRole(['admin', 'super_admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'price_monthly' => ['sometimes', 'numeric', 'min:0', 'max:9999.99'],
            'price_annual' => ['sometimes', 'numeric', 'min:0', 'max:99999.99'],
            'features' => ['sometimes', 'array'],
            'features.*' => ['boolean'],
            'design_uploads_limit' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:10000'],
            'validations_limit' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:10000'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'price_monthly' => 'monthly price',
            'price_annual' => 'annual price',
            'design_uploads_limit' => 'design uploads limit',
            'validations_limit' => 'validations limit',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'price_monthly.min' => 'The monthly price cannot be negative.',
            'price_annual.min' => 'The annual price cannot be negative.',
            'design_uploads_limit.min' => 'The design uploads limit must be at least 1.',
            'validations_limit.min' => 'The validations limit must be at least 1.',
        ];
    }
}
