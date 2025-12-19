<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notification_schedules', function (Blueprint $table) {
            $table->id('id_schedule');
            $table->foreignId('id_booking')->constrained('room_bookings', 'id_booking')->onDelete('cascade');
            $table->enum('notify_type', ['24h_before', '3h_before', '30m_before']);
            $table->timestamp('notify_at'); // waktu notifikasi dijadwalkan
            $table->enum('channel', ['email', 'in-app', 'both'])->default('both');
            $table->boolean('is_sent')->default(false);
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index('notify_at');
            $table->index('is_sent');
            $table->index(['notify_at', 'is_sent']); // untuk scheduled jobs
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_schedules');
    }
};
