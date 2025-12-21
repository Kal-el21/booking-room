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
                        'userName' => $booking->request->user->nama,
                        'roomName' => $booking->room->nama_ruangan,
                        'location' => $booking->room->lokasi,
                        'date' => $booking->tanggal->format('d F Y'),
                        'timeStart' => $booking->jam_mulai,
                        'timeEnd' => $booking->jam_selesai,
                        'capacity' => $booking->room->kapasitas,
                        'description' => $booking->room->deskripsi,
                        'purpose' => $booking->request->kebutuhan,
                    ]);
    }
}
