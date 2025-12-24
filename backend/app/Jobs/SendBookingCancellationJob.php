<?php

namespace App\Jobs;

use App\Mail\BookingCancelledMail;
use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendBookingCancellationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $userId;
    public $bookingData;
    public $cancelledBy;

    /**
     * Create a new job instance.
     */
    public function __construct($userId, $bookingData, $cancelledBy)
    {
        $this->userId = $userId;
        $this->bookingData = $bookingData;
        $this->cancelledBy = $cancelledBy;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $user = \App\Models\User::find($this->userId);

        if (!$user) {
            return;
        }

        // Create in-app notification
        Notification::create([
            'id_user' => $user->id_user,
            'id_booking' => null,
            'title' => 'Booking Dibatalkan',
            'message' => "Booking ruangan {$this->bookingData['room_name']} untuk tanggal {$this->bookingData['date']} jam {$this->bookingData['start_time']} - {$this->bookingData['end_time']} telah dibatalkan.",
            'type' => 'cancellation',
            'channel' => 'both',
            'sent_at' => now(),
        ]);

        // Send email
        if ($user->preference && $user->preference->canSendEmail()) {
            Mail::to($user->email)->send(
                new BookingCancelledMail($this->bookingData, $this->cancelledBy)
            );
        }
    }
}
