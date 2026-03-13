'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

interface SwapNotification {
  id: string;
  status: string;
  created_at: string;
  item: {
    title: string;
    image_url: string;
  };
  requester: {
    username: string;
    avatar_url: string | null;
  };
  owner: {
    username: string;
    avatar_url: string | null;
  };
  requester_id: string;
  owner_id: string;
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
}

export default function MessagesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [swaps, setSwaps] = useState<SwapNotification[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchSwaps();
      // Refresh every 5 seconds
      const interval = setInterval(fetchSwaps, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUserId]);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/${user.id}`);
        if (!response.ok) {
          console.error('Failed to fetch user');
          setBackendError(true);
          return;
        }
        const userData = await response.json();
        setCurrentUserId(userData.id);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setBackendError(true);
      setLoading(false);
    }
  };

  const fetchSwaps = async () => {
    if (!currentUserId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/swaps/user/${currentUserId}`
      );
      
      if (!response.ok) {
        console.error('Failed to fetch swaps');
        return;
      }
      
      const data = await response.json();
      
      // Fetch last message for each swap
      const swapsWithMessages = await Promise.all(
        data.map(async (swap: SwapNotification) => {
          try {
            const msgResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/chat/${swap.id}/messages?user_id=${currentUserId}`
            );
            if (msgResponse.ok) {
              const messages = await msgResponse.json();
              const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
              return { ...swap, last_message: lastMessage };
            }
          } catch (error) {
            console.error('Error fetching messages for swap:', swap.id);
          }
          return swap;
        })
      );
      
      // Sort by most recent activity
      swapsWithMessages.sort((a, b) => {
        const aTime = a.last_message?.created_at || a.created_at;
        const bTime = b.last_message?.created_at || b.created_at;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
      
      setSwaps(swapsWithMessages);
    } catch (error) {
      console.error('Error fetching swaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      negotiating: { text: 'New Request', color: 'bg-yellow-100 text-yellow-700' },
      agreed: { text: 'Agreed', color: 'bg-green-100 text-green-700' },
      scheduled: { text: 'Meeting Scheduled', color: 'bg-blue-100 text-blue-700' },
      pending_confirmation: { text: 'Ready to Swap', color: 'bg-purple-100 text-purple-700' },
      completed: { text: 'Completed', color: 'bg-gray-100 text-gray-600' },
      cancelled: { text: 'Cancelled', color: 'bg-red-100 text-red-700' }
    };
    
    return badges[status as keyof typeof badges] || badges.negotiating;
  };

  const getOtherUser = (swap: SwapNotification) => {
    return currentUserId === swap.owner_id ? swap.requester : swap.owner;
  };

  const isUnread = (swap: SwapNotification) => {
    // Consider unread if:
    // 1. Status is negotiating and user is owner (new request)
    // 2. Last message was from the other person
    if (swap.status === 'negotiating' && currentUserId === swap.owner_id) {
      return true;
    }
    if (swap.last_message && swap.last_message.sender_id !== currentUserId) {
      return true;
    }
    return false;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (backendError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Backend Not Available</h2>
            <p className="text-gray-500 mb-4">
              The backend server is not running. Please start it with:
            </p>
            <code className="bg-gray-100 px-4 py-2 rounded text-sm block mb-4">
              cd backend && python -m uvicorn main:app --reload
            </code>
            <p className="text-sm text-gray-400">
              If you're seeing DNS errors, try restarting your computer or changing DNS to 8.8.8.8
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto p-4 pt-20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500 mt-1">Your active swaps and conversations</p>
        </div>

        {swaps.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No messages yet</h2>
            <p className="text-gray-500 mb-6">
              Start swapping items to begin conversations!
            </p>
            <button
              onClick={() => router.push('/marketplace')}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {swaps.map((swap) => {
              const otherUser = getOtherUser(swap);
              const statusBadge = getStatusBadge(swap.status);
              const unread = isUnread(swap);
              
              return (
                <div
                  key={swap.id}
                  onClick={() => router.push(`/chat/${swap.id}`)}
                  className={`bg-white rounded-2xl shadow-sm border ${
                    unread ? 'border-green-300 bg-green-50' : 'border-gray-100'
                  } p-4 hover:shadow-md transition-all cursor-pointer`}
                >
                  <div className="flex items-start gap-4">
                    {/* Item Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={swap.item.image_url || '/placeholder.png'}
                        alt={swap.item.title}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      {unread && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          {/* Other User Avatar */}
                          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold overflow-hidden flex-shrink-0">
                            {otherUser.avatar_url ? (
                              <img
                                src={otherUser.avatar_url}
                                alt={otherUser.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              otherUser.username[0].toUpperCase()
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              @{otherUser.username}
                            </h3>
                          </div>
                        </div>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2 truncate">
                        {swap.item.title}
                      </p>

                      {swap.last_message ? (
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${unread ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                            {swap.last_message.sender_id === currentUserId ? 'You: ' : ''}
                            {swap.last_message.content}
                          </p>
                          <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                            {formatTime(swap.last_message.created_at)}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          {swap.status === 'negotiating' && currentUserId === swap.owner_id
                            ? 'New swap request - tap to respond'
                            : 'Start the conversation'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
