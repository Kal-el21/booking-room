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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id('id_room');
            $table->string('room_name');
            $table->integer('capacity');
            $table->string('location'); // termasuk lantai
            $table->text('description')->nullable(); // fasilitas dijelaskan di sini
            $table->enum('status', ['available', 'occupied', 'maintenance'])->default('available');
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->constrained('users', 'id_user')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
