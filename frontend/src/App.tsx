import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner'; // ✅ CHANGED
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';

// User Pages
import { UserDashboardPage } from '@/pages/user/DashboardPage';
import { MyRequestsPage } from '@/pages/user/MyRequestsPage';
import { CreateRequestPage } from '@/pages/user/CreateRequestPage';

// Room Admin Pages
import { AdminRoomsPage } from '@/pages/admin/RoomsPage';
import { CreateRoomPage } from '@/pages/admin/CreateRoomPage';
import { UsersPage } from '@/pages/admin/UsersPage'; // ✅ NEW

// GA Pages
import { GADashboardPage } from '@/pages/ga/DashboardPage';
import { PendingRequestsPage } from '@/pages/ga/PendingRequestsPage';
import { CalendarPage } from '@/pages/ga/CalendarPage';
import { GARoomsPage } from '@/pages/ga/RoomsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Layout>
                <UserDashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-requests"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Layout>
                <MyRequestsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-request"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Layout>
                <CreateRequestPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Room Admin Routes */}
        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute allowedRoles={['room_admin']}>
              <Layout>
                <AdminRoomsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms/create"
          element={
            <ProtectedRoute allowedRoles={['room_admin']}>
              <Layout>
                <CreateRoomPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['room_admin']}>
              <Layout>
                <UsersPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* GA Routes */}
        <Route
          path="/ga/dashboard"
          element={
            <ProtectedRoute allowedRoles={['GA']}>
              <Layout>
                <GADashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ga/requests"
          element={
            <ProtectedRoute allowedRoles={['GA']}>
              <Layout>
                <PendingRequestsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ga/calendar"
          element={
            <ProtectedRoute allowedRoles={['GA']}>
              <Layout>
                <CalendarPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ga/rooms"
          element={
            <ProtectedRoute allowedRoles={['GA']}>
              <Layout>
                <GARoomsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster /> {/* ✅ CHANGED */}
    </BrowserRouter>
  );
}

export default App;