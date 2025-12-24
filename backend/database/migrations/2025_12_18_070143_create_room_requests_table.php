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
        Schema::create('room_requests', function (Blueprint $table) {
            $table->id('id_request');
            $table->foreignId('id_user')->constrained('users', 'id_user')->onDelete('cascade');
            // $table->string('nama_peminjam');
            $table->integer('required_capacity');
            $table->text('purpose'); // keperluan rapat, dll
            $table->text('notes')->nullable(); // catatan tambahan dari user
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->foreignId('id_assigned_by')->nullable()->constrained('users', 'id_user')->onDelete('set null'); // GA yang assign
            $table->text('rejected_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('date');
            $table->index(['date', 'status']); // composite index untuk query
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_requests');
    }
};
