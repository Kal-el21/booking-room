<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingRejectedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $request;

    /**
     * Create a new message instance.
     */
    public function __construct($request)
    {
        $this->request = $request;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Booking Rejected Mail',
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
        return $this->subject('Request Booking Ruangan Ditolak')
                    ->view('emails.booking-rejected')
                    ->with([
                        'userName' => $this->request->user->name,
                        'date' => $this->request->date->format('d F Y'),
                        'timeStart' => $this->request->start_time,
                        'timeEnd' => $this->request->end_time,
                        'capacity' => $this->request->required_capacity,
                        'purpose' => $this->request->purpose,
                        'rejectedReason' => $this->request->rejected_reason,
                        'rejectedBy' => $this->request->assignedBy->name ?? 'Admin',
                    ]);
    }
}
