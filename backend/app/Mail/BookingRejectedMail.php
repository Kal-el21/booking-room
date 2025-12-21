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
                        'userName' => $this->request->user->nama,
                        'date' => $this->request->tanggal->format('d F Y'),
                        'timeStart' => $this->request->jam_mulai,
                        'timeEnd' => $this->request->jam_selesai,
                        'capacity' => $this->request->kapasitas_dibutuhkan,
                        'purpose' => $this->request->kebutuhan,
                        'rejectedReason' => $this->request->rejected_reason,
                        'rejectedBy' => $this->request->assignedBy->nama ?? 'Admin',
                    ]);
    }
}
