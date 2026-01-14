<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentFailedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $invoiceId,
        public int $amount,
        public string $currency = 'USD'
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
        $formattedAmount = '$'.number_format($this->amount / 100, 2);

        return (new MailMessage)
            ->subject('Payment Failed - Action Required')
            ->greeting('Hello '.$notifiable->name.',')
            ->line('We were unable to process your payment of '.$formattedAmount.' for your AgileSourcing subscription.')
            ->line('This might be due to:')
            ->line('- Insufficient funds')
            ->line('- Expired card')
            ->line('- Card declined by your bank')
            ->line('Please update your payment method to continue enjoying AgileSourcing without interruption.')
            ->action('Update Payment Method', url('/billing'))
            ->line('If you don\'t update your payment method within 7 days, your subscription will be cancelled.')
            ->line('If you have any questions, please contact our support team.');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'invoice_id' => $this->invoiceId,
            'amount' => $this->amount,
            'currency' => $this->currency,
        ];
    }
}
