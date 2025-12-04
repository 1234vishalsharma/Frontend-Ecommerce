import { makeAutoObservable } from "mobx";

/**
 * Product interface matching the Fake Store API response.
 * Used throughout the app for type safety.
 */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

/** Shopping cart item extends Product with quantity tracking */
export interface CartItem extends Product {
  quantity: number;
}

/**
 * CartStore manages the user's shopping cart using MobX for fine-grained reactivity.
 * Cart state is persisted to sessionStorage for the current browsing session.
 *
 * Why sessionStorage and not localStorage?
 * - SessionStorage clears when the tab closes (expected e-commerce behavior)
 * - Prevents stale carts from previous visits
 * - localStorage would require explicit clearing logic
 */
class CartStore {
  items: CartItem[] = [];
  private readonly STORAGE_KEY = "shophub_cart";

  constructor() {
    makeAutoObservable(this);
    this.loadCart();
  }

  /**
   * Add a product to cart or increase quantity if already present.
   * Automatically saves to sessionStorage.
   */
  addToCart(product: Product, quantity: number = 1) {
    const existingItem = this.items.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ ...product, quantity });
    }
    this.saveCart();
  }

  /**
   * Remove a product from cart by ID.
   */
  removeFromCart(productId: number) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveCart();
  }

  /**
   * Update the quantity of a cart item.
   * Enforces minimum quantity of 1.
   */
  updateQuantity(productId: number, quantity: number) {
    const item = this.items.find((item) => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
    }
  }

  /** Calculate total price of all items in cart */
  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  /** Get total number of items in cart (sum of quantities) */
  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  /** Clear all items from cart */
  clearCart() {
    this.items = [];
    this.saveCart();
  }

  /** Persist cart to sessionStorage */
  private saveCart() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    }
  }

  /** Load cart from sessionStorage on initialization */
  private loadCart() {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          this.items = JSON.parse(saved);
        } catch (error) {
          console.error("Failed to parse cart from sessionStorage:", error);
          this.items = [];
        }
      }
    }
  }
}

export const cartStore = new CartStore();
