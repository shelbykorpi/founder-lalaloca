"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  addLine,
  getServerSnapshot,
  getSnapshot,
  removeLine,
  setLineQuantity,
  subscribe,
  type BagLine,
} from "./bagStore";

export type { BagLine };

type BagContextValue = {
  lines: BagLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  add: (line: Omit<BagLine, "quantity">, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  openBag: () => void;
  closeBag: () => void;
};

const BagContext = createContext<BagContextValue | null>(null);

export function BagProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  const add = useCallback<BagContextValue["add"]>((line, quantity = 1) => {
    addLine(line, quantity);
    setIsOpen(true);
  }, []);

  const value = useMemo<BagContextValue>(() => {
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.price, 0);
    return {
      lines,
      count,
      subtotal,
      isOpen,
      add,
      setQuantity: setLineQuantity,
      remove: removeLine,
      openBag: () => setIsOpen(true),
      closeBag: () => setIsOpen(false),
    };
  }, [lines, isOpen, add]);

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const context = useContext(BagContext);
  if (!context) throw new Error("useBag must be used inside <BagProvider>");
  return context;
}
