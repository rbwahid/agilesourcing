<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SupplierCertificationRequest extends FormRequest
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
            'certification_type' => [
                'required',
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
            'certificate_file' => [
                'required',
                'file',
                'mimes:pdf,jpg,jpeg,png',
                'max:10240', // 10MB
            ],
            'expiry_date' => ['required', 'date', 'after:today'],
            'certificate_number' => ['nullable', 'string', 'max:100'],
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
            'certification_type.required' => 'Please select a certification type.',
            'certification_type.in' => 'Please select a valid certification type.',
            'certificate_file.required' => 'Please upload your certificate.',
            'certificate_file.file' => 'The uploaded file is invalid.',
            'certificate_file.mimes' => 'Certificate must be a PDF, JPG, or PNG file.',
            'certificate_file.max' => 'Certificate file cannot exceed 10MB.',
            'expiry_date.required' => 'Please enter the expiry date.',
            'expiry_date.date' => 'Please enter a valid date.',
            'expiry_date.after' => 'Expiry date must be in the future.',
        ];
    }
}
