<?php

namespace App\Jobs;

use App\Mail\BookingReminderMail;
use App\Models\Notification;
use App\Models\NotificationSchedule;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendBookingReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $schedule;

    /**
     * Create a new job instance.
     */
    public function __construct(NotificationSchedule $schedule)
    {
        $this->schedule = $schedule;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $booking = $this->schedule->booking;
        $user = $booking->request->user;
        $room = $booking->room;

        // Get reminder message based on type
        $message = $this->getReminderMessage($this->schedule->notify_type, $booking, $room);

        // Create in-app notification
        Notification::create([
            'id_user' => $user->id_user,
            'id_booking' => $booking->id_booking,
            'title' => 'Reminder Booking Ruangan',
            'message' => $message,
            'type' => 'reminder',
            'channel' => $this->schedule->channel,
            'sent_at' => now(),
        ]);

        // Send email if channel includes email
        if (in_array($this->schedule->channel, ['email', 'both'])) {
            Mail::to($user->email)->send(
                new BookingReminderMail($booking, $this->schedule->notify_type)
            );
        }

        // Mark schedule as sent
        $this->schedule->markAsSent();
    }

    private function getReminderMessage($type, $booking, $room)
    {
        $timeMap = [
            '24h_before' => '24 jam',
            '3h_before' => '3 jam',
            '30m_before' => '30 menit',
        ];

        $time = $timeMap[$type] ?? 'beberapa saat';

        return "Reminder: Booking ruangan {$room->nama_ruangan} akan dimulai dalam {$time}. " .
               "Tanggal: {$booking->tanggal->format('d/m/Y')}, " .
               "Jam: {$booking->jam_mulai} - {$booking->jam_selesai}. " .
               "Lokasi: {$room->lokasi}";
    }
}
