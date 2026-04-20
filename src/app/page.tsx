import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Code, Search, Building2, Terminal, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-[#EDEDED] flex flex-col relative overflow-hidden bg-grid-white">
      {/* Intense Supabase green glowing orb in the center */}
      <div className="absolute top-1/4 left-1/2 -z-10 -translate-x-1/2 w-[800px] h-[400px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[#3ECF8E] blur-[150px] rounded-[100%]" />
      </div>
      
      {/* Secondary glow */}
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-blue-500 blur-[150px] rounded-full" />
      </div>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-32 text-center max-w-6xl mx-auto w-full z-10">
        
    

        {/* Hero Headline */}
        <h1 
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Your next <br className="hidden md:block" />
          <span className="text-[#3ECF8E] text-glow-green">
            engineering role
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-[#8B8B8B] mb-12 max-w-3xl mx-auto leading-relaxed">
          The ultimate developer-first job community. Connect with top-tier organizations, fast-track interviews, and build the future. 
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center justify-center">
          <Link 
            href="/discover"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-[#3ECF8E] text-black font-bold text-lg hover:bg-[#24B47E] transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(62,207,142,0.3)] hover:shadow-[0_0_30px_rgba(62,207,142,0.5)]"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:scale-x-100 scale-x-0 origin-left transition-transform duration-500 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              Start Exploring <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link 
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-transparent text-white font-bold text-lg border border-[#3ECF8E]/30 hover:border-[#3ECF8E] hover:bg-[#3ECF8E]/10 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>

        {/* Browser Mockup / Showcase */}
        <div className="mt-24 w-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#3ECF8E] to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="relative rounded-xl bg-[#0B0C10] border border-[#2E2E2E] shadow-2xl overflow-hidden aspect-video max-w-5xl mx-auto flex flex-col">
            <div className="flex items-center px-4 py-3 border-b border-[#2E2E2E] bg-[#111111]">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-[#3ECF8E]/80" />
              </div>
              <div className="mx-auto flex items-center justify-center px-3 py-1 bg-[#1C1C1C] border border-[#2E2E2E] rounded text-xs text-[#8B8B8B] font-mono">
                dashboard.nightshift.dev
              </div>
            </div>
            <div className="p-8 flex-1 bg-[#0B0C10] bg-grid-white flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] to-transparent" />
                <div className="text-center relative z-10">
                    <Terminal className="w-16 h-16 text-[#3ECF8E] mx-auto mb-4 opacity-70 drop-shadow-[0_0_15px_rgba(62,207,142,0.5)]" />
                    <p className="text-[#8B8B8B] font-mono">system ready_</p>
                </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left">
          <div className="p-8 rounded-xl bg-[#111111] border border-[#1F1F1F] hover:border-[#3ECF8E]/50 transition-all duration-300 group shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-[#1C1C1C] border border-[#2E2E2E] flex items-center justify-center mb-6 group-hover:bg-[#3ECF8E]/10 group-hover:border-[#3ECF8E]/30 transition-colors">
              <Search className="h-6 w-6 text-[#3ECF8E]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Algorithmic Matching</h3>
            <p className="text-[#8B8B8B] text-sm leading-relaxed">
              We parse your stack and experience to surface roles where you are guaranteed to shine.
            </p>
          </div>
          <div className="p-8 rounded-xl bg-[#111111] border border-[#1F1F1F] hover:border-[#3ECF8E]/50 transition-all duration-300 group shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-[#1C1C1C] border border-[#2E2E2E] flex items-center justify-center mb-6 group-hover:bg-[#3ECF8E]/10 group-hover:border-[#3ECF8E]/30 transition-colors">
              <Building2 className="h-6 w-6 text-[#3ECF8E]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Verified Orgs</h3>
            <p className="text-[#8B8B8B] text-sm leading-relaxed">
              Skip the recruiters. Talk directly to engineering managers at verified, high-growth startups.
            </p>
          </div>
          <div className="p-8 rounded-xl bg-[#111111] border border-[#1F1F1F] hover:border-[#3ECF8E]/50 transition-all duration-300 group shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-[#1C1C1C] border border-[#2E2E2E] flex items-center justify-center mb-6 group-hover:bg-[#3ECF8E]/10 group-hover:border-[#3ECF8E]/30 transition-colors">
              <Shield className="h-6 w-6 text-[#3ECF8E]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Privacy First</h3>
            <p className="text-[#8B8B8B] text-sm leading-relaxed">
              Control exactly who sees your profile. Reveal your identity only when you accept an interview request.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
