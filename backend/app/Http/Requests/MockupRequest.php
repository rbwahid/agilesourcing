<?php

namespace App\Http\Requests;

use App\Models\Mockup;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MockupRequest extends FormRequest
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
            'model_type' => [
                'required',
                'string',
                Rule::in(Mockup::MODEL_TYPES),
            ],
            'pose' => [
                'required',
                'string',
                Rule::in(Mockup::POSES),
            ],
            'background' => [
                'required',
                'string',
                Rule::in(Mockup::BACKGROUNDS),
            ],
            'design_variation_id' => [
                'nullable',
                'integer',
                'exists:design_variations,id',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'model_type.in' => 'Model type must be one of: '.implode(', ', Mockup::MODEL_TYPES),
            'pose.in' => 'Pose must be one of: '.implode(', ', Mockup::POSES),
            'background.in' => 'Background must be one of: '.implode(', ', Mockup::BACKGROUNDS),
        ];
    }
}
