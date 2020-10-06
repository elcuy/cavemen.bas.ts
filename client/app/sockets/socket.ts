import { SocketEvent } from "@contracts/events";
import socketIOClient from "socket.io-client";

interface ListenerCallback<T> {
  (data: T): void;
}

export interface DataSocket<T> {
  emit: (data: T) => void;
  on: (callback: ListenerCallback<T>) => void;
  off: (callback?: ListenerCallback<T>) => void;
}

export function createSocket<T>(event: SocketEvent): DataSocket<T> {
  return {
    emit: emitCallback(event),
    on: onCallback(event),
    off: offCallback(event)
  };
}

function emitCallback<T>(event: string) {
  return (data: T): void => {
    socket.emit(event, data);
  }
}

function onCallback<T>(event: string) {
  return (callback: ListenerCallback<T>): void => {
    socket.on(event, callback);
  };
}

function offCallback<T>(event: string) {
  return (callback?: ListenerCallback<T>): void => {
    socket.off(event, callback);
  };
}

const socket = socketIOClient();

socket.on("reconnect_attempt", () => {
  (socket as any).io.opts.transports = ["polling", "websocket"];
});

socket.on("connect", () => null);

socket.on("disconnect", (reason: string) => {
  if (reason === "io server disconnect") {
    (socket as any).connect();
  }
});

export default socket;
