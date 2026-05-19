import { useState, useEffect, useRef } from "react";

// ─── Lucide-react icons (available in artifact env) ─────────────────────────
import {
  ArrowRight, CheckCircle2, Users, Brain, MessageSquare, Calendar,
  FileText, Plus, Sparkles, Zap, Target, Activity, Stethoscope,
  ShieldCheck, HeartPulse, Syringe, Pill, Microscope, ClipboardPlus,
  ScanHeart, Cross, Thermometer, ShieldPlus, FlaskConical, CircleDot,
  Star, TrendingUp, BarChart2, Bell, Menu, X
} from "lucide-react";

// ─── Motion (framer-motion compatible, available as "motion/react") ─────────
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";

// =========================================================
// ANIMATED BACKGROUND
// =========================================================
function AnimatedBackground() {
  const icons = [
    { I: Stethoscope,  top:"8%",  left:"4%",   sz:88, col:"#10b981", dur:8 },
    { I: Microscope,   top:"14%", right:"6%",   sz:72, col:"#06b6d4", dur:10 },
    { I: Syringe,      bottom:"20%", left:"10%",sz:60, col:"#059669", dur:9 },
    { I: Pill,         top:"44%", right:"4%",   sz:72, col:"#ec4899", dur:11 },
    { I: ClipboardPlus,top:"60%", left:"5%",    sz:64, col:"#3b82f6", dur:13 },
    { I: ScanHeart,    top:"28%", left:"40%",   sz:72, col:"#ef4444", dur:12 },
    { I: Thermometer,  bottom:"10%", right:"18%",sz:56, col:"#f97316", dur:8 },
    { I: FlaskConical, top:"6%",  left:"52%",   sz:56, col:"#8b5cf6", dur:9 },
    { I: ShieldPlus,   bottom:"22%", right:"32%",sz:72, col:"#14b8a6", dur:14 },
    { I: Activity,     top:"12%", left:"28%",   sz:48, col:"#34d399", dur:9 },
    { I: HeartPulse,   top:"70%", left:"30%",   sz:48, col:"#f87171", dur:10 },
    { I: Cross,        top:"20%", right:"26%",  sz:44, col:"#22d3ee", dur:8 },
    { I: Pill,         bottom:"28%", left:"44%",sz:44, col:"#f472b6", dur:12 },
    { I: FlaskConical, top:"46%", left:"16%",   sz:44, col:"#a78bfa", dur:7 },
    { I: Stethoscope,  bottom:"6%", right:"6%", sz:56, col:"#10b981", dur:10 },
    { I: Syringe,      top:"4%",  right:"40%",  sz:44, col:"#eab308", dur:11 },
    { I: HeartPulse,   top:"18%", left:"62%",   sz:36, col:"#fb7185", dur:9 },
    { I: Microscope,   top:"64%", right:"3%",   sz:36, col:"#38bdf8", dur:12 },
    { I: ShieldPlus,   top:"10%", right:"52%",  sz:44, col:"#2dd4bf", dur:13 },
    { I: Activity,     bottom:"12%", left:"58%",sz:36, col:"#4ade80", dur:9 },
    { I: ClipboardPlus,top:"26%", left:"20%",   sz:36, col:"#93c5fd", dur:11 },
    { I: Syringe,      top:"72%", left:"70%",   sz:36, col:"#fde047", dur:8 },
    { I: Cross,        top:"50%", left:"50%",   sz:30, col:"#67e8f9", dur:6 },
    { I: HeartPulse,   top:"8%",  left:"78%",   sz:30, col:"#fca5a5", dur:7 },
    { I: Thermometer,  bottom:"18%", left:"46%",sz:30, col:"#fdba74", dur:9 },
    { I: ShieldPlus,   top:"32%", left:"72%",   sz:30, col:"#5eead4", dur:10 },
  ];

  return (
    <div className="animated-bg">
      {/* gradient base */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#f0fff8 0%,#ecfff7 50%,#f0fdfa 100%)"}} />

      {/* big glows */}
      <motion.div animate={{x:[0,60,0],y:[0,-40,0]}} transition={{duration:16,repeat:Infinity,ease:"easeInOut"}}
        style={{position:"absolute",top:-150,left:-150,width:700,height:700,background:"rgba(16,185,129,0.18)",borderRadius:"50%",filter:"blur(140px)"}} />
      <motion.div animate={{x:[0,-80,0],y:[0,50,0]}} transition={{duration:20,repeat:Infinity,ease:"easeInOut"}}
        style={{position:"absolute",bottom:-200,right:-150,width:750,height:750,background:"rgba(6,182,212,0.15)",borderRadius:"50%",filter:"blur(160px)"}} />

      {/* grid */}
      <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:"linear-gradient(to right,#10b981 1px,transparent 1px),linear-gradient(to bottom,#10b981 1px,transparent 1px)",backgroundSize:"80px 80px"}} />

      {/* ECG lines */}
      {[0,1,2,3,4,5,6].map(i=>(
        <motion.div key={i} initial={{x:"-100%"}} animate={{x:"200%"}}
          transition={{duration:10+i*2,repeat:Infinity,ease:"linear",delay:i*2}}
          style={{position:"absolute",top:`${8+i*13}%`,width:480,height:120,opacity:0.07}}>
          <svg width="480" height="120" viewBox="0 0 480 120" fill="none">
            <path d="M0 60 L50 60 L80 22 L110 98 L150 32 L195 60 L240 60 L270 18 L310 102 L350 48 L480 60"
              stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      ))}

      {/* floating icons */}
      {icons.map((item,idx)=>{
        const Icon = item.I;
        return (
          <motion.div key={idx}
            animate={{y:[-16,16,-16],rotate:[0,5,-5,0],x:[-5,5,-5]}}
            transition={{duration:item.dur,repeat:Infinity,ease:"easeInOut",delay:idx*0.3}}
            style={{position:"absolute",top:item.top,left:item.left,right:item.right,bottom:item.bottom}}>
            <div style={{
              width:item.sz, height:item.sz, borderRadius:"30%",
              background:"rgba(255,255,255,0.35)", backdropFilter:"blur(16px)",
              border:"1px solid rgba(255,255,255,0.5)",
              boxShadow:"0 20px 50px rgba(0,0,0,0.07)",
              display:"flex",alignItems:"center",justifyContent:"center"
            }}>
              <Icon size={item.sz*0.45} color={item.col} />
            </div>
          </motion.div>
        );
      })}

      {/* particles */}
      {Array.from({length:140}).map((_,i)=>(
        <motion.div key={`p${i}`}
          animate={{y:[-25,25,-25],opacity:[0.05,0.22,0.05],scale:[1,1.5,1]}}
          transition={{duration:4+(i%6),repeat:Infinity,delay:i*0.12}}
          style={{position:"absolute",left:`${(i*9)%100}%`,top:`${(i*11)%100}%`}}>
          <CircleDot size={3+(i%7)} color="rgba(16,185,129,0.4)" />
        </motion.div>
      ))}

      {/* micro glow dots */}
      {Array.from({length:90}).map((_,i)=>(
        <motion.div key={`g${i}`}
          animate={{opacity:[0.04,0.22,0.04],scale:[1,2,1]}}
          transition={{duration:2+(i%5),repeat:Infinity,delay:i*0.07}}
          style={{
            position:"absolute",borderRadius:"50%",
            background:"rgba(16,185,129,0.35)",filter:"blur(2px)",
            width:2+(i%4),height:2+(i%4),
            left:`${(i*7)%100}%`,top:`${(i*13)%100}%`
          }} />
      ))}

      {/* hologram scan line */}
      <motion.div animate={{y:["-10%","110%"]}} transition={{duration:14,repeat:Infinity,ease:"linear"}}
        style={{position:"absolute",left:0,right:0,height:96,background:"linear-gradient(to bottom,transparent,rgba(52,211,153,0.09),transparent)",filter:"blur(20px)"}} />

      {/* heart pulse subtle center */}
      <motion.div animate={{scale:[1,1.18,1],opacity:[0.04,0.1,0.04]}}
        transition={{duration:4,repeat:Infinity}}
        style={{position:"absolute",top:"36%",left:"47%"}}>
        <HeartPulse size={160} color="#10b981" />
      </motion.div>
    </div>
  );
}

