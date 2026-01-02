import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

export const CalendarPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Booking Calendar</h1>
        <p className="text-slate-400 mt-1">View all room bookings in calendar view</p>
      </div>

      <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-800">
          <CardTitle className="text-white flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-400" />
            Calendar View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-20 text-center">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="h-12 w-12 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Calendar Component Coming Soon
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              This page will display an interactive calendar showing all room bookings, 
              available time slots, and scheduling conflicts.
            </p>
            
            <Card className="bg-blue-500/5 border-blue-500/20 max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-left space-y-2">
                    <p className="text-sm font-medium text-blue-300">Implementation Suggestion</p>
                    <p className="text-sm text-blue-200/70">
                      Consider using popular calendar libraries such as:
                    </p>
                    <ul className="text-sm text-blue-200/70 space-y-1 list-disc list-inside">
                      <li><span className="font-medium text-blue-300">FullCalendar</span> - Full-featured calendar with drag & drop</li>
                      <li><span className="font-medium text-blue-300">React Big Calendar</span> - Google Calendar-like interface</li>
                      <li><span className="font-medium text-blue-300">React Calendar</span> - Simple and customizable</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Preview Features */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto">
                <CalendarIcon className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white">Monthly View</h4>
              <p className="text-sm text-slate-400">See all bookings in a month at a glance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto">
                <CalendarIcon className="h-6 w-6 text-green-400" />
              </div>
              <h4 className="font-semibold text-white">Weekly View</h4>
              <p className="text-sm text-slate-400">Detailed view of weekly schedules</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto">
                <CalendarIcon className="h-6 w-6 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white">Daily View</h4>
              <p className="text-sm text-slate-400">Hour-by-hour booking overview</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// export const CalendarPage = () => {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Booking Calendar</h1>
//         <p className="text-muted-foreground">View all room bookings in calendar view</p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Calendar View</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="py-16 text-center text-muted-foreground">
//             <p>📅 Calendar component will be implemented here</p>
//             <p className="text-sm mt-2">
//               Use libraries like FullCalendar or React Big Calendar
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
