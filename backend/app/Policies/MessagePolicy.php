<?php

namespace App\Policies;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;

class MessagePolicy
{
    /**
     * Determine whether the user can view any messages in a conversation.
     */
    public function viewAny(User $user, Conversation $conversation): bool
    {
        return $this->isParticipant($user, $conversation);
    }

    /**
     * Determine whether the user can view the message.
     */
    public function view(User $user, Message $message): bool
    {
        return $this->isParticipant($user, $message->conversation);
    }

    /**
     * Determine whether the user can create messages in a conversation.
     */
    public function create(User $user, Conversation $conversation): bool
    {
        // Only participants can send messages
        if (! $this->isParticipant($user, $conversation)) {
            return false;
        }

        // Cannot send messages in archived conversations
        return $conversation->status !== 'archived';
    }

    /**
     * Determine whether the user can delete the message.
     */
    public function delete(User $user, Message $message): bool
    {
        // Only the sender can delete their own messages
        if ($message->sender_id === $user->id) {
            return true;
        }

        // Admins can delete any message
        return $user->hasRole(['admin', 'super_admin']);
    }

    /**
     * Check if user is a participant in the conversation.
     */
    protected function isParticipant(User $user, Conversation $conversation): bool
    {
        // Designer participant
        if ($conversation->designer_id === $user->id) {
            return true;
        }

        // Supplier participant
        if ($user->hasRole('supplier') && $user->supplier) {
            return $conversation->supplier_id === $user->supplier->id;
        }

        return false;
    }
}
