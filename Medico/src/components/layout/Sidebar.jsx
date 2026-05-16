import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Settings, 
  LogOut, 
  ClipboardList,
  ShieldCheck,
  FileText
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Role } from "../../types";

export default function Sidebar({ user, isSidebarOpen, handleLogout }) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: [Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.RECEPTIONIST, Role.LAB, Role.PHARMACY] },
    { name: "Patients", path: "/patients", icon: Users, roles: [Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST] },
    { name: "Doctors", path: "/doctors", icon: Stethoscope, roles: [Role.ADMIN, Role.RECEPTIONIST] },
    { name: "Appointments", path: "/appointments", icon: ClipboardList, roles: [Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.PATIENT] },
    { name: "EMR", path: "/emr", icon: FileText, roles: [Role.ADMIN, Role.DOCTOR] },
    { name: "Admin Panel", path: "/admin/users", icon: ShieldCheck, roles: [Role.ADMIN] },
    { name: "Settings", path: "/settings", icon: Settings, roles: [Role.ADMIN, Role.DOCTOR, Role.PATIENT] },
  ];

  const filteredMenu = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <aside 
      className={cn(
        "bg-white border-r border-gray-100 transition-all duration-300 h-full fixed md:relative inset-y-0 left-0 z-50",
        "md:translate-x-0 flex-shrink-0",
        isSidebarOpen ? "translate-x-0 w-72 shadow-2xl md:shadow-none" : "-translate-x-full md:translate-x-0 md:w-24"
      )}
    >
      <div className="h-full flex flex-col overflow-hidden">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="w-10 h-10 flex-shrink-0 object-contain" />
            <span className={cn(
              "font-bold text-2xl tracking-tighter text-[#06402B] transition-all duration-300 transform",
              isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 md:opacity-0 w-0 -translate-x-2 overflow-hidden"
            )}>
              Medico
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
           <div className={cn(
             "px-4 py-2 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest transition-opacity duration-300",
             isSidebarOpen ? "opacity-100" : "opacity-0"
           )}>
              Main Menu
           </div>
          {filteredMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative",
                location.pathname === item.path 
                  ? "bg-emerald-50 text-emerald-700 font-bold" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#06402B]"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0 transition-all duration-200",
                location.pathname === item.path ? "text-emerald-600 scale-110" : "group-hover:scale-110"
              )} />
              <span className={cn(
                "transition-all duration-300 whitespace-nowrap",
                isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 md:opacity-0 w-0 overflow-hidden -translate-x-4"
              )}>
                {item.name}
              </span>
              
              {location.pathname === item.path && !isSidebarOpen && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-600 rounded-l-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-50 bg-gray-50/30 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 group-hover:rotate-180 transition-transform duration-500" />
            <span className={cn(
              "transition-all duration-300 font-bold",
              isSidebarOpen ? "opacity-100" : "opacity-0 md:opacity-0 w-0 overflow-hidden"
            )}>
              Log Out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
