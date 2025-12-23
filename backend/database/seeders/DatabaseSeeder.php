<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\NotificationSchedule;
use App\Models\Room;
use App\Models\RoomBooking;
use App\Models\RoomRequest;
use App\Models\User;
use Carbon\Carbon;
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
        $this->command->info('🌱 Seeding database...');

        // ============================================
        // 1. CREATE USERS
        // ============================================
        $this->command->info('👥 Creating users...');

        $ga = User::create([
            'nama' => 'GA Admin',
            'email' => 'ga@company.com',
            'password' => Hash::make('password123'),
            'role' => 'GA',
            'divisi' => 'General Affairs',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        $adminRuangan = User::create([
            'nama' => 'Admin Ruangan',
            'email' => 'admin@company.com',
            'password' => Hash::make('password123'),
            'role' => 'admin_ruangan',
            'divisi' => 'Facilities',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        $user1 = User::create([
            'nama' => 'John Doe',
            'email' => 'user@company.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'divisi' => 'IT',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        $user2 = User::create([
            'nama' => 'Jane Smith',
            'email' => 'jane@company.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'divisi' => 'Marketing',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        $user3 = User::create([
            'nama' => 'Bob Wilson',
            'email' => 'bob@company.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'divisi' => 'Sales',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        $this->command->info('✅ Created 5 users');

        // ============================================
        // 2. CREATE ROOMS
        // ============================================
        $this->command->info('🏢 Creating rooms...');

        $room1 = Room::create([
            'nama_ruangan' => 'Meeting Room A',
            'kapasitas' => 10,
            'lokasi' => 'Lantai 3, Gedung Utama',
            'deskripsi' => 'Ruang meeting dengan proyektor, whiteboard, AC, sound system, WiFi',
            'status' => 'available',
            'is_active' => true,
            'created_by' => $adminRuangan->id_user,
        ]);

        $room2 = Room::create([
            'nama_ruangan' => 'Meeting Room B',
            'kapasitas' => 20,
            'lokasi' => 'Lantai 3, Gedung Utama',
            'deskripsi' => 'Ruang meeting besar dengan proyektor, whiteboard, AC, sound system, video conference, WiFi',
            'status' => 'available',
            'is_active' => true,
            'created_by' => $adminRuangan->id_user,
        ]);

        $room3 = Room::create([
            'nama_ruangan' => 'Discussion Room',
            'kapasitas' => 6,
            'lokasi' => 'Lantai 2, Gedung Utama',
            'deskripsi' => 'Ruang diskusi kecil dengan whiteboard, TV, AC, WiFi',
            'status' => 'available',
            'is_active' => true,
            'created_by' => $adminRuangan->id_user,
        ]);

        $room4 = Room::create([
            'nama_ruangan' => 'Board Room',
            'kapasitas' => 15,
            'lokasi' => 'Lantai 4, Gedung Utama',
            'deskripsi' => 'Ruang rapat direksi dengan meja besar, proyektor, video conference, AC, WiFi, pantry',
            'status' => 'available',
            'is_active' => true,
            'created_by' => $adminRuangan->id_user,
        ]);

        $room5 = Room::create([
            'nama_ruangan' => 'Training Room',
            'kapasitas' => 30,
            'lokasi' => 'Lantai 2, Gedung Annex',
            'deskripsi' => 'Ruang training dengan proyektor, sound system, AC, WiFi, meja lipat',
            'status' => 'available',
            'is_active' => true,
            'created_by' => $adminRuangan->id_user,
        ]);

        $this->command->info('✅ Created 5 rooms');

        // ============================================
        // 3. CREATE ROOM REQUESTS & BOOKINGS
        // ============================================
        $this->command->info('📝 Creating requests and bookings...');

        // === APPROVED REQUEST with BOOKING (Past - for history) ===
        $request1 = RoomRequest::create([
            'id_user' => $user1->id_user,
            'nama_peminjam' => 'Tim IT - Sprint Planning',
            'kapasitas_dibutuhkan' => 8,
            'kebutuhan' => 'Sprint planning meeting untuk project baru',
            'notes' => 'Butuh proyektor untuk demo',
            'tanggal' => Carbon::yesterday(),
            'jam_mulai' => '09:00:00',
            'jam_selesai' => '11:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        RoomBooking::create([
            'id_request' => $request1->id_request,
            'id_room' => $room1->id_room,
            'booked_by' => $ga->id_user,
            'tanggal' => $request1->tanggal,
            'jam_mulai' => $request1->jam_mulai,
            'jam_selesai' => $request1->jam_selesai,
        ]);

        // === APPROVED REQUEST with BOOKING (Today) ===
        $request2 = RoomRequest::create([
            'id_user' => $user2->id_user,
            'nama_peminjam' => 'Tim Marketing - Campaign Review',
            'kapasitas_dibutuhkan' => 12,
            'kebutuhan' => 'Review campaign Q1 dan planning Q2',
            'notes' => 'Mohon sediakan flip chart',
            'tanggal' => Carbon::today(),
            'jam_mulai' => '14:00:00',
            'jam_selesai' => '16:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking2 = RoomBooking::create([
            'id_request' => $request2->id_request,
            'id_room' => $room2->id_room,
            'booked_by' => $ga->id_user,
            'tanggal' => $request2->tanggal,
            'jam_mulai' => $request2->jam_mulai,
            'jam_selesai' => $request2->jam_selesai,
        ]);

        // Create notification for today's booking
        Notification::create([
            'id_user' => $user2->id_user,
            'id_booking' => $booking2->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room2->nama_ruangan} untuk hari ini jam {$request2->jam_mulai} - {$request2->jam_selesai} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => now(),
        ]);

        // === APPROVED REQUEST with BOOKING (Tomorrow) ===
        $request3 = RoomRequest::create([
            'id_user' => $user3->id_user,
            'nama_peminjam' => 'Tim Sales - Client Presentation',
            'kapasitas_dibutuhkan' => 10,
            'kebutuhan' => 'Presentasi proposal ke klien besar',
            'notes' => 'Mohon pastikan video conference berfungsi',
            'tanggal' => Carbon::tomorrow(),
            'jam_mulai' => '10:00:00',
            'jam_selesai' => '12:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking3 = RoomBooking::create([
            'id_request' => $request3->id_request,
            'id_room' => $room4->id_room,
            'booked_by' => $ga->id_user,
            'tanggal' => $request3->tanggal,
            'jam_mulai' => $request3->jam_mulai,
            'jam_selesai' => $request3->jam_selesai,
        ]);

        // Create notification schedules for tomorrow's booking
        $bookingDateTime = $request3->tanggal
                                    ->copy()
                                    ->setTimeFromTimeString($request3->jam_mulai);
        // $bookingDateTime = Carbon::parse($request3->tanggal . ' ' . $request3->jam_mulai);

        NotificationSchedule::create([
            'id_booking' => $booking3->id_booking,
            'notify_type' => '24h_before',
            'notify_at' => $bookingDateTime->copy()->subHours(24),
            'channel' => 'both',
        ]);

        NotificationSchedule::create([
            'id_booking' => $booking3->id_booking,
            'notify_type' => '3h_before',
            'notify_at' => $bookingDateTime->copy()->subHours(3),
            'channel' => 'both',
        ]);

        NotificationSchedule::create([
            'id_booking' => $booking3->id_booking,
            'notify_type' => '30m_before',
            'notify_at' => $bookingDateTime->copy()->subMinutes(30),
            'channel' => 'both',
        ]);

        // === PENDING REQUESTS (for GA to process) ===
        $pendingRequest1 = RoomRequest::create([
            'id_user' => $user1->id_user,
            'nama_peminjam' => 'Tim IT - Code Review',
            'kapasitas_dibutuhkan' => 6,
            'kebutuhan' => 'Code review session untuk feature baru',
            'notes' => 'Butuh ruang kecil saja',
            'tanggal' => Carbon::today()->addDays(2),
            'jam_mulai' => '13:00:00',
            'jam_selesai' => '15:00:00',
            'status' => 'pending',
        ]);

        $pendingRequest2 = RoomRequest::create([
            'id_user' => $user2->id_user,
            'nama_peminjam' => 'Tim Marketing - Brainstorming',
            'kapasitas_dibutuhkan' => 8,
            'kebutuhan' => 'Brainstorming ide campaign baru',
            'notes' => 'Butuh whiteboard besar',
            'tanggal' => Carbon::today()->addDays(3),
            'jam_mulai' => '09:00:00',
            'jam_selesai' => '11:00:00',
            'status' => 'pending',
        ]);

        $pendingRequest3 = RoomRequest::create([
            'id_user' => $user3->id_user,
            'nama_peminjam' => 'Tim Sales - Training',
            'kapasitas_dibutuhkan' => 25,
            'kebutuhan' => 'Training produk baru untuk sales team',
            'notes' => 'Butuh ruang besar dan sound system',
            'tanggal' => Carbon::today()->addDays(5),
            'jam_mulai' => '08:00:00',
            'jam_selesai' => '12:00:00',
            'status' => 'pending',
        ]);

        // === REJECTED REQUEST (for user to see rejection) ===
        $rejectedRequest = RoomRequest::create([
            'id_user' => $user1->id_user,
            'nama_peminjam' => 'Tim IT - Workshop',
            'kapasitas_dibutuhkan' => 50,
            'kebutuhan' => 'Workshop internal',
            'notes' => null,
            'tanggal' => Carbon::today()->addDays(1),
            'jam_mulai' => '08:00:00',
            'jam_selesai' => '17:00:00',
            'status' => 'rejected',
            'id_assigned_by' => $ga->id_user,
            'rejected_reason' => 'Kapasitas terlalu besar. Ruangan terbesar kami hanya 30 orang. Mohon split menjadi 2 sesi atau gunakan auditorium.',
        ]);

        // Create notification for rejection
        Notification::create([
            'id_user' => $user1->id_user,
            'id_booking' => null,
            'title' => 'Request Ditolak',
            'message' => "Request booking untuk tanggal {$rejectedRequest->tanggal->format('d/m/Y')} telah ditolak. Alasan: {$rejectedRequest->rejected_reason}",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => now(),
        ]);

        $this->command->info('✅ Created 7 requests (3 approved, 3 pending, 1 rejected)');
        $this->command->info('✅ Created 3 bookings');
        $this->command->info('✅ Created 3 notification schedules');

        // ============================================
        // SUMMARY
        // ============================================
        $this->command->info('');
        $this->command->info('🎉 Database seeded successfully!');
        $this->command->info('');
        $this->command->info('📋 Login Credentials:');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('👤 User Role:');
        $this->command->info('   Email: user@company.com');
        $this->command->info('   Password: password123');
        $this->command->info('   Name: John Doe');
        $this->command->info('   Division: IT');
        $this->command->info('');
        $this->command->info('🏢 Admin Ruangan Role:');
        $this->command->info('   Email: admin@company.com');
        $this->command->info('   Password: password123');
        $this->command->info('   Name: Admin Ruangan');
        $this->command->info('   Division: Facilities');
        $this->command->info('');
        $this->command->info('👔 GA (General Affairs) Role:');
        $this->command->info('   Email: ga@company.com');
        $this->command->info('   Password: password123');
        $this->command->info('   Name: GA Admin');
        $this->command->info('   Division: General Affairs');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('');
        $this->command->info('📊 Data Summary:');
        $this->command->info("   Users: " . User::count());
        $this->command->info("   Rooms: " . Room::count());
        $this->command->info("   Requests: " . RoomRequest::count());
        $this->command->info("   Bookings: " . RoomBooking::count());
        $this->command->info("   Notifications: " . Notification::count());
        $this->command->info("   Notification Schedules: " . NotificationSchedule::count());
        $this->command->info('');
        $this->command->info('🚀 Ready to test! Start with:');
        $this->command->info('   php artisan serve');
        $this->command->info('   php artisan queue:work');
        $this->command->info('   php artisan schedule:work');
        $this->command->info('');

        // // Create GA User
        // $ga = User::create([
        //     'nama' => 'GA Admin',
        //     'email' => 'ga@company.com',
        //     'password' => Hash::make('password123'),
        //     'role' => 'GA',
        //     'email_verified_at' => now(),
        //     'is_active' => true,
        // ]);

        // // Create Admin Ruangan
        // $adminRuangan = User::create([
        //     'nama' => 'Admin Ruangan',
        //     'email' => 'admin@company.com',
        //     'password' => Hash::make('password123'),
        //     'role' => 'admin_ruangan',
        //     'email_verified_at' => now(),
        //     'is_active' => true,
        // ]);

        // // Create Regular User
        // $user = User::create([
        //     'nama' => 'John Doe',
        //     'email' => 'user@company.com',
        //     'password' => Hash::make('password123'),
        //     'role' => 'user',
        //     'divisi' => 'IT',
        //     'email_verified_at' => now(),
        //     'is_active' => true,
        // ]);

        // // Create Sample Rooms
        // Room::create([
        //     'nama_ruangan' => 'Meeting Room A',
        //     'kapasitas' => 10,
        //     'lokasi' => 'Lantai 3, Gedung Utama',
        //     'deskripsi' => 'Ruang meeting dengan proyektor, whiteboard, AC, sound system',
        //     'status' => 'available',
        //     'is_active' => true,
        //     'created_by' => $adminRuangan->id_user,
        // ]);

        // Room::create([
        //     'nama_ruangan' => 'Meeting Room B',
        //     'kapasitas' => 20,
        //     'lokasi' => 'Lantai 3, Gedung Utama',
        //     'deskripsi' => 'Ruang meeting besar dengan proyektor, whiteboard, AC, sound system, video conference',
        //     'status' => 'available',
        //     'is_active' => true,
        //     'created_by' => $adminRuangan->id_user,
        // ]);

        // Room::create([
        //     'nama_ruangan' => 'Discussion Room',
        //     'kapasitas' => 6,
        //     'lokasi' => 'Lantai 2, Gedung Utama',
        //     'deskripsi' => 'Ruang diskusi kecil dengan whiteboard dan AC',
        //     'status' => 'available',
        //     'is_active' => true,
        //     'created_by' => $adminRuangan->id_user,
        // ]);

        // $this->command->info('Sample data created successfully!');
        // $this->command->info('GA: ga@company.com / password123');
        // $this->command->info('Admin: admin@company.com / password123');
        // $this->command->info('User: user@company.com / password123');

    }
}
