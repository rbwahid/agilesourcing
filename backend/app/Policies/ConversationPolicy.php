<?php

namespace App\Policies;

use App\Models\Conversation;
use App\Models\User;

class ConversationPolicy
{
    /**
     * Determine whether the user can view any conversations.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the conversation.
     */
    public function view(User $user, Conversation $conversation): bool
    {
        return $this->isParticipant($user, $conversation);
    }

    /**
     * Determine whether the user can create conversations.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['designer', 'supplier']);
    }

    /**
     * Determine whether the user can participate in the conversation.
     */
    public function participate(User $user, Conversation $conversation): bool
    {
        return $this->isParticipant($user, $conversation);
    }

    /**
     * Determine whether the user can archive the conversation.
     */
    public function archive(User $user, Conversation $conversation): bool
    {
        return $this->isParticipant($user, $conversation);
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

        // Admins can view all conversations
        return $user->hasRole(['admin', 'super_admin']);
    }
}
