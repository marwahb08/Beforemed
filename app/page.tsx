import Link from "next/link";
import { Activity, Brain, ClipboardList } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#00c27a] flex items-center justify-center">
            <Activity size={14} className="text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight text-lg">BeforeMed</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">
            Log in
          </Link>
          <Link href="/signup" className="text-sm bg-[#00c27a] hover:bg-[#00a868] text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-24">
        <div className="inline-flex items-center gap-2 bg-[#00c27a]/10 border border-[#00c27a]/20 text-[#00c27a] text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c27a] inline-block"></span>
          Built for high school students exploring medicine
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl mb-6">
          Know if medicine is{" "}
          <span className="text-[#00c27a]">right for you</span>
          {" "}before you commit.
        </h1>

        <p className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed">
          Step into the room. Assess real patient cases. Get honest feedback on your instincts, decisions, and fit for a medical career.
        </p>

        <Link
          href="/signup"
          className="bg-[#00c27a] hover:bg-[#00a868] text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-[#00c27a]/20"
        >
          Start Free — No credit card required
        </Link>

        <p className="text-white/30 text-sm mt-4">Takes 10 minutes. 100% free.</p>
      </main>

      {/* Features */}
      <section className="px-6 md:px-12 pb-24 max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-5">
          <FeatureCard
            icon={<Brain size={20} className="text-[#00c27a]" />}
            title="Real AI Patients"
            description="Talk to AI-simulated patients with authentic symptoms, vitals, and histories. Pick a suggested action — or type your own."
          />
          <FeatureCard
            icon={<ClipboardList size={20} className="text-[#00c27a]" />}
            title="3 Specialties"
            description="Try Emergency Medicine, Surgery, or General Practice. Each simulation is designed with real clinical cases."
          />
          <FeatureCard
            icon={<Activity size={20} className="text-[#00c27a]" />}
            title="Honest Feedback"
            description="Get a scored breakdown of what you did well and where you struggled — no sugarcoating."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-6 text-center text-white/25 text-sm">
        © {new Date().getFullYear()} BeforeMed. Built for students who take their future seriously.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-[#00c27a]/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/45 leading-relaxed">{description}</p>
    </div>
  );
}
