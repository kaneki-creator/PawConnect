import {
  users,
  pets,
  shelters,
  favorites,
  applications,
  type User,
  type UpsertUser,
  type Pet,
  type InsertPet,
  type Shelter,
  type InsertShelter,
  type Favorite,
  type InsertFavorite,
  type Application,
  type InsertApplication,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, ilike, or, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Pet operations
  getPets(filters?: {
    species?: string;
    size?: string;
    location?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Pet[]>;
  getPet(id: number): Promise<Pet | undefined>;
  getPetWithShelter(id: number): Promise<Pet & { shelter: Shelter } | undefined>;
  createPet(pet: InsertPet): Promise<Pet>;
  updatePet(id: number, pet: Partial<InsertPet>): Promise<Pet>;
  
  // Shelter operations
  getShelters(): Promise<Shelter[]>;
  getShelter(id: number): Promise<Shelter | undefined>;
  createShelter(shelter: InsertShelter): Promise<Shelter>;
  
  // Favorite operations
  getUserFavorites(userId: string): Promise<(Favorite & { pet: Pet })[]>;
  addToFavorites(favorite: InsertFavorite): Promise<Favorite>;
  removeFromFavorites(userId: string, petId: number): Promise<void>;
  isFavorite(userId: string, petId: number): Promise<boolean>;
  
  // Application operations
  getUserApplications(userId: string): Promise<(Application & { pet: Pet })[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Pet operations
  async getPets(filters?: {
    species?: string;
    size?: string;
    location?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Pet[]> {
    try {
      // Simple query for now to get app working
      const result = await db.select().from(pets).where(eq(pets.status, "available")).orderBy(desc(pets.createdAt)).limit(filters?.limit || 20);
      return result;
    } catch (error) {
      console.error("Error fetching pets:", error);
      return [];
    }
  }

  async getPet(id: number): Promise<Pet | undefined> {
    const [pet] = await db.select().from(pets).where(eq(pets.id, id));
    return pet;
  }

  async getPetWithShelter(id: number): Promise<Pet & { shelter: Shelter } | undefined> {
    const [result] = await db
      .select()
      .from(pets)
      .innerJoin(shelters, eq(pets.shelterId, shelters.id))
      .where(eq(pets.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.pets,
      shelter: result.shelters,
    };
  }

  async createPet(pet: InsertPet): Promise<Pet> {
    const [newPet] = await db.insert(pets).values(pet).returning();
    return newPet;
  }

  async updatePet(id: number, pet: Partial<InsertPet>): Promise<Pet> {
    const [updatedPet] = await db
      .update(pets)
      .set({ ...pet, updatedAt: new Date() })
      .where(eq(pets.id, id))
      .returning();
    return updatedPet;
  }

  // Shelter operations
  async getShelters(): Promise<Shelter[]> {
    return await db.select().from(shelters);
  }

  async getShelter(id: number): Promise<Shelter | undefined> {
    const [shelter] = await db.select().from(shelters).where(eq(shelters.id, id));
    return shelter;
  }

  async createShelter(shelter: InsertShelter): Promise<Shelter> {
    const [newShelter] = await db.insert(shelters).values(shelter).returning();
    return newShelter;
  }

  // Favorite operations
  async getUserFavorites(userId: string): Promise<(Favorite & { pet: Pet })[]> {
    const results = await db
      .select()
      .from(favorites)
      .innerJoin(pets, eq(favorites.petId, pets.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));
    
    return results.map(result => ({
      ...result.favorites,
      pet: result.pets,
    }));
  }

  async addToFavorites(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db.insert(favorites).values(favorite).returning();
    return newFavorite;
  }

  async removeFromFavorites(userId: string, petId: number): Promise<void> {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.petId, petId)));
  }

  async isFavorite(userId: string, petId: number): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.petId, petId)))
      .limit(1);
    
    return !!favorite;
  }

  // Application operations
  async getUserApplications(userId: string): Promise<(Application & { pet: Pet })[]> {
    const results = await db
      .select()
      .from(applications)
      .innerJoin(pets, eq(applications.petId, pets.id))
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.createdAt));
    
    return results.map(result => ({
      ...result.applications,
      pet: result.pets,
    }));
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db
      .insert(applications)
      .values(application)
      .returning();
    return newApplication;
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application> {
    const [updatedApplication] = await db
      .update(applications)
      .set({ status, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return updatedApplication;
  }
}

export const storage = new DatabaseStorage();
