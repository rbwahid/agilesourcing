<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConversationRequest extends FormRequest
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
            'supplier_id' => ['required', 'exists:users,id'],
            'subject' => ['nullable', 'string', 'max:255'],
            'design_id' => ['nullable', 'exists:designs,id'],
            'initial_message' => ['required', 'string', 'max:5000'],
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
            'supplier_id.required' => 'Please select a supplier to contact.',
            'supplier_id.exists' => 'The selected supplier does not exist.',
            'subject.max' => 'Subject cannot exceed 255 characters.',
            'design_id.exists' => 'The selected design does not exist.',
            'initial_message.required' => 'Please enter a message.',
            'initial_message.max' => 'Message cannot exceed 5000 characters.',
        ];
    }
}
