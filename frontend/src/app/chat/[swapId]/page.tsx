'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
  sender: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

interface Swap {
  id: string;
  status: string;
  requester_id: string;
  owner_id: string;
  meeting_time: string | null;
  meeting_location: string | null;
  requester_otp: string | null;
  owner_otp: string | null;
  requester_verified: boolean;
  owner_verified: boolean;
  item: {
    title: string;
    image_url: string;
  };
  requester: {
    username: string;
  };
  owner: {
    username: string;
  };
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const swapId = params.swapId as string;
  const supabase = createClient();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [swap, setSwap] = useState<Swap | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [myOtp, setMyOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');

  useEffect(() => {
    const init = async () => {
      await fetchCurrentUser();
      await fetchSwapDetails();
      await fetchMessages();
    };
    init();
    
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [swapId]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/${user.id}`);
      const userData = await response.json();
      setCurrentUserId(userData.id);
    }
  };

  const fetchSwapDetails = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/swaps/${swapId}`);
      const data = await response.json();
      setSwap(data);
    } catch (error) {
      console.error('Error fetching swap:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!currentUserId) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/${swapId}/messages?user_id=${currentUserId}`
      );
      
      if (response.status === 403) {
        alert('You do not have access to this swap. Redirecting to marketplace...');
        router.push('/marketplace');
        return;
      }
      
      if (!response.ok) {
        console.error('Failed to fetch messages:', response.status);
        return;
      }
      
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const sendQuickMessage = async (message: string) => {
    if (!currentUserId) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${swapId}/messages?user_id=${currentUserId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: message,
          message_type: 'TEXT'
        })
      });
      
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const acceptSwap = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${swapId}/accept?user_id=${currentUserId}`, {
        method: 'POST'
      });
      fetchSwapDetails();
      fetchMessages();
    } catch (error) {
      console.error('Error accepting swap:', error);
    }
  };

  const proposeMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/${swapId}/propose-meeting?user_id=${currentUserId}&meeting_time=${encodeURIComponent(meetingTime)}&meeting_location=${encodeURIComponent(meetingLocation)}`,
        { method: 'POST' }
      );
      setShowMeetingForm(false);
      setMeetingTime('');
      setMeetingLocation('');
      fetchSwapDetails();
      fetchMessages();
    } catch (error) {
      console.error('Error proposing meeting:', error);
    }
  };

  const confirmMeeting = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/${swapId}/confirm-meeting?user_id=${currentUserId}`, {
        method: 'POST'
      });
      fetchSwapDetails();
      fetchMessages();
    } catch (error) {
      console.error('Error confirming meeting:', error);
    }
  };

  const generateOtp = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/${swapId}/generate-otp?user_id=${currentUserId}`,
        { method: 'POST' }
      );
      const data = await response.json();
      setMyOtp(data.otp);
      fetchSwapDetails();
      fetchMessages();
    } catch (error) {
      console.error('Error generating OTP:', error);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/${swapId}/verify-otp?user_id=${currentUserId}&other_user_otp=${otpInput}`,
        { method: 'POST' }
      );
      const data = await response.json();
      alert(data.message);
      setOtpInput('');
      fetchSwapDetails();
      fetchMessages();
    } catch (error: any) {
      alert(error.message || 'Invalid OTP');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!swap) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <p>Swap not found</p>
        </div>
      </div>
    );
  }

  const isOwner = currentUserId === swap.owner_id;
  const otherUser = isOwner ? swap.requester : swap.owner;

  // Quick message templates
  const quickMessages = [
    "Hi! I'm interested in swapping 👋",
    "Sounds good to me! ✅",
    "When would be a good time to meet?",
    "I'm available this weekend",
    "Let's meet at the campus cafe",
    "See you there! 👍"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-2xl mx-auto p-4 pt-20">
        {/* Swap Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-center gap-4">
            <img 
              src={swap.item.image_url || '/placeholder.png'} 
              alt={swap.item.title}
              className="w-16 h-16 object-cover rounded-xl"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{swap.item.title}</h2>
              <p className="text-sm text-gray-500">
                with @{otherUser.username}
              </p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                swap.status === 'completed' ? 'bg-green-100 text-green-700' :
                swap.status === 'pending_confirmation' ? 'bg-purple-100 text-purple-700' :
                swap.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                swap.status === 'agreed' ? 'bg-emerald-100 text-emerald-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {swap.status === 'negotiating' ? 'Pending' :
                 swap.status === 'agreed' ? 'Agreed' :
                 swap.status === 'scheduled' ? 'Scheduled' :
                 swap.status === 'pending_confirmation' ? 'Ready to Swap' :
                 'Completed'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        {swap.status === 'negotiating' && isOwner && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 mb-4">
            <p className="text-sm text-gray-700 mb-3">
              @{swap.requester.username} wants to swap with you!
            </p>
            <button
              onClick={acceptSwap}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              ✓ Accept Swap Request
            </button>
          </div>
        )}

        {swap.status === 'agreed' && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 mb-4">
            <p className="text-sm text-gray-700 mb-3">
              Great! Now let's arrange a meeting
            </p>
            {!showMeetingForm ? (
              <button
                onClick={() => setShowMeetingForm(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                📅 Propose Meeting Time & Place
              </button>
            ) : (
              <form onSubmit={proposeMeeting} className="space-y-3">
                <input
                  type="text"
                  placeholder="When? (e.g., Tomorrow 3 PM)"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Where? (e.g., Campus Cafe)"
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
                  >
                    Send Proposal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMeetingForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {swap.status === 'scheduled' && swap.meeting_time && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6 mb-4">
            <p className="text-sm text-gray-700 mb-3">Meeting Details:</p>
            <div className="bg-white rounded-xl p-4 mb-4">
              <p className="font-semibold text-gray-800">📅 {swap.meeting_time}</p>
              <p className="font-semibold text-gray-800">📍 {swap.meeting_location}</p>
            </div>
            <button
              onClick={confirmMeeting}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700"
            >
              ✓ Confirm Meeting
            </button>
          </div>
        )}

        {swap.status === 'pending_confirmation' && (
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border border-green-200 p-6 mb-4">
            <div className="text-center mb-4">
              <p className="text-sm font-semibold text-gray-800 mb-2">
                🎉 Meeting Confirmed!
              </p>
              <div className="bg-white rounded-xl p-3 text-sm text-gray-600">
                <p>📅 {swap.meeting_time}</p>
                <p>📍 {swap.meeting_location}</p>
              </div>
            </div>
            
            {!myOtp ? (
              <button
                onClick={generateOtp}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 mb-3"
              >
                🔐 Generate My OTP
              </button>
            ) : (
              <div className="bg-white border-2 border-green-500 rounded-xl p-6 text-center mb-3">
                <p className="text-xs text-gray-500 mb-2">Your OTP Code:</p>
                <p className="text-4xl font-bold text-green-600 tracking-widest mb-2">{myOtp}</p>
                <p className="text-xs text-gray-500">
                  Show this to @{otherUser.username} when you meet
                </p>
              </div>
            )}

            <form onSubmit={verifyOtp} className="space-y-3">
              <input
                type="text"
                placeholder="Enter their OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-center text-3xl tracking-widest font-bold focus:ring-2 focus:ring-green-500 focus:border-transparent"
                maxLength={6}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
              >
                ✓ Verify & Complete Swap
              </button>
            </form>
          </div>
        )}

        {swap.status === 'completed' && (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-300 p-6 mb-4 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-lg font-bold text-gray-800 mb-2">Swap Completed!</p>
            <p className="text-sm text-gray-600">
              You successfully swapped with @{otherUser.username}
            </p>
          </div>
        )}

        {/* Messages Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Activity</h3>
          </div>
          
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">
                No messages yet. Use quick replies below to start!
              </p>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                const isSystem = msg.message_type !== 'TEXT';
                
                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center py-2">
                      <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-xs font-medium">
                        {msg.content}
                      </span>
                    </div>
                  );
                }
                
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${isMe ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-2`}>
                      {!isMe && (
                        <p className="text-xs font-semibold mb-1 opacity-70">@{msg.sender.username}</p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Reply Buttons */}
          {swap.status !== 'completed' && swap.status !== 'pending_confirmation' && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 mb-2">Quick Replies:</p>
              <div className="flex flex-wrap gap-2">
                {quickMessages.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendQuickMessage(msg)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-full text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
