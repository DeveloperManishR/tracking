import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

import { KafkaClient } from "../kafka/kafka-client.js";
import { env } from "../../../db/env.js";
const userSocketMap: Record<string, string> = {};
const rateLimitingHashMap = new Map();

async function connectWithRetry(client: { connect: () => Promise<void> }, label: string) {
  for (let attempt = 1; attempt <= env.KAFKA_CONNECT_RETRIES; attempt += 1) {
    try {
      await client.connect();
      return;
    } catch (error) {
      if (attempt === env.KAFKA_CONNECT_RETRIES) {
        throw error;
      }

      console.warn(`Kafka ${label} connect attempt ${attempt} failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, env.KAFKA_CONNECT_RETRY_DELAY_MS));
    }
  }
}

export async function initSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  const kafkaProducer = KafkaClient.producer();
  await connectWithRetry(kafkaProducer, "producer");

  const kafkaConsumer = KafkaClient.consumer({
    groupId: `socket-server-${env.PORT}`,
  });
  await connectWithRetry(kafkaConsumer, "consumer");

  await kafkaConsumer.subscribe({
    topics: ["location-updates"],
    fromBeginning: true,
  });

  kafkaConsumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat }) => {
      const data = JSON.parse(message.value?.toString() || "{}");
      io.emit("server:location:update", {
        id: data.id,
        user: data.user,
        latitude: data.latitude,
        longitude: data.longitude,
      });
      await heartbeat();
    },
  });

  io.on("connection", (socket) => {
    console.log(`socket connected ${socket.id}`);

    socket.on("client:location:update", (locationData) => {
      const { latitude, longitude, user } = locationData;

      console.log(`Socket:${socket.id}:client:location:update`, locationData);

      kafkaProducer.send({
        topic: "location-updates",
        messages: [
          {
            key: socket.id,
            value: JSON.stringify({
              id: socket.id,
              latitude,
              longitude,
              user: user,
            }),
          },
        ],
      });
    });
  });

  return io;
}
