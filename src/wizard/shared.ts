// Shared wizard helpers — eliminates duplication across wizard modules
import { t } from '../i18n';
import type { WizardContext } from '../app';

/** Standard wizard panel shell with progress bar and section badge */
export function wizardShell(ctx: WizardContext, step: number, total: number, icon: string, navKey: string, content: string): string {
  return `
    <div class="max-w-[640px] mx-auto px-4 sm:px-0 py-12">
      <div class="wizard-panel bg-surface rounded-sharp shadow-wizard p-6 sm:p-8">
        ${ctx.renderProgressBar(step, total)}
        <div class="flex items-center gap-2 mb-1">
          <i data-lucide="${icon}" class="w-5 h-5 text-primary"></i>
          <span class="text-caption text-primary font-semibold">${t(navKey)}</span>
        </div>
        <div class="wizard-step-enter">
          ${content}
        </div>
      </div>
    </div>
  `;
}

/** Show validation error with red border + shake animation on an element */
export function showValidationError(el: HTMLElement): void {
  el.classList.add('input-error', 'shake');
  el.focus();
  setTimeout(() => el.classList.remove('shake'), 300);
}

/** Clear validation error styling */
export function clearValidationError(el: HTMLElement): void {
  el.classList.remove('input-error');
}
