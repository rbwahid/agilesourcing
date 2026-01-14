<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class RefundRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'amount' => ['nullable', 'integer', 'min:1'],
            'reason' => ['required', 'string', 'max:500'],
        ];
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'amount.integer' => 'The refund amount must be specified in cents.',
            'amount.min' => 'The refund amount must be at least 1 cent.',
            'reason.required' => 'A reason for the refund is required.',
            'reason.max' => 'The reason cannot exceed 500 characters.',
        ];
    }
}
