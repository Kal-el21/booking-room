<?php

namespace App\Console\Commands;

use App\Models\Room;
use App\Models\RoomBooking;
use Illuminate\Console\Command;

class UpdateRoomStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rooms:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update room status based on current bookings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = now();
        $today = $now->toDateString();
        $currentTime = $now->format('H:i:s');

        // Get all active rooms
        $rooms = Room::active()->get();

        foreach ($rooms as $room) {
            // Check if room has active booking right now
            $activeBooking = RoomBooking::where('id_room', $room->id_room)
                                       ->where('tanggal', $today)
                                       ->where('jam_mulai', '<=', $currentTime)
                                       ->where('jam_selesai', '>=', $currentTime)
                                       ->exists();

            if ($activeBooking) {
                $room->update(['status' => 'occupied']);
            } else {
                // Only update to available if currently occupied
                if ($room->status === 'occupied') {
                    $room->update(['status' => 'available']);
                }
            }
        }

        $this->info('Room statuses updated successfully.');
    }
}
