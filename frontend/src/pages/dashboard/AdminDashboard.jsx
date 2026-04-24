import { 
  ArrowUpRight, 
  TrendingDown, 
  Users, 
  UserCheck, 
  DollarSign, 
  Package,
  UserCircle
} from "lucide-react";
import { cn } from "../../lib/utils";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { Button } from "../../components/common/Button";

const REVENUE_DATA = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const PATIENT_GROWTH = [
  { name: 'Jan', count: 400 },
  { name: 'Feb', count: 600 },
  { name: 'Mar', count: 550 },
  { name: 'Apr', count: 800 },
  { name: 'May', count: 700 },
  { name: 'Jun', count: 1100 },
];

function StatCard({ title, value, icon: Icon, color, trend, trendValue }) {
  const isPositive = trend === "up";
  
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-900/5 group">
      <div className="flex items-center justify-between mb-6">
        <div className={cn("p-4 rounded-2xl bg-opacity-10 group-hover:scale-110 transition-transform duration-300", color.replace('text-', 'bg-'))}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
        {trendValue && (
          <div className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
            isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-[#06402B] tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard({ name }) {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#06402B] tracking-tighter">System Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Hospital metrics for <span className="text-emerald-600 font-bold underline">April 22, 2026</span></p>
        </div>
        <div className="hidden sm:flex gap-3">
           <button className="h-12 px-6 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">Generate Report</button>
           <button className="h-12 px-6 bg-[#06402B] text-white rounded-2xl text-sm font-bold shadow-xl shadow-[#06402B]/20 hover:scale-105 transition-transform">Live Monitor</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Patients" value="12,482" icon={Users} color="text-emerald-600" trend="up" trendValue="+12%" />
        <StatCard title="Active Doctors" value="142" icon={UserCheck} color="text-blue-600" trend="up" trendValue="+3" />
        <StatCard title="Today's Revenue" value="$42,850" icon={DollarSign} color="text-green-600" trend="up" trendValue="+8.2%" />
        <StatCard title="Pharmacy Stock" value="84%" icon={Package} color="text-orange-600" trend="down" trendValue="-2.1%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold text-[#06402B] tracking-tight">Revenue Analysis</h3>
             <select className="text-xs font-bold text-gray-400 bg-gray-50 border-none rounded-xl px-3 py-2 outline-none">
                <option>Last 7 Days</option>
                <option>Last Month</option>
             </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 700, color: '#06402B' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-[#06402B] tracking-tight mb-8">Registration Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PATIENT_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                   cursor={{fill: '#f9fafb'}}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#06402B] tracking-tight">System Activity Log</h3>
          <Button variant="outline" className="rounded-xl border-gray-100 text-emerald-600 font-bold text-xs h-10">Export Logs</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">User</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { user: "Dr. Sarah Jenkins", action: "Updated EMR for Patient #4412", status: "Success", time: "2 min ago" },
                { user: "Admin (You)", action: "Backup System Database", status: "In Progress", time: "15 min ago" },
                { user: "Receptionist Alice", action: "Authorized Payment #9910", status: "Success", time: "1 hour ago" },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          <UserCircle className="w-5 h-5" />
                       </div>
                       <span className="font-bold text-gray-900">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-500 font-medium">{log.action}</td>
                  <td className="px-8 py-5 text-sm">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      log.status === "Success" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600 animate-pulse"
                    )}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right text-xs font-bold text-gray-300">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
