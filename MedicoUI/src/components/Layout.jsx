import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";
import Breadcrumbs from "./Breadcrumbs";

export default function Layout({ children, rightPanel }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Persist collapse preference
    return localStorage.getItem("medico_sidebar_collapsed") === "true";
  });

  // Persist collapse state
  useEffect(() => {
    localStorage.setItem("medico_sidebar_collapsed", String(isCollapsed));
  }, [isCollapsed]);

  // Mobile sidebar closes itself via onCloseMobile on each SidebarItem click.
  // We also track path changes to close it as a safety net.
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login");
  }, [logout, navigate]);

  const toggleSidebar = useCallback(() => {
    // On mobile: toggle drawer; on desktop: toggle collapse
    if (window.innerWidth < 768) {
      setIsSidebarOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <div className="h-screen bg-[#FCFBFA] flex overflow-hidden">
      {/* ─── Sidebar ─── */}
      <Sidebar
        user={user}
        isSidebarOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        onCloseMobile={closeMobileSidebar}
        handleLogout={handleLogout}
      />

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ─── Navbar ─── */}
        <Navbar
          user={user}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          handleLogout={handleLogout}
        />

        {/* ─── Content with optional Right Panel ─── */}
        <div className="flex-1 flex overflow-hidden">
          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 md:p-8">
              {/* Breadcrumbs */}
              <Breadcrumbs />

              {/* Page transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-7xl mx-auto"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          {/* Optional Right Panel (for EMR clinical profile) */}
          {rightPanel}
        </div>
      </div>
    </div>
  );
}
