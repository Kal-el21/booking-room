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
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id('id_preference');
            $table->foreignId('id_user')->unique()->constrained('users', 'id_user')->onDelete('cascade');
            $table->boolean('notification_24h')->default(true);
            $table->boolean('notification_3h')->default(true);
            $table->boolean('notification_30m')->default(true);
            $table->boolean('email_notifications')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
    }
};
