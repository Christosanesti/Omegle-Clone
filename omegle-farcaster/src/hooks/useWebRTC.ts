import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isConnected: boolean;
  startCall: () => Promise<void>;
  endCall: () => void;
  sendMessage: (message: string) => void;
  messages: Array<{ content: string; senderId: string; timestamp: Date }>;
}

export function useWebRTC(sessionId: string | null): UseWebRTCReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ content: string; senderId: string; timestamp: Date }>
  >([]);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    // Initialize socket connection
    socketRef.current = io(
      process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001"
    );

    // Initialize WebRTC
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    peerConnection.current = new RTCPeerConnection(configuration);

    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("signal", {
          sessionId,
          signal: {
            type: "candidate",
            candidate: event.candidate,
          },
        });
      }
    };

    // Handle incoming streams
    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    // Handle incoming signals
    socketRef.current.on("signal", async (signal) => {
      if (!peerConnection.current) return;

      if (signal.type === "offer") {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(signal)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socketRef.current?.emit("signal", {
          sessionId,
          signal: answer,
        });
      } else if (signal.type === "answer") {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(signal)
        );
      } else if (signal.type === "candidate") {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(signal.candidate)
        );
      }
    });

    // Handle messages
    socketRef.current.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Handle chat end
    socketRef.current.on("chat_ended", () => {
      endCall();
    });

    return () => {
      endCall();
    };
  }, [sessionId]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      if (peerConnection.current) {
        stream.getTracks().forEach((track) => {
          peerConnection.current?.addTrack(track, stream);
        });

        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socketRef.current?.emit("signal", {
          sessionId,
          signal: offer,
        });
      }

      setIsConnected(true);
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsConnected(false);
    setMessages([]);
  };

  const sendMessage = (content: string) => {
    if (socketRef.current && sessionId) {
      socketRef.current.emit("message", { sessionId, content });
    }
  };

  return {
    localStream,
    remoteStream,
    isConnected,
    startCall,
    endCall,
    sendMessage,
    messages,
  };
}
