import { DataSocket, createSocket } from "./socket";

import { Throw } from "@contracts/events";

export const socketHit: DataSocket<null> = createSocket("hit");
export const socketThrow: DataSocket<Throw> = createSocket("throw");
