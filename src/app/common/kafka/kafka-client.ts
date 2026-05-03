import { Kafka } from "kafkajs";

export const KafkaClient = new Kafka({
  clientId: "manish",
  brokers: ["localhost:9092"],
});
