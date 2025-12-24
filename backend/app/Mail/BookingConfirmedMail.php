<?php

namespace App\Mail;

use App\Models\RoomBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;

    /**
     * Create a new message instance.
     */
    public function __construct(RoomBooking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Booking Confirmed Mail',
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

        return $this->subject('Booking Ruangan Dikonfirmasi')
                    ->view('emails.booking-confirmed')
                    ->with([
                        'userName' => $booking->request->user->name,
                        'roomName' => $booking->room->room_name,
                        'location' => $booking->room->location,
                        'date' => $booking->date->format('d F Y'),
                        'timeStart' => $booking->start_time,
                        'timeEnd' => $booking->end_time,
                        'capacity' => $booking->room->capacity,
                        'description' => $booking->room->description,
                        'purpose' => $booking->request->purpose,
                    ]);
    }
}
