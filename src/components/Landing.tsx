import React from 'react';
import { ChevronDown, X, Play, Image as ImageIcon, MessageSquare, Briefcase, Plus, Github, PenTool, LayoutDashboard, Calendar, PenLine, FileText, CheckCircle2 } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

const HexagonLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <path d="M11 21 L11 14 L6 11" />
    <path d="M4 7 L9 10 L13 8" />
    <path d="M20 7 L15 10 L15 16" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
  </svg>
);

export function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-indigo-100 overflow-x-hidden relative">
      <nav className="flex items-center justify-between px-8 py-5 bg-white relative z-50">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-2xl cursor-default">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center p-1.5 shadow-sm">
            <HexagonLogo className="w-full h-full text-white" />
          </div>
          <span className="tracking-tight">Note Hub</span>
        </div>
        
        <div className="hidden lg:flex items-center space-x-10 text-sm font-medium text-slate-500">
          <button className="hover:text-slate-900 transition-colors">Home</button>
          <button className="hover:text-slate-900 flex items-center space-x-1.5 transition-colors">
            <span>Features</span> <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="hover:text-slate-900 transition-colors">Pricing</button>
          <button className="hover:text-slate-900 flex items-center space-x-1.5 transition-colors">
            <span>Resources</span> <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button className="hover:text-slate-900 flex items-center space-x-1.5 transition-colors">
            <span>Get App</span> <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        <div className="flex items-center space-x-6 text-sm font-semibold">
          <button onClick={onGetStarted} className="text-slate-800 hover:text-black transition-colors">Sign In</button>
          <button 
            onClick={onGetStarted}
            className="bg-black hover:bg-slate-800 text-white px-5 py-2.5 rounded-full transition-colors flex items-center space-x-1"
          >
            <span>Sign up</span>
            <span className="font-light ml-1">&gt;</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center w-full relative z-10 pt-20 pb-0">
        
        <div className="flex flex-col items-center text-center px-4 max-w-4xl mx-auto z-20">
          <h3 className="font-[Caveat,cursive] italic text-slate-500 text-2xl md:text-3xl mb-4 tracking-wide font-normal">
            Awesome notes everywhere
          </h3>
          <h1 className="text-[3.5rem] md:text-[5.5rem] font-bold tracking-tight text-[#0f172a] leading-[1.05] mb-6 relative">
            Every Conversation into<br />
            <span className="relative inline-block mt-2">
              Actionable Notes
              <svg className="absolute w-full h-[0.5em] -bottom-[0.2em] left-0 text-indigo-400/80 -z-10" viewBox="0 0 400 30" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 25C125 10 275 -5 395 15C250 25 150 15 50 30" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.8"/>
              </svg>
              <svg className="absolute -top-6 -right-12 w-10 h-10 text-yellow-400 animate-[pulse_3s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.536-7.536l-2.828 2.828m-11.314 0l-2.828-2.828m16.97 16.97l-2.828-2.828m-11.314 0l-2.828-2.828"/>
              </svg>
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl font-medium tracking-tight mb-12">
            Your Meetings. Your Chats. All Turned Into Actionable Notes.
          </p>
          <div className="flex flex-col items-center justify-center">
            <button 
              onClick={onGetStarted}
              className="bg-black hover:bg-slate-800 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-xl shadow-slate-900/10 flex items-center space-x-2 text-lg hover:-translate-y-0.5"
            >
              <span>Get started Free</span>
              <span className="font-light">&gt;</span>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 mb-20 relative z-20">
             <button onClick={onGetStarted} className="flex items-start bg-white border border-slate-200/80 rounded-2xl p-4 w-60 text-left hover:border-slate-300 hover:shadow-md transition-all group">
               <div className="mr-4 mt-1 opacity-60 group-hover:opacity-100 transition-opacity"><LayoutDashboard className="w-5 h-5"/></div>
               <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-sm mb-0.5 tracking-tight">Add to Chrome</span>
                  <span className="text-[11px] text-slate-500 font-medium tracking-tight leading-snug">Make note taker browser</span>
               </div>
             </button>
             <button onClick={onGetStarted} className="flex items-start bg-white border border-slate-200/80 rounded-2xl p-4 w-60 text-left hover:border-slate-300 hover:shadow-md transition-all group">
               <div className="mr-4 mt-1 opacity-60 group-hover:opacity-100 transition-opacity"><LayoutDashboard className="w-5 h-5"/></div>
               <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-sm mb-0.5 tracking-tight">Download from App store</span>
                  <span className="text-[11px] text-slate-500 font-medium tracking-tight leading-snug">Add to Appl device</span>
               </div>
             </button>
          </div>
        </div>

        {/* Central Graphic Section */}
        <div className="relative w-full max-w-4xl mx-auto flex justify-center mb-0 mt-8 z-20">
            {/* The mockup dialog */}
            <div className="w-[600px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col relative z-20 overflow-hidden">
               {/* header */}
               <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                  <h3 className="font-semibold text-[19px] text-[#0f172a] tracking-tight">Note Hub is creating notes from meeting...</h3>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors p-1"><X className="w-5 h-5"/></button>
               </div>
               
               {/* tabs */}
               <div className="flex items-center gap-6 px-6 pt-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2 pb-3 border-b-2 border-indigo-900 text-indigo-950 font-semibold cursor-pointer">
                    <PenLine className="w-4 h-4 text-indigo-900"/>
                    <span className="text-sm">Auto Notes</span>
                  </div>
                  <div className="flex items-center space-x-2 pb-3 border-b-2 border-transparent text-slate-400 hover:text-slate-600 font-medium cursor-pointer transition-colors">
                    <FileText className="w-4 h-4"/>
                    <span className="text-sm">Type</span>
                  </div>
                  <div className="flex items-center space-x-2 pb-3 border-b-2 border-transparent text-slate-400 hover:text-slate-600 font-medium cursor-pointer transition-colors">
                    <Plus className="w-4 h-4"/>
                    <span className="text-sm">Upload</span>
                  </div>
                  <div className="flex items-center space-x-2 pb-3 border-b-2 border-transparent text-slate-400 hover:text-slate-600 font-medium cursor-pointer transition-colors">
                    <CheckCircle2 className="w-4 h-4"/>
                    <span className="text-sm">Saved</span>
                  </div>
               </div>
               
               {/* inner content block */}
               <div className="p-6 pb-8">
                 <div className="w-full h-64 bg-[#e0dfff] rounded-2xl flex items-center justify-center pt-8 text-center px-8 relative overflow-hidden">
                    <h2 className="font-[Caveat,cursive] italic text-white text-4xl leading-relaxed tracking-wider font-light mx-10 whitespace-pre-wrap mix-blend-overlay">Notes are being{'\n'}created</h2>
                 </div>
               </div>
            </div>
            
            {/* Defensive badge right */}
            <div className="absolute right-[-80px] top-[20%] bg-white rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-4 pr-6 flex items-center gap-3 border border-slate-100 z-30 animate-[bounce_5s_ease-in-out_infinite] delay-1000">
               <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                 <CheckCircle2 className="w-5 h-5 text-emerald-600" />
               </div>
               <div>
                  <div className="text-sm font-bold text-slate-800">100% Accurate</div>
                  <div className="text-xs text-slate-500 font-medium">AI Transcriptions</div>
               </div>
            </div>

            {/* AI badge left */}
            <div className="absolute left-[-120px] bottom-[20%] bg-white rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-4 flex items-center gap-3 border border-slate-100 z-30 animate-[bounce_6s_ease-in-out_infinite]">
               <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                 <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.536-7.536l-2.828 2.828m-11.314 0l-2.828-2.828m16.97 16.97l-2.828-2.828m-11.314 0l-2.828-2.828"/></svg>
               </div>
               <div>
                  <div className="text-sm font-bold text-slate-800">Powered by Gemini</div>
                  <div className="text-xs text-slate-500 font-medium">Smart Summaries</div>
               </div>
            </div>

            {/* Decorative items */}
            {/* Mail icon left */}
             <div className="absolute left-[-100px] top-[10%] w-24 h-24 bg-white rounded-xl border-4 border-slate-900 flex items-center justify-center transform -rotate-12 shadow-2xl z-20">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-slate-900"><path d="M21 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" /><path d="m3 7 9 6 9-6" /></svg>
             </div>
             
             {/* Laptop icon bottom left */}
             <div className="absolute left-[-40px] bottom-[-20px] w-20 h-20 bg-white rounded-lg border-4 border-slate-900 flex items-end justify-center transform rotate-6 shadow-2xl z-20 pb-2">
                 <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mb-2"></div>
             </div>
             
             {/* cute character right */}
             <div className="absolute right-[-100px] bottom-[-40px] z-30 pointer-events-none transform scale-110">
                <svg viewBox="0 0 200 200" className="w-56 h-56" fill="none">
                  {/* character body */}
                  <path d="M100 20C120 20 130 40 130 50C160 50 180 80 180 120C180 160 150 180 100 180C50 180 20 160 20 120C20 80 40 50 70 50C70 40 80 20 100 20Z" fill="#b9affa"/>
                  <path d="M100 20C120 20 130 40 130 50C160 50 180 80 180 120C180 160 150 180 100 180C50 180 20 160 20 120C20 80 40 50 70 50C70 40 80 20 100 20Z" stroke="#0f172a" strokeWidth="6" strokeLinejoin="round"/>
                  {/* head curl */}
                  <path d="M90 25C95 10 105 10 110 25" stroke="#0f172a" strokeWidth="6" strokeLinecap="round"/>
                  <path d="M85 45C95 30 105 30 115 45" stroke="#0f172a" strokeWidth="6" strokeLinecap="round"/>
                  {/* closed eyes */}
                  <path d="M65 130C75 140 85 130 85 130" stroke="#0f172a" strokeWidth="6" strokeLinecap="round"/>
                  <path d="M115 130C125 140 135 130 135 130" stroke="#0f172a" strokeWidth="6" strokeLinecap="round"/>
                  {/* arm & pencil */}
                  <path d="M160 150L180 150" stroke="#0f172a" strokeWidth="6" strokeLinecap="round"/>
                  {/* pencil drawing */}
                  <g transform="rotate(45 50 150)">
                    <rect x="25" y="140" width="15" height="50" rx="2" fill="white" stroke="#0f172a" strokeWidth="5"/>
                    <path d="M25 190L32.5 210L40 190Z" fill="white" stroke="#0f172a" strokeWidth="5" strokeLinejoin="round"/>
                  </g>
                </svg>
             </div>
        </div>

        {/* Abstract Clouds Background - mimicking the bottom clouds */}
        <div className="absolute bottom-0 left-0 right-0 h-[400px] z-0 overflow-hidden pointer-events-none opacity-40">
           <div className="absolute bottom-[-100px] left-[-20%] w-[800px] h-[500px] bg-sky-100 rounded-[100%] blur-[80px]"></div>
           <div className="absolute bottom-[-150px] right-[-10%] w-[900px] h-[600px] bg-indigo-50/80 rounded-[100%] blur-[100px]"></div>
           <div className="absolute bottom-[-50px] left-[30%] w-[600px] h-[400px] bg-slate-100/60 rounded-[100%] blur-[60px]"></div>
        </div>
      </main>

      {/* Footer Logos */}
      <footer className="w-full bg-white border-t border-slate-100 py-6 relative z-30">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between overflow-x-auto no-scrollbar gap-8">
           <span className="text-[13px] font-semibold text-slate-400 whitespace-nowrap uppercase tracking-widest shrink-0">Trusted by global teams</span>
           <div className="flex items-center space-x-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center space-x-2 font-bold text-lg text-slate-800"><Github className="w-6 h-6"/><span>GitLab</span></div>
             <div className="flex items-center space-x-2 font-bold text-lg text-slate-800"><LayoutDashboard className="w-6 h-6"/><span>asana</span></div>
             <div className="flex items-center space-x-2 font-bold text-lg text-slate-800"><Briefcase className="w-6 h-6"/><span>tropic</span></div>
             <div className="flex items-center space-x-2 font-bold text-lg text-slate-800"><Calendar className="w-6 h-6"/><span>cansaas</span></div>
             <div className="flex items-center space-x-2 font-bold text-lg text-slate-800"><MessageSquare className="w-6 h-6"/><span>reddit</span></div>
           </div>
        </div>
      </footer>
    </div>
  );
}
