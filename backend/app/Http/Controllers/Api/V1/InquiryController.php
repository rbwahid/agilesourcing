<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\InquiryStatusRequest;
use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    /**
     * List inquiries for the authenticated supplier.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $status = $request->query('status');

        $inquiries = Inquiry::with([
            'conversation.designer.profile',
            'conversation.latestMessage',
            'design',
        ])
            ->whereHas('conversation', function ($query) use ($user) {
                $query->where('supplier_id', $user->id);
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($inquiry) use ($user) {
                return $this->formatInquiry($inquiry, $user);
            });

        return response()->json([
            'data' => $inquiries,
        ]);
    }

    /**
     * Update inquiry status.
     */
    public function updateStatus(InquiryStatusRequest $request, Inquiry $inquiry): JsonResponse
    {
        $user = $request->user();

        // Verify user is the supplier for this inquiry's conversation
        if ($inquiry->conversation->supplier_id !== $user->id) {
            return response()->json([
                'message' => 'You are not authorized to update this inquiry.',
            ], 403);
        }

        $inquiry->update(['status' => $request->status]);

        $inquiry->load([
            'conversation.designer.profile',
            'conversation.latestMessage',
            'design',
        ]);

        return response()->json([
            'message' => 'Inquiry status updated successfully.',
            'data' => $this->formatInquiry($inquiry, $user),
        ]);
    }

    /**
     * Get inquiry statistics for dashboard.
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        $baseQuery = Inquiry::whereHas('conversation', function ($query) use ($user) {
            $query->where('supplier_id', $user->id);
        });

        return response()->json([
            'total' => (clone $baseQuery)->count(),
            'new' => (clone $baseQuery)->where('status', 'new')->count(),
            'in_progress' => (clone $baseQuery)->where('status', 'in_progress')->count(),
            'quoted' => (clone $baseQuery)->where('status', 'quoted')->count(),
            'closed' => (clone $baseQuery)->where('status', 'closed')->count(),
        ]);
    }

    /**
     * Format inquiry for response.
     */
    private function formatInquiry(Inquiry $inquiry, $user): array
    {
        $conversation = $inquiry->conversation;
        $designer = $conversation->designer;

        return [
            'id' => $inquiry->id,
            'conversation_id' => $inquiry->conversation_id,
            'design_id' => $inquiry->design_id,
            'status' => $inquiry->status,
            'created_at' => $inquiry->created_at->toISOString(),
            'updated_at' => $inquiry->updated_at->toISOString(),
            'conversation' => [
                'id' => $conversation->id,
                'subject' => $conversation->subject,
                'last_message_at' => $conversation->last_message_at?->toISOString(),
                'unread_count' => $conversation->unreadCountFor($user),
                'latest_message' => $conversation->latestMessage ? [
                    'content' => $conversation->latestMessage->content,
                    'created_at' => $conversation->latestMessage->created_at->toISOString(),
                ] : null,
            ],
            'designer' => [
                'id' => $designer->id,
                'name' => $designer->name,
                'email' => $designer->email,
                'profile' => $designer->profile ? [
                    'avatar_url' => $designer->profile->profile_image_url,
                    'business_name' => $designer->profile->business_name,
                ] : null,
            ],
            'design' => $inquiry->design ? [
                'id' => $inquiry->design->id,
                'title' => $inquiry->design->title,
                'primary_image_url' => $inquiry->design->primary_image_url,
            ] : null,
        ];
    }
}