// =========================================================
// FLOATING STAT CARD
// =========================================================
function FloatCard({ icon: Icon, label, value, sub, color, delay=0, style={} }) {
  return (
    <motion.div
      initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
      transition={{delay,duration:0.6}}
      style={{...style, position:"absolute", zIndex:10}}
    >
      <motion.div
        animate={{y:[-8,8,-8]}}
        transition={{duration:4+delay,repeat:Infinity,ease:"easeInOut"}}
        style={{
          background:"rgba(255,255,255,0.92)", backdropFilter:"blur(20px)",
          borderRadius:20, padding:"14px 18px",
          boxShadow:"0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(16,185,129,0.1)",
          border:"1px solid rgba(255,255,255,0.8)",
          display:"flex", alignItems:"center", gap:12, minWidth:170
        }}>
        <div style={{
          width:42,height:42,borderRadius:12,
          background:color+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0
        }}>
          <Icon size={20} color={color} />
        </div>
        <div>
          <div style={{fontSize:18,fontWeight:800,color:"#0f172a",lineHeight:1.1}}>{value}</div>
          <div style={{fontSize:11,fontWeight:700,color:"#64748b",marginTop:2}}>{label}</div>
          {sub && <div style={{fontSize:10,fontWeight:600,color:"#10b981",marginTop:1}}>{sub}</div>}
        </div>
      </motion.div>
    </motion.div>
  );
}

