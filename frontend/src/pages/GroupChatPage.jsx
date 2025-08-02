import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import toast from "react-hot-toast";
import CallButton from "../components/CallButton";
import {
  Chat,
  Channel,
  ChannelHeader,
  Window,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";

import ChatLoader from "../components/Chatloader";
import GroupButton from "../components/GroupButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const GroupChatPage = () => {
  const { id: streamChannelId } = useParams(); // <--- use group channel ID from URL
  const { authUser } = useAuthUser();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initGroupChat = async () => {
      if (!tokenData?.token || !authUser || !streamChannelId) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        // Join or watch the existing group channel
        const groupChannel = client.channel("messaging", streamChannelId);
        await groupChannel.watch();

        setChatClient(client);
        setChannel(groupChannel);
        console.log(groupChannel)
      } catch (error) {
        console.error("Group chat init failed:", error);
        toast.error("Could not connect to group chat");
      } finally {
        setLoading(false);
      }
    };

    initGroupChat();
  }, [tokenData, authUser, streamChannelId]);
 // ✅ Group call handler
  const handleVideoCall = () => {
    if (channel) {
const callUrl = `${window.location.origin}/group-call/${channel.id}`;


channel.sendMessage({
  text: `📹 Group video call started: ${callUrl}`,
});

      toast.success("Group video call link shared!");

      
    }
  };
  if (loading || !chatClient || !channel) return <ChatLoader />;

  // const handleStartCall = () => {
  //   navigate(`/group-call/${id}`);
  // };


  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
          
                 <GroupButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default GroupChatPage;
