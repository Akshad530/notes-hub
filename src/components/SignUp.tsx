import React, { useState } from 'react';
import { AudioWaveform, Check, EyeOff, FileText, Image as ImageIcon, Lock, Mail, Mic, Sparkles, Upload, Video } from 'lucide-react';
import { HexagonLogo } from './Logo';

interface SignUpProps {
  onSignUp: () => void;
}

export function SignUp({ onSignUp }: SignUpProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    onSignUp();
  };

  return (
    <main className="min-h-screen bg-[#d9d9d9] p-4 sm:p-7 lg:p-10 flex items-center justify-center font-sans text-slate-950">
      <section className="w-full max-w-6xl min-h-[650px] bg-white rounded-[28px] p-4 sm:p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] grid lg:grid-cols-[1.25fr_0.9fr] overflow-hidden">
        <div className="relative min-h-[480px] lg:min-h-full rounded-[22px] bg-[#f7f7f7] overflow-hidden flex flex-col justify-between p-7 sm:p-9">
          <div className="flex items-center gap-3 font-extrabold tracking-tight text-slate-950 relative z-20">
            <HexagonLogo className="h-6 w-6 text-slate-950" />
            <span className="text-base sm:text-lg">Note Hub</span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,#111_1.2px,transparent_1.4px)] [background-size:6px_6px] opacity-[0.12] animate-[spin_34s_linear_infinite]" />
            <div className="absolute left-[-8%] right-[-8%] top-[43%] h-28 bg-[radial-gradient(circle,#111_1.5px,transparent_1.7px)] [background-size:5px_5px] opacity-70 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_70%,transparent)] animate-pulse" />
            <div className="absolute h-[520px] w-[520px] rounded-full border border-slate-200/80" />
            <div className="absolute h-[360px] w-[360px] rounded-full border border-slate-200/70" />
            <div className="absolute h-64 w-64 rounded-full bg-sky-200/30 blur-3xl animate-[pulse_5s_ease-in-out_infinite]" />
          </div>

          <div className="absolute left-8 top-24 hidden sm:flex items-center gap-2 animate-[bounce_4s_ease-in-out_infinite]">
            <button className="h-12 w-12 rounded-xl bg-white shadow-[0_10px_26px_rgba(15,23,42,0.12)] border border-slate-100 flex items-center justify-center">
              <AudioWaveform className="h-5 w-5 text-slate-950" />
            </button>
            <span className="h-0.5 w-6 bg-sky-500" />
          </div>

          <div className="absolute right-16 bottom-28 hidden sm:flex items-center gap-2 animate-[bounce_5s_ease-in-out_infinite]">
            <span className="h-0.5 w-6 bg-sky-500" />
            <button className="h-12 w-12 rounded-xl bg-white shadow-[0_10px_26px_rgba(15,23,42,0.12)] border border-slate-100 flex items-center justify-center font-bold text-slate-950">
              A
            </button>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[450px] rounded-2xl bg-white/95 border border-slate-100 shadow-[0_22px_60px_rgba(15,23,42,0.14)] p-5 animate-[floatPanel_6s_ease-in-out_infinite]">
            <div className="flex items-center gap-5 text-xs font-semibold border-b border-slate-100 pb-3">
              <button className="flex items-center gap-2 text-slate-950 bg-sky-50 px-3 py-2 rounded-lg border border-sky-100">
                <Mic className="h-4 w-4" />
                Auto Notes
              </button>
              <button className="flex items-center gap-2 text-slate-400">
                <Upload className="h-4 w-4" />
                Upload File
              </button>
            </div>
            <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Live note capture</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> Recording</span>
              </div>
              <div className="mt-4 flex h-20 items-end gap-1.5">
                {[28, 52, 36, 70, 44, 82, 58, 34, 76, 48, 66, 38, 88, 54, 42, 72].map((height, index) => (
                  <span
                    key={index}
                    className="flex-1 rounded-full bg-slate-950/80 animate-[wave_1.2s_ease-in-out_infinite]"
                    style={{ height: `${height}%`, animationDelay: `${index * 0.06}s` }}
                  />
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <span className="block h-2.5 w-11/12 rounded-full bg-slate-200 overflow-hidden">
                  <span className="block h-full w-2/3 rounded-full bg-sky-500 animate-[scanLine_2.4s_ease-in-out_infinite]" />
                </span>
                <span className="block h-2.5 w-8/12 rounded-full bg-slate-200" />
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              Capture meetings, images, and rough ideas, then turn them into searchable notes with summaries and next steps.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-sm"><Video className="h-3.5 w-3.5" /> Meeting</span>
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-sm"><FileText className="h-3.5 w-3.5" /> Summary</span>
              <span className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-sm"><ImageIcon className="h-3.5 w-3.5" /> Image notes</span>
            </div>
          </div>

          <div className="relative z-10">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm border border-slate-100">
              <Sparkles className="h-4 w-4 text-sky-500" />
              AI notes with image understanding
            </span>
            <h1 className="max-w-md text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
              One Click Away from<br />Smarter Notes
            </h1>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-12 sm:px-10 lg:px-14">
          <form onSubmit={handleSubmit} className="w-full max-w-[300px]">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Create an Account</h2>
            <p className="mt-2 text-xs text-slate-500">You are few moments away from getting started!</p>

            <label className="mt-5 flex items-center gap-2 text-[11px] font-medium text-slate-700">
              <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-black" />
              Send me tips, updates and offers
            </label>

            <label className="block mt-6 text-xs font-semibold text-slate-950" htmlFor="signup-email">Email</label>
            <div className="mt-2 relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                required
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <label className="block mt-4 text-xs font-semibold text-slate-950" htmlFor="signup-password">Password</label>
            <div className="mt-2 relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="************"
                required
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
              <EyeOff className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            </div>

            <p className="mt-3 text-[10px] leading-4 text-slate-600">
              By signing up, you accept Note Hub <span className="font-semibold text-slate-950">privacy policy</span> and <span className="font-semibold text-slate-950">terms of service</span>.
            </p>

            <button type="submit" className="mt-5 h-11 w-full rounded-lg bg-black text-sm font-semibold text-white shadow-[0_16px_28px_rgba(15,23,42,0.16)] transition hover:bg-slate-800">
              Sign up
            </button>

            <div className="my-5 text-center text-xs font-semibold text-slate-950">or</div>

            <button type="button" onClick={onSignUp} className="h-11 w-full rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
              G&nbsp;&nbsp; Continue with Google
            </button>
            <button type="button" onClick={onSignUp} className="mt-3 h-11 w-full rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Continue with Microsoft</span>
            </button>

            <p className="mt-7 text-center text-xs text-slate-400">
              Already have an account? <button type="button" onClick={onSignUp} className="font-bold text-slate-950">Log In</button>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
