<?php

namespace App\Listeners;

use App\Models\CommunicationLog;
use App\Models\User;
use Illuminate\Notifications\Events\NotificationSent;

class LogNotificationSent
{
    /**
     * Handle the event.
     */
    public function handle(NotificationSent $event): void
    {
        // Only log notifications for User models
        if (! $event->notifiable instanceof User) {
            return;
        }

        $notification = $event->notification;
        $channel = $event->channel;

        // Determine the type based on channel
        $type = $this->determineType($channel);

        // Get the subject from the notification if available
        $subject = $this->getSubject($notification, $channel);

        // Get content preview
        $content = $this->getContentPreview($notification, $channel, $event->notifiable);

        CommunicationLog::create([
            'user_id' => $event->notifiable->id,
            'type' => $type,
            'channel' => $channel,
            'subject' => $subject,
            'content' => $content,
            'status' => 'sent',
            'metadata' => [
                'notification_class' => get_class($notification),
                'notification_id' => $notification->id ?? null,
            ],
            'triggered_by' => null, // System triggered
        ]);
    }

    /**
     * Determine the communication type based on the channel.
     */
    private function determineType(string $channel): string
    {
        return match ($channel) {
            'mail' => 'email',
            'database' => 'notification',
            default => 'notification',
        };
    }

    /**
     * Get the subject from the notification.
     */
    private function getSubject(object $notification, string $channel): string
    {
        // Try to get subject from toMail if it's an email
        if ($channel === 'mail' && method_exists($notification, 'toMail')) {
            try {
                // We can't call toMail without the notifiable, so use class name
                $className = class_basename($notification);

                return $this->formatNotificationName($className);
            } catch (\Exception $e) {
                // Fallback to class name
            }
        }

        // Fallback: use the notification class name
        $className = class_basename($notification);

        return $this->formatNotificationName($className);
    }

    /**
     * Get a content preview from the notification.
     */
    private function getContentPreview(object $notification, string $channel, User $notifiable): ?string
    {
        // For database notifications, try to get the data
        if ($channel === 'database' && method_exists($notification, 'toDatabase')) {
            try {
                $data = $notification->toDatabase($notifiable);

                if (is_array($data)) {
                    return json_encode($data);
                }
            } catch (\Exception $e) {
                // Ignore errors
            }
        }

        return null;
    }

    /**
     * Format a notification class name into a readable subject.
     */
    private function formatNotificationName(string $className): string
    {
        // Remove "Notification" suffix if present
        $name = preg_replace('/Notification$/', '', $className);

        // Convert camelCase to Title Case with spaces
        $formatted = preg_replace('/([a-z])([A-Z])/', '$1 $2', $name);

        return trim($formatted);
    }
}
