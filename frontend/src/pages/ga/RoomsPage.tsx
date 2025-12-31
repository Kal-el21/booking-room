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

  if (loading) return <LoadingSpinner text="Loading rooms..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Rooms</h1>
        <p className="text-muted-foreground">View and monitor all rooms</p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <Card key={room.id_room}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{room.room_name}</h3>
                  <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>📍 {room.location}</p>
                  <p>👥 Capacity: {room.capacity}</p>
                  {room.description && <p>📝 {room.description}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <p className="text-center text-muted-foreground">No rooms found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};