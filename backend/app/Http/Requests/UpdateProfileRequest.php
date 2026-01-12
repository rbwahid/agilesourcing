<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
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
            'business_name' => ['sometimes', 'required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'style_focus' => ['nullable', 'array'],
            'style_focus.*' => ['string', 'max:50'],
            'target_demographics' => ['nullable', 'array'],
            'target_demographics.*' => ['string', 'max:50'],
        ];
    }

    /**
     * Get custom error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'business_name.required' => 'Please enter your business or brand name.',
            'business_name.max' => 'Business name cannot exceed 255 characters.',
            'bio.max' => 'Bio cannot exceed 1000 characters.',
            'website_url.url' => 'Please enter a valid website URL.',
            'phone.max' => 'Phone number cannot exceed 20 characters.',
        ];
    }
}
