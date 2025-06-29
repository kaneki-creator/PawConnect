import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  location: varchar("location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shelters table
export const shelters = pgTable("shelters", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  location: varchar("location").notNull(),
  address: text("address"),
  phone: varchar("phone"),
  email: varchar("email"),
  website: varchar("website"),
  rating: decimal("rating", { precision: 2, scale: 1 }),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pets table
export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  species: varchar("species").notNull(), // dog, cat, rabbit, etc.
  breed: varchar("breed").notNull(),
  age: varchar("age").notNull(), // "2 years", "6 months", etc.
  weight: varchar("weight"), // "25 kg", "3.5 kg", etc.
  gender: varchar("gender").notNull(), // male, female
  size: varchar("size").notNull(), // small, medium, large
  color: varchar("color"),
  description: text("description"),
  characteristics: text("characteristics").array(),
  images: text("images").array().notNull(),
  status: varchar("status").notNull().default("available"), // available, pending, adopted
  shelterId: integer("shelter_id").references(() => shelters.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Favorites table
export const favorites = pgTable(
  "favorites",
  {
    userId: varchar("user_id").references(() => users.id).notNull(),
    petId: integer("pet_id").references(() => pets.id).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.petId] }),
  })
);

// Applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  petId: integer("pet_id").references(() => pets.id).notNull(),
  status: varchar("status").notNull().default("pending"), // pending, approved, rejected
  message: text("message"),
  contactInfo: jsonb("contact_info"), // phone, email, etc.
  experienceInfo: jsonb("experience_info"), // previous pets, living situation, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
  applications: many(applications),
}));

export const sheltersRelations = relations(shelters, ({ many }) => ({
  pets: many(pets),
}));

export const petsRelations = relations(pets, ({ one, many }) => ({
  shelter: one(shelters, {
    fields: [pets.shelterId],
    references: [shelters.id],
  }),
  favorites: many(favorites),
  applications: many(applications),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  pet: one(pets, {
    fields: [favorites.petId],
    references: [pets.id],
  }),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  user: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
  pet: one(pets, {
    fields: [applications.petId],
    references: [pets.id],
  }),
}));

// Types and schemas
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Shelter = typeof shelters.$inferSelect;
export type InsertShelter = typeof shelters.$inferInsert;

export type Pet = typeof pets.$inferSelect;
export type InsertPet = typeof pets.$inferInsert;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;

// Zod schemas
export const insertPetSchema = createInsertSchema(pets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  createdAt: true,
});

export const insertShelterSchema = createInsertSchema(shelters).omit({
  id: true,
  createdAt: true,
});
