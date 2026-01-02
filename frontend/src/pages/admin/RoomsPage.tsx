import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsApi } from '@/lib/apiService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { getStatusColor } from '@/lib/utils';
import type { Room } from '@/lib/types';
import { Plus, DoorOpen, MapPin, Users, FileText, Edit } from 'lucide-react';

export const AdminRoomsPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomsApi.getAll();
      if (response.data.success && response.data.data) {
        setRooms(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'occupied':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'maintenance':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  if (loading) return <LoadingSpinner text="Loading rooms..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Rooms</h1>
          <p className="text-slate-400 mt-1">Create and manage meeting rooms</p>
        </div>
        <Button 
          onClick={() => navigate('/admin/rooms/create')}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{rooms.length}</div>
              <p className="text-sm text-slate-400 mt-1">Total Rooms</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {rooms.filter(r => r.status === 'available').length}
              </div>
              <p className="text-sm text-slate-400 mt-1">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {rooms.filter(r => r.status === 'occupied').length}
              </div>
              <p className="text-sm text-slate-400 mt-1">Occupied</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {rooms.filter(r => r.status === 'maintenance').length}
              </div>
              <p className="text-sm text-slate-400 mt-1">Maintenance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rooms Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card 
            key={room.id_room}
            className="bg-slate-900/80 border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 group"
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
                      <DoorOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">{room.room_name}</h3>
                      <Badge className={`mt-1 ${getStatusBadgeClass(room.status)}`}>
                        {room.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span>{room.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span>Capacity: {room.capacity} people</span>
                  </div>
                  {room.description && (
                    <div className="flex items-start gap-2 text-slate-400 pt-2 border-t border-slate-800">
                      <FileText className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{room.description}</span>
                    </div>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {rooms.length === 0 && (
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <DoorOpen className="h-10 w-10 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium text-lg">No rooms found</p>
              <p className="text-slate-600 text-sm mt-2">Create your first room to get started</p>
              <Button 
                onClick={() => navigate('/admin/rooms/create')}
                className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Room
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};






// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { roomsApi } from '@/lib/apiService';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
// import { ErrorMessage } from '@/components/shared/ErrorMessage';
// import { getStatusColor } from '@/lib/utils';
// import type { Room } from '@/lib/types';
// import { Plus } from 'lucide-react';

// export const AdminRoomsPage = () => {
//   const navigate = useNavigate();
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   const fetchRooms = async () => {
//     try {
//       setLoading(true);
//       const response = await roomsApi.getAll();
//       if (response.data.success && response.data.data) {
//         setRooms(response.data.data);
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to load rooms');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <LoadingSpinner text="Loading rooms..." />;
//   if (error) return <ErrorMessage message={error} />;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Manage Rooms</h1>
//           <p className="text-muted-foreground">Create and manage meeting rooms</p>
//         </div>
//         <Button onClick={() => navigate('/admin/rooms/create')}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Room
//         </Button>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {rooms.map((room) => (
//           <Card key={room.id_room}>
//             <CardContent className="pt-6">
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <h3 className="font-semibold">{room.room_name}</h3>
//                   <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
//                 </div>
//                 <div className="space-y-1 text-sm text-muted-foreground">
//                   <p>📍 {room.location}</p>
//                   <p>👥 Capacity: {room.capacity}</p>
//                   {room.description && <p>📝 {room.description}</p>}
//                 </div>
//                 <div className="pt-2">
//                   <Button variant="outline" size="sm" className="w-full">
//                     Edit
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {rooms.length === 0 && (
//         <Card>
//           <CardContent className="py-16">
//             <p className="text-center text-muted-foreground">No rooms found</p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };