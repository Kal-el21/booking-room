<?php

namespace App\Mail;

use App\Models\RoomBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $reminderType;

    /**
     * Create a new message instance.
     */
    public function __construct(RoomBooking $booking, $reminderType)
    {
        $this->booking = $booking;
        $this->reminderType = $reminderType;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Booking Reminder Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    public function build()
    {
        $booking = $this->booking->load(['room', 'request']);

        $timeMap = [
            '24h_before' => '24 jam',
            '3h_before' => '3 jam',
            '30m_before' => '30 menit',
        ];

        $timeText = $timeMap[$this->reminderType] ?? 'beberapa saat';

        return $this->subject("Reminder: Booking Ruangan dalam {$timeText}")
                    ->view('emails.booking-reminder')
                    ->with([
                        'userName' => $booking->request->user->nama,
                        'roomName' => $booking->room->nama_ruangan,
                        'location' => $booking->room->lokasi,
                        'date' => $booking->tanggal->format('d F Y'),
                        'timeStart' => $booking->jam_mulai,
                        'timeEnd' => $booking->jam_selesai,
                        'reminderTime' => $timeText,
                    ]);
    }

}
