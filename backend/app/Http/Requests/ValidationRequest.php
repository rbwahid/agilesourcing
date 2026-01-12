<?php

namespace App\Http\Requests;

use App\Models\Validation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ValidationRequest extends FormRequest
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
            'mockup_id' => [
                'required',
                'integer',
                'exists:mockups,id',
            ],
            'caption' => [
                'required',
                'string',
                'max:2200', // Instagram caption limit
            ],
            'validation_duration_hours' => [
                'required',
                'integer',
                Rule::in(Validation::DURATIONS),
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'caption.max' => 'Caption cannot exceed 2200 characters (Instagram limit).',
            'validation_duration_hours.in' => 'Duration must be one of: 24, 48, 72, or 168 hours.',
        ];
    }
}
