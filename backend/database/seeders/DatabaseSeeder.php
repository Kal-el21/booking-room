<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create GA User
        $ga = User::create([
            'nama' => 'GA Admin',
            'email' => 'ga@company.com',
            'password' => Hash::make('password123'),
            'role' => 'GA',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create Admin Ruangan
        $adminRuangan = User::create([
            'nama' => 'Admin Ruangan',
            'email' => 'admin@company.com',
            'password' => Hash::make('password123'),
            'role' => 'admin_ruangan',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create Regular User
        $user = User::create([
            'nama' => 'John Doe',
            'email' => 'user@company.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'divisi' => 'IT',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        // Create Sample Rooms
        Room::create([
            'nama_ruangan' => 'Meeting Room A',
            'kapasitas' => 10,
            'lokasi' => 'Lantai 3, Gedung Utama',
            'deskripsi' => 'Ruang meeting dengan proyektor, whiteboard, AC, sound system',
            'status' => 'available',
            'is_active' => true,
            'created_by' => $adminRuangan->id_user,
        ]);

        Room::create([
            'nama_ruangan' => 'Meeting Room B',
            'kapasitas' => 20,
            'lokasi' => 'Lantai 3, Gedung Utama',
            'deskripsi' => 'Ruang meeting besar dengan proyektor, whiteboard, AC, sound system, video conference',
            'status' => 'available',
            'is_active' => true,
            'created_by' => $adminRuangan->id_user,
        ]);

        Room::create([
            'nama_ruangan' => 'Discussion Room',
            'kapasitas' => 6,
            'lokasi' => 'Lantai 2, Gedung Utama',
            'deskripsi' => 'Ruang diskusi kecil dengan whiteboard dan AC',
            'status' => 'available',
            'is_active' => true,
            'created_by' => $adminRuangan->id_user,
        ]);

        $this->command->info('Sample data created successfully!');
        $this->command->info('GA: ga@company.com / password123');
        $this->command->info('Admin: admin@company.com / password123');
        $this->command->info('User: user@company.com / password123');

    }
}
