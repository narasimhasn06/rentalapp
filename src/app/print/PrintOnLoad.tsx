"use client";

import { useEffect } from "react";

/**
 * Triggers the browser's print dialog once a print view has mounted, per
 * spec/screens/print/P-01-rent-receipt.md's "print dialog triggered on
 * load" rule (applies to every view under spec/screens/print/**).
 */
export function PrintOnLoad() {
  useEffect(() => {
    window.print();
  }, []);

  return null;
}
