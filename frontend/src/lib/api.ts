const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "API error");
  }
  return res.json();
}

// ─── Users ───────────────────────────────────────────────────────
export const api = {
  users: {
    createOrGet: (data: {
      supabase_auth_id: string;
      email: string;
      username: string;
      avatar_url?: string;
      bio?: string;
    }) => request("/users/", { method: "POST", body: JSON.stringify(data) }),

    getMe: (authId: string) => request(`/users/me/${authId}`),

    getByUsername: (username: string) => request(`/users/${username}`),

    updateUser: (userId: string, data: Partial<{ username: string; bio: string; avatar_url: string }>) =>
      request(`/users/${userId}`, { method: "PATCH", body: JSON.stringify(data) }),

    getWardrobe: (username: string) => request(`/users/${username}/wardrobe`),
  },

  // ─── Items ──────────────────────────────────────────────────────
  items: {
    list: (params?: { category?: string; size?: string; skip?: number; limit?: number }) => {
      const q = new URLSearchParams();
      if (params?.category) q.set("category", params.category);
      if (params?.size) q.set("size", params.size);
      if (params?.skip) q.set("skip", String(params.skip));
      if (params?.limit) q.set("limit", String(params.limit));
      return request(`/items/?${q.toString()}`);
    },

    get: (itemId: string) => request(`/items/${itemId}`),

    create: (data: {
      title: string;
      description?: string;
      category: string;
      size: string;
      condition: string;
      image_url?: string;
    }, userId: string) =>
      request(`/items/?user_id=${userId}`, { method: "POST", body: JSON.stringify(data) }),

    uploadImage: async (file: File): Promise<{ image_url: string }> => {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${BASE}/items/upload-image`, { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },

    update: (itemId: string, data: object) =>
      request(`/items/${itemId}`, { method: "PATCH", body: JSON.stringify(data) }),

    delete: (itemId: string) =>
      request(`/items/${itemId}`, { method: "DELETE" }),
  },

  // ─── Swaps ──────────────────────────────────────────────────────
  swaps: {
    create: (itemId: string, requesterId: string) =>
      request(`/swaps/?requester_id=${requesterId}`, {
        method: "POST",
        body: JSON.stringify({ item_id: itemId }),
      }),

    get: (swapId: string) => request(`/swaps/${swapId}`),

    getUserSwaps: (userId: string) => request(`/swaps/user/${userId}`),

    sendMessage: (swapId: string, senderId: string, messageType: string, payload?: string) =>
      request(`/swaps/${swapId}/message?sender_id=${senderId}`, {
        method: "POST",
        body: JSON.stringify({ message_type: messageType, payload }),
      }),

    verifyOtp: (swapId: string, verifierId: string, otpCode: string) =>
      request(`/swaps/${swapId}/verify-otp?verifier_id=${verifierId}`, {
        method: "POST",
        body: JSON.stringify({ otp_code: otpCode }),
      }),
  },
};
