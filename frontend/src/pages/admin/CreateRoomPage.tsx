import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomsApi } from '@/lib/apiService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, DoorOpen, Users, MapPin, FileText, Save } from 'lucide-react';

export const CreateRoomPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    room_name: '',
    capacity: '',
    location: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await roomsApi.create({
        room_name: formData.room_name,
        capacity: parseInt(formData.capacity),
        location: formData.location,
        description: formData.description || undefined,
        status: 'available',
        is_active: true,
      });

      if (response.data.success) {
        toast.success('Room created!', {
          description: 'The room has been created successfully.',
        });
        navigate('/admin/rooms');
      }
    } catch (err: any) {
      toast.error('Failed to create room', {
        description: err.response?.data?.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Room</h1>
          <p className="text-slate-400 mt-1">Add a new meeting room to the system</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-white flex items-center gap-2">
            <DoorOpen className="h-5 w-5 text-blue-400" />
            Room Details
          </CardTitle>
          <CardDescription className="text-slate-400">
            Fill in the details for the new meeting room
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Name */}
            <div className="space-y-2">
              <Label htmlFor="room_name" className="text-slate-300 font-medium flex items-center gap-2">
                <DoorOpen className="h-4 w-4 text-blue-400" />
                Room Name *
              </Label>
              <Input
                id="room_name"
                name="room_name"
                placeholder="e.g., Meeting Room A, Conference Hall"
                value={formData.room_name}
                onChange={handleChange}
                required
                disabled={loading}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
              />
            </div>

            {/* Capacity & Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-slate-300 font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  Capacity *
                </Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  placeholder="10"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-slate-300 font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  Location *
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Floor 3, Building A"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 h-11"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-300 font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-400" />
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="e.g., Equipped with projector, whiteboard, AC, video conferencing system..."
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                rows={4}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Room
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-500/5 border-blue-500/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-300">Room Configuration</p>
              <p className="text-sm text-blue-200/70">
                After creating the room, it will be automatically set to "Available" status. 
                You can change the status later from the room management page. Make sure to provide 
                accurate capacity and location information for better booking management.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { roomsApi } from '@/lib/apiService';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { toast } from 'sonner'; // ✅ CHANGED
// import { Loader2, ArrowLeft } from 'lucide-react';

// export const CreateRoomPage = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     room_name: '',
//     capacity: '',
//     location: '',
//     description: '',
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await roomsApi.create({
//         room_name: formData.room_name,
//         capacity: parseInt(formData.capacity),
//         location: formData.location,
//         description: formData.description || undefined,
//         status: 'available',
//         is_active: true,
//       });

//       if (response.data.success) {
//         toast.success('Room created!', {
//           description: 'The room has been created successfully.',
//         });
//         navigate('/admin/rooms');
//       }
//     } catch (err: any) {
//       toast.error('Failed to create room', {
//         description: err.response?.data?.message || 'An error occurred',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       <div className="flex items-center gap-4">
//         <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
//           <ArrowLeft className="h-4 w-4" />
//         </Button>
//         <div>
//           <h1 className="text-3xl font-bold">Create New Room</h1>
//           <p className="text-muted-foreground">Add a new meeting room</p>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Room Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="room_name">Room Name *</Label>
//               <Input
//                 id="room_name"
//                 name="room_name"
//                 placeholder="e.g., Meeting Room A"
//                 value={formData.room_name}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="capacity">Capacity *</Label>
//                 <Input
//                   id="capacity"
//                   name="capacity"
//                   type="number"
//                   min="1"
//                   placeholder="10"
//                   value={formData.capacity}
//                   onChange={handleChange}
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="location">Location *</Label>
//                 <Input
//                   id="location"
//                   name="location"
//                   placeholder="e.g., Floor 3, Building A"
//                   value={formData.location}
//                   onChange={handleChange}
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 name="description"
//                 placeholder="e.g., Room with projector, whiteboard, AC..."
//                 value={formData.description}
//                 onChange={handleChange}
//                 disabled={loading}
//                 rows={4}
//               />
//             </div>

//             <div className="flex gap-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => navigate(-1)}
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={loading}>
//                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 Create Room
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };