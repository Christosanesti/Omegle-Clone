import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ChatUser {
  socketId: string;
  userId: string;
  sessionId?: string;
}

export function setupWebSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  const waitingUsers: ChatUser[] = [];
  const activeChats = new Map<string, ChatUser[]>();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle user joining
    socket.on("join", async ({ userId }) => {
      const user: ChatUser = { socketId: socket.id, userId };
      waitingUsers.push(user);

      // Try to match with another user
      if (waitingUsers.length >= 2) {
        const user1 = waitingUsers.shift()!;
        const user2 = waitingUsers.shift()!;

        // Create a new chat session
        const session = await prisma.session.create({
          data: {
            userId: user1.userId,
            status: "chatting",
          },
        });

        // Update both users with session info
        user1.sessionId = session.id;
        user2.sessionId = session.id;

        // Store active chat
        activeChats.set(session.id, [user1, user2]);

        // Notify both users
        io.to(user1.socketId).emit("chat_started", { sessionId: session.id });
        io.to(user2.socketId).emit("chat_started", { sessionId: session.id });
      }
    });

    // Handle messages
    socket.on("message", async ({ sessionId, content }) => {
      const chat = activeChats.get(sessionId);
      if (!chat) return;

      const sender = chat.find((user) => user.socketId === socket.id);
      if (!sender) return;

      // Save message to database
      const message = await prisma.message.create({
        data: {
          content,
          sessionId,
          userId: sender.userId,
        },
      });

      // Broadcast message to other user
      const receiver = chat.find((user) => user.socketId !== socket.id);
      if (receiver) {
        io.to(receiver.socketId).emit("message", {
          content,
          senderId: sender.userId,
          timestamp: message.createdAt,
        });
      }
    });

    // Handle video signaling
    socket.on("signal", ({ sessionId, signal }) => {
      const chat = activeChats.get(sessionId);
      if (!chat) return;

      const receiver = chat.find((user) => user.socketId !== socket.id);
      if (receiver) {
        io.to(receiver.socketId).emit("signal", signal);
      }
    });

    // Handle chat end
    socket.on("end_chat", async ({ sessionId }) => {
      const chat = activeChats.get(sessionId);
      if (!chat) return;

      // Update session status
      await prisma.session.update({
        where: { id: sessionId },
        data: {
          status: "ended",
          endedAt: new Date(),
        },
      });

      // Notify other user
      const otherUser = chat.find((user) => user.socketId !== socket.id);
      if (otherUser) {
        io.to(otherUser.socketId).emit("chat_ended");
      }

      // Remove from active chats
      activeChats.delete(sessionId);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      // Remove from waiting list
      const waitingIndex = waitingUsers.findIndex(
        (user) => user.socketId === socket.id
      );
      if (waitingIndex !== -1) {
        waitingUsers.splice(waitingIndex, 1);
      }

      // Handle active chat disconnection
      for (const [sessionId, chat] of activeChats.entries()) {
        const userIndex = chat.findIndex((user) => user.socketId === socket.id);
        if (userIndex !== -1) {
          const otherUser = chat[userIndex === 0 ? 1 : 0];
          io.to(otherUser.socketId).emit("chat_ended");
          activeChats.delete(sessionId);
          break;
        }
      }
    });
  });

  return io;
}
