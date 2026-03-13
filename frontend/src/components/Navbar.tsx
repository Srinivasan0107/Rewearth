"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { User } from "@/types";
import { api } from "@/lib/api";
import { Coins, Leaf, LogOut, Plus, ShoppingBag, User as UserIcon, MessageCircle } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const u = await api.users.getMe(session.user.id) as User;
          setUser(u);
        } catch {}
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const u = await api.users.getMe(session.user.id) as User;
          setUser(u);
        } catch {}
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  if (pathname === "/login") return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-leaf">
            <span className="w-8 h-8 rounded-full gradient-leaf flex items-center justify-center text-white text-sm font-bold">R</span>
            ReWearth
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/marketplace" current={pathname}>
              <ShoppingBag size={16} /> Marketplace
            </NavLink>
            <NavLink href="/messages" current={pathname}>
              <MessageCircle size={16} /> Messages
            </NavLink>
            <NavLink href="/green-alternatives" current={pathname}>
              <Leaf size={16} /> Green Alternatives
            </NavLink>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {!loading && user ? (
              <>
                <Link
                  href="/wardrobe/add-item"
                  className="hidden sm:flex items-center gap-1.5 bg-leaf text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-800 transition-colors"
                >
                  <Plus size={14} /> Add Item
                </Link>

                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  <Coins size={14} />
                  <span>{user.coins}</span>
                </div>

                <Link
                  href={`/profile/${user.username}`}
                  className="w-8 h-8 rounded-full bg-leaf text-white flex items-center justify-center text-sm font-bold overflow-hidden"
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    user.username?.[0]?.toUpperCase()
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : !loading ? (
              <Link
                href="/login"
                className="bg-leaf text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-800 transition-colors"
              >
                Sign In
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, current, children }: { href: string; current: string; children: React.ReactNode }) {
  const active = current === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1.5 rounded-full ${
        active ? "bg-green-50 text-leaf" : "text-gray-600 hover:text-leaf"
      }`}
    >
      {children}
    </Link>
  );
}
