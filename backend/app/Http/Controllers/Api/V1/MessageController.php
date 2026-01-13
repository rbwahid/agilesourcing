<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\MessageRequest;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    /**
     * List messages in a conversation.
     */
    public function index(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        if (!$conversation->hasParticipant($user)) {
            return response()->json([
                'message' => 'You are not a participant in this conversation.',
            ], 403);
        }

        $perPage = $request->query('per_page', 50);
        $page = $request->query('page', 1);

        $messages = $conversation->messages()
            ->with('sender.profile')
            ->orderByDesc('created_at')
            ->paginate($perPage, ['*'], 'page', $page);

        $formattedMessages = collect($messages->items())->map(function ($message) use ($user) {
            return $this->formatMessage($message, $user);
        })->reverse()->values();

        return response()->json([
            'data' => $formattedMessages,
            'meta' => [
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
                'per_page' => $messages->perPage(),
                'total' => $messages->total(),
                'has_more_pages' => $messages->hasMorePages(),
            ],
        ]);
    }

    /**
     * Send a new message.
     */
    public function store(MessageRequest $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        if (!$conversation->hasParticipant($user)) {
            return response()->json([
                'message' => 'You are not a participant in this conversation.',
            ], 403);
        }

        // Handle file attachments
        $attachments = [];
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store(
                    'messages/' . $conversation->id,
                    'public'
                );

                $attachments[] = [
                    'name' => $file->getClientOriginalName(),
                    'url' => url('storage/' . $path),
                    'type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ];
            }
        }

        $message = $conversation->messages()->create([
            'sender_id' => $user->id,
            'content' => $request->content,
            'attachments' => !empty($attachments) ? $attachments : null,
        ]);

        // Update conversation last_message_at
        $conversation->update(['last_message_at' => now()]);

        // Update inquiry status if new
        if ($conversation->inquiry && $conversation->inquiry->status === 'new') {
            $conversation->inquiry->update(['status' => 'in_progress']);
        }

        $message->load('sender.profile');

        return response()->json([
            'message' => 'Message sent successfully.',
            'data' => $this->formatMessage($message, $user),
        ], 201);
    }

    /**
     * Mark all messages in conversation as read.
     */
    public function markRead(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        if (!$conversation->hasParticipant($user)) {
            return response()->json([
                'message' => 'You are not a participant in this conversation.',
            ], 403);
        }

        // Mark all unread messages from the other participant as read
        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'message' => 'Messages marked as read.',
        ]);
    }

    /**
     * Delete a message.
     */
    public function destroy(Request $request, Message $message): JsonResponse
    {
        $user = $request->user();

        // Only sender can delete their own messages
        if ($message->sender_id !== $user->id) {
            return response()->json([
                'message' => 'You can only delete your own messages.',
            ], 403);
        }

        // Delete attachments
        if ($message->attachments) {
            foreach ($message->attachments as $attachment) {
                $path = str_replace(url('storage/'), '', $attachment['url']);
                Storage::disk('public')->delete($path);
            }
        }

        $message->delete();

        return response()->json([
            'message' => 'Message deleted successfully.',
        ]);
    }

    /**
     * Format message for response.
     */
    private function formatMessage(Message $message, $user): array
    {
        $sender = $message->sender;

        return [
            'id' => $message->id,
            'conversation_id' => $message->conversation_id,
            'sender_id' => $message->sender_id,
            'content' => $message->content,
            'attachments' => $message->attachments,
            'read_at' => $message->read_at?->toISOString(),
            'created_at' => $message->created_at->toISOString(),
            'sender' => [
                'id' => $sender->id,
                'name' => $sender->name,
                'email' => $sender->email,
                'role' => $sender->role,
                'profile' => $sender->profile ? [
                    'avatar_url' => $sender->profile->profile_image_url,
                    'business_name' => $sender->profile->business_name,
                    'company_name' => $sender->profile->business_name,
                ] : null,
            ],
            'is_own' => $message->sender_id === $user->id,
        ];
    }
}
