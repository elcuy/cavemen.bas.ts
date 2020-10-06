import express, { Request, Response, static as staticMiddleware } from "express";

import {createSocketServer} from "./socket-server";
import httpServer from "http";
import path from "path";

const app = express();
app.use(staticMiddleware("dist/client"));

app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.resolve("./public/index.html"));
});

const http = new httpServer.Server(app);
createSocketServer(http);

http.listen(3000, function() {
  console.log(`
    _|_|_|    _|_|    _|      _|  _|_|_|_|  _|      _|  _|_|_|_|  _|      _|
  _|        _|    _|  _|      _|  _|        _|_|  _|_|  _|        _|_|    _|
  _|        _|_|_|_|  _|      _|  _|_|_|    _|  _|  _|  _|_|_|    _|  _|  _|
  _|        _|    _|    _|  _|    _|        _|      _|  _|        _|    _|_|
    _|_|_|  _|    _|      _|      _|_|_|_|  _|      _|  _|_|_|_|  _|      _|
  ==========================================================================
     A port of the GORILLAS.BAS QBASIC game, in TypeScript and Socket.io
                      Now listening on port 3000
  `);
});
