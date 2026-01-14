<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConversationRequest;
use App\Models\Conversation;
use App\Models\Inquiry;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    /**
     * List conversations for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $status = $request->query('status', 'active');

        $conversations = Conversation::with([
            'designer.profile',
            'supplier.profile.supplier',
            'latestMessage.sender',
            'inquiry.design',
        ])
            ->where(function ($query) use ($user) {
                $query->where('designer_id', $user->id)
                    ->orWhere('supplier_id', $user->id);
            })
            ->when($status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderByDesc('last_message_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($conversation) use ($user) {
                return $this->formatConversation($conversation, $user);
            });

        return response()->json([
            'data' => $conversations,
        ]);
    }

    /**
     * Show a single conversation.
     */
    public function show(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        if (! $conversation->hasParticipant($user)) {
            return response()->json([
                'message' => 'You are not a participant in this conversation.',
            ], 403);
        }

        $conversation->load([
            'designer.profile',
            'supplier.profile.supplier',
            'inquiry.design',
        ]);

        return response()->json([
            'data' => $this->formatConversation($conversation, $user),
        ]);
    }

    /**
     * Create a new conversation.
     */
    public function store(ConversationRequest $request): JsonResponse
    {
        $user = $request->user();
        $supplierId = $request->supplier_id;

        // Verify the supplier exists and is a supplier
        $supplier = User::find($supplierId);
        if (! $supplier || $supplier->role !== 'supplier') {
            return response()->json([
                'message' => 'Invalid supplier.',
            ], 422);
        }

        // Check if conversation already exists
        $existingConversation = Conversation::where('designer_id', $user->id)
            ->where('supplier_id', $supplierId)
            ->where('status', 'active')
            ->first();

        if ($existingConversation) {
            // Add message to existing conversation
            $message = $existingConversation->messages()->create([
                'sender_id' => $user->id,
                'content' => $request->initial_message,
            ]);

            $existingConversation->update(['last_message_at' => now()]);

            $existingConversation->load([
                'designer.profile',
                'supplier.profile.supplier',
                'latestMessage.sender',
                'inquiry.design',
            ]);

            return response()->json([
                'message' => 'Message added to existing conversation.',
                'data' => $this->formatConversation($existingConversation, $user),
            ]);
        }

        // Create new conversation
        $conversation = Conversation::create([
            'designer_id' => $user->id,
            'supplier_id' => $supplierId,
            'subject' => $request->subject,
            'status' => 'active',
            'last_message_at' => now(),
        ]);

        // Create the initial message
        $message = $conversation->messages()->create([
            'sender_id' => $user->id,
            'content' => $request->initial_message,
        ]);

        // Create inquiry if design is attached
        if ($request->design_id) {
            Inquiry::create([
                'conversation_id' => $conversation->id,
                'design_id' => $request->design_id,
                'status' => 'new',
            ]);
        }

        $conversation->load([
            'designer.profile',
            'supplier.profile.supplier',
            'latestMessage.sender',
            'inquiry.design',
        ]);

        return response()->json([
            'message' => 'Conversation created successfully.',
            'data' => $this->formatConversation($conversation, $user),
        ], 201);
    }

    /**
     * Archive a conversation.
     */
    public function archive(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        if (! $conversation->hasParticipant($user)) {
            return response()->json([
                'message' => 'You are not a participant in this conversation.',
            ], 403);
        }

        $conversation->update(['status' => 'archived']);

        return response()->json([
            'message' => 'Conversation archived successfully.',
        ]);
    }

    /**
     * Get unread messages count.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();

        $count = Message::whereHas('conversation', function ($query) use ($user) {
            $query->where('designer_id', $user->id)
                ->orWhere('supplier_id', $user->id);
        })
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'unread_count' => $count,
        ]);
    }

    /**
     * Format conversation for response.
     */
    private function formatConversation(Conversation $conversation, User $user): array
    {
        $designer = $conversation->designer;
        $supplier = $conversation->supplier;

        return [
            'id' => $conversation->id,
            'designer_id' => $conversation->designer_id,
            'supplier_id' => $conversation->supplier_id,
            'subject' => $conversation->subject,
            'status' => $conversation->status,
            'last_message_at' => $conversation->last_message_at?->toISOString(),
            'created_at' => $conversation->created_at->toISOString(),
            'designer' => [
                'id' => $designer->id,
                'name' => $designer->name,
                'email' => $designer->email,
                'role' => $designer->role,
                'profile' => $designer->profile ? [
                    'avatar_url' => $designer->profile->profile_image_url,
                    'business_name' => $designer->profile->business_name,
                ] : null,
            ],
            'supplier' => [
                'id' => $supplier->id,
                'name' => $supplier->name,
                'email' => $supplier->email,
                'role' => $supplier->role,
                'profile' => $supplier->profile ? [
                    'avatar_url' => $supplier->profile->profile_image_url,
                    'company_name' => $supplier->profile->business_name,
                ] : null,
            ],
            'latest_message' => $conversation->latestMessage ? [
                'id' => $conversation->latestMessage->id,
                'content' => $conversation->latestMessage->content,
                'sender_id' => $conversation->latestMessage->sender_id,
                'created_at' => $conversation->latestMessage->created_at->toISOString(),
                'is_own' => $conversation->latestMessage->sender_id === $user->id,
            ] : null,
            'inquiry' => $conversation->inquiry ? [
                'id' => $conversation->inquiry->id,
                'status' => $conversation->inquiry->status,
                'design' => $conversation->inquiry->design ? [
                    'id' => $conversation->inquiry->design->id,
                    'title' => $conversation->inquiry->design->title,
                    'primary_image_url' => $conversation->inquiry->design->primary_image_url,
                ] : null,
            ] : null,
            'unread_count' => $conversation->unreadCountFor($user),
        ];
    }
}
