import http from "node:http";
import { env } from "./db/env.js";
import { createServerApplication } from "./app/app.js";
import { initSocket } from "./app/common/utils/socket.js";

async function main() {
  try {
    const server = http.createServer(createServerApplication());
    const PORT: number = env.PORT ? +env.PORT : 8000;

    initSocket(server);
    server.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    throw error;
  }
}

main();
