import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Brain,
  MessageSquare,
  Calendar,
  FileText,
  Plus,
  Sparkles,
  Zap,
  Target,
  Activity,
  Stethoscope,
  ShieldCheck
} from "lucide-react";

const logoBireena = "/src/assets/logobireena.jpeg";

const Navbar = () => {
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-secondary backdrop-blur-md border-b border-primary/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group transition-all duration-300 hover:-translate-y-2 hover:scale-105">
          <img src={logoBireena} alt="Logo" className="w-60 object-contain rounded-xl" />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {["Home", "About", "Services", "Features", "Pricing", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={(e) => scrollToSection(e, item.toLowerCase())}
              className="text-sm font-bold text-gray-600 hover:text-primary transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block text-sm font-bold text-gray-600 hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link to="/login" className="h-11 px-6 bg-primary text-white rounded-xl text-sm font-bold shadow-xl shadow-primary-dark/20 hover:scale-105 transition-transform flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

const SectionHeading = ({ tag, title, subtitle, center = true }) => (
  <div className={`mb-16 ${center ? "text-center" : "text-left"}`}>
    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary-forest text-[10px] font-black uppercase tracking-widest mb-4">
      {tag}
    </span>
    <h2 className="text-4xl md:text-5xl font-black text-primary-dark tracking-tighter mb-4 leading-tight">
      {title}
    </h2>
    <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
      {subtitle}
    </p>
  </div>
);

export default function Landing() {
  const [isYearly, setIsYearly] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const pricingPlans = [
    { name: "Standard", monthlyPrice: "1,899", yearlyPrice: "1,519", color: "bg-bg-secondary" },
    { name: "Professional", monthlyPrice: "4,599", yearlyPrice: "3,679", color: "bg-bg-secondary", popular: true },
    { name: "Premium", monthlyPrice: "6,999", yearlyPrice: "5,599", color: "bg-bg-secondary" },
    { name: "Elite", monthlyPrice: "10,599", yearlyPrice: "8,479", color: "bg-bg-secondary" },
  ];

  const faqs = [
    {
      q: "How this software works",
      a: "Our software centralizes all clinical operations into a single, intuitive dashboard. Using advanced logic-driven modules, it automates patient records, billing, and lab management for a seamless experience."
    },
    {
      q: "Advantages",
      a: "From 99.8% uptime to real-time clinical anomaly detection, Medico helps you reduce operational errors by 40% and increase patient satisfaction and throughput."
    },
    {
      q: "Usage",
      a: "Simply sign up, set up your clinic profile, and begin digitizing your records. Our interface is designed for zero medical coding knowledge, making it accessible to all staff members."
    },
    {
      q: "How it secures clinic data",
      a: "We use quantum-level encryption and cloud-based architecture with multi-region backups. Your data is protected with end-to-end trauma protection, ensuring HIPAA and clinical compliance."
    },
    {
      q: "Is there a mobile app available?",
      a: "Yes, Medico is fully responsive and available as an optimized web-app on all mobile devices. A native iOS and Android companion app is currently in development for offline usage."
    },
    {
      q: "Can I migrate my existing data?",
      a: "Absolutely. Our specialized migration team helps you import patient records, pharmacy inventories, and billing histories from any legacy system or Excel sheets with zero data loss."
    },
    {
      q: "Do you provide training for staff?",
      a: "We offer comprehensive onboarding sessions and 24/7 technical support. Most staff members can master the basic operations within 2 hours of use thanks to our intuitive UX."
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary font-sans text-primary selection:bg-primary/20 selection:text-primary-dark overflow-x-hidden relative">

      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="pt-40 pb-24 px-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/40 pointer-events-none" />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-primary-dark tracking-tighter mb-8 leading-[0.9] italic">
              Simplifying Healthcare <br />
              <span className="text-primary">with Intelligent Care</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
              Simplify medical workflows, patient records, and real-time clinical insights with India&apos;s most trusted medical ERP.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link to="/login" className="h-16 px-10 bg-primary text-white rounded-2xl text-lg font-bold shadow-2xl shadow-primary-dark/30 hover:scale-105 transition-transform flex items-center gap-3">
                Sign in now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section - Matching Image Reference */}
      <section id="about" className="py-32 px-6 bg-bg-primary overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-10 border border-primary/20">
              <Sparkles className="w-4 h-4" /> MEDICO CLINICAL INTELLIGENCE
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-primary-dark tracking-tight leading-[1.05] mb-8">
              Your 24/7 Virtual <br />
              <span className="text-primary-forest">Clinical Assistant</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium mb-12 leading-relaxed max-w-xl">
              While other software just records your data, our expert logic active-scans it. It predicts clinical anomalies, flags duplicate records, and finds resource optimizations automatically—so you can focus on care.
            </p>

            <ul className="space-y-6 mb-12">
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary-forest group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="font-bold text-primary-dark text-base sm:text-lg">Auto-categorization of 10,000+ medical records</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary-forest group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="font-bold text-primary-dark text-base sm:text-lg">Real-time clinical anomaly & fraud detection</span>
              </li>
            </ul>

            <button className="h-16 px-10 bg-primary text-white rounded-3xl text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-transform flex items-center gap-3">
              Experience the Future <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* AI Insights Feed Mockup */}
            <div className="glass rounded-[3rem] p-8 shadow-2xl relative">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CLINICAL INTELLIGENCE FEED</span>
                <div className="px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black border border-primary/10">
                  High Precision
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20 flex items-center gap-4">
                  <div className="w-4 h-4 bg-primary-forest rounded-full animate-pulse shadow-[0_0_15px_rgba(22,106,69,0.5)]" />
                  <span className="text-sm font-bold text-primary">Analyzing clinical health...</span>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-black text-primary-dark">Anomaly Detected</h4>
                      <span className="text-[10px] font-bold text-gray-400">Just now</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Duplicate record of &apos;Patient #4412&apos; detected for Ward &apos;Emer-A&apos;.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 opacity-80">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-black text-primary-dark">Patient Influx Projection</h4>
                      <span className="text-[10px] font-bold text-gray-400">2 mins ago</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Based on current trends, ER visits relative to last week will increase by 18%.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-forest flex-shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-black text-primary-dark">Resource Optimization</h4>
                      <span className="text-[10px] font-bold text-gray-400">1 hour ago</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">You have 12 idle bed shifts in Cardiac Ward. Click to view.</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Predictive Analytics</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="features" className="py-24 px-6 bg-bg-secondary/40 relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            tag="Why Choose Us"
            title="Why we're Unbeatable"
            subtitle="Built for modern hospitals and clinics — powerful features that set us apart from the rest."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Intelligent Automation", desc: "Automate repetitive clinical tasks with expert logic-driven care modules.", icon: Brain, color: "bg-primary/10 text-primary" },
              { title: "Real-time Clinical Insights", desc: "Immediate dashboard updates with clinical analytics.", icon: Activity, color: "bg-blue-50 text-blue-600" },
              { title: "Quantum Level Security", desc: "Your medical data encrypted with end-to-end trauma protection.", icon: ShieldCheck, color: "bg-emerald-50 text-emerald-600" },
              { title: "Seamless Global Connectivity", desc: "Cloud integration for healthcare systems across the world.", icon: CheckCircle2, color: "bg-orange-50 text-orange-600" },
            ].map((feature, i) => (
              <div key={i} className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group">
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-primary-dark mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">{feature.desc}</p>
                <button className="text-sm font-bold text-primary-forest flex items-center gap-2 group-hover:gap-3 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            tag="Our Expertise"
            title="Comprehensive Medical Services"
            subtitle="From patient management to complex surgery scheduling, Medico offers a full suite of services designed to let you focus on saving lives."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Automated EMR", desc: "Say goodbye to manual data entry. We categorize records automatically.", icon: FileText },
              { title: "Pharmacy & Lab", desc: "Stay ahead of regulatory deadlines. We generate detailed lab reports.", icon: Stethoscope },
              { title: "Financial Reporting", desc: "Gain deep insights into your hospital cash flow. We provide balance sheets.", icon: Activity },
              { title: "Appointment Management", desc: "Simplify scheduling with automated calculations and reminders.", icon: Calendar },
              { title: "Clinical Insights", desc: "Get strategic medical planning. Our virtual CFOs help you map out growth.", icon: Brain },
              { title: "Enterprise Solutions", desc: "Custom consolidation and multi-specialty management for scaling.", icon: ShieldCheck },
            ].map((service, i) => (
              <div key={i} className="p-8 rounded-[3rem] border border-gray-50 bg-bg-secondary shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary-dark mb-4 tracking-tight">{service.title}</h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">{service.desc}</p>
                <button className="h-12 px-6 bg-primary text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform">Learn more</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionHeading
              tag="Pricing"
              title={<>Choose the <span className="text-primary">Perfect Plan</span> for Your Practice</>}
              subtitle="Transparent pricing with no hidden fees. Scale effortlessly as your clinic grows."
            />
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-bold transition-colors ${!isYearly ? "text-primary-dark" : "text-gray-400"}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="w-16 h-8 bg-primary rounded-full p-1 relative transition-colors"
              >
                <motion.div
                  animate={{ x: isYearly ? 32 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-white rounded-full shadow-sm"
                />
              </button>
              <span className={`text-sm font-bold transition-colors flex items-center gap-2 ${isYearly ? "text-primary-dark" : "text-gray-400"}`}>
                Yearly <span className="px-2 py-0.5 bg-primary/10 text-primary-forest text-[10px] rounded-full">Save 20%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`p-8 rounded-[2.5rem] border border-primary/10 shadow-sm relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 ${plan.color}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-white text-[8px] font-black uppercase tracking-widest py-1.5 px-6 rotate-45 translate-x-4 translate-y-2">Popular</div>
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-8">
                  <span className="text-sm font-bold text-gray-900 mr-1">₹</span>
                  <span className="text-3xl font-black text-primary-dark tracking-tighter transition-all">
                    {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-xs text-gray-400 font-bold ml-1">/mo</span>
                </div>
                <Link
                  to="/register"
                  className={`w-full py-3 rounded-xl border border-primary/10 text-xs font-bold hover:bg-bg-primary transition-colors flex items-center justify-center ${plan.popular ? "bg-primary/10 text-primary-forest border-primary/20" : "bg-white text-primary-dark"}`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <button className="h-16 px-10 bg-primary text-white rounded-2xl text-lg font-bold shadow-xl shadow-primary-dark/20 hover:scale-105 transition-transform flex items-center gap-3 mx-auto">
              Explore All Plans & Features <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="contact" className="py-24 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            tag="Tailored For You"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about Medico ERP."
          />
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 group cursor-pointer transition-all hover:border-primary/20"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700 tracking-tight">{faq.q}</span>
                  <div className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${activeFaq === i ? "bg-primary text-white rotate-45" : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"}`}>
                    <Plus className="w-5 h-5" />
                  </div>
                </div>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-gray-500 font-medium leading-relaxed mt-4 pt-4 border-t border-gray-50">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Image 2 Style */}
      <section className="py-32 px-6 bg-[#0B0A1A] relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] -translate-x-1/2" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] translate-x-1/2" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-8 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Sparkles className="w-3 h-3" /> Get Started Today
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Ready to Transform Your <span className="text-primary">Practice?</span>
            </h2>
            <p className="text-gray-400 font-medium text-lg">
              Choose how you&apos;d like to begin your journey with Medico
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Trial Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] flex flex-col items-center group hover:bg-white/10 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 border border-primary/20 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(46,213,115,0.1)]">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Free Trial</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10 h-12">
                Experience the full power of Medico — no strings attached for 14 days.
              </p>
              <Link to="/register" className="w-full h-14 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Request a Demo Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] flex flex-col items-center group hover:bg-white/10 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Request a Demo</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10 h-12">
                Get a personalised walkthrough with our clinical product expert.
              </p>
              <button className="w-full h-14 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                Book a Demo <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Plans Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] flex flex-col items-center group hover:bg-white/10 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">Plans & Pricing</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10 h-12">
                Flexible plans designed for every practice — from clinics to hospitals.
              </p>
              <Link to="/register" className="w-full h-14 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                View All Plans <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="overflow-hidden pt-24 pb-12 px-6 border-t border-primary/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={logoBireena} alt="Logo" className="w-60 object-contain rounded-xl" />
            </div>
            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
              Advanced Medical ERP for modern hospitals and clinics. Simple. Secure. Smart.
            </p>
            <div className="flex gap-4">
              {[MessageSquare, Users, Activity].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/20 transition-all cursor-pointer">
                  <Icon className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-1">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              {["Features", "Pricing", "Privacy Policy", "Terms of Service"].map(u => <li key={u} className="hover:text-emerald-600 cursor-pointer">{u}</li>)}
            </ul>
          </div>
          <div className="md:col-span-1">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              {["About Us", "Contact", "Careers", "Global Partners"].map(u => <li key={u} className="hover:text-emerald-600 cursor-pointer">{u}</li>)}
            </ul>
          </div>
          <div className="md:col-span-1">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Contact</h4>
            <p className="text-sm text-gray-500 mb-2">support@medico.app</p>
            <p className="text-sm text-gray-500">+91 000 000 0000</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Copyright © 2026 Medico Health Systems | All Rights Reserved
          </p>
          <div className="flex gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span className="hover:text-primary cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
