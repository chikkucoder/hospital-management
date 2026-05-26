import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  UserX, 
  UserCheck, 
  Search,
  Filter,
  MoreVertical,
  Activity,
  UserCog,
  BarChart,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { adminService } from "../../services/adminService";
import { Role } from "../../types";
import { cn } from "../../lib/utils";
import { Button } from "../../components/common/Button";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: Role.DOCTOR });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, metricsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getSystemMetrics()
      ]);
      setUsers(usersData);
      setMetrics(metricsData);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const registeredUsers = JSON.parse(localStorage.getItem("medico_registered_users") || "[]");
    const createdUser = {
      ...newUser,
      id: `USR-${Date.now()}`,
      isActive: true,
      registeredAt: new Date().toISOString()
    };
    localStorage.setItem("medico_registered_users", JSON.stringify([...registeredUsers, createdUser]));
    setIsAddModalOpen(false);
    setNewUser({ name: "", email: "", role: Role.DOCTOR });
    fetchData();
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.isActive === false ? true : false;
    await adminService.updateUser(user.id, { isActive: newStatus });
    fetchData();
  };

  const handleChangeRole = async (user, newRole) => {
    await adminService.updateUser(user.id, { role: newRole });
    fetchData();
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-primary-dark tracking-tighter italic">Authority Hub</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">System Administration • User Registry</p>
        </div>
        <div className="flex gap-4">
           <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="h-14 px-8 rounded-2xl flex items-center gap-2 shadow-xl shadow-primary/20"
           >
              <UserPlus className="w-5 h-5" /> Provision User
           </Button>
        </div>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
              onClick={() => setIsAddModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-10"
            >
              <h2 className="text-2xl font-black text-primary-dark tracking-tight mb-2 italic">Provision New Identity</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">System Access Allocation</p>
              
              <form onSubmit={handleCreateUser} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full h-14 px-6 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 italic"
                    value={newUser.name}
                    onChange={e => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    className="w-full h-14 px-6 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5"
                    value={newUser.email}
                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Designated Role</label>
                  <select 
                    className="w-full h-14 px-6 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5"
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value})}
                  >
                    {Object.values(Role).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1 h-14 rounded-2xl">Cancel</Button>
                  <Button type="submit" className="flex-1 h-14 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95">Complete Provisioning</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total Accounts", value: metrics.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active Staff", value: metrics.activeStaff, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Patient Sync", value: metrics.activePatients, icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "System Load", value: "Optimal", icon: ShieldAlert, color: "text-orange-600", bg: "bg-orange-50" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-xl", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-primary-dark">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="w-full h-14 pl-12 pr-6 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select 
              className="h-14 px-6 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-600 outline-none focus:ring-4 focus:ring-primary/5"
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              {Object.values(Role).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity</th>
                <th className="text-left px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role Authority</th>
                <th className="text-left px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="text-right px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user) => (
                  <motion.tr 
                    key={user.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-primary-dark">{user.name}</p>
                          <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="relative">
                        <button 
                          onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:border-primary transition-all"
                        >
                          <UserCog className="w-4 h-4 text-primary" />
                          {user.role}
                        </button>
                        
                        {selectedUser === user.id && (
                          <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden py-2">
                             {Object.values(Role).map(role => (
                               <button 
                                 key={role}
                                 onClick={() => handleChangeRole(user, role)}
                                 className={cn(
                                   "w-full text-left px-4 py-2.5 text-xs font-bold transition-colors",
                                   user.role === role ? "text-primary bg-primary/5" : "text-gray-500 hover:bg-gray-50"
                                 )}
                               >
                                 {role}
                               </button>
                             ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                         user.isActive !== false ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                       )}>
                         {user.isActive !== false ? "Active" : "Deactivated"}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => handleToggleStatus(user)}
                           className={cn(
                             "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                             user.isActive !== false ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                           )}
                           title={user.isActive !== false ? "Deactivate Account" : "Activate Account"}
                         >
                           {user.isActive !== false ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                         </button>
                         <button className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-primary-dark hover:text-white transition-all flex items-center justify-center">
                           <MoreVertical className="w-5 h-5" />
                         </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
