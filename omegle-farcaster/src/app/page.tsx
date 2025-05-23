"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ThumbsUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useWebRTC } from "@/hooks/useWebRTC";
import { io } from "socket.io-client";

const Home = () => {
  const [isChatting, setIsChatting] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);

  const {
    localStream,
    remoteStream,
    isConnected,
    startCall,
    endCall,
    sendMessage,
    messages,
  } = useWebRTC(sessionId);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const startChat = async () => {
    setIsChatting(true);
    socketRef.current = io(
      process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001"
    );

    socketRef.current.on("chat_started", ({ sessionId: newSessionId }) => {
      setSessionId(newSessionId);
      if (isVideoEnabled) {
        startCall();
      }
    });

    socketRef.current.emit("join", { userId: "temp-user-id" }); // Replace with actual user ID
  };

  const stopChat = () => {
    endCall();
    setIsChatting(false);
    setSessionId(null);
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-1 border-b">
        <div className="flex items-center">
          <div className="flex items-center">
            <Image
              src="/pngegg.png"
              alt="Omegle"
              width={100}
              height={100}
              className="w-20 h-15"
            />
            <span className="text-black ml-6 font-bold -rotate-4 text-xl">
              Talk to strangers!
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="bg-[#3B5998] text-white text-xs px-2 py-0.5 rounded">
              177k
            </div>
            <div className="bg-[#3B5998] flex text-white text-xs px-2 py-0.5 rounded ml-1">
              Like
              <ThumbsUp size={14} />
            </div>
          </div>
          <button className="bg-[#1DA1F2] text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
            </svg>
            Tweet
          </button>
          <div className="flex flex-col items-center gap-2">
            <select className="border rounded px-1 text-xs">
              <option>Select Language ▼</option>
            </select>
            <div className="w-full text-right pr-4 pt-1">
              <span className="text-[#40A0F0] text-sm">14,000+ </span>
              <span className="text-sm">online now</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-8 px-4">
        {
          !isChatting ?
            // Landing page content
            <div className="space-y-8">
              <div className="text-center mb-4">
                <p>
                  You don't need an app to use Omegle on your phone or tablet!
                  The web site works great on mobile.
                </p>
              </div>
              <div className="text-sm space-y-4 mb-8">
                <p>
                  Omegle (oh·meg·ull) is a great way to meet new friends. When
                  you use Omegle, we pick someone else at random and let you
                  talk one-on-one. To help you stay safe, chats are anonymous
                  unless you tell someone who you are (not suggested!), and you
                  can stop a chat at any time. Predators have been known to use
                  Omegle, so please be careful.
                </p>
                <p className="text-xs italic">
                  By using Omegle, you accept the terms at the bottom. You must
                  be 18+ or 13+ with parental permission.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsVideoEnabled(false);
                      startChat();
                    }}
                    className="bg-[#0088cc] text-white px-8 py-2 rounded"
                  >
                    Text
                  </Button>
                  <div className="text-xs mt-1">Spy (question) mode</div>
                </div>
                <span>or</span>
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsVideoEnabled(true);
                      startChat();
                    }}
                    className="bg-[#0088cc] text-white px-8 py-2 rounded"
                  >
                    Video
                  </Button>
                  <div className="text-xs mt-1">Unmoderated section</div>
                </div>
              </div>
            </div>
            // Chat interface
          : <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!isConnected && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
                      Waiting for someone to join...
                    </div>
                  )}
                </div>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Chat controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-gray-200 hover:bg-gray-300"
                >
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
                <Button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className="bg-gray-200 hover:bg-gray-300"
                >
                  {isVideoEnabled ? "Disable Video" : "Enable Video"}
                </Button>
                <Button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="bg-gray-200 hover:bg-gray-300"
                >
                  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </Button>
                <Button
                  onClick={stopChat}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Stop
                </Button>
              </div>

              {/* Chat messages area */}
              <div className="h-64 border rounded-lg p-4 overflow-y-auto">
                {messages.length === 0 ?
                  <div className="text-center text-gray-500">
                    No messages yet. Say hi!
                  </div>
                : messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                      <span className="text-gray-500 text-sm">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                      <p>{msg.content}</p>
                    </div>
                  ))
                }
              </div>

              {/* Message input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded"
                />
                <Button type="submit" className="bg-[#0088cc] text-white">
                  Send
                </Button>
              </form>
            </div>

        }
      </main>
    </div>
  );
};

export default Home;
