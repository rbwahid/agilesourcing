<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TrialEndingNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Carbon $trialEndsAt,
        public int $daysRemaining
    ) {}

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $daysText = $this->daysRemaining === 1 ? '1 day' : $this->daysRemaining.' days';
        $endDate = $this->trialEndsAt->format('F j, Y');

        return (new MailMessage)
            ->subject('Your Trial Ends in '.$daysText)
            ->greeting('Hello '.$notifiable->name.',')
            ->line("Your AgileSourcing trial ends in **{$daysText}** on {$endDate}.")
            ->line('To continue using AgileSourcing without interruption:')
            ->line('- Add a payment method to your account')
            ->line('- Choose a plan that fits your needs')
            ->line('What you\'ll keep access to:')
            ->line('- AI-powered design analysis')
            ->line('- Instagram validation campaigns')
            ->line('- Supplier directory and messaging')
            ->line('- All your uploaded designs and data')
            ->action('Add Payment Method', url('/billing'))
            ->line('Have questions? Reply to this email and we\'ll be happy to help!');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'trial_ends_at' => $this->trialEndsAt->toIso8601String(),
            'days_remaining' => $this->daysRemaining,
        ];
    }
}
