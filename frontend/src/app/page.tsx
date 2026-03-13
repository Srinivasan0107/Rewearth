import Link from "next/link";
import { ArrowRight, Recycle, Coins, Leaf, ShoppingBag, Users, CheckCircle } from "lucide-react";

const STEPS = [
  { icon: "👗", title: "Upload Your Clothes", desc: "Add items from your wardrobe to your digital profile with photos and details." },
  { icon: "🔍", title: "Browse Marketplace", desc: "Discover clothes from other users sorted by size, category, and condition." },
  { icon: "💬", title: "Negotiate & Agree", desc: "Use structured chat to ask questions and agree on a swap." },
  { icon: "🤝", title: "Meet & Swap", desc: "Schedule a meetup, confirm with OTP, and complete your swap!" },
];

const STATS = [
  { value: "2.5B", label: "lbs of textile waste yearly" },
  { value: "120", label: "free coins to start" },
  { value: "20", label: "coins per swap" },
  { value: "100%", label: "sustainable" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-300 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Leaf size={14} className="text-green-300" />
              Sustainable Fashion Platform
            </div>
            <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6">
              Swap Fashion.<br />
              Save Money.<br />
              <span className="text-green-300">Reduce Waste.</span>
            </h1>
            <p className="text-green-100 text-lg lg:text-xl max-w-xl mb-10 leading-relaxed">
              Join thousands of conscious shoppers trading their unwanted clothes through a fair coin-based system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center gap-2 bg-white text-leaf px-8 py-4 rounded-full font-semibold text-base hover:bg-green-50 transition-colors"
              >
                <ShoppingBag size={18} />
                Explore Marketplace
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/wardrobe/add-item"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/20 transition-colors backdrop-blur"
              >
                Build Your Digital Wardrobe
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative border-t border-white/10 bg-black/10 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-display text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-green-300 text-sm mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">How ReWearth Works</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">A simple, fair, and fun way to refresh your wardrobe sustainably.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-green-100 z-0" style={{ width: "calc(100% - 4rem)", left: "calc(50% + 2rem)" }} />
                )}
                <div className="relative z-10 text-center p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:border-green-200 hover:bg-green-50 transition-colors">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="w-7 h-7 rounded-full bg-leaf text-white text-xs font-bold flex items-center justify-center mx-auto mb-3">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coin system */}
      <section className="py-24 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-gray-900 mb-6">The Coin System</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                ReWearth uses a fair coin-based economy. Every new user starts with <strong>120 coins</strong>. Each swap costs just <strong>20 coins</strong> per person — ensuring everyone plays fairly.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Coins className="text-amber-500" size={20} />, text: "Start with 120 free coins upon signup" },
                  { icon: <CheckCircle className="text-green-500" size={20} />, text: "20 coins deducted from each party per swap" },
                  { icon: <Users className="text-blue-500" size={20} />, text: "Both users must agree before coins are deducted" },
                  { icon: <Recycle className="text-leaf" size={20} />, text: "OTP confirmation ensures fair physical exchanges" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
                    {item.icon}
                    <span className="text-gray-700 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-100">
              <div className="text-center mb-8">
                <div className="text-6xl font-display font-bold text-amber-500">120</div>
                <div className="text-gray-500 mt-1">Starting Coins</div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Request a Swap", cost: "-20 coins", color: "text-red-500" },
                  { label: "Owner Accepts", cost: "-20 coins", color: "text-red-500" },
                  { label: "Meet & Confirm OTP", cost: "Free", color: "text-green-500" },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700 text-sm">{r.label}</span>
                    <span className={`font-semibold text-sm ${r.color}`}>{r.cost}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/login"
                className="mt-6 w-full block text-center gradient-leaf text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started Free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="font-display text-2xl font-bold text-white mb-2">ReWearth</div>
          <p className="text-green-300 text-sm">Swap Fashion. Save Money. Reduce Waste.</p>
          <p className="text-green-600 text-xs mt-6">© 2024 ReWearth. Building a sustainable fashion future.</p>
        </div>
      </footer>
    </div>
  );
}
