<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SupplierProfileRequest extends FormRequest
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
            // Profile fields
            'business_name' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'location' => ['required', 'string', 'max:255'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],

            // Supplier-specific fields
            'service_type' => ['required', 'string', Rule::in(['fabric', 'cmt', 'full_production'])],
            'specialties' => ['nullable', 'array'],
            'specialties.*' => ['string', 'max:100'],
            'minimum_order_quantity' => ['nullable', 'integer', 'min:1'],
            'lead_time_days' => ['nullable', 'integer', 'min:1', 'max:365'],
            'production_capacity' => ['nullable', 'integer', 'min:1'],
            'response_time_hours' => ['nullable', 'integer', 'min:1', 'max:168'],
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
            'business_name.required' => 'Please enter your company name.',
            'business_name.max' => 'Company name cannot exceed 255 characters.',
            'bio.max' => 'Description cannot exceed 2000 characters.',
            'location.required' => 'Please enter your location.',
            'service_type.required' => 'Please select a service type.',
            'service_type.in' => 'Please select a valid service type.',
            'minimum_order_quantity.min' => 'Minimum order quantity must be at least 1.',
            'lead_time_days.min' => 'Lead time must be at least 1 day.',
            'lead_time_days.max' => 'Lead time cannot exceed 365 days.',
            'website_url.url' => 'Please enter a valid website URL.',
        ];
    }
}
