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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id('id_notification');
            $table->foreignId('id_user')->constrained('users', 'id_user')->onDelete('cascade');
            $table->foreignId('id_booking')->nullable()->constrained('room_bookings', 'id_booking')->onDelete('cascade');
            $table->string('title');
            $table->text('message');
            $table->enum('type', ['booking_confirmed', 'reminder', 'cancellation', 'room_changed'])->default('reminder');
            $table->enum('channel', ['email', 'in-app', 'both'])->default('both');
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index('id_user');
            $table->index('is_read');
            $table->index(['id_user', 'is_read']); // untuk unread notifications
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
