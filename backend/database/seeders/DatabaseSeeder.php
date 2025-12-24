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
            'name' => 'GA Admin',
            'email' => 'ga@company.com',
            'password' => Hash::make('password123'),
            'role' => 'GA',
            'division' => 'General Affairs',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        $adminRuangan = User::create([
            'name' => 'Admin Ruangan',
            'email' => 'admin@company.com',
            'password' => Hash::make('password123'),
            'role' => 'room_admin',
            'division' => 'Facilities',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        $user1 = User::create([
            'name' => 'John Doe',
            'email' => 'user@company.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'division' => 'IT',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        $user2 = User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@company.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'division' => 'Marketing',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        $user3 = User::create([
            'name' => 'Bob Wilson',
            'email' => 'bob@company.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'division' => 'Sales',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        $this->command->info('✅ Created 5 users');

        // ============================================
        // 2. CREATE ROOMS
        // ============================================
        $this->command->info('🏢 Creating rooms...');

        $room1 = Room::create([
            'room_name' => 'Meeting Room A',
            'capacity' => 10,
            'location' => 'Lantai 3, Gedung Utama',
            'description' => 'Ruang meeting dengan proyektor, whiteboard, AC, sound system, WiFi',
            'status' => 'available',
            'is_active' => true,
            'created_by' => $adminRuangan->id_user,
        ]);

        $room2 = Room::create([
            'room_name' => 'Meeting Room B',
            'capacity' => 20,
            'location' => 'Lantai 3, Gedung Utama',
            'description' => 'Ruang meeting besar dengan proyektor, whiteboard, AC, sound system, video conference, WiFi',
            'status' => 'available',
            'is_active' => true,
            'created_by' => $adminRuangan->id_user,
        ]);

        $room3 = Room::create([
            'room_name' => 'Discussion Room',
            'capacity' => 6,
            'location' => 'Lantai 2, Gedung Utama',
            'description' => 'Ruang diskusi kecil dengan whiteboard, TV, AC, WiFi',
            'status' => 'available',
            'is_active' => true,
            'created_by' => $adminRuangan->id_user,
        ]);

        $room4 = Room::create([
            'room_name' => 'Board Room',
            'capacity' => 15,
            'location' => 'Lantai 4, Gedung Utama',
            'description' => 'Ruang rapat direksi dengan meja besar, proyektor, video conference, AC, WiFi, pantry',
            'status' => 'available',
            'is_active' => true,
            'created_by' => $adminRuangan->id_user,
        ]);

        $room5 = Room::create([
            'room_name' => 'Training Room',
            'capacity' => 30,
            'location' => 'Lantai 2, Gedung Annex',
            'description' => 'Ruang training dengan proyektor, sound system, AC, WiFi, meja lipat',
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
            // 'nama_peminjam' => 'Tim IT - Sprint Planning',
            'required_capacity' => 8,
            'purpose' => 'Sprint planning meeting untuk project baru',
            'notes' => 'Butuh proyektor untuk demo',
            'date' => Carbon::yesterday(),
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        RoomBooking::create([
            'id_request' => $request1->id_request,
            'id_room' => $room1->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request1->date,
            'start_time' => $request1->start_time,
            'end_time' => $request1->end_time,
        ]);

        // === APPROVED REQUEST with BOOKING (Today) ===
        $request2 = RoomRequest::create([
            'id_user' => $user2->id_user,
            // 'nama_peminjam' => 'Tim Marketing - Campaign Review',
            'required_capacity' => 12,
            'purpose' => 'Review campaign Q1 dan planning Q2',
            'notes' => 'Mohon sediakan flip chart',
            'date' => Carbon::today(),
            'start_time' => '14:00:00',
            'end_time' => '16:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking2 = RoomBooking::create([
            'id_request' => $request2->id_request,
            'id_room' => $room2->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request2->date,
            'start_time' => $request2->start_time,
            'end_time' => $request2->end_time,
        ]);

        // Create notification for today's booking
        Notification::create([
            'id_user' => $user2->id_user,
            'id_booking' => $booking2->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room2->room_name} untuk hari ini jam {$request2->start_time} - {$request2->end_time} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => now(),
        ]);

        // === APPROVED REQUEST with BOOKING (Tomorrow) ===
        $request3 = RoomRequest::create([
            'id_user' => $user3->id_user,
            // 'nama_peminjam' => 'Tim Sales - Client Presentation',
            'required_capacity' => 10,
            'purpose' => 'Presentasi proposal ke klien besar',
            'notes' => 'Mohon pastikan video conference berfungsi',
            'date' => Carbon::tomorrow(),
            'start_time' => '10:00:00',
            'end_time' => '12:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking3 = RoomBooking::create([
            'id_request' => $request3->id_request,
            'id_room' => $room4->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request3->date,
            'start_time' => $request3->start_time,
            'end_time' => $request3->end_time,
        ]);

        // Create notification schedules for tomorrow's booking
        $bookingDateTime = $request3->date
                                    ->copy()
                                    ->setTimeFromTimeString($request3->start_time);
        // $bookingDateTime = Carbon::parse($request3->date . ' ' . $request3->start_time);

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
            // 'nama_peminjam' => 'Tim IT - Code Review',
            'required_capacity' => 6,
            'purpose' => 'Code review session untuk feature baru',
            'notes' => 'Butuh ruang kecil saja',
            'date' => Carbon::today()->addDays(2),
            'start_time' => '13:00:00',
            'end_time' => '15:00:00',
            'status' => 'pending',
        ]);

        $pendingRequest2 = RoomRequest::create([
            'id_user' => $user2->id_user,
            // 'nama_peminjam' => 'Tim Marketing - Brainstorming',
            'required_capacity' => 8,
            'purpose' => 'Brainstorming ide campaign baru',
            'notes' => 'Butuh whiteboard besar',
            'date' => Carbon::today()->addDays(3),
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
            'status' => 'pending',
        ]);

        $pendingRequest3 = RoomRequest::create([
            'id_user' => $user3->id_user,
            // 'nama_peminjam' => 'Tim Sales - Training',
            'required_capacity' => 25,
            'purpose' => 'Training produk baru untuk sales team',
            'notes' => 'Butuh ruang besar dan sound system',
            'date' => Carbon::today()->addDays(5),
            'start_time' => '08:00:00',
            'end_time' => '12:00:00',
            'status' => 'pending',
        ]);

        // === REJECTED REQUEST (for user to see rejection) ===
        $rejectedRequest = RoomRequest::create([
            'id_user' => $user1->id_user,
            // 'nama_peminjam' => 'Tim IT - Workshop',
            'required_capacity' => 50,
            'purpose' => 'Workshop internal',
            'notes' => null,
            'date' => Carbon::today()->addDays(1),
            'start_time' => '08:00:00',
            'end_time' => '17:00:00',
            'status' => 'rejected',
            'id_assigned_by' => $ga->id_user,
            'rejected_reason' => 'Kapasitas terlalu besar. Ruangan terbesar kami hanya 30 orang. Mohon split menjadi 2 sesi atau gunakan auditorium.',
        ]);

        // Create notification for rejection
        Notification::create([
            'id_user' => $user1->id_user,
            'id_booking' => null,
            'title' => 'Request Ditolak',
            'message' => "Request booking untuk date {$rejectedRequest->date->format('d/m/Y')} telah ditolak. Alasan: {$rejectedRequest->rejected_reason}",
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
        //     'name' => 'GA Admin',
        //     'email' => 'ga@company.com',
        //     'password' => Hash::make('password123'),
        //     'role' => 'GA',
        //     'email_verified_at' => now(),
        //     'is_active' => true,
        // ]);

        // // Create Admin Ruangan
        // $adminRuangan = User::create([
        //     'name' => 'Admin Ruangan',
        //     'email' => 'admin@company.com',
        //     'password' => Hash::make('password123'),
        //     'role' => 'room_admin',
        //     'email_verified_at' => now(),
        //     'is_active' => true,
        // ]);

        // // Create Regular User
        // $user = User::create([
        //     'name' => 'John Doe',
        //     'email' => 'user@company.com',
        //     'password' => Hash::make('password123'),
        //     'role' => 'user',
        //     'division' => 'IT',
        //     'email_verified_at' => now(),
        //     'is_active' => true,
        // ]);

        // // Create Sample Rooms
        // Room::create([
        //     'room_name' => 'Meeting Room A',
        //     'capacity' => 10,
        //     'location' => 'Lantai 3, Gedung Utama',
        //     'description' => 'Ruang meeting dengan proyektor, whiteboard, AC, sound system',
        //     'status' => 'available',
        //     'is_active' => true,
        //     'created_by' => $adminRuangan->id_user,
        // ]);

        // Room::create([
        //     'room_name' => 'Meeting Room B',
        //     'capacity' => 20,
        //     'location' => 'Lantai 3, Gedung Utama',
        //     'description' => 'Ruang meeting besar dengan proyektor, whiteboard, AC, sound system, video conference',
        //     'status' => 'available',
        //     'is_active' => true,
        //     'created_by' => $adminRuangan->id_user,
        // ]);

        // Room::create([
        //     'room_name' => 'Discussion Room',
        //     'capacity' => 6,
        //     'location' => 'Lantai 2, Gedung Utama',
        //     'description' => 'Ruang diskusi kecil dengan whiteboard dan AC',
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
