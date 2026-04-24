import { 
  ArrowUpRight, 
  TrendingDown, 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  ClipboardList, 
  ArrowRight,
  Activity,
  FlaskConical,
  Pill,
  UserCircle
} from "lucide-react";
import { cn } from "../../lib/utils";

function StatCard({ title, value, icon: Icon, color, trend, trendValue }) {
  const isPositive = trend === "up";
  
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-900/5 group">
      <div className="flex items-center justify-between mb-6">
        <div className={cn("p-4 rounded-2xl bg-opacity-10 group-hover:scale-110 transition-transform duration-300", color.replace('text-', 'bg-'))}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-[#06402B] tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

export default function DoctorDashboard({ name }) {
  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#06402B] tracking-tighter italic">Doctor's Lounge</h1>
          <p className="text-gray-500 font-medium">Hello Dr. {name}, you have <span className="text-emerald-600 font-black">8 tasks</span> remaining today.</p>
        </div>
        <div className="flex gap-3">
           <button className="h-14 px-8 bg-emerald-100 text-emerald-700 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-200 transition-colors">
              <ClipboardList className="w-5 h-5" /> Round Notes
           </button>
           <button className="h-14 px-8 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-emerald-600/20 hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" /> Start Consultation
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Appointments" value="28" icon={Calendar} color="text-emerald-600" />
        <StatCard title="Patients Seen" value="12" icon={Users} color="text-blue-600" />
        <StatCard title="Avg. Time" value="18m" icon={Clock} color="text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-emerald-50/20">
             <div>
                <h3 className="text-xl font-bold text-[#06402B] tracking-tight">Today's Schedule</h3>
                <p className="text-xs font-bold text-emerald-600/60 uppercase tracking-widest mt-1">April 22 · Wednesday</p>
             </div>
             <button className="p-3 bg-white rounded-xl shadow-sm text-gray-400 hover:text-emerald-600 transition-colors">
                <ArrowRight className="w-5 h-5" />
             </button>
          </div>
          <div className="divide-y divide-gray-50 px-4">
             {[
               { time: "09:30 AM", patient: "Alice Cooper", type: "Follow-up", status: "Waiting" },
               { time: "10:15 AM", patient: "Bob Marley", type: "First Visit", status: "Upcoming" },
               { time: "11:00 AM", patient: "Charlie Sheen", type: "Urgent", status: "Upcoming" },
               { time: "11:45 AM", patient: "Diana Ross", type: "Consultation", status: "Upcoming" },
             ].map((apt, i) => (
               <div key={i} className="p-6 flex items-center gap-8 group hover:bg-emerald-50/30 transition-colors rounded-2xl">
                  <div className="text-center min-w-[70px]">
                     <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Time</p>
                     <p className="text-sm font-black text-gray-900">{apt.time.split(' ')[0]}</p>
                     <p className="text-[8px] font-bold text-emerald-600 uppercase">{apt.time.split(' ')[1]}</p>
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                     <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{apt.patient}</h4>
                        <p className="text-xs font-medium text-gray-400">{apt.type}</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className={cn(
                          "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider",
                          apt.status === "Waiting" ? "bg-orange-50 text-orange-600 animate-pulse" : "bg-gray-50 text-gray-400"
                        )}>
                          {apt.status}
                        </span>
                        <button className="h-10 px-4 bg-[#06402B] text-white rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-all">
                           Open
                        </button>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#06402B] p-8 rounded-[3rem] text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
              <div className="relative z-10">
                 <h3 className="text-2xl font-bold mb-4 tracking-tighter">Emergency Calls</h3>
                 <p className="text-emerald-100/60 text-sm font-medium leading-relaxed mb-6">Quickly access the emergency registry and trauma unit alerts.</p>
                 <button className="w-full py-4 bg-white text-[#06402B] font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5" /> View Registry
                 </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#06402B] tracking-tight mb-6">Quick Access</h3>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: "My Profile", icon: UserCircle },
                   { label: "Patient Search", icon: Users },
                   { label: "Lab Results", icon: FlaskConical },
                   { label: "Pharma", icon: Pill },
                 ].map((nav, i) => (
                   <button key={i} className="flex flex-col items-center justify-center p-4 rounded-3xl bg-gray-50 hover:bg-emerald-50 transition-colors group">
                      <nav.icon className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 mb-2 transition-colors" />
                      <span className="text-[10px] font-bold text-gray-500">{nav.label}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
