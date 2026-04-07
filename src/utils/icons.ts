// Centralized Lucide icon initialization — replaces 15+ scattered setTimeout calls

declare global {
  interface Window {
    lucide?: { createIcons: () => void };
  }
}

let pendingInit: ReturnType<typeof setTimeout> | null = null;

export function initIcons(): void {
  if (pendingInit) clearTimeout(pendingInit);
  pendingInit = setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
    pendingInit = null;
  }, 10);
}