// =========================================================
// NAVBAR
// =========================================================
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(()=>{
    const fn = ()=>setScrolled(window.scrollY>20);
    window.addEventListener("scroll",fn);
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  const links = ["Home","About","Solutions","Features","Pricing","Contact"];

  return (
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:100,
      background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
      backdropFilter:"blur(20px)",
      borderBottom: scrolled ? "1px solid rgba(16,185,129,0.15)" : "1px solid rgba(255,255,255,0.3)",
      padding:"0 32px",height:68,
      display:"flex",alignItems:"center",justifyContent:"space-between",
      transition:"all 0.3s ease",
      boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.06)" : "none"
    }}>
      {/* Logo */}
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{
          width:150,height:48,borderRadius:14,overflow:"hidden",
          background:"rgba(255,255,255,0.95)",display:"flex",alignItems:"center",justifyContent:"center",
          padding:"4px 8px"
        }}>
          <img
            src="/logo.png"
            alt="Bireena Health logo"
            style={{width:"100%",height:"100%",objectFit:"contain"}}
            onError={e=>{e.target.style.display="none";}}
          />
        </div>
        
      </div>

      {/* Desktop links */}
      <div style={{display:"flex",gap:32,alignItems:"center"}}>
        {links.map(l=>(
          <a key={l} href={`#${l.toLowerCase()}`}
            style={{fontSize:13,fontWeight:700,color:"#475569",textDecoration:"none",transition:"color 0.2s"}}
            onMouseEnter={e=>e.target.style.color="#10b981"}
            onMouseLeave={e=>e.target.style.color="#475569"}>
            {l}
          </a>
        ))}
      </div>

      {/* CTA */}
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <a href="/login" style={{fontSize:13,fontWeight:700,color:"#475569",textDecoration:"none"}}>Sign In</a>
        <motion.a href="/login" whileHover={{scale:1.05}} whileTap={{scale:0.97}}
          style={{
            background:"linear-gradient(135deg,#10b981,#059669)",
            color:"white",padding:"10px 22px",borderRadius:12,
            fontSize:13,fontWeight:800,textDecoration:"none",
            display:"flex",alignItems:"center",gap:6,
            boxShadow:"0 8px 24px rgba(16,185,129,0.3)"
          }}>
          Get Started <ArrowRight size={14} />
        </motion.a>
      </div>
    </nav>
  );
}

