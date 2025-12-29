<?php

namespace App\Console\Commands;

use App\Jobs\SendBookingReminderJob;
use App\Models\NotificationSchedule;
use Illuminate\Console\Command;

class SendScheduledNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get all due notifications
        $dueNotifications = NotificationSchedule::due()
                                                ->with(['booking.request.user', 'booking.room'])
                                                ->get();

        if ($dueNotifications->isEmpty()) {
            $this->info('No notifications to send.');
            return;
        }

        $count = 0;
        foreach ($dueNotifications as $schedule) {
            // Dispatch job to send notification
            SendBookingReminderJob::dispatch($schedule);
            $count++;
        }

        $this->info("Dispatched {$count} notification jobs.");
    }
}
