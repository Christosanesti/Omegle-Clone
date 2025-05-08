import { Socket } from "socket.io";

interface User {
  socket: Socket;
  name: string;
}

export class UserManager {
  private users: User[];
  private queue: string[];

  constructor() {
    this.users = [];
    this.queue = [];
  }
  addUser(name: string, socket: Socket) {
    this.users.push({
      name,
      socket,
    });
    this.queue.push(socket.id);
    this.clearQueue();
  }
  removeuser(socketId) {
    this.users = this.users.filter((x) => x.socket.id === socketId);
  }
  clearQueue() {
    
  }
}
