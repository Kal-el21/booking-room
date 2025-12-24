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
        Schema::create('room_bookings', function (Blueprint $table) {
            $table->id('id_booking');
            $table->foreignId('id_request')->constrained('room_requests', 'id_request')->onDelete('cascade');
            $table->foreignId('id_room')->constrained('rooms', 'id_room')->onDelete('cascade');
            $table->foreignId('booked_by')->constrained('users', 'id_user')->onDelete('cascade'); // GA yang booking
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();
            $table->softDeletes();

            $table->index('date');
            $table->index('id_room');
            $table->index(['id_room', 'date']); // untuk cek availability
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_bookings');
    }
};
