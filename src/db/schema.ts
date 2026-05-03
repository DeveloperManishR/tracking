import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  email: text("email").notNull().unique(),

  name: text("name").notNull(),

  refreshToken: text("refreshToken"),

  profilePic: text("profilePic"),

  providerId: text("providerId"),

  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});