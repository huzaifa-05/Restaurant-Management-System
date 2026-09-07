import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "foodie-we-cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (_err) {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = Number(subtotal.toFixed(2));

    return {
      items,
      subtotal,
      total,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem(menuItem) {
        setItems((current) => {
          const existing = current.find((item) => item.id === menuItem.id);
          if (existing) {
            return current.map((item) =>
              item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          }
          return [...current, { ...menuItem, quantity: 1 }];
        });
      },
      removeItem(id) {
        setItems((current) => current.filter((item) => item.id !== id));
      },
      increase(id) {
        setItems((current) =>
          current.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
        );
      },
      decrease(id) {
        setItems((current) =>
          current
            .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item))
            .filter((item) => item.quantity > 0)
        );
      },
      clearCart() {
        setItems([]);
      }
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
