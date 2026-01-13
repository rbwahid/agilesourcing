<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PaymentMethodController extends Controller
{
    /**
     * List all payment methods for the user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Ensure user has a Stripe customer
        if (!$user->stripe_id) {
            return response()->json([
                'data' => [],
            ]);
        }

        try {
            $paymentMethods = $user->paymentMethods();
            $defaultPaymentMethod = $user->defaultPaymentMethod();

            $formatted = $paymentMethods->map(function ($pm) use ($defaultPaymentMethod) {
                return [
                    'id' => $pm->id,
                    'brand' => $pm->card->brand,
                    'last4' => $pm->card->last4,
                    'exp_month' => $pm->card->exp_month,
                    'exp_year' => $pm->card->exp_year,
                    'is_default' => $defaultPaymentMethod && $pm->id === $defaultPaymentMethod->id,
                ];
            });

            return response()->json([
                'data' => $formatted,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'data' => [],
            ]);
        }
    }

    /**
     * Create a SetupIntent for adding a new payment method.
     */
    public function setupIntent(Request $request): JsonResponse
    {
        $user = $request->user();

        try {
            $intent = $user->createSetupIntent();

            return response()->json([
                'data' => [
                    'client_secret' => $intent->client_secret,
                ],
            ]);
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'payment_method' => ['Failed to create setup intent: ' . $e->getMessage()],
            ]);
        }
    }

    /**
     * Add a new payment method.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_method_id' => ['required', 'string'],
            'set_as_default' => ['boolean'],
        ]);

        $user = $request->user();

        try {
            // Add the payment method
            $paymentMethod = $user->addPaymentMethod($validated['payment_method_id']);

            // Set as default if requested or if it's the only payment method
            if ($validated['set_as_default'] ?? false || !$user->hasDefaultPaymentMethod()) {
                $user->updateDefaultPaymentMethod($validated['payment_method_id']);
            }

            return response()->json([
                'message' => 'Payment method added successfully.',
                'data' => [
                    'id' => $paymentMethod->id,
                    'brand' => $paymentMethod->card->brand,
                    'last4' => $paymentMethod->card->last4,
                    'exp_month' => $paymentMethod->card->exp_month,
                    'exp_year' => $paymentMethod->card->exp_year,
                    'is_default' => true,
                ],
            ], 201);
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'payment_method_id' => ['Failed to add payment method: ' . $e->getMessage()],
            ]);
        }
    }

    /**
     * Set a payment method as default.
     */
    public function setDefault(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_method_id' => ['required', 'string'],
        ]);

        $user = $request->user();

        try {
            $user->updateDefaultPaymentMethod($validated['payment_method_id']);

            return response()->json([
                'message' => 'Default payment method updated.',
            ]);
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'payment_method_id' => ['Failed to set default payment method: ' . $e->getMessage()],
            ]);
        }
    }

    /**
     * Remove a payment method.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $user = $request->user();

        try {
            // Check if this is the only payment method
            $paymentMethods = $user->paymentMethods();

            if ($paymentMethods->count() === 1 && $user->subscribed('default')) {
                throw ValidationException::withMessages([
                    'payment_method' => ['Cannot remove your only payment method while you have an active subscription.'],
                ]);
            }

            // Find and delete the payment method
            $paymentMethod = $user->findPaymentMethod($id);

            if (!$paymentMethod) {
                return response()->json([
                    'message' => 'Payment method not found.',
                ], 404);
            }

            $paymentMethod->delete();

            return response()->json([
                'message' => 'Payment method removed.',
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'payment_method' => ['Failed to remove payment method: ' . $e->getMessage()],
            ]);
        }
    }
}
