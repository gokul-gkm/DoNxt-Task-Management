import app from "./app";
import dbConnect from "./config/dbConfig";
import { env } from "./config/env";

const startServer = async () => {
    await dbConnect();
    app.listen(env.PORT, () => {
        console.log("Server running on port 8008");
    })
}

startServer(); 