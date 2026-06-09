import React, { useState } from "react";
import { 
  ArrowUpRight, 
  TrendingDown, 
  Users, 
  UserCheck, 
  DollarSign, 
  Package,
  UserCircle,
  Download,
  Activity,
  CheckCircle2,
  PlusCircle,
  FileBarChart
} from "lucide-react";
import { cn } from "../../lib/utils";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { Button } from "../../components/common/Button";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import logoBireena from "../../assets/logobireena.jpeg";

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
    <div className="bg-bg-[#e9e6dd] backdrop-blur-md p-6 rounded-[2rem] border border-primary/10 shadow-xl shadow-primary-dark/5 transition-all hover:shadow-2xl hover:shadow-primary-dark/10 hover:-translate-y-1 group">
      <div className="flex items-center justify-between mb-6">
        <div className={cn("p-4 rounded-2xl bg-opacity-10 group-hover:scale-110 transition-transform duration-500", color.replace('text-', 'bg-'))}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
        {trendValue && (
          <div className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
            isPositive ? "bg-primary/10 text-primary-forest" : "bg-red-50 text-red-600"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-primary-dark tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-10 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-10 z-50 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold italic"
          >
            <CheckCircle2 className="w-5 h-5" />
            System Report Generated Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary-dark tracking-tighter italic">System Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Hospital metrics for <span className="text-primary font-bold underline">{new Date().toLocaleDateString()}</span></p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <Button 
            disabled={isGenerating}
            onClick={handleGenerateReport}
            className="flex-1 md:flex-none h-14 px-8 bg-white border border-primary/10 rounded-2xl text-sm font-black italic text-primary-dark shadow-lg shadow-primary-dark/5 hover:bg-gray-50 transition-all flex items-center gap-2"
           >
             {isGenerating ? <Activity className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
             {isGenerating ? "Processing..." : "Generate Report"}
           </Button>
           <button 
             onClick={() => setIsMonitoring(!isMonitoring)}
             className={cn(
               "flex-1 md:flex-none h-14 px-8 rounded-2xl text-sm font-black italic shadow-xl transition-all flex items-center gap-2",
               isMonitoring 
                 ? "bg-emerald-600 text-white shadow-emerald-600/20" 
                 : "bg-primary-dark text-white shadow-primary-dark/30 hover:scale-105 active:scale-95"
             )}
           >
             <Activity className={cn("w-4 h-4", isMonitoring && "animate-pulse")} />
             {isMonitoring ? "Monitoring Live..." : "Live Monitor"}
           </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Patients" value="12,482" icon={Users} color="text-primary" trend="up" trendValue="+12%" />
        <StatCard title="Active Doctors" value="142" icon={UserCheck} color="text-primary" trend="up" trendValue="+3" />
        <StatCard title="Today's Revenue" value="$42,850" icon={DollarSign} color="text-primary" trend="up" trendValue="+8.2%" />
        <StatCard title="Pharmacy Stock" value="84%" icon={Package} color="text-primary" trend="down" trendValue="-2.1%" />
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <button onClick={() => navigate("/admin/users")} className="p-8 bg-[#e9e6dd] rounded-[2.5rem] text-primary-dark shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform text-left group">
            <PlusCircle className="w-10 h-10 mb-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xl font-black italic tracking-tighter">Add Doctors</h3>
            <p className="text-primary-dark/40 text-xs font-bold uppercase tracking-widest mt-1">Personnel Allocation</p>
         </button>
         <button onClick={() => navigate("/analytics")} className="p-8 bg-[#e9e6dd] rounded-[2.5rem] text-primary-dark shadow-2xl shadow-primary-dark/5 hover:scale-[1.02] transition-transform text-left group">
            <FileBarChart className="w-10 h-10 mb-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xl font-black italic tracking-tighter">Clinical Analytics</h3>
            <p className="text-primary-dark/40 text-xs font-bold uppercase tracking-widest mt-1">Data Visualizer</p>
         </button>
         <button className="p-8 bg-[#e9e6dd] rounded-[2.5rem] text-primary-dark shadow-xl shadow-primary-dark/5 hover:scale-[1.02] transition-transform text-left group">
            <Package className="w-10 h-10 mb-4 opacity-40 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xl font-black italic tracking-tighter">Inventory Audit</h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Asset Control</p>
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-bg-secondary/60 backdrop-blur-md p-8 rounded-[3rem] border border-primary/10 shadow-xl shadow-primary-dark/5">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold text-primary-dark tracking-tight">Revenue Analysis</h3>
             <select className="text-xs font-bold text-primary-forest bg-primary/10 backdrop-blur-sm border-none rounded-xl px-3 py-2 outline-none cursor-pointer">
                <option>Last 7 Days</option>
                <option>Last Month</option>
             </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F5C3A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0F5C3A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#0A3E2A', fontSize: 10, fontWeight: 700, opacity: 0.5}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#0A3E2A', fontSize: 10, fontWeight: 700, opacity: 0.5}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(232, 227, 216, 0.9)', backdropFilter: 'blur(16px)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800, color: '#0A3E2A' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0F5C3A" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-secondary/60 backdrop-blur-md p-8 rounded-[3rem] border border-primary/10 shadow-xl shadow-primary-dark/5">
          <h3 className="text-xl font-bold text-primary-dark tracking-tight mb-8">Registration Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PATIENT_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#0A3E2A', fontSize: 10, fontWeight: 700, opacity: 0.5}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#0A3E2A', fontSize: 10, fontWeight: 700, opacity: 0.5}} />
                <Tooltip 
                   cursor={{fill: 'rgba(15, 92, 58, 0.05)'}}
                   contentStyle={{ borderRadius: '24px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(232, 227, 216, 0.9)', backdropFilter: 'blur(16px)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#166A45" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-bg-secondary/60 backdrop-blur-md rounded-[3rem] border border-primary/10 shadow-xl shadow-primary-dark/5 overflow-hidden">
        <div className="p-8 border-b border-primary/10 flex items-center justify-between">
          <h3 className="text-xl font-bold text-primary-dark tracking-tight">System Activity Log</h3>
          <Button variant="outline" className="h-10 text-[10px] font-black uppercase tracking-widest px-4 border-primary/10 bg-primary/10 text-primary-forest">Export Logs</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-primary/10 text-primary-forest">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest opacity-60">User</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest opacity-60">Action</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest opacity-60">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest opacity-60 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {[
                { user: "Dr. Sarah Jenkins", action: "Updated EMR for Patient #4412", status: "Success", time: "2 min ago" },
                { user: "Admin (You)", action: "Backup System Database", status: "In Progress", time: "15 min ago" },
                { user: "Receptionist Alice", action: "Authorized Payment #9910", status: "Success", time: "1 hour ago" },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-primary/5 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary-forest group-hover:scale-110 transition-transform">
                          <UserCircle className="w-6 h-6" />
                       </div>
                       <span className="font-bold text-primary-dark group-hover:text-primary transition-colors">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-gray-500 font-medium">{log.action}</td>
                  <td className="px-8 py-6 text-sm">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      log.status === "Success" ? "bg-primary/10 text-primary-forest" : "bg-blue-50 text-blue-600 animate-pulse border border-blue-100"
                    )}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-gray-300">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
