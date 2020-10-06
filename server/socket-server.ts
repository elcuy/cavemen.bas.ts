import {Hit, SocketEvent, Throw} from "@contracts/events"
import socketIO, {Server as IOServer, Socket as IOSocket} from "socket.io";

import {Server as HTTPServer} from "http";

export interface WrappedServerSocket<T> {
  event: string;
  callback: SocketActionFn<T>;
}

type SocketActionFn<T> = (message: T) => void;

let io: (IOServer | null) = null;

// Wrapper functions

export function createSocketServer(server: HTTPServer) {
  io = socketIO(server);

  io.on("connection", (socket: IOSocket) => {
    registeredEvents.forEach(({ event, callback }) => {
      socket.on(event, callback);
    });
  });
}

export function broadcast<T>(event: SocketEvent) {
  return (message: T) => io?.emit(event, message);
}

export function createSocket<T>(
  event: SocketEvent,
  action?: SocketActionFn<T>
): WrappedServerSocket<T> {
  const callback = action || broadcast(event);
  return { event, callback };
}


// Socket Events

const registeredEvents = [
  createSocket<string>("player_join"),
  createSocket<Throw>("throw"),
  createSocket<Hit>("hit")
];
