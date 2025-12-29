<?php

namespace App\Jobs;

use App\Mail\BookingRejectedMail;
use App\Models\Notification;
use App\Models\RoomRequest;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendBookingRejectedJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $request;

    /**
     * Create a new job instance.
     */
    public function __construct(RoomRequest $request)
    {
        $this->request = $request;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $user = $this->request->user;

        // Create in-app notification
        Notification::create([
            'id_user' => $user->id_user,
            'id_booking' => null,
            'title' => 'Request Ditolak',
            'message' => "Request booking untuk tanggal {$this->request->date->format('d/m/Y')} telah ditolak. Alasan: {$this->request->rejected_reason}",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'sent_at' => now(),
        ]);

        // Send email
        if ($user->preference->canSendEmail()) {
            Mail::to($user->email)->send(new BookingRejectedMail($this->request));
        }
    }
}
