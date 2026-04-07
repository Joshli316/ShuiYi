// Lucide icons — locally bundled
import { createIcons, icons } from 'lucide';

let pendingInit: ReturnType<typeof setTimeout> | null = null;

export function initIcons(): void {
  if (pendingInit) clearTimeout(pendingInit);
  pendingInit = setTimeout(() => {
    createIcons({ icons });
    pendingInit = null;
  }, 10);
}
