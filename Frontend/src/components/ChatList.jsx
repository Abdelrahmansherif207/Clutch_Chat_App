import NoChats from "./NoChats";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./skeletons/UsersLoadingSkeleton";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function ChatList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();

  //TODO SOCKET CONNECTION 
  const { onlineUsers } = useAuthStore();


  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChats />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3 relative">
            {/* Avatar */}
            <div className="relative">
              <div className="size-12 rounded-full overflow-hidden">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.username} />
              </div>

              {/* Online/Offline circle */}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${onlineUsers.includes(chat._id) ? "bg-green-400" : "bg-gray-500"
                  }`}
              ></span>
            </div>

            {/* Username */}
            <h4 className="text-slate-200 font-medium truncate">{chat.username}</h4>
          </div>
        </div>
      ))}

    </>
  );
}

