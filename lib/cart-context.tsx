"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Check, ArrowRight, Zap, Package } from "lucide-react";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: "game" | "software" | "gift-card";
  subcategory?: string;
  image?: string;
  stock: number;
  rating?: string;
  genre?: string;
  publisher?: string;
  releaseDate?: string;
  platform?: string;
  features?: string[];
  isDigital?: boolean;
  discountPercentage?: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  lastAdded: { product: Product; quantity: number } | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ═══════════════════════════════════════════════════════
// ─── CART TOAST COMPONENT ────────────────────────────
// ═══════════════════════════════════════════════════════
function CartToast({
  item,
  itemCount,
  totalPrice,
  onClose,
}: {
  item: { product: Product; quantity: number } | null;
  itemCount: number;
  totalPrice: number;
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0, x: 80, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 80, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="fixed top-20 right-4 z-[100] w-[380px] max-w-[calc(100vw-2rem)]"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Success header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 border-b border-emerald-100 dark:border-emerald-500/10">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Added to cart
              </span>
              <button
                onClick={onClose}
                className="ml-auto p-1 rounded-lg text-emerald-400 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product info */}
            <div className="flex gap-3 p-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-white/[0.04] overflow-hidden shrink-0">
                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">
                    🎮
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {item.product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  {item.product.isDigital !== false && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      <Zap className="w-3 h-3" /> Instant Delivery
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    ${item.product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
            </div>

            {/* Cart summary + actions */}
            <div className="px-4 pb-4 pt-0 space-y-3">
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Package className="w-3.5 h-3.5" />
                  <span>
                    Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onClose();
                    router.push("/store");
                  }}
                  className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    onClose();
                    router.push("/cart");
                  }}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white hover:shadow-glow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  View Cart <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<{
    product: Product;
    quantity: number;
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const dismissToast = useCallback(() => {
    setLastAdded(null);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product._id === product._id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        return [...currentItems, { product, quantity }];
      }
    });

    // Show toast
    setLastAdded({ product, quantity });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setLastAdded(null), 4500);
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product._id !== productId),
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        lastAdded,
      }}
    >
      {children}
      <CartToast
        item={lastAdded}
        itemCount={itemCount}
        totalPrice={totalPrice}
        onClose={dismissToast}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
