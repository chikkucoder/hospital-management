import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Settings,
  LogOut,
  ClipboardList,
  Pill,
  ReceiptIndianRupee,
  BarChart3,
  ShieldCheck,
  FileText,
  ChevronDown,
  Plus,
  History,
  Microscope,
  Upload,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { Role } from "../../types";

const logoBireena = "/src/assets/logo.png";

export default function Sidebar({ user, handleLogout }) {

  const location = useLocation();

  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // =====================================================
  // ROLE BASED MENU
  // =====================================================

  const getMenuItems = () => {

    if (!user) return [];

    switch (user.role) {

      // =====================================================
      // DOCTOR
      // =====================================================

      case Role.DOCTOR:
        return [
          {
            name: "Doctor Dashboard",
            path: "/doctor/dashboard",
            icon: LayoutDashboard,
          },

          {
            name: "All Patients",
            path: "/doctor/patients",
            icon: Users,
          },

          {
            name: "Add Prescription",
            path: "/doctor/prescriptions",
            icon: Plus,
          },

          {
            name: "Reports",
            path: "/doctor/reports",
            icon: FileText,
          },

          {
            name: "Patient History",
            path: "/doctor/history",
            icon: History,
          },
        ];

      // =====================================================
      // LAB
      // =====================================================

      case Role.LAB:
        return [
          {
            name: "Lab Dashboard",
            path: "/lab/dashboard",
            icon: LayoutDashboard,
          },

          {
            name: "All Reports",
            path: "/lab/reports",
            icon: Microscope,
          },

          {
            name: "Upload Reports",
            path: "/lab/upload",
            icon: Upload,
          },

          {
            name: "Pending Samples",
            path: "/lab/pending",
            icon: ClipboardList,
          },
        ];

      // =====================================================
      // APPOINTMENT
      // =====================================================

      case Role.APPOINTMENT:
        return [
          {
            name: "Appointment Dashboard",
            path: "/appointment/dashboard",
            icon: LayoutDashboard,
          },

          {
            name: "Add Appointment",
            path: "/appointment/add",
            icon: Plus,
          },

          {
            name: "Patients",
            icon: Users,
            hasSubmenu: true,

            submenu: [
              {
                name: "All Patients",
                path: "/appointment/patients",
              },

              {
                name: "Add Patient",
                path: "/appointment/add-patient",
              },
            ],
          },

          {
            name: "Billing",
            path: "/appointment/billing",
            icon: ReceiptIndianRupee,
          },

          {
            name: "Appointment History",
            path: "/appointment/history",
            icon: History,
          },
        ];

      // =====================================================
      // CLINIC
      // =====================================================

      case Role.CLINIC:
        return [
          {
            name: "Clinic Dashboard",
            path: "/clinic/dashboard",
            icon: LayoutDashboard,
          },

          {
            name: "New Patient",
            path: "/clinic/new-patient",
            icon: Plus,
          },

          {
            name: "Patient History",
            path: "/clinic/history",
            icon: History,
          },

          {
            name: "Billing",
            path: "/clinic/billing",
            icon: ReceiptIndianRupee,
          },

          {
            name: "Medicine Inventory",
            path: "/clinic/inventory",
            icon: Pill,
          },

          {
            name: "Dispense Medicine",
            path: "/clinic/dispense",
            icon: ClipboardList,
          },
        ];

      // =====================================================
      // ADMIN
      // =====================================================

      case Role.ADMIN:
      default:
        return [
          {
            name: "Admin Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
          },

          {
            name: "All Patients",
            path: "/patients",
            icon: Users,
          },

          {
            name: "Doctor Management",
            path: "/admin/doctors",
            icon: Stethoscope,
          },

          {
            name: "Appointments",
            path: "/appointments",
            icon: ClipboardList,
          },

          {
            name: "Dispensary",
            icon: Pill,
            hasSubmenu: true,

            submenu: [
              {
                name: "Medicine Inventory",
                path: "/clinic/inventory",
              },

              {
                name: "Add Medicine",
                path: "/clinic/add-medicine",
              },
            ],
          },

          {
            name: "User Management",
            path: "/admin/users",
            icon: ShieldCheck,
          },

          {
            name: "Analytics",
            path: "/admin/analytics",
            icon: BarChart3,
          },

          {
            name: "Settings",
            path: "/settings",
            icon: Settings,
          },
        ];
    }
  };

  const menuItems = getMenuItems();

  // =====================================================
  // UI
  // =====================================================

  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col shadow-sm">

      {/* ===================================================== */}
      {/* LOGO */}
      {/* ===================================================== */}

      <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100">

        <img
          src={logoBireena}
          alt="Logo"
          className="h-14 object-contain rounded-xl"
        />

        

      </div>

      {/* ===================================================== */}
      {/* MENU */}
      {/* ===================================================== */}

      <nav className="flex-1 p-4 overflow-y-auto">

        <div className="mb-4 px-3 text-xs uppercase tracking-widest font-black text-gray-400">
          Main Menu
        </div>

        <div className="space-y-2">

          {menuItems.map((item) => (

            <div key={item.path || item.name}>

              {/* ===================================================== */}
              {/* SUBMENU */}
              {/* ===================================================== */}

              {item.hasSubmenu ? (

                <>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-gray-50 transition-all"
                  >

                    <div className="flex items-center gap-3">

                      <item.icon className="w-5 h-5 text-gray-600" />

                      <span className="font-semibold text-gray-700">
                        {item.name}
                      </span>

                    </div>

                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        openDropdowns[item.name] && "rotate-180"
                      )}
                    />

                  </button>

                  {openDropdowns[item.name] && (

                    <div className="ml-6 mt-2 space-y-1">

                      {item.submenu.map((subitem) => (

                        <Link
                          key={subitem.path}
                          to={subitem.path}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-all",

                            location.pathname === subitem.path
                              ? "bg-emerald-50 text-emerald-700 font-bold"
                              : "text-gray-600 hover:bg-gray-50"
                          )}
                        >

                          <div className="w-2 h-2 rounded-full bg-gray-400" />

                          {subitem.name}

                        </Link>
                      ))}

                    </div>
                  )}
                </>
              ) : (

                /* ===================================================== */
                /* NORMAL MENU */
                /* ===================================================== */

                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all",

                    location.pathname === item.path
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >

                  <item.icon
                    className={cn(
                      "w-5 h-5",

                      location.pathname === item.path
                        ? "text-emerald-600"
                        : "text-gray-500"
                    )}
                  />

                  <span className="font-semibold">
                    {item.name}
                  </span>

                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <div className="p-4 border-t border-gray-100">

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all"
        >

          <LogOut className="w-5 h-5" />

          <span className="font-bold">
            Log Out
          </span>

        </button>

      </div>

    </aside>
  );
}