<?php

namespace App\Jobs;

use App\Mail\BookingConfirmedMail;
use App\Models\Notification;
use App\Models\NotificationSchedule;
use App\Models\RoomBooking;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendBookingConfirmationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $booking;

    /**
     * Create a new job instance.
     */
    public function __construct(RoomBooking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $user = $this->booking->request->user;
        $room = $this->booking->room;

        // Create in-app notification
        Notification::create([
            'id_user' => $user->id_user,
            'id_booking' => $this->booking->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room->room_name} untuk tanggal {$this->booking->date->format('d/m/Y')} jam {$this->booking->start_time} - {$this->booking->end_time} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'sent_at' => now(),
        ]);

        // Send email if user preference allows
        if ($user->preference->canSendEmail()) {
            Mail::to($user->email)->send(new BookingConfirmedMail($this->booking));
        }

        // Create notification schedules
        $this->createNotificationSchedules();
    }

    private function createNotificationSchedules()
    {
        $user = $this->booking->request->user;
        $bookingDateTime = Carbon::parse($this->booking->date . ' ' . $this->booking->start_time);

        // 24 hours before
        if ($user->preference->shouldNotify('24h_before')) {
            $notifyAt = $bookingDateTime->copy()->subHours(24);

            // Only create if notification time is in the future
            if ($notifyAt->isFuture()) {
                NotificationSchedule::create([
                    'id_booking' => $this->booking->id_booking,
                    'notify_type' => '24h_before',
                    'notify_at' => $notifyAt,
                    'channel' => $user->preference->canSendEmail() ? 'both' : 'in-app',
                ]);
            }
        }

        // 3 hours before
        if ($user->preference->shouldNotify('3h_before')) {
            $notifyAt = $bookingDateTime->copy()->subHours(3);

            if ($notifyAt->isFuture()) {
                NotificationSchedule::create([
                    'id_booking' => $this->booking->id_booking,
                    'notify_type' => '3h_before',
                    'notify_at' => $notifyAt,
                    'channel' => $user->preference->canSendEmail() ? 'both' : 'in-app',
                ]);
            }
        }

        // 30 minutes before
        if ($user->preference->shouldNotify('30m_before')) {
            $notifyAt = $bookingDateTime->copy()->subMinutes(30);

            if ($notifyAt->isFuture()) {
                NotificationSchedule::create([
                    'id_booking' => $this->booking->id_booking,
                    'notify_type' => '30m_before',
                    'notify_at' => $notifyAt,
                    'channel' => $user->preference->canSendEmail() ? 'both' : 'in-app',
                ]);
            }
        }
    }
}
