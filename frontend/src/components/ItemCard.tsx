import Link from "next/link";
import { WardrobeItem } from "@/types";
import { Tag, Ruler, Star } from "lucide-react";

const CONDITION_COLOR: Record<string, string> = {
  "New with tags": "bg-green-100 text-green-800",
  "Like new": "bg-blue-100 text-blue-800",
  "Good": "bg-amber-100 text-amber-800",
  "Fair": "bg-orange-100 text-orange-800",
  "Worn": "bg-red-100 text-red-800",
};

export default function ItemCard({ item }: { item: WardrobeItem }) {
  return (
    <Link href={`/item/${item.id}`} className="group block">
      <div className="card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        {/* Image */}
        <div className="aspect-square bg-gray-50 overflow-hidden relative">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CONDITION_COLOR[item.condition] || "bg-gray-100 text-gray-600"}`}>
              {item.condition}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">{item.title}</h3>
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1"><Tag size={11} />{item.category}</span>
            <span className="flex items-center gap-1"><Ruler size={11} />{item.size}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">@{item.owner?.username}</span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">20 coins</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
