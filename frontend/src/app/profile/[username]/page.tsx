"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { UserPublic, WardrobeItem } from "@/types";
import { Coins, Package, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<UserPublic | null>(null);
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.users.getByUsername(username) as Promise<UserPublic>,
      api.users.getWardrobe(username) as Promise<WardrobeItem[]>,
    ]).then(([userData, wardrobeData]) => {
      setUser(userData);
      setItems(wardrobeData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-leaf" size={32} />
    </div>
  );

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div>
        <div className="text-5xl mb-3">👤</div>
        <p className="text-gray-500">User not found</p>
      </div>
    </div>
  );

  const available = items.filter(i => i.is_available).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-leaf flex items-center justify-center text-white text-3xl font-bold flex-shrink-0 shadow-md">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                user.username?.[0]?.toUpperCase()
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">@{user.username}</h1>
              {user.bio && <p className="text-gray-500 text-sm mb-4 max-w-md">{user.bio}</p>}

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-6">
                <div className="text-center">
                  <div className="font-display font-bold text-xl text-gray-900">{items.length}</div>
                  <div className="text-xs text-gray-400">Items</div>
                </div>
                <div className="text-center">
                  <div className="font-display font-bold text-xl text-gray-900">{available}</div>
                  <div className="text-xs text-gray-400">Available</div>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full">
                  <Coins size={16} className="text-amber-500" />
                  <span className="font-semibold text-amber-700">{user.coins} Coins</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wardrobe Grid */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-gray-400" />
            <h2 className="font-semibold text-gray-700">Digital Wardrobe</h2>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
              <div className="text-5xl mb-3">👗</div>
              <p className="text-gray-400 text-sm">No items in wardrobe yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {items.map(item => (
                <Link key={item.id} href={`/item/${item.id}`} className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">👕</div>
                  )}
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold bg-black/60 px-2 py-1 rounded-full">Swapped</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-2 opacity-0 group-hover:opacity-100">
                    <span className="text-white text-xs font-medium truncate drop-shadow">{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
