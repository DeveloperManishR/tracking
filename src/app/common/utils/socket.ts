import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

import { KafkaClient } from "../kafka/kafka-client.js";
import { env } from "process";
const userSocketMap: Record<string, string> = {};
const rateLimitingHashMap = new Map();

export async function initSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  const kafkaProducer = KafkaClient.producer();
  await kafkaProducer.connect();

  const kafkaConsumer = KafkaClient.consumer({
    groupId: `socket-server-${env.PORT}`,
  });
  await kafkaConsumer.connect();

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
