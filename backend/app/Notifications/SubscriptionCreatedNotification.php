<?php

namespace App\Notifications;

use App\Models\Plan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Plan $plan,
        public string $billingPeriod
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
        $price = $this->billingPeriod === 'annual'
            ? '$'.number_format($this->plan->price_annual, 2).'/year'
            : '$'.number_format($this->plan->price_monthly, 2).'/month';

        $trialMessage = $notifiable->onTrial()
            ? "Your 14-day free trial has started! You won't be charged until the trial ends."
            : 'Your subscription is now active.';

        return (new MailMessage)
            ->subject('Welcome to AgileSourcing '.$this->plan->name)
            ->greeting('Welcome to AgileSourcing!')
            ->line($trialMessage)
            ->line("**Your Plan:** {$this->plan->name}")
            ->line("**Price:** {$price}")
            ->line('Here\'s what you can do:')
            ->line('- Upload and analyze your designs with AI')
            ->line('- Validate designs with Instagram engagement')
            ->line('- Connect with verified suppliers')
            ->line('- Message and collaborate with suppliers')
            ->action('Go to Dashboard', url('/dashboard'))
            ->line('Thank you for choosing AgileSourcing to power your fashion business!');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'plan_id' => $this->plan->id,
            'plan_name' => $this->plan->name,
            'billing_period' => $this->billingPeriod,
        ];
    }
}