// =========================================================
// HERO SECTION
// =========================================================
function Hero() {
  return (
    <section id="home" style={{paddingTop:110,paddingBottom:80,position:"relative",overflow:"hidden"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 32px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
        {/* Left */}
        <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{duration:0.8}}>
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
            style={{
              display:"inline-flex",alignItems:"center",gap:8,
              padding:"6px 16px",borderRadius:100,
              background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",
              fontSize:11,fontWeight:800,color:"#059669",letterSpacing:"0.12em",
              textTransform:"uppercase",marginBottom:24
            }}>
            <Sparkles size={12} /> Intelligent Healthcare Platform
          </motion.div>

          <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
            style={{fontSize:54,fontWeight:900,color:"#0f172a",lineHeight:1.05,letterSpacing:"-2px",marginBottom:20}}>
            Simplifying Healthcare<br/>
            <span style={{color:"#10b981",fontStyle:"italic"}}>with Intelligent Care</span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
            style={{fontSize:17,color:"#64748b",lineHeight:1.7,marginBottom:32,maxWidth:460}}>
            Bireena Health is an intelligent clinical platform that helps healthcare providers deliver better care, streamline workflows, and improve patient outcomes.
          </motion.p>

          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
            style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:40}}>
            <motion.a href="/login" whileHover={{scale:1.05}} whileTap={{scale:0.97}}
              style={{
                background:"linear-gradient(135deg,#10b981,#059669)",color:"white",
                padding:"14px 28px",borderRadius:14,fontSize:15,fontWeight:800,
                textDecoration:"none",display:"flex",alignItems:"center",gap:8,
                boxShadow:"0 12px 32px rgba(16,185,129,0.35)"
              }}>
              Get Started Free <ArrowRight size={16} />
            </motion.a>
            <motion.a href="#contact" whileHover={{scale:1.03}}
              style={{
                background:"white",color:"#0f172a",
                padding:"14px 28px",borderRadius:14,fontSize:15,fontWeight:800,
                textDecoration:"none",display:"flex",alignItems:"center",gap:8,
                border:"1px solid #e2e8f0",boxShadow:"0 4px 16px rgba(0,0,0,0.06)"
              }}>
              <Calendar size={16} color="#10b981" /> Book a Demo
            </motion.a>
          </motion.div>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7}}
            style={{display:"flex",gap:24,alignItems:"center"}}>
            {[
              {label:"HIPAA Compliant",icon:ShieldCheck},
              {label:"Secure & Encrypted",icon:ShieldPlus},
              {label:"Trusted by Providers",icon:Users},
            ].map(({label,icon:Icon})=>(
              <div key={label} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:700,color:"#64748b"}}>
                <Icon size={14} color="#10b981" /> {label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right – hero image with floating cards */}
        <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{duration:0.8,delay:0.2}}
          style={{position:"relative",height:520}}>

          {/* Hero image */}
          <motion.div
            animate={{y:[-6,6,-6]}}
            transition={{duration:6,repeat:Infinity,ease:"easeInOut"}}
            style={{
              position:"absolute",inset:0,
              borderRadius:32,overflow:"hidden",
              boxShadow:"0 40px 100px rgba(0,0,0,0.18)"
            }}>
            <img
              src="/src/components/ui/1.jpeg"
              alt="Healthcare professional"
              style={{width:"100%",height:"100%",objectFit:"cover"}}
              onError={e=>{
                e.target.style.display="none";
                e.target.parentElement.style.background="linear-gradient(135deg,#dcfce7,#d1fae5,#a7f3d0)";
              }}
            />
            <div style={{
              position:"absolute",inset:0,
              background:"linear-gradient(to top,rgba(15,23,42,0.3) 0%,transparent 60%)"
            }} />
          </motion.div>

          {/* Floating stat: Patients */}
          <FloatCard icon={Users} label="Total Patients" value="1,248"
            sub="↑ 12% vs yesterday" color="#10b981" delay={0.6}
            style={{top:24,left:-28}} />

          {/* Floating stat: Appointments */}
          <FloatCard icon={Calendar} label="Appointments" value="328"
            sub="↑ 10% vs yesterday" color="#3b82f6" delay={0.8}
            style={{top:"40%",right:-24}} />

          {/* Floating stat: New Records */}
          <FloatCard icon={FileText} label="New Records" value="85"
            sub="↑ 10% vs yesterday" color="#8b5cf6" delay={1.0}
            style={{bottom:24,left:20}} />

          {/* Clinical notification card */}
          <motion.div
            initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.2}}
            style={{position:"absolute",bottom:28,right:-20,zIndex:10}}>
            <motion.div
              animate={{y:[-6,6,-6]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}}
              style={{
                background:"rgba(15,23,42,0.88)",backdropFilter:"blur(20px)",
                borderRadius:18,padding:"12px 16px",
                border:"1px solid rgba(255,255,255,0.1)",
                boxShadow:"0 20px 60px rgba(0,0,0,0.25)",
                maxWidth:200
              }}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#10b981",boxShadow:"0 0 8px #10b981"}} />
                <span style={{fontSize:10,fontWeight:800,color:"#10b981",letterSpacing:"0.1em"}}>CLINICAL ASSISTANT</span>
              </div>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.8)",lineHeight:1.5,margin:0}}>
                Patient care gap detected for Patient ID: 102026
              </p>
              <div style={{
                marginTop:8,padding:"5px 10px",borderRadius:8,
                background:"rgba(16,185,129,0.2)",border:"1px solid rgba(16,185,129,0.3)",
                fontSize:10,fontWeight:700,color:"#34d399",display:"inline-block"
              }}>
                View Recommendation →
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Trusted by */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1}}
        style={{maxWidth:1200,margin:"60px auto 0",padding:"0 32px"}}>
        <p style={{textAlign:"center",fontSize:11,fontWeight:800,color:"#94a3b8",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:24}}>
          Trusted by Leading Healthcare Organizations
        </p>
        <div style={{display:"flex",gap:32,justifyContent:"center",alignItems:"center",flexWrap:"wrap"}}>
          {["MedCare Hospitals","Curewell Health","HealthFirst Clinic","Wellness Group","PrimeCare Medical"].map(name=>(
            <div key={name} style={{
              padding:"10px 20px",borderRadius:12,
              background:"rgba(255,255,255,0.7)",border:"1px solid rgba(16,185,129,0.15)",
              fontSize:13,fontWeight:800,color:"#475569",
              backdropFilter:"blur(10px)"
            }}>
              {name}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// =========================================================
// SECTION HEADING
// =========================================================
function SH({tag,title,sub}) {
  return (
    <div style={{textAlign:"center",marginBottom:60}}>
      <span style={{
        display:"inline-block",padding:"5px 16px",borderRadius:100,
        background:"rgba(16,185,129,0.1)",color:"#059669",
        fontSize:10,fontWeight:900,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:16
      }}>{tag}</span>
      <h2 style={{fontSize:42,fontWeight:900,color:"#0f172a",letterSpacing:"-1.5px",marginBottom:14,lineHeight:1.1}}>{title}</h2>
      <p style={{fontSize:16,color:"#64748b",maxWidth:580,margin:"0 auto",lineHeight:1.7}}>{sub}</p>
    </div>
  );
}

// =========================================================
// ABOUT / VIRTUAL ASSISTANT SECTION
// =========================================================
function About() {
  const items = [
    {icon:Zap,text:"Auto-categorization of 10,000+ medical records"},
    {icon:Activity,text:"Real-time clinical anomaly & fraud detection"},
    {icon:Target,text:"Resource and care gap identification"},
    {icon:Brain,text:"Patient intake and triage automation"},
  ];
  return (
    <section id="about" style={{padding:"100px 32px",background:"white"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
        <motion.div initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.7}}>
          <div style={{
            display:"inline-flex",alignItems:"center",gap:8,
            padding:"6px 16px",borderRadius:100,
            background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.2)",
            fontSize:10,fontWeight:900,color:"#059669",letterSpacing:"0.15em",
            textTransform:"uppercase",marginBottom:24
          }}>
            <Sparkles size={12} /> What We Provide
          </div>
          <h2 style={{fontSize:46,fontWeight:900,color:"#0f172a",letterSpacing:"-1.5px",lineHeight:1.05,marginBottom:20}}>
            Your 24/7 Virtual<br/><span style={{color:"#10b981"}}>Clinical Assistant</span>
          </h2>
          <p style={{fontSize:16,color:"#64748b",lineHeight:1.7,marginBottom:36,maxWidth:460}}>
            Our intelligent platform works around the clock to automate clinical tasks, reduce administrative burden, and help your care teams focus on what matters most — patient care.
          </p>
          <ul style={{listStyle:"none",padding:0,margin:"0 0 36px",display:"flex",flexDirection:"column",gap:16}}>
            {items.map(({icon:Icon,text})=>(
              <li key={text} style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:40,height:40,borderRadius:10,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon size={18} color="#10b981" />
                </div>
                <span style={{fontSize:15,fontWeight:700,color:"#0f172a"}}>{text}</span>
              </li>
            ))}
          </ul>
          <motion.a href="#features" whileHover={{scale:1.05}}
            style={{
              display:"inline-flex",alignItems:"center",gap:8,
              padding:"14px 28px",borderRadius:14,
              background:"linear-gradient(135deg,#10b981,#059669)",
              color:"white",fontSize:15,fontWeight:800,textDecoration:"none",
              boxShadow:"0 12px 32px rgba(16,185,129,0.3)"
            }}>
            Explore All Features <ArrowRight size={16} />
          </motion.a>
        </motion.div>

        {/* Clinical feed card */}
        <motion.div initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.7}}>
          <div style={{
            background:"white",borderRadius:28,padding:28,
            boxShadow:"0 30px 80px rgba(0,0,0,0.1)",border:"1px solid #f1f5f9"
          }}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24,paddingBottom:16,borderBottom:"1px solid #f1f5f9"}}>
              <div style={{display:"flex",gap:6}}>
                {["#f87171","#fbbf24","#34d399"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}} />)}
              </div>
              <span style={{fontSize:10,fontWeight:800,color:"#94a3b8",letterSpacing:"0.15em",textTransform:"uppercase"}}>Clinical Intelligence Feed</span>
              <div style={{padding:"3px 10px",borderRadius:100,background:"rgba(16,185,129,0.1)",fontSize:9,fontWeight:800,color:"#059669",border:"1px solid rgba(16,185,129,0.2)"}}>Live</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(16,185,129,0.08)",borderRadius:14,padding:14,marginBottom:16,border:"1px solid rgba(16,185,129,0.2)"}}>
              <motion.div animate={{opacity:[1,0.3,1]}} transition={{duration:1.5,repeat:Infinity}}
                style={{width:10,height:10,borderRadius:"50%",background:"#10b981",flexShrink:0}} />
              <span style={{fontSize:13,fontWeight:700,color:"#059669"}}>Analyzing clinical health...</span>
            </div>
            {[
              {icon:Zap,color:"#ef4444",bg:"#fef2f2",title:"Anomaly Detected",desc:"Duplicate record of 'Patient #4412' detected for Ward 'Emer-A'.",time:"Just now"},
              {icon:Activity,color:"#10b981",bg:"#f0fdf4",title:"Patient Intake Completed",desc:"New patient intake completed and added to system records.",time:"10 mins ago"},
              {icon:Target,color:"#8b5cf6",bg:"#faf5ff",title:"Care Gap Identified",desc:"Preventive screening due for Patient ID: 102026.",time:"1 hr ago"},
            ].map(({icon:Icon,color,bg,title,desc,time})=>(
              <motion.div key={title}
                whileHover={{scale:1.02,x:4}}
                style={{
                  display:"flex",alignItems:"flex-start",gap:14,
                  background:"white",borderRadius:16,padding:16,marginBottom:12,
                  border:"1px solid #f1f5f9",boxShadow:"0 2px 12px rgba(0,0,0,0.04)",
                  cursor:"pointer"
                }}>
                <div style={{width:38,height:38,borderRadius:10,background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon size={18} color={color} />
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:13,fontWeight:800,color:"#0f172a"}}>{title}</span>
                    <span style={{fontSize:10,fontWeight:600,color:"#94a3b8"}}>{time}</span>
                  </div>
                  <p style={{fontSize:12,color:"#64748b",margin:0,lineHeight:1.5}}>{desc}</p>
                </div>
              </motion.div>
            ))}
            <div style={{textAlign:"center",marginTop:8}}>
              <a href="#about" style={{fontSize:12,fontWeight:800,color:"#10b981",textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                View All Notifications <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// =========================================================
// FEATURES
// =========================================================
function Features() {
  const feats = [
    {icon:Brain,title:"Smart Automation",desc:"Reduce admin work with intelligent assistants that handle documentation and follow-ups.",color:"#10b981",bg:"#f0fdf4"},
    {icon:Activity,title:"Real-time Clinical Insights",desc:"Get actionable insights at the point of care and improve decision-making.",color:"#3b82f6",bg:"#eff6ff"},
    {icon:ShieldCheck,title:"Secure & Compliant",desc:"End-to-end encryption and HIPAA-compliant infrastructure for peace of mind.",color:"#8b5cf6",bg:"#faf5ff"},
    {icon:CheckCircle2,title:"Seamless Connectivity",desc:"Integrate with EHRs, labs, pharmacies, and other tools you already use.",color:"#f97316",bg:"#fff7ed"},
  ];
  return (
    <section id="features" style={{padding:"100px 32px",background:"#f8fafc"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <SH tag="Why Choose Us" title="Built for Modern Healthcare"
          sub="Powerful features that set us apart from the rest." />
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24}}>
          {feats.map(({icon:Icon,title,desc,color,bg},i)=>(
            <motion.div key={title}
              initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.1,duration:0.5}}
              whileHover={{y:-8,boxShadow:"0 30px 60px rgba(0,0,0,0.12)"}}
              style={{
                background:"white",borderRadius:24,padding:28,
                border:"1px solid #f1f5f9",cursor:"pointer",
                boxShadow:"0 4px 20px rgba(0,0,0,0.05)",transition:"box-shadow 0.3s"
              }}>
              <div style={{width:52,height:52,borderRadius:14,background:bg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
                <Icon size={26} color={color} />
              </div>
              <h3 style={{fontSize:17,fontWeight:800,color:"#0f172a",marginBottom:10,letterSpacing:"-0.3px"}}>{title}</h3>
              <p style={{fontSize:13,color:"#64748b",lineHeight:1.6,marginBottom:16}}>{desc}</p>
              <a href="#contact" style={{fontSize:12,fontWeight:800,color:color,textDecoration:"none",display:"flex",alignItems:"center",gap:4}}>
                Learn more <ArrowRight size={12} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =========================================================
// SERVICES
// =========================================================
function Services() {
  const svcs = [
    {icon:FileText,title:"EHR Automation",desc:"Smart EHR automation that saves time and reduces manual entry."},
    {icon:FlaskConical,title:"Pharmacy & Labs",desc:"Integrated ordering and results management in one place."},
    {icon:BarChart2,title:"Financial Reporting",desc:"Real-time financial insights and performance analytics."},
    {icon:Calendar,title:"Appointment Management",desc:"Intelligent scheduling and patient reminders."},
    {icon:Brain,title:"Clinical Insights",desc:"Data-driven insights to improve care quality and outcomes."},
    {icon:Users,title:"Care Coordination",desc:"Seamless communication across the care team."},
    {icon:MessageSquare,title:"Patient Engagement",desc:"Empower patients with portals, updates, and secure messaging."},
    {icon:Activity,title:"Telehealth Solutions",desc:"Built-in telehealth tools for virtual care delivery."},
  ];
  return (
    <section id="solutions" style={{padding:"100px 32px",background:"white"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <SH tag="Our Solutions" title="Comprehensive Medical Services"
          sub="A complete suite of solutions to streamline operations, improve efficiency, and elevate patient experience." />
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
          {svcs.map(({icon:Icon,title,desc},i)=>(
            <motion.div key={title}
              initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:(i%4)*0.08}}
              whileHover={{y:-6}}
              style={{
                background:"#f8fafc",borderRadius:20,padding:22,
                border:"1px solid #e2e8f0",cursor:"pointer",
                transition:"all 0.2s"
              }}>
              <div style={{width:44,height:44,borderRadius:12,background:"rgba(16,185,129,0.12)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
                <Icon size={20} color="#10b981" />
              </div>
              <h3 style={{fontSize:15,fontWeight:800,color:"#0f172a",marginBottom:8}}>{title}</h3>
              <p style={{fontSize:12,color:"#64748b",lineHeight:1.6,marginBottom:12}}>{desc}</p>
              <a href="#contact" style={{fontSize:11,fontWeight:800,color:"#10b981",textDecoration:"none",display:"flex",alignItems:"center",gap:3}}>
                Learn more <ArrowRight size={11} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =========================================================
// STATS BAR
// =========================================================
function Stats() {
  const stats = [
    {icon:Users,value:"20K+",label:"Healthcare Providers"},
    {icon:HeartPulse,value:"1M+",label:"Patients Managed"},
    {icon:FileText,value:"50M+",label:"Clinical Records"},
    {icon:Activity,value:"99.9%",label:"Uptime & Reliability"},
  ];
  return (
    <div style={{background:"linear-gradient(135deg,#0f2d1f,#0a1f14)",padding:"48px 32px"}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:40}}>
        {stats.map(({icon:Icon,value,label})=>(
          <div key={label} style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
            <div style={{width:48,height:48,borderRadius:14,background:"rgba(16,185,129,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon size={22} color="#10b981" />
            </div>
            <div style={{fontSize:36,fontWeight:900,color:"white",letterSpacing:"-1px"}}>{value}</div>
            <div style={{fontSize:13,fontWeight:700,color:"rgba(255,255,255,0.5)"}}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================
// PRICING
// =========================================================
function Pricing() {
  const [yearly,setYearly]=useState(false);
  const plans = [
    {name:"Starter",desc:"For small practices getting started",mo:49,yr:39,feats:["Up to 1,000 patients","EHR Integration","Basic Assistant"]},
    {name:"Professional",desc:"For growing practices",mo:129,yr:99,feats:["Up to 10,000 patients","Advanced Assistant","Reports & Analytics","Priority Support"],popular:true},
    {name:"Enterprise",desc:"For large organizations",mo:null,yr:null,feats:["Unlimited patients","Custom integrations","Dedicated Support"]},
  ];
  return (
    <section id="pricing" style={{padding:"100px 32px",background:"#f8fafc"}}>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <SH tag="Pricing" title="Simple, Transparent Pricing"
          sub="Transparent pricing with no hidden fees. Scale effortlessly as your practice grows." />
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:16,marginBottom:48}}>
          <span style={{fontSize:13,fontWeight:700,color:yearly?"#94a3b8":"#0f172a"}}>Monthly</span>
          <motion.button onClick={()=>setYearly(!yearly)}
            style={{width:52,height:28,borderRadius:100,background:"#10b981",border:"none",cursor:"pointer",padding:3,position:"relative"}}>
            <motion.div animate={{x:yearly?24:0}} transition={{type:"spring",stiffness:500,damping:30}}
              style={{width:22,height:22,borderRadius:"50%",background:"white",boxShadow:"0 2px 6px rgba(0,0,0,0.2)"}} />
          </motion.button>
          <span style={{fontSize:13,fontWeight:700,color:yearly?"#0f172a":"#94a3b8",display:"flex",gap:6,alignItems:"center"}}>
            Yearly
            <span style={{padding:"2px 8px",borderRadius:100,background:"rgba(16,185,129,0.15)",color:"#059669",fontSize:10,fontWeight:800}}>Save 20%</span>
          </span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
          {plans.map(({name,desc,mo,yr,feats,popular})=>(
            <motion.div key={name}
              whileHover={{y:-8}}
              style={{
                background:popular?"linear-gradient(135deg,#0f2d1f,#0a3d21)":"white",
                borderRadius:24,padding:32,
                border:popular?"none":"1px solid #e2e8f0",
                boxShadow:popular?"0 30px 80px rgba(16,185,129,0.25)":"0 4px 20px rgba(0,0,0,0.05)",
                position:"relative",overflow:"hidden"
              }}>
              {popular && <div style={{
                position:"absolute",top:16,right:16,
                padding:"4px 12px",borderRadius:100,
                background:"rgba(16,185,129,0.3)",color:"#34d399",
                fontSize:10,fontWeight:900,border:"1px solid rgba(16,185,129,0.4)"
              }}>Most Popular</div>}
              <h3 style={{fontSize:13,fontWeight:900,color:popular?"#6ee7b7":"#94a3b8",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4}}>{name}</h3>
              <p style={{fontSize:12,color:popular?"rgba(255,255,255,0.5)":"#94a3b8",marginBottom:20}}>{desc}</p>
              <div style={{marginBottom:28}}>
                {mo ? (
                  <>
                    <span style={{fontSize:40,fontWeight:900,color:popular?"white":"#0f172a",letterSpacing:"-1px"}}>${yearly?yr:mo}</span>
                    <span style={{fontSize:13,color:popular?"rgba(255,255,255,0.4)":"#94a3b8",marginLeft:4}}>/month</span>
                  </>
                ) : (
                  <span style={{fontSize:36,fontWeight:900,color:popular?"white":"#0f172a"}}>Custom</span>
                )}
              </div>
              <ul style={{listStyle:"none",padding:0,margin:"0 0 28px",display:"flex",flexDirection:"column",gap:10}}>
                {feats.map(f=>(
                  <li key={f} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,fontWeight:600,color:popular?"rgba(255,255,255,0.8)":"#475569"}}>
                    <CheckCircle2 size={15} color="#10b981" /> {f}
                  </li>
                ))}
              </ul>
              <motion.a href={mo ? "/login" : "#contact"} whileHover={{scale:1.03}}
                style={{
                  display:"block",textAlign:"center",padding:"12px",borderRadius:12,
                  background:popular?"#10b981":"white",
                  color:popular?"white":"#0f172a",
                  fontSize:14,fontWeight:800,textDecoration:"none",
                  border:popular?"none":"2px solid #e2e8f0"
                }}>
                {mo?"Get Started":"Contact Sales"}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =========================================================
// TESTIMONIALS
// =========================================================
function Testimonials() {
  const reviews = [
    {name:"Dr. Emily Carter",role:"Family Medicine",stars:5,text:"Bireena Health has transformed the way we manage our practice. The assistant saves us hours every day."},
    {name:"Dr. James Wilson",role:"Internal Medicine",stars:5,text:"The insights and automation help us deliver better care and improve patient satisfaction."},
    {name:"Sarah Mitchell",role:"Practice Administrator",stars:5,text:"A must-have platform for any modern healthcare organization."},
  ];
  return (
    <section style={{padding:"100px 32px",background:"white"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <SH tag="What Our Clients Say" title="Loved by Healthcare Professionals"
          sub="Trusted by thousands of healthcare providers across the country." />
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:28}}>
          {reviews.map(({name,role,stars,text},i)=>(
            <motion.div key={name}
              initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.1}}
              style={{
                background:"#f8fafc",borderRadius:24,padding:28,
                border:"1px solid #e2e8f0"
              }}>
              <div style={{display:"flex",gap:4,marginBottom:16}}>
                {Array(stars).fill(0).map((_,j)=><Star key={j} size={14} fill="#fbbf24" color="#fbbf24" />)}
              </div>
              <p style={{fontSize:14,color:"#475569",lineHeight:1.7,marginBottom:20,fontStyle:"italic"}}>
                "{text}"
              </p>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#10b981,#059669)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:15,fontWeight:800,color:"white"}}>{name[3]}</span>
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:"#0f172a"}}>{name}</div>
                  <div style={{fontSize:11,fontWeight:600,color:"#94a3b8"}}>{role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =========================================================
// CTA
// =========================================================
function CTA() {
  return (
    <section id="contact" style={{padding:"100px 32px",background:"linear-gradient(135deg,#0a1f14,#0f2d1f)",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:"20%",left:"-5%",width:500,height:500,background:"rgba(16,185,129,0.08)",borderRadius:"50%",filter:"blur(120px)"}} />
      <div style={{position:"absolute",bottom:"20%",right:"-5%",width:500,height:500,background:"rgba(6,182,212,0.07)",borderRadius:"50%",filter:"blur(120px)"}} />
      <div style={{maxWidth:1000,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
        <div style={{
          display:"inline-flex",alignItems:"center",gap:8,marginBottom:24,
          padding:"6px 18px",borderRadius:100,
          background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",
          fontSize:10,fontWeight:800,color:"#34d399",letterSpacing:"0.15em",textTransform:"uppercase"
        }}>
          <Sparkles size={12} /> Get Started Today
        </div>
        <h2 style={{fontSize:52,fontWeight:900,color:"white",letterSpacing:"-2px",lineHeight:1.1,marginBottom:16}}>
          Ready to Transform<br/>
          <span style={{color:"#10b981"}}>Your Practice?</span>
        </h2>
        <p style={{fontSize:16,color:"rgba(255,255,255,0.5)",marginBottom:48}}>
          Join thousands of healthcare providers already using Bireena Health to deliver smarter, better care.
        </p>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          <motion.a href="/login" whileHover={{scale:1.05}}
            style={{
              display:"flex",alignItems:"center",gap:8,
              padding:"16px 32px",borderRadius:14,
              background:"linear-gradient(135deg,#10b981,#059669)",
              color:"white",fontSize:15,fontWeight:800,textDecoration:"none",
              boxShadow:"0 16px 40px rgba(16,185,129,0.4)"
            }}>
            Get Started Free <ArrowRight size={16} />
          </motion.a>
          <motion.a href="#contact" whileHover={{scale:1.05}}
            style={{
              display:"flex",alignItems:"center",gap:8,
              padding:"16px 32px",borderRadius:14,
              background:"rgba(255,255,255,0.08)",
              color:"white",fontSize:15,fontWeight:800,textDecoration:"none",
              border:"1px solid rgba(255,255,255,0.15)"
            }}>
            <Calendar size={16} /> Book a Demo
          </motion.a>
        </div>
      </div>
    </section>
  );
}

// =========================================================
// FOOTER
// =========================================================
function Footer() {
  const cols = [
    {title:"Platform",links:["Features","Pricing","Solutions","Integrations"]},
    {title:"Company",links:["About Us","Blog","Careers","Contact Us"]},
    {title:"Resources",links:["Help Center","Documentation","Webinars","Case Studies"]},
  ];
  const footerLinkMap = {
    Features: "#features",
    Pricing: "#pricing",
    Solutions: "#solutions",
    Integrations: "#contact",
    "About Us": "#about",
    Blog: "#contact",
    Careers: "#contact",
    "Contact Us": "#contact",
    "Help Center": "#contact",
    Documentation: "#contact",
    Webinars: "#contact",
    "Case Studies": "#about"
  };

  return (
    <footer style={{background:"#0a0f0d",padding:"80px 32px 32px"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1.5fr",gap:48,marginBottom:60}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#10b981,#059669)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <HeartPulse size={22} color="white" />
              </div>
              <div>
                <div style={{fontSize:16,fontWeight:900,color:"white",letterSpacing:"-0.5px",lineHeight:1}}>BIREENA</div>
                <div style={{fontSize:10,fontWeight:700,color:"#10b981",letterSpacing:"0.15em"}}>HEALTH</div>
              </div>
            </div>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.7,marginBottom:24}}>
              Advanced Medical ERP for modern hospitals and clinics. Simple. Secure. Smart.
            </p>
            <div style={{display:"flex",gap:10}}>
              {[MessageSquare,Users,Activity].map((Icon,i)=>(
                <div key={i} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                  <Icon size={15} color="rgba(255,255,255,0.5)" />
                </div>
              ))}
            </div>
          </div>
          {cols.map(({title,links})=>(
            <div key={title}>
              <h4 style={{fontSize:11,fontWeight:900,color:"rgba(255,255,255,0.7)",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:20}}>{title}</h4>
              <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:12}}>
                {links.map(l=>(
                  <li key={l}><a href={footerLinkMap[l] ?? "#contact"} style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.4)",textDecoration:"none",transition:"color 0.2s"}}
                    onMouseEnter={e=>e.target.style.color="#10b981"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.4)"}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 style={{fontSize:11,fontWeight:900,color:"rgba(255,255,255,0.7)",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:20}}>Stay Connected</h4>
            <div style={{display:"flex",borderRadius:12,overflow:"hidden",border:"1px solid rgba(255,255,255,0.1)"}}>
              <input placeholder="Enter your email" style={{
                flex:1,padding:"10px 14px",background:"rgba(255,255,255,0.05)",
                border:"none",color:"white",fontSize:13,outline:"none"
              }} />
              <button style={{padding:"10px 14px",background:"#10b981",border:"none",cursor:"pointer",display:"flex",alignItems:"center"}}>
                <ArrowRight size={15} color="white" />
              </button>
            </div>
          </div>
        </div>
        <div style={{
          paddingTop:24,borderTop:"1px solid rgba(255,255,255,0.08)",
          display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12
        }}>
          <p style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em",textTransform:"uppercase"}}>
            © 2026 Bireena Health. All rights reserved.
          </p>
          <div style={{display:"flex",gap:24}}>
            {["Privacy Policy","Terms of Service","Security"].map(t=>(
              <a key={t} href="#contact" style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.3)",textDecoration:"none",letterSpacing:"0.05em"}}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// =========================================================
// ROOT
// =========================================================
export default function Landing() {
  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",position:"relative",overflowX:"hidden"}}>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        .animated-bg { position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
        section, nav, footer { position:relative; z-index:1; }
      `}</style>

      <AnimatedBackground />
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Services />
      <Stats />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}