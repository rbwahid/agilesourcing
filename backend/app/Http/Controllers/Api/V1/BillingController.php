<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BillingController extends Controller
{
    /**
     * List all invoices for the user.
     */
    public function invoices(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->stripe_id) {
            return response()->json([
                'data' => [],
            ]);
        }

        try {
            $invoices = $user->invoices();

            $formatted = $invoices->map(function ($invoice) {
                return [
                    'id' => $invoice->id,
                    'number' => $invoice->number,
                    'amount_due' => $invoice->rawAmountDue(),
                    'amount_paid' => $invoice->rawAmountPaid(),
                    'currency' => $invoice->currency,
                    'status' => $invoice->status,
                    'created' => $invoice->date()->toIso8601String(),
                    'period_start' => $invoice->periodStartDate()?->toIso8601String(),
                    'period_end' => $invoice->periodEndDate()?->toIso8601String(),
                    'invoice_pdf' => $invoice->invoicePdf(),
                    'hosted_invoice_url' => $invoice->hostedInvoiceUrl(),
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
     * Download a specific invoice as PDF.
     */
    public function downloadInvoice(Request $request, string $invoiceId): Response
    {
        $user = $request->user();

        try {
            return $user->downloadInvoice($invoiceId, [
                'vendor' => 'AgileSourcing',
                'product' => 'Subscription',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Invoice not found.',
            ], 404);
        }
    }

    /**
     * Get the upcoming invoice preview.
     */
    public function upcomingInvoice(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user->stripe_id || ! $user->subscribed('default')) {
            return response()->json([
                'data' => null,
            ]);
        }

        try {
            $invoice = $user->upcomingInvoice();

            if (! $invoice) {
                return response()->json([
                    'data' => null,
                ]);
            }

            return response()->json([
                'data' => [
                    'amount_due' => $invoice->rawAmountDue(),
                    'currency' => $invoice->currency,
                    'next_payment_date' => $invoice->date()?->toIso8601String(),
                    'line_items' => collect($invoice->lines->data)->map(function ($item) {
                        return [
                            'description' => $item->description,
                            'amount' => $item->amount,
                            'quantity' => $item->quantity,
                        ];
                    }),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'data' => null,
            ]);
        }
    }
}
