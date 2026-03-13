"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { WardrobeItem, User } from "@/types";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, Coins, Tag, Ruler, CheckCircle, Loader2 } from "lucide-react";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<WardrobeItem | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    Promise.all([
      api.items.get(id) as Promise<WardrobeItem>,
      supabase.auth.getSession(),
    ]).then(async ([itemData, { data: { session } }]) => {
      setItem(itemData);
      if (session?.user) {
        try {
          const u = await api.users.getMe(session.user.id) as User;
          setCurrentUser(u);
        } catch {}
      }
      setLoading(false);
    });
  }, [id]);

  const handleRequestSwap = async () => {
    if (!currentUser) { router.push("/login"); return; }
    setRequesting(true);
    try {
      const swap = await api.swaps.create(id, currentUser.id) as { id: string };
      router.push(`/swap/${swap.id}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-leaf" size={32} />
    </div>
  );

  if (!item) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-5xl mb-3">😕</div>
        <p className="text-gray-500">Item not found</p>
      </div>
    </div>
  );

  const isOwner = currentUser?.id === item.user_id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="aspect-square bg-gray-100 relative">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200">
                  <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {!item.is_available && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-full text-sm">Swapped</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                {item.description && (
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.description}</p>
                )}

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { icon: <Tag size={14} />, label: "Category", value: item.category },
                    { icon: <Ruler size={14} />, label: "Size", value: item.size },
                    { icon: <CheckCircle size={14} />, label: "Condition", value: item.condition },
                  ].map((detail) => (
                    <div key={detail.label} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                        {detail.icon} {detail.label}
                      </div>
                      <div className="font-semibold text-gray-800 text-sm">{detail.value}</div>
                    </div>
                  ))}
                  <div className="bg-amber-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-amber-600 text-xs mb-1">
                      <Coins size={14} /> Swap Cost
                    </div>
                    <div className="font-semibold text-amber-700 text-sm">20 Coins</div>
                  </div>
                </div>

                {/* Owner */}
                <Link href={`/profile/${item.owner?.username}`} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-leaf hover:bg-green-50 transition-colors mb-6">
                  <div className="w-9 h-9 rounded-full bg-leaf text-white flex items-center justify-center text-sm font-bold overflow-hidden flex-shrink-0">
                    {item.owner?.avatar_url ? (
                      <img src={item.owner.avatar_url} alt={item.owner.username} className="w-full h-full object-cover" />
                    ) : (
                      item.owner?.username?.[0]?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">@{item.owner?.username}</div>
                    <div className="text-xs text-gray-400">View Profile →</div>
                  </div>
                </Link>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/profile/${item.owner?.username}`}
                  className="w-full block text-center border-2 border-leaf text-leaf py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors"
                >
                  View Profile
                </Link>
                {!isOwner && item.is_available && (
                  <button
                    onClick={handleRequestSwap}
                    disabled={requesting}
                    className="w-full gradient-leaf text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {requesting ? <Loader2 className="animate-spin" size={16} /> : <Coins size={16} />}
                    Request Swap — 20 Coins
                  </button>
                )}
                {isOwner && (
                  <div className="text-center text-sm text-gray-400 py-2">This is your item</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
