import { Kafka } from "kafkajs";
import { env } from "../../../db/env.js";

export const KafkaClient = new Kafka({
  clientId: "manish",
  brokers: env.KAFKA_BROKER.split(",").map((broker) => broker.trim()),
});
