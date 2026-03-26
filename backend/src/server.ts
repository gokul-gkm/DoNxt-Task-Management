import "reflect-metadata";
import "@/di/container";
import http from "http";
import { Container } from "typedi";
import { TOKENS } from "@/di/tokens";
import app from "./app";
import dbConnect from "./config/db.config";
import { env } from "./config/env";

const startServer = async () => {
    await dbConnect();
    
    const server = http.createServer(app);
    
    const socketService = Container.get(TOKENS.SocketService);
    socketService.initialize(server);

    const PORT = env.PORT || 8008;
    server.listen({
        port: Number(PORT),
        host: "0.0.0.0",
    }, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();