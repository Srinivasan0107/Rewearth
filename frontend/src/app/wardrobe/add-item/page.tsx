"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase";
import { Upload, Loader2, CheckCircle } from "lucide-react";

const CATEGORIES = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories", "Other"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const CONDITIONS = ["New with tags", "Like new", "Good", "Fair", "Worn"];

export default function AddItemPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({ title: "", description: "", category: "", size: "", condition: "", image_url: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.category || !form.size || !form.condition) {
      setError("Please fill in all required fields.");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) { router.push("/login"); return; }

    setSubmitting(true);
    try {
      const user = await api.users.getMe(session.user.id) as { id: string };
      let imageUrl = form.image_url;

      if (imageFile) {
        setUploading(true);
        const { image_url } = await api.items.uploadImage(imageFile);
        imageUrl = image_url;
        setUploading(false);
      }

      await api.items.create({ ...form, image_url: imageUrl }, user.id);
      router.push(`/profile/${(user as any).username}`);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Add to Wardrobe</h1>
        <p className="text-gray-500 text-sm mb-8">List an item and earn coins when someone swaps with you!</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Photo</label>
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className={`border-2 border-dashed rounded-2xl flex items-center justify-center overflow-hidden transition-colors ${
                imagePreview ? "border-leaf" : "border-gray-200 hover:border-leaf"
              }`} style={{ height: 240 }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400">
                    <Upload size={32} className="mx-auto mb-2" />
                    <p className="text-sm">Click to upload photo</p>
                    <p className="text-xs mt-1">JPG, PNG, WEBP up to 10MB</p>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Vintage Levi's 501 Jeans"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-leaf"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Describe your item — color, material, brand, any flaws..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-leaf resize-none"
            />
          </div>

          {/* Category + Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-leaf bg-white"
              >
                <option value="">Select...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Size *</label>
              <select
                value={form.size}
                onChange={e => setForm(f => ({ ...f, size: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-leaf bg-white"
              >
                <option value="">Select...</option>
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Condition *</label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setForm(f => ({ ...f, condition: c }))}
                  className={`text-sm px-4 py-2 rounded-full border-2 font-medium transition-colors ${
                    form.condition === c ? "border-leaf bg-green-50 text-leaf" : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full gradient-leaf text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <><Loader2 className="animate-spin" size={18} /> {uploading ? "Uploading photo..." : "Adding item..."}</>
            ) : (
              <><CheckCircle size={18} /> Add to Wardrobe</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
