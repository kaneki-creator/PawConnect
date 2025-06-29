import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPetSchema, insertApplicationSchema, insertFavoriteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Pet routes
  app.get('/api/pets', async (req, res) => {
    try {
      const { species, size, location, search, limit, offset } = req.query;
      const pets = await storage.getPets({
        species: species as string,
        size: size as string,
        location: location as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(pets);
    } catch (error) {
      console.error("Error fetching pets:", error);
      res.status(500).json({ message: "Failed to fetch pets" });
    }
  });

  app.get('/api/pets/:id', async (req, res) => {
    try {
      const petId = parseInt(req.params.id);
      const pet = await storage.getPetWithShelter(petId);
      
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      
      res.json(pet);
    } catch (error) {
      console.error("Error fetching pet:", error);
      res.status(500).json({ message: "Failed to fetch pet" });
    }
  });

  // Favorite routes
  app.get('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { petId } = insertFavoriteSchema.parse({ ...req.body, userId });
      
      const favorite = await storage.addToFavorites({ userId, petId });
      res.json(favorite);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      res.status(500).json({ message: "Failed to add to favorites" });
    }
  });

  app.delete('/api/favorites/:petId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const petId = parseInt(req.params.petId);
      
      await storage.removeFromFavorites(userId, petId);
      res.json({ message: "Removed from favorites" });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });

  app.get('/api/favorites/:petId/check', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const petId = parseInt(req.params.petId);
      
      const isFavorite = await storage.isFavorite(userId, petId);
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  // Application routes
  app.get('/api/applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const applications = await storage.getUserApplications(userId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post('/api/applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const applicationData = insertApplicationSchema.parse({ ...req.body, userId });
      
      const application = await storage.createApplication(applicationData);
      res.json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  // Shelter routes
  app.get('/api/shelters', async (req, res) => {
    try {
      const shelters = await storage.getShelters();
      res.json(shelters);
    } catch (error) {
      console.error("Error fetching shelters:", error);
      res.status(500).json({ message: "Failed to fetch shelters" });
    }
  });

  // Seed data route for testing
  app.post('/api/seed', async (req, res) => {
    try {
      // Create sample shelter
      const shelter = await storage.createShelter({
        name: "Hills Animal Rescue",
        location: "Hills District, NSW",
        address: "123 Pet Street, Hills NSW 2154",
        phone: "+61 2 9876 5432",
        email: "contact@hillsanimalrescue.org.au",
        rating: "4.8",
        reviewCount: 156
      });

      // Create sample pets
      const pets = [
        {
          name: "Buddy",
          species: "dog",
          breed: "Golden Retriever",
          age: "3 years",
          weight: "28 kg",
          gender: "male",
          size: "large",
          color: "golden",
          description: "Buddy is a friendly and energetic Golden Retriever who loves playing fetch and swimming. He's great with kids and other dogs!",
          characteristics: ["Friendly", "Energetic", "Good with kids", "Loves water"],
          images: ["https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop"],
          shelterId: shelter.id
        },
        {
          name: "Luna",
          species: "cat",
          breed: "Domestic Shorthair",
          age: "2 years",
          weight: "4 kg",
          gender: "female",
          size: "medium",
          color: "calico",
          description: "Luna is a sweet and gentle cat who loves to cuddle. She's looking for a quiet home where she can be the center of attention.",
          characteristics: ["Gentle", "Affectionate", "Indoor cat", "Quiet"],
          images: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop"],
          shelterId: shelter.id
        },
        {
          name: "Max",
          species: "dog",
          breed: "Border Collie",
          age: "1 year",
          weight: "18 kg",
          gender: "male",
          size: "medium",
          color: "black and white",
          description: "Max is a smart and active Border Collie puppy. He needs an active family who can keep up with his energy and intelligence.",
          characteristics: ["Intelligent", "Active", "Trainable", "Needs exercise"],
          images: ["https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=400&fit=crop"],
          shelterId: shelter.id
        }
      ];

      for (const petData of pets) {
        await storage.createPet(petData);
      }

      res.json({ message: "Sample data created successfully!" });
    } catch (error) {
      console.error("Error seeding data:", error);
      res.status(500).json({ message: "Failed to seed data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
