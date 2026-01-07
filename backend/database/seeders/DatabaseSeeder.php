<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\NotificationSchedule;
use App\Models\Room;
use App\Models\RoomBooking;
use App\Models\RoomRequest;
use App\Models\User;
use Carbon\Carbon;
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

        // === USER 1 (John Doe) - IT DEPARTMENT ===

        // Past booking 1 - 7 days ago
        $request1_1 = RoomRequest::create([
            'id_user' => $user1->id_user,
            'required_capacity' => 8,
            'purpose' => 'Sprint planning meeting untuk project baru',
            'notes' => 'Butuh proyektor untuk demo',
            'date' => Carbon::today()->subDays(7),
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking1_1 = RoomBooking::create([
            'id_request' => $request1_1->id_request,
            'id_room' => $room1->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request1_1->date,
            'start_time' => $request1_1->start_time,
            'end_time' => $request1_1->end_time,
        ]);

        Notification::create([
            'id_user' => $user1->id_user,
            'id_booking' => $booking1_1->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room1->room_name} untuk tanggal {$request1_1->date->format('d/m/Y')} jam {$request1_1->start_time} - {$request1_1->end_time} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(7),
        ]);

        // Past booking 2 - 5 days ago
        $request1_2 = RoomRequest::create([
            'id_user' => $user1->id_user,
            'required_capacity' => 6,
            'purpose' => 'Code review session dengan senior developer',
            'notes' => 'Butuh whiteboard',
            'date' => Carbon::today()->subDays(5),
            'start_time' => '14:00:00',
            'end_time' => '16:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking1_2 = RoomBooking::create([
            'id_request' => $request1_2->id_request,
            'id_room' => $room3->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request1_2->date,
            'start_time' => $request1_2->start_time,
            'end_time' => $request1_2->end_time,
        ]);

        Notification::create([
            'id_user' => $user1->id_user,
            'id_booking' => $booking1_2->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room3->room_name} untuk tanggal {$request1_2->date->format('d/m/Y')} jam {$request1_2->start_time} - {$request1_2->end_time} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(5),
        ]);

        Notification::create([
            'id_user' => $user1->id_user,
            'id_booking' => $booking1_2->id_booking,
            'title' => 'Pengingat: Booking Besok',
            'message' => "Reminder: Anda memiliki booking ruangan {$room3->room_name} besok pada {$request1_2->start_time} - {$request1_2->end_time}.",
            'type' => 'reminder',
            'channel' => 'both',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(6),
        ]);

        // Past booking 3 - 3 days ago
        $request1_3 = RoomRequest::create([
            'id_user' => $user1->id_user,
            'required_capacity' => 10,
            'purpose' => 'Technical discussion dengan vendor',
            'notes' => 'Mohon sediakan video conference',
            'date' => Carbon::today()->subDays(3),
            'start_time' => '10:00:00',
            'end_time' => '12:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking1_3 = RoomBooking::create([
            'id_request' => $request1_3->id_request,
            'id_room' => $room4->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request1_3->date,
            'start_time' => $request1_3->start_time,
            'end_time' => $request1_3->end_time,
        ]);

        Notification::create([
            'id_user' => $user1->id_user,
            'id_booking' => $booking1_3->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room4->room_name} untuk tanggal {$request1_3->date->format('d/m/Y')} jam {$request1_3->start_time} - {$request1_3->end_time} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(4),
        ]);

        // Rejected request
        $requestRejected1 = RoomRequest::create([
            'id_user' => $user1->id_user,
            'required_capacity' => 50,
            'purpose' => 'Workshop internal IT Department',
            'notes' => null,
            'date' => Carbon::today()->addDays(1),
            'start_time' => '08:00:00',
            'end_time' => '17:00:00',
            'status' => 'rejected',
            'id_assigned_by' => $ga->id_user,
            'rejected_reason' => 'Kapasitas terlalu besar. Ruangan terbesar kami hanya 30 orang. Mohon split menjadi 2 sesi atau gunakan auditorium.',
        ]);

        Notification::create([
            'id_user' => $user1->id_user,
            'id_booking' => null,
            'title' => 'Request Ditolak',
            'message' => "Request booking untuk tanggal {$requestRejected1->date->format('d/m/Y')} telah ditolak. Alasan: {$requestRejected1->rejected_reason}",
            'type' => 'cancellation',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => now(),
        ]);

        // Future booking - Tomorrow
        $request1_4 = RoomRequest::create([
            'id_user' => $user1->id_user,
            'required_capacity' => 8,
            'purpose' => 'Daily standup meeting dengan tim development',
            'notes' => 'Regular meeting',
            'date' => Carbon::tomorrow(),
            'start_time' => '09:00:00',
            'end_time' => '10:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking1_4 = RoomBooking::create([
            'id_request' => $request1_4->id_request,
            'id_room' => $room1->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request1_4->date,
            'start_time' => $request1_4->start_time,
            'end_time' => $request1_4->end_time,
        ]);

        Notification::create([
            'id_user' => $user1->id_user,
            'id_booking' => $booking1_4->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room1->room_name} untuk tanggal {$request1_4->date->format('d/m/Y')} jam {$request1_4->start_time} - {$request1_4->end_time} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => now(),
        ]);

        // === USER 2 (Jane Smith) - MARKETING ===

        // Past booking 1 - 6 days ago
        $request2_1 = RoomRequest::create([
            'id_user' => $user2->id_user,
            'required_capacity' => 15,
            'purpose' => 'Campaign Q4 planning dengan management',
            'notes' => 'Mohon sediakan flip chart dan markers',
            'date' => Carbon::today()->subDays(6),
            'start_time' => '13:00:00',
            'end_time' => '15:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking2_1 = RoomBooking::create([
            'id_request' => $request2_1->id_request,
            'id_room' => $room2->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request2_1->date,
            'start_time' => $request2_1->start_time,
            'end_time' => $request2_1->end_time,
        ]);

        Notification::create([
            'id_user' => $user2->id_user,
            'id_booking' => $booking2_1->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room2->room_name} untuk tanggal {$request2_1->date->format('d/m/Y')} jam {$request2_1->start_time} - {$request2_1->end_time} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(6),
        ]);

        // Past booking 2 - 4 days ago
        $request2_2 = RoomRequest::create([
            'id_user' => $user2->id_user,
            'required_capacity' => 12,
            'purpose' => 'Review performance marketing campaign',
            'notes' => 'Butuh proyektor untuk presentasi data',
            'date' => Carbon::today()->subDays(4),
            'start_time' => '10:00:00',
            'end_time' => '12:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking2_2 = RoomBooking::create([
            'id_request' => $request2_2->id_request,
            'id_room' => $room4->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request2_2->date,
            'start_time' => $request2_2->start_time,
            'end_time' => $request2_2->end_time,
        ]);

        Notification::create([
            'id_user' => $user2->id_user,
            'id_booking' => $booking2_2->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room4->room_name} untuk tanggal {$request2_2->date->format('d/m/Y')} jam {$request2_2->start_time} - {$request2_2->end_time} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(5),
        ]);

        Notification::create([
            'id_user' => $user2->id_user,
            'id_booking' => $booking2_2->id_booking,
            'title' => 'Pengingat: Booking Hari Ini',
            'message' => "Reminder: Anda memiliki booking ruangan {$room4->room_name} hari ini pada {$request2_2->start_time} - {$request2_2->end_time}.",
            'type' => 'reminder',
            'channel' => 'both',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(4)->setTime(7, 0),
        ]);

        // Today's booking
        $request2_3 = RoomRequest::create([
            'id_user' => $user2->id_user,
            'required_capacity' => 12,
            'purpose' => 'Brainstorming ide campaign baru untuk Q1',
            'notes' => 'Mohon sediakan whiteboard',
            'date' => Carbon::today(),
            'start_time' => '14:00:00',
            'end_time' => '16:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking2_3 = RoomBooking::create([
            'id_request' => $request2_3->id_request,
            'id_room' => $room2->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request2_3->date,
            'start_time' => $request2_3->start_time,
            'end_time' => $request2_3->end_time,
        ]);

        Notification::create([
            'id_user' => $user2->id_user,
            'id_booking' => $booking2_3->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room2->room_name} untuk hari ini jam {$request2_3->start_time} - {$request2_3->end_time} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => Carbon::today()->subDay(),
        ]);

        Notification::create([
            'id_user' => $user2->id_user,
            'id_booking' => $booking2_3->id_booking,
            'title' => 'Pengingat: Booking Hari Ini',
            'message' => "Reminder: Anda memiliki booking ruangan {$room2->room_name} hari ini pada {$request2_3->start_time} - {$request2_3->end_time}.",
            'type' => 'reminder',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => Carbon::today()->setTime(11, 0),
        ]);

        // Pending request
        $pendingRequest2 = RoomRequest::create([
            'id_user' => $user2->id_user,
            'required_capacity' => 20,
            'purpose' => 'Quarterly marketing meeting dengan seluruh tim',
            'notes' => 'Butuh sound system dan proyektor',
            'date' => Carbon::today()->addDays(5),
            'start_time' => '09:00:00',
            'end_time' => '12:00:00',
            'status' => 'pending',
        ]);

        // === USER 3 (Bob Wilson) - SALES ===

        // Past booking 1 - 8 days ago
        $request3_1 = RoomRequest::create([
            'id_user' => $user3->id_user,
            'required_capacity' => 8,
            'purpose' => 'Sales training untuk produk baru',
            'notes' => 'Butuh proyektor',
            'date' => Carbon::today()->subDays(8),
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking3_1 = RoomBooking::create([
            'id_request' => $request3_1->id_request,
            'id_room' => $room1->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request3_1->date,
            'start_time' => $request3_1->start_time,
            'end_time' => $request3_1->end_time,
        ]);

        Notification::create([
            'id_user' => $user3->id_user,
            'id_booking' => $booking3_1->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room1->room_name} untuk tanggal {$request3_1->date->format('d/m/Y')} jam {$request3_1->start_time} - {$request3_1->end_time} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(9),
        ]);

        // Past booking 2 - 2 days ago
        $request3_2 = RoomRequest::create([
            'id_user' => $user3->id_user,
            'required_capacity' => 6,
            'purpose' => 'Review sales performance bulanan',
            'notes' => 'Meeting internal sales',
            'date' => Carbon::today()->subDays(2),
            'start_time' => '13:00:00',
            'end_time' => '15:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking3_2 = RoomBooking::create([
            'id_request' => $request3_2->id_request,
            'id_room' => $room3->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request3_2->date,
            'start_time' => $request3_2->start_time,
            'end_time' => $request3_2->end_time,
        ]);

        Notification::create([
            'id_user' => $user3->id_user,
            'id_booking' => $booking3_2->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room3->room_name} untuk tanggal {$request3_2->date->format('d/m/Y')} jam {$request3_2->start_time} - {$request3_2->end_time} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(3),
        ]);

        Notification::create([
            'id_user' => $user3->id_user,
            'id_booking' => $booking3_2->id_booking,
            'title' => 'Pengingat: Booking Besok',
            'message' => "Reminder: Anda memiliki booking ruangan {$room3->room_name} besok pada {$request3_2->start_time} - {$request3_2->end_time}.",
            'type' => 'reminder',
            'channel' => 'both',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(3),
        ]);

        Notification::create([
            'id_user' => $user3->id_user,
            'id_booking' => $booking3_2->id_booking,
            'title' => 'Pengingat: Meeting Sebentar Lagi',
            'message' => "Reminder: Anda memiliki booking ruangan {$room3->room_name} dalam 30 menit pada {$request3_2->start_time} - {$request3_2->end_time}.",
            'type' => 'reminder',
            'channel' => 'both',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(2)->setTime(12, 30),
        ]);

        // Future booking - Tomorrow with notification schedules
        $request3_3 = RoomRequest::create([
            'id_user' => $user3->id_user,
            'required_capacity' => 10,
            'purpose' => 'Presentasi proposal ke klien besar',
            'notes' => 'Mohon pastikan video conference berfungsi dengan baik',
            'date' => Carbon::tomorrow(),
            'start_time' => '10:00:00',
            'end_time' => '12:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking3_3 = RoomBooking::create([
            'id_request' => $request3_3->id_request,
            'id_room' => $room4->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request3_3->date,
            'start_time' => $request3_3->start_time,
            'end_time' => $request3_3->end_time,
        ]);

        Notification::create([
            'id_user' => $user3->id_user,
            'id_booking' => $booking3_3->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room4->room_name} untuk tanggal {$request3_3->date->format('d/m/Y')} jam {$request3_3->start_time} - {$request3_3->end_time} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => now(),
        ]);

        // Create notification schedules for tomorrow's booking
        $bookingDateTime = $request3_3->date->copy()->setTimeFromTimeString($request3_3->start_time);

        NotificationSchedule::create([
            'id_booking' => $booking3_3->id_booking,
            'notify_type' => '24h_before',
            'notify_at' => $bookingDateTime->copy()->subHours(24),
            'channel' => 'both',
        ]);

        NotificationSchedule::create([
            'id_booking' => $booking3_3->id_booking,
            'notify_type' => '3h_before',
            'notify_at' => $bookingDateTime->copy()->subHours(3),
            'channel' => 'both',
        ]);

        NotificationSchedule::create([
            'id_booking' => $booking3_3->id_booking,
            'notify_type' => '30m_before',
            'notify_at' => $bookingDateTime->copy()->subMinutes(30),
            'channel' => 'both',
        ]);

        // Future booking 2 - Next week
        $request3_4 = RoomRequest::create([
            'id_user' => $user3->id_user,
            'required_capacity' => 25,
            'purpose' => 'Training produk baru untuk seluruh sales team',
            'notes' => 'Butuh ruang besar dan sound system',
            'date' => Carbon::today()->addDays(7),
            'start_time' => '08:00:00',
            'end_time' => '12:00:00',
            'status' => 'approved',
            'id_assigned_by' => $ga->id_user,
        ]);

        $booking3_4 = RoomBooking::create([
            'id_request' => $request3_4->id_request,
            'id_room' => $room5->id_room,
            'booked_by' => $ga->id_user,
            'date' => $request3_4->date,
            'start_time' => $request3_4->start_time,
            'end_time' => $request3_4->end_time,
        ]);

        Notification::create([
            'id_user' => $user3->id_user,
            'id_booking' => $booking3_4->id_booking,
            'title' => 'Booking Dikonfirmasi',
            'message' => "Booking ruangan {$room5->room_name} untuk tanggal {$request3_4->date->format('d/m/Y')} jam {$request3_4->start_time} - {$request3_4->end_time} telah dikonfirmasi.",
            'type' => 'booking_confirmed',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => now(),
        ]);

        // === PENDING REQUESTS (for GA to process) ===

        $pendingRequest1 = RoomRequest::create([
            'id_user' => $user1->id_user,
            'required_capacity' => 6,
            'purpose' => 'Code review session untuk feature authentication',
            'notes' => 'Butuh ruang kecil saja',
            'date' => Carbon::today()->addDays(2),
            'start_time' => '13:00:00',
            'end_time' => '15:00:00',
            'status' => 'pending',
        ]);

        $pendingRequest3 = RoomRequest::create([
            'id_user' => $user3->id_user,
            'required_capacity' => 8,
            'purpose' => 'Meeting dengan potential client',
            'notes' => 'Butuh video conference yang bagus',
            'date' => Carbon::today()->addDays(4),
            'start_time' => '14:00:00',
            'end_time' => '16:00:00',
            'status' => 'pending',
        ]);

        // === SYSTEM/ROOM CHANGE NOTIFICATIONS ===

        Notification::create([
            'id_user' => $user1->id_user,
            'id_booking' => null,
            'title' => 'Sistem Booking Ruangan Updated',
            'message' => 'Sistem booking ruangan telah diupdate dengan fitur baru: reminder otomatis dan notifikasi real-time.',
            'type' => 'room_changed',
            'channel' => 'in-app',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(10),
        ]);

        Notification::create([
            'id_user' => $user2->id_user,
            'id_booking' => null,
            'title' => 'Sistem Booking Ruangan Updated',
            'message' => 'Sistem booking ruangan telah diupdate dengan fitur baru: reminder otomatis dan notifikasi real-time.',
            'type' => 'room_changed',
            'channel' => 'in-app',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(10),
        ]);

        Notification::create([
            'id_user' => $user2->id_user,
            'id_booking' => null,
            'title' => 'Sistem Booking Ruangan Updated',
            'message' => 'Sistem booking ruangan telah diupdate dengan fitur baru: reminder otomatis dan notifikasi real-time.',
            'type' => 'room_changed',
            'channel' => 'in-app',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(10),
        ]);

        Notification::create([
            'id_user' => $user2->id_user,
            'id_booking' => null,
            'title' => 'Ruangan Baru Tersedia',
            'message' => 'Training Room dengan kapasitas 30 orang kini tersedia untuk booking.',
            'type' => 'room_changed',
            'channel' => 'in-app',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(15),
        ]);

        Notification::create([
            'id_user' => $user2->id_user,
            'id_booking' => null,
            'title' => 'Tips: Booking Ruangan',
            'message' => 'Booking ruangan sebaiknya dilakukan minimal 1 hari sebelumnya untuk ketersediaan yang lebih baik.',
            'type' => 'room_changed',
            'channel' => 'in-app',
            'is_read' => false,
            'sent_at' => Carbon::today()->subDays(8),
        ]);

        Notification::create([
            'id_user' => $user3->id_user,
            'id_booking' => null,
            'title' => 'Sistem Booking Ruangan Updated',
            'message' => 'Sistem booking ruangan telah diupdate dengan fitur baru: reminder otomatis dan notifikasi real-time.',
            'type' => 'room_changed',
            'channel' => 'in-app',
            'is_read' => false,
            'sent_at' => Carbon::today()->subDays(10),
        ]);

        Notification::create([
            'id_user' => $user3->id_user,
            'id_booking' => null,
            'title' => 'Video Conference Update',
            'message' => 'Board Room kini dilengkapi dengan sistem video conference yang lebih baik.',
            'type' => 'room_changed',
            'channel' => 'in-app',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(12),
        ]);

        Notification::create([
            'id_user' => $user3->id_user,
            'id_booking' => null,
            'title' => 'Pengingat Kebijakan',
            'message' => 'Mohon untuk selalu membersihkan ruangan setelah digunakan. Terima kasih atas kerjasamanya.',
            'type' => 'room_changed',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => Carbon::today()->subDays(4),
        ]);

        Notification::create([
            'id_user' => $user1->id_user,
            'id_booking' => null,
            'title' => 'Maintenance Ruangan',
            'message' => 'Meeting Room A akan menjalani maintenance pada tanggal 15 Januari 2026. Harap hindari booking di tanggal tersebut.',
            'type' => 'room_changed',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => Carbon::today()->subDay(),
        ]);

        // === NOTIFICATIONS FOR GA ADMIN ===

        Notification::create([
            'id_user' => $ga->id_user,
            'id_booking' => null,
            'title' => 'Request Baru Menunggu Approval',
            'message' => 'Ada 3 request booking ruangan baru yang menunggu approval dari Anda.',
            'type' => 'room_changed',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => now(),
        ]);

        Notification::create([
            'id_user' => $ga->id_user,
            'id_booking' => null,
            'title' => 'Request Approved',
            'message' => 'Anda telah menyetujui request booking dari John Doe untuk Meeting Room A.',
            'type' => 'booking_confirmed',
            'channel' => 'in-app',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(7),
        ]);

        Notification::create([
            'id_user' => $ga->id_user,
            'id_booking' => null,
            'title' => 'Request Ditolak',
            'message' => 'Anda telah menolak request booking dari John Doe karena kapasitas tidak mencukupi.',
            'type' => 'cancellation',
            'channel' => 'in-app',
            'is_read' => true,
            'sent_at' => Carbon::today()->subHour(),
        ]);

        Notification::create([
            'id_user' => $ga->id_user,
            'id_booking' => null,
            'title' => 'Reminder: Meeting Hari Ini',
            'message' => 'Ada 2 booking ruangan yang akan berlangsung hari ini.',
            'type' => 'reminder',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => Carbon::today()->setTime(8, 0),
        ]);

        Notification::create([
            'id_user' => $ga->id_user,
            'id_booking' => null,
            'title' => 'Sistem Booking Ruangan Updated',
            'message' => 'Sistem booking ruangan telah diupdate dengan fitur baru: reminder otomatis dan notifikasi real-time.',
            'type' => 'room_changed',
            'channel' => 'in-app',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(10),
        ]);

        Notification::create([
            'id_user' => $ga->id_user,
            'id_booking' => null,
            'title' => 'Laporan Bulanan',
            'message' => 'Laporan penggunaan ruangan bulan ini tersedia. Total booking: 45 requests.',
            'type' => 'room_changed',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => Carbon::today()->subDays(2),
        ]);

        // === NOTIFICATIONS FOR ADMIN RUANGAN ===

        Notification::create([
            'id_user' => $adminRuangan->id_user,
            'id_booking' => null,
            'title' => 'Ruangan Baru Ditambahkan',
            'message' => 'Training Room telah berhasil ditambahkan ke sistem.',
            'type' => 'room_changed',
            'channel' => 'in-app',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(15),
        ]);

        Notification::create([
            'id_user' => $adminRuangan->id_user,
            'id_booking' => null,
            'title' => 'Maintenance Dijadwalkan',
            'message' => 'Meeting Room A akan menjalani maintenance pada tanggal 15 Januari 2026.',
            'type' => 'reminder',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => Carbon::today()->subDay(),
        ]);

        Notification::create([
            'id_user' => $adminRuangan->id_user,
            'id_booking' => null,
            'title' => 'Kapasitas Ruangan Diupdate',
            'message' => 'Kapasitas Board Room telah diupdate dari 12 menjadi 15 orang.',
            'type' => 'room_changed',
            'channel' => 'in-app',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(5),
        ]);

        Notification::create([
            'id_user' => $adminRuangan->id_user,
            'id_booking' => null,
            'title' => 'Peralatan Ruangan Perlu Pengecekan',
            'message' => 'Proyektor di Meeting Room B dilaporkan tidak berfungsi dengan baik.',
            'type' => 'room_changed',
            'channel' => 'both',
            'is_read' => false,
            'sent_at' => Carbon::today()->subHours(3),
        ]);

        Notification::create([
            'id_user' => $adminRuangan->id_user,
            'id_booking' => null,
            'title' => 'Sistem Booking Ruangan Updated',
            'message' => 'Sistem booking ruangan telah diupdate dengan fitur baru: reminder otomatis dan notifikasi real-time.',
            'type' => 'room_changed',
            'channel' => 'in-app',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(10),
        ]);

        Notification::create([
            'id_user' => $adminRuangan->id_user,
            'id_booking' => null,
            'title' => 'Pembersihan Ruangan Selesai',
            'message' => 'Pembersihan mendalam untuk semua ruangan meeting telah selesai dilakukan.',
            'type' => 'room_changed',
            'channel' => 'in-app',
            'is_read' => true,
            'sent_at' => Carbon::today()->subDays(3),
        ]);

        $this->command->info('✅ Created multiple requests and bookings');
        $this->command->info('✅ Created notification schedules');

        // ============================================
        // SUMMARY
        // ============================================
        $this->command->info('');
        $this->command->info('🎉 Database seeded successfully!');
        $this->command->info('');
        $this->command->info('📋 Login Credentials:');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('🎯 GA (General Affairs) Role:');
        $this->command->info('   Email: ga@company.com');
        $this->command->info('   Password: password123');
        $this->command->info('   Name: GA Admin');
        $this->command->info('   Notifications: ' . Notification::where('id_user', $ga->id_user)->count());
        $this->command->info('');
        $this->command->info('🏢 Admin Ruangan Role:');
        $this->command->info('   Email: admin@company.com');
        $this->command->info('   Password: password123');
        $this->command->info('   Name: Admin Ruangan');
        $this->command->info('   Notifications: ' . Notification::where('id_user', $adminRuangan->id_user)->count());
        $this->command->info('');
        $this->command->info('👤 User Role:');
        $this->command->info('   Email: user@company.com');
        $this->command->info('   Password: password123');
        $this->command->info('   Name: John Doe (IT)');
        $this->command->info('   Notifications: ' . Notification::where('id_user', $user1->id_user)->count());
        $this->command->info('');
        $this->command->info('👤 User Role:');
        $this->command->info('   Email: jane@company.com');
        $this->command->info('   Password: password123');
        $this->command->info('   Name: Jane Smith (Marketing)');
        $this->command->info('   Notifications: ' . Notification::where('id_user', $user2->id_user)->count());
        $this->command->info('');
        $this->command->info('👤 User Role:');
        $this->command->info('   Email: bob@company.com');
        $this->command->info('   Password: password123');
        $this->command->info('   Name: Bob Wilson (Sales)');
        $this->command->info('   Notifications: ' . Notification::where('id_user', $user3->id_user)->count());
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('');
        $this->command->info('📊 Data Summary:');
        $this->command->info("   Users: " . User::count());
        $this->command->info("   Rooms: " . Room::count());
        $this->command->info("   Requests: " . RoomRequest::count());
        $this->command->info("   - Pending: " . RoomRequest::where('status', 'pending')->count());
        $this->command->info("   - Approved: " . RoomRequest::where('status', 'approved')->count());
        $this->command->info("   - Rejected: " . RoomRequest::where('status', 'rejected')->count());
        $this->command->info("   Bookings: " . RoomBooking::count());
        $this->command->info("   Notifications: " . Notification::count());
        $this->command->info("   - Unread: " . Notification::where('is_read', false)->count());
        $this->command->info("   - Read: " . Notification::where('is_read', true)->count());
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
