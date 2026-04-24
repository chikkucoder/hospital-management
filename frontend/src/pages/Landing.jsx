import { useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000); // 3 seconds splash
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.8,
          ease: [0, 0.71, 0.2, 1.01] 
        }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 mb-8">
          <img src="/logo.svg" alt="Medico Logo" className="w-full h-full object-contain" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold tracking-tighter text-[#06402B] mb-2">Medico</h1>
          <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Bireena Infotech</p>
        </motion.div>
      </motion.div>

      {/* Progress bar */}
      <div className="absolute bottom-12 w-64 h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "linear" }}
          className="h-full bg-emerald-600"
        />
      </div>
    </div>
  );
}
