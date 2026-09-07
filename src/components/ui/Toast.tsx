"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

const TOAST_DURATION_MS = 4000;

export interface ToastOptions {
  message: string;
  undoLabel?: string;
  onUndo?: () => void;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * A2 "Toast": bottom-centre, 4 seconds, one optional Undo. Never used for
 * errors that need a decision — use ConfirmDialog for those instead.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

interface ActiveToast extends ToastOptions {
  id: number;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ActiveToast | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const id = Date.now();
    setToast({ ...options, id });
    timerRef.current = setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        {toast && (
          <div
            role="status"
            className="pointer-events-auto flex items-center gap-3 rounded-md bg-ink px-4 py-3 shadow-2"
          >
            <span className="text-surface">{toast.message}</span>
            {toast.onUndo && (
              <button
                type="button"
                onClick={() => {
                  toast.onUndo?.();
                  setToast(null);
                }}
                className="font-semibold text-primary-soft underline underline-offset-2"
              >
                {toast.undoLabel ?? "Undo"}
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
