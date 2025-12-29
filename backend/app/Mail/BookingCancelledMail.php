<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingCancelledMail extends Mailable
{
    use Queueable, SerializesModels;
public $bookingData;
    public $cancelledBy;

    /**
     * Create a new message instance.
     */
    public function __construct($bookingData, $cancelledBy)
    {
        $this->bookingData = $bookingData;
        $this->cancelledBy = $cancelledBy;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Booking Cancelled Mail',
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
        return $this->subject('Booking Ruangan Dibatalkan')
                    ->view('emails.booking-cancelled')
                    ->with([
                        'roomName' => $this->bookingData['room_name'],
                        'date' => $this->bookingData['date'],
                        'timeStart' => $this->bookingData['start_time'],
                        'timeEnd' => $this->bookingData['end_time'],
                        'cancelledBy' => $this->cancelledBy,
                    ]);
    }
}
