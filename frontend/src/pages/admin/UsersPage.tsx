import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '@/lib/apiService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { getRoleName } from '@/lib/utils';
import type { User } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserCog, Mail, Briefcase, Shield, CheckCircle, XCircle, Edit } from 'lucide-react';

export const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getAll();
      if (response.data.success && response.data.data) {
        const userData = Array.isArray(response.data.data) 
          ? response.data.data 
          : response.data.data.data || [];
        setUsers(userData);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          (user.division && user.division.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'GA':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'room_admin':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'user':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const handleEditUser = (userId: number) => {
    navigate(`/admin/users/edit/${userId}`);
  };

  if (loading) return <LoadingSpinner text="Loading users..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Manage Users</h1>
        <p className="text-slate-400 mt-1">View and manage user accounts</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by name, email, or division..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-slate-800/50 border-slate-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800">
            <SelectItem value="all" className="text-slate-300 focus:bg-slate-800 focus:text-white">All Roles</SelectItem>
            <SelectItem value="user" className="text-slate-300 focus:bg-slate-800 focus:text-white">User</SelectItem>
            <SelectItem value="room_admin" className="text-slate-300 focus:bg-slate-800 focus:text-white">Room Admin</SelectItem>
            <SelectItem value="GA" className="text-slate-300 focus:bg-slate-800 focus:text-white">GA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{users.length}</div>
              <p className="text-sm text-slate-400 mt-1">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {users.filter(u => u.role === 'user').length}
              </div>
              <p className="text-sm text-slate-400 mt-1">Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {users.filter(u => u.role === 'room_admin').length}
              </div>
              <p className="text-sm text-slate-400 mt-1">Room Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {users.filter(u => u.role === 'GA').length}
              </div>
              <p className="text-sm text-slate-400 mt-1">GA</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <Card 
            key={user.id_user}
            className="bg-slate-900/80 border-slate-800 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200"
          >
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* User Header */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserCog className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{user.name}</h3>
                    <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                  </div>
                </div>
                
                {/* User Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Role:
                    </span>
                    <Badge className={getRoleBadgeClass(user.role)}>
                      {getRoleName(user.role)}
                    </Badge>
                  </div>
                  
                  {user.division && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        Division:
                      </span>
                      <span className="text-white font-medium">{user.division}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Status:</span>
                    <Badge className={user.is_active 
                      ? "bg-green-500/10 text-green-400 border-green-500/20" 
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                    }>
                      {user.is_active ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </div>

                  {user.email_verified_at && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-slate-400">Verified:</span>
                      <span className="text-green-400 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Yes
                      </span>
                    </div>
                  )}
                </div>

                {/* Edit Button */}
                <Button 
                  onClick={() => handleEditUser(user.id_user)}
                  className="w-full bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCog className="h-10 w-10 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium text-lg">No users found</p>
              <p className="text-slate-600 text-sm mt-2">
                {search || roleFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No users available in the system'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};


// import { useEffect, useState } from 'react';
// import { usersApi } from '@/lib/apiService';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
// import { ErrorMessage } from '@/components/shared/ErrorMessage';
// import { getRoleName } from '@/lib/utils';
// import type { User } from '@/lib/types';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Search, UserCog } from 'lucide-react';

// export const UsersPage = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [search, setSearch] = useState('');
//   const [roleFilter, setRoleFilter] = useState('all');

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     filterUsers();
//   }, [users, search, roleFilter]);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await usersApi.getAll();
//       if (response.data.success && response.data.data) {
//         // Handle paginated or non-paginated response
//         const userData = Array.isArray(response.data.data) 
//           ? response.data.data 
//           : response.data.data.data || [];
//         setUsers(userData);
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterUsers = () => {
//     let filtered = users;

//     if (search) {
//       filtered = filtered.filter(
//         (user) =>
//           user.name.toLowerCase().includes(search.toLowerCase()) ||
//           user.email.toLowerCase().includes(search.toLowerCase()) ||
//           (user.division && user.division.toLowerCase().includes(search.toLowerCase()))
//       );
//     }

//     if (roleFilter !== 'all') {
//       filtered = filtered.filter((user) => user.role === roleFilter);
//     }

//     setFilteredUsers(filtered);
//   };

//   if (loading) return <LoadingSpinner text="Loading users..." />;
//   if (error) return <ErrorMessage message={error} />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Manage Users</h1>
//         <p className="text-muted-foreground">View and manage user accounts</p>
//       </div>

//       <div className="flex gap-4">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Search users..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//         <Select value={roleFilter} onValueChange={setRoleFilter}>
//           <SelectTrigger className="w-48">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Roles</SelectItem>
//             <SelectItem value="user">User</SelectItem>
//             <SelectItem value="room_admin">Room Admin</SelectItem>
//             <SelectItem value="GA">GA</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {filteredUsers.map((user) => (
//           <Card key={user.id_user}>
//             <CardContent className="pt-6">
//               <div className="space-y-3">
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-2">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
//                       <UserCog className="h-5 w-5 text-primary" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold">{user.name}</h3>
//                       <p className="text-xs text-muted-foreground">{user.email}</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground">Role:</span>
//                     <Badge variant="outline">{getRoleName(user.role)}</Badge>
//                   </div>
                  
//                   {user.division && (
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-muted-foreground">Division:</span>
//                       <span className="font-medium">{user.division}</span>
//                     </div>
//                   )}
                  
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground">Status:</span>
//                     <Badge variant={user.is_active ? "default" : "secondary"}>
//                       {user.is_active ? 'Active' : 'Inactive'}
//                     </Badge>
//                   </div>

//                   {user.email_verified_at && (
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-muted-foreground">Verified:</span>
//                       <span className="text-green-600">✓ Yes</span>
//                     </div>
//                   )}
//                 </div>

//                 <Button variant="outline" size="sm" className="w-full">
//                   Edit User
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredUsers.length === 0 && (
//         <Card>
//           <CardContent className="py-16">
//             <p className="text-center text-muted-foreground">No users found</p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };