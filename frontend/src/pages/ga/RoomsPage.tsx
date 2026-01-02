import { useEffect, useState } from 'react';
import { roomsApi } from '@/lib/apiService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { getStatusColor } from '@/lib/utils';
import type { Room } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, DoorOpen, MapPin, Users, FileText } from 'lucide-react';

export const GARoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, search, statusFilter]);

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

  const filterRooms = () => {
    let filtered = rooms;

    if (search) {
      filtered = filtered.filter(
        (room) =>
          room.room_name.toLowerCase().includes(search.toLowerCase()) ||
          room.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((room) => room.status === statusFilter);
    }

    setFilteredRooms(filtered);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return '✓';
      case 'occupied':
        return '●';
      case 'maintenance':
        return '⚠';
      default:
        return '○';
    }
  };

  if (loading) return <LoadingSpinner text="Loading rooms..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">All Rooms</h1>
        <p className="text-slate-400 mt-1">View and monitor all rooms in the system</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by room name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800">
            <SelectItem value="all" className="text-slate-300 focus:bg-slate-800 focus:text-white">All Status</SelectItem>
            <SelectItem value="available" className="text-slate-300 focus:bg-slate-800 focus:text-white">Available</SelectItem>
            <SelectItem value="occupied" className="text-slate-300 focus:bg-slate-800 focus:text-white">Occupied</SelectItem>
            <SelectItem value="maintenance" className="text-slate-300 focus:bg-slate-800 focus:text-white">Maintenance</SelectItem>
          </SelectContent>
        </Select>
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
        {filteredRooms.map((room) => (
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
                        {getStatusIcon(room.status)} {room.status.toUpperCase()}
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredRooms.length === 0 && (
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <DoorOpen className="h-10 w-10 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium text-lg">No rooms found</p>
              <p className="text-slate-600 text-sm mt-2">
                {search || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No rooms available in the system'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};