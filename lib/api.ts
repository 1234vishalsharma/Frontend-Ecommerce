import axios from "axios";
import { Product } from "./store";

/**
 * API client for the Fake Store API (https://fakestoreapi.com)
 *
 * This is a public, free API used for development and demo purposes.
 * In production, replace with your actual backend API.
 */
const API_BASE = process.env.BASE_URL || "https://fakestoreapi.com";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

/**
 * Fetch all products, optionally filtered by category
 * @param category - Optional category filter (e.g., "electronics", "clothing")
 * @returns Array of products or empty array on error
 */
export async function getProducts(category?: string): Promise<Product[]> {
  try {
    if (category && category !== "all") {
      const response = await api.get<Product[]>(
        `/products/category/${category}`
      );
      return response.data;
    }
    const response = await api.get<Product[]>("/products");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

/**
 * Fetch all available product categories
 * @returns Array of category names (e.g., ["electronics", "jewelery", "men's clothing", "women's clothing"])
 */
export async function getCategories(): Promise<string[]> {
  try {
    const response = await api.get<string[]>("/products/categories");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

/**
 * Fetch a single product by ID
 * @param id - Product ID from the Fake Store API
 * @returns Product object or null if not found
 */
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    return null;
  }
}
