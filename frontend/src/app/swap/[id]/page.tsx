"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Swap, User, MessageType } from "@/types";
import { createClient } from "@/lib/supabase";
import { Loader2, Coins, Calendar, MapPin, ShieldCheck, ArrowLeft } from "lucide-react";

const CHAT_BUTTONS: { type: MessageType; label: string; color: string; group: string }[] = [
  { type: "ASK_CONDITION", label: "Ask Condition", color: "bg-blue-50 text-blue-700 border-blue-200", group: "inquire" },
  { type: "ASK_SIZE", label: "Ask Size", color: "bg-blue-50 text-blue-700 border-blue-200", group: "inquire" },
  { type: "ASK_MORE_PHOTOS", label: "Ask More Photos", color: "bg-blue-50 text-blue-700 border-blue-200", group: "inquire" },
  { type: "OFFER_SWAP", label: "Offer Swap", color: "bg-amber-50 text-amber-700 border-amber-200", group: "swap" },
  { type: "ACCEPT_SWAP", label: "Accept Swap ✓", color: "bg-green-50 text-green-700 border-green-200", group: "swap" },
  { type: "REJECT_SWAP", label: "Reject Swap ✗", color: "bg-red-50 text-red-700 border-red-200", group: "swap" },
  { type: "PROPOSE_TIME", label: "Propose Time", color: "bg-purple-50 text-purple-700 border-purple-200", group: "schedule" },
  { type: "PROPOSE_LOCATION", label: "Propose Location", color: "bg-purple-50 text-purple-700 border-purple-200", group: "schedule" },
  { type: "CONFIRM_MEETING", label: "Confirm Meeting", color: "bg-teal-50 text-teal-700 border-teal-200", group: "schedule" },
  { type: "READY_TO_SWAP", label: "Ready to Swap 🤝", color: "bg-leaf/10 text-leaf border-leaf/30", group: "complete" },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  negotiating: { label: "Negotiating", color: "bg-blue-100 text-blue-700" },
  agreed: { label: "Agreed", color: "bg-amber-100 text-amber-700" },
  scheduled: { label: "Scheduled", color: "bg-purple-100 text-purple-700" },
  pending_confirmation: { label: "Awaiting OTP", color: "bg-orange-100 text-orange-700" },
  completed: { label: "Completed ✓", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
};

export default function SwapPage() {
  const { id } = useParams<{ id: string }>();
  const [swap, setSwap] = useState<Swap | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otp, setOtp] = useState("");
  const [payload, setPayload] = useState("");
  const [pendingType, setPendingType] = useState<MessageType | null>(null);
  const [verifying, setVerifying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.push("/login"); return; }
      const [swapData, userData] = await Promise.all([
        api.swaps.get(id) as Promise<Swap>,
        api.users.getMe(session.user.id) as Promise<User>,
      ]);
      setSwap(swapData);
      setCurrentUser(userData);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [swap?.messages]);

  const sendMessage = async (type: MessageType, payloadVal?: string) => {
    if (!currentUser || !swap) return;
    setSending(true);
    try {
      const updated = await api.swaps.sendMessage(swap.id, currentUser.id, type, payloadVal) as Swap;
      setSwap(updated);
      setPayload("");
      setPendingType(null);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSending(false);
    }
  };

  const handleButtonClick = (type: MessageType) => {
    if (type === "PROPOSE_TIME" || type === "PROPOSE_LOCATION") {
      setPendingType(type);
    } else {
      sendMessage(type);
    }
  };

  const verifyOtp = async () => {
    if (!currentUser || !swap) return;
    setVerifying(true);
    try {
      const updated = await api.swaps.verifyOtp(swap.id, currentUser.id, otp) as Swap;
      setSwap(updated);
      setOtp("");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-leaf" size={32} /></div>;
  if (!swap) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-400">Swap not found</p></div>;

  const isParticipant = currentUser && (currentUser.id === swap.requester_id || currentUser.id === swap.owner_id);
  const statusInfo = STATUS_LABELS[swap.status] || { label: swap.status, color: "bg-gray-100 text-gray-700" };
  const canChat = ["negotiating", "agreed", "scheduled"].includes(swap.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {swap.item.image_url && (
                <img src={swap.item.image_url} alt={swap.item.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              )}
              <div>
                <h2 className="font-semibold text-gray-900 text-sm">{swap.item.title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  @{swap.requester.username} → @{swap.owner.username}
                </p>
              </div>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Meeting details if scheduled */}
          {(swap.proposed_time || swap.proposed_location) && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
              {swap.proposed_time && (
                <div className="flex items-center gap-2 text-xs text-gray-600 bg-purple-50 px-3 py-2 rounded-lg">
                  <Calendar size={13} className="text-purple-500" /> {swap.proposed_time}
                </div>
              )}
              {swap.proposed_location && (
                <div className="flex items-center gap-2 text-xs text-gray-600 bg-purple-50 px-3 py-2 rounded-lg">
                  <MapPin size={13} className="text-purple-500" /> {swap.proposed_location}
                </div>
              )}
            </div>
          )}

          {/* Show OTP to requester if pending */}
          {swap.status === "pending_confirmation" && swap.otp_code && currentUser?.id === swap.requester_id && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Share this OTP with the other person:</p>
              <div className="font-mono text-3xl font-bold text-leaf tracking-widest">{swap.otp_code}</div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-sm text-gray-700">Conversation</h3>
          </div>
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {swap.messages.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No messages yet. Start the conversation!</p>
            ) : (
              swap.messages.map(msg => {
                const isMe = msg.sender_id === currentUser?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs rounded-2xl px-4 py-2.5 ${
                      msg.message_type === "NOT_ELIGIBLE_SWAP"
                        ? "bg-red-50 border border-red-200"
                        : isMe
                          ? "bg-leaf text-white"
                          : "bg-gray-100 text-gray-800"
                    }`}>
                      {!isMe && <p className="text-xs font-semibold mb-0.5 opacity-60">@{msg.sender.username}</p>}
                      <p className="text-sm">{msg.rendered_text}</p>
                      {msg.payload && <p className="text-xs mt-1 opacity-70 italic">{msg.payload}</p>}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat actions */}
        {canChat && isParticipant && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Actions</h3>

            {pendingType && (
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={payload}
                  onChange={e => setPayload(e.target.value)}
                  placeholder={pendingType === "PROPOSE_TIME" ? "e.g. Saturday 3pm" : "e.g. Central Park"}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-leaf"
                />
                <button
                  onClick={() => sendMessage(pendingType, payload)}
                  disabled={!payload || sending}
                  className="bg-leaf text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  Send
                </button>
                <button onClick={() => setPendingType(null)} className="text-gray-400 px-3 py-2 text-sm">✕</button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {CHAT_BUTTONS.map(btn => (
                <button
                  key={btn.type}
                  onClick={() => handleButtonClick(btn.type)}
                  disabled={sending}
                  className={`text-xs px-3 py-2 rounded-full border font-medium transition-opacity ${btn.color} disabled:opacity-50`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* OTP Verification for owner */}
        {swap.status === "pending_confirmation" && currentUser?.id === swap.owner_id && !swap.confirmed_owner && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-leaf" size={20} />
              <h3 className="font-semibold text-gray-800">Verify Swap</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Enter the 4-digit OTP from the other person to confirm the swap.</p>
            <div className="flex gap-3">
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="0000"
                className="w-32 px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl font-mono font-bold focus:outline-none focus:border-leaf tracking-widest"
              />
              <button
                onClick={verifyOtp}
                disabled={otp.length !== 4 || verifying}
                className="flex-1 gradient-leaf text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {verifying ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                Verify Swap
              </button>
            </div>
          </div>
        )}

        {/* Completed */}
        {swap.status === "completed" && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="font-display font-bold text-green-800 text-xl mb-1">Swap Completed!</h3>
            <p className="text-green-600 text-sm">Congrats on your sustainable fashion swap.</p>
          </div>
        )}
      </div>
    </div>
  );
}
