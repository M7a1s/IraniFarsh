import { createContext, useEffect, useState, type PropsWithChildren } from "react";

type CartItem = {
  id: string;
  count: number;
};

type CartContextType = {
  cart: CartItem[];
  addItem: (id: string, count: number) => void;
  changeCount: (id: string, method: "plus" | "minus") => void;
  handleRemove: (id: string) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("Cart");
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        console.error("Failed to parse cart data from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (id: string, count: number): void => {
    setCart((prev) => [...prev, { id, count }]);
  };

  const changeCount = (id: string, method: "plus" | "minus"): void => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                count: method === "plus" ? item.count + 1 : item.count - 1,
              }
            : item
        )
        .filter((item) => item.count > 0)
    );
  };

  const handleRemove = (id: string) => {
    setCart((prev) => prev.filter((e) => e.id !== id));
  };

  return <CartContext.Provider value={{ cart, addItem, changeCount, handleRemove }}>{children}</CartContext.Provider>;
};
