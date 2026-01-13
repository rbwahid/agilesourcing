<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubscriptionRequest extends FormRequest
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
     */
    public function rules(): array
    {
        $rules = [
            'plan_slug' => ['required', 'string', 'exists:plans,slug'],
            'billing_period' => ['required', 'string', 'in:monthly,annual'],
        ];

        // Payment method is required when creating a new subscription
        // (not required when just changing plans with existing payment method)
        if ($this->isMethod('POST') && !$this->user()->hasDefaultPaymentMethod()) {
            $rules['payment_method_id'] = ['required', 'string'];
        } else {
            $rules['payment_method_id'] = ['nullable', 'string'];
        }

        return $rules;
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'plan_slug.required' => 'Please select a plan.',
            'plan_slug.exists' => 'The selected plan is not available.',
            'billing_period.required' => 'Please select a billing period.',
            'billing_period.in' => 'Please select either monthly or annual billing.',
            'payment_method_id.required' => 'A payment method is required to subscribe.',
        ];
    }
}
