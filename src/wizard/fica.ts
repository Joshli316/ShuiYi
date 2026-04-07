// FICA Exemption Checker
import { t } from '../i18n';
import { FICA_TOTAL_RATE, FICA_EXEMPT_VISA_TYPES, STUDENT_EXEMPT_YEARS, calculateFICA } from '../data/constants';
import { initIcons } from '../utils/icons';
import { wizardShell as sharedShell } from './shared';
import type { WizardContext } from '../app';

type SubStep = 'employed' | 'paystub' | 'result';
let currentSubStep: SubStep = 'employed';

export function renderFICAWizard(ctx: WizardContext): void {
  currentSubStep = 'employed';
  renderSubStep(ctx);
}

function renderSubStep(ctx: WizardContext): void {
  const renderers: Record<SubStep, () => void> = {
    employed: () => renderEmployedStep(ctx),
    paystub: () => renderPaystubStep(ctx),
    result: () => renderResultStep(ctx),
  };
  renderers[currentSubStep]();
}

function goSub(ctx: WizardContext, step: SubStep): void {
  currentSubStep = step;
  renderSubStep(ctx);
}

function shell(ctx: WizardContext, step: number, total: number, content: string): string {
  return sharedShell(ctx, step, total, 'wallet', 'nav.fica', content);
}

function renderEmployedStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const content = `
    <h3 class="text-h3 text-text mb-1">${t('fica.title')}</h3>
    <p class="text-body text-text-secondary mb-6">${t('fica.subtitle')}</p>
    <h3 class="text-h3 text-text mb-1">${t('fica.employed')}</h3>
    <p class="text-caption text-text-muted mb-4 flex items-center gap-1">
      <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> ${t('fica.employedHelp')}
    </p>
    <div class="space-y-3">
      ${ctx.renderOptionCard('yes', t('common.yes'), state.isEmployed === true, 'briefcase')}
      ${ctx.renderOptionCard('no', t('common.no'), state.isEmployed === false, 'x')}
    </div>
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = shell(ctx, 1, 2, content);

  container.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const opt = (card as HTMLElement).dataset.option;
      ctx.updateState({ isEmployed: opt === 'yes' });
      if (opt === 'yes') {
        goSub(ctx, 'paystub');
      } else {
        // Not employed — FICA not relevant
        ctx.updateState({ ficaExempt: true, ficaWithheld: false });
        goSub(ctx, 'result');
      }
    });
  });

  container.querySelector('#btn-back')?.addEventListener('click', () => ctx.goToSection('treaty'));
  initIcons();
}

function renderPaystubStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const content = `
    <h3 class="text-h3 text-text mb-1">${t('fica.payStub')}</h3>
    <p class="text-caption text-text-muted mb-4 flex items-center gap-1">
      <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> ${t('fica.payStubHelp')}
    </p>
    <div class="space-y-3">
      ${ctx.renderOptionCard('yes', t('common.yes'), state.ficaWithheld === true, 'alert-triangle')}
      ${ctx.renderOptionCard('no', t('common.no'), state.ficaWithheld === false, 'check')}
      ${ctx.renderOptionCard('unsure', t('common.notSure'), false, 'help-circle')}
    </div>
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = shell(ctx, 2, 2, content);

  container.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const opt = (card as HTMLElement).dataset.option;
      ctx.updateState({ ficaWithheld: opt === 'yes' || opt === 'unsure' });

      // Check if exempt
      const visa = state.visaType || '';
      const yearsUsed = state.exemptYearsUsed || 0;
      const isExempt = FICA_EXEMPT_VISA_TYPES.includes(visa) && yearsUsed <= STUDENT_EXEMPT_YEARS;
      ctx.updateState({ ficaExempt: isExempt });

      // Calculate refund if FICA was withheld and student is exempt
      if (isExempt && (opt === 'yes' || opt === 'unsure')) {
        const income = state.incomeAmount || 0;
        const refund = calculateFICA(income);
        ctx.updateState({ ficaRefundAmount: refund });
      }

      goSub(ctx, 'result');
    });
  });

  container.querySelector('#btn-back')?.addEventListener('click', () => goSub(ctx, 'employed'));
  initIcons();
}

function renderResultStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const visa = state.visaType || 'F-1';
  const yearsUsed = state.exemptYearsUsed || 1;
  const isExempt = state.ficaExempt;
  const ficaWithheld = state.ficaWithheld;
  const refundAmount = state.ficaRefundAmount || 0;

  let resultHtml = '';

  if (!state.isEmployed) {
    // Not employed — just a note
    resultHtml = `
      <div class="p-6 rounded-celebrate border-2 border-primary bg-primary-light mb-6">
        <div class="flex items-center gap-3 mb-3">
          <i data-lucide="check-circle" class="w-7 h-7 text-primary"></i>
          <h2 class="text-h2 text-text">${t('fica.exempt')}</h2>
        </div>
        <p class="text-body text-text-secondary">${t('fica.notEmployedDesc')}</p>
      </div>
    `;
  } else if (isExempt && ficaWithheld) {
    // Exempt but FICA was withheld — refund scenario!
    resultHtml = `
      <div class="result-card-bg p-6 rounded-celebrate border-2 border-accent bg-gradient-to-br from-primary-light to-surface mb-6">
        <div class="flex items-center gap-2 mb-2">
          <i data-lucide="sparkles" class="w-6 h-6 text-accent"></i>
          <span class="text-body text-text-secondary">${t('fica.refundTitle')}</span>
        </div>
        <div class="count-up text-display text-primary font-extrabold mb-2">$${refundAmount.toLocaleString()}</div>
        <p class="text-body text-text-secondary">${t('fica.refundAmount').replace('{amount}', refundAmount.toLocaleString())}</p>
      </div>

      <div class="space-y-4 mb-6">
        <h3 class="text-body-sm font-semibold text-text">${t('fica.howToGetRefund')}</h3>
        ${[t('fica.refundStep1'), t('fica.refundStep2'), t('fica.refundStep3')].map((step, i) => `
          <div class="flex items-start gap-3 text-body text-text-secondary">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent-dark text-sm font-semibold flex items-center justify-center">${i + 1}</span>
            <span>${step}</span>
          </div>
        `).join('')}
        <div class="flex items-center gap-2 text-caption text-warning">
          <i data-lucide="calendar-clock" class="w-4 h-4"></i>
          ${t('fica.refundDeadline')}
        </div>
      </div>

      <p class="text-caption text-text-muted">${t('fica.ircSection')}</p>
    `;
  } else if (isExempt && !ficaWithheld) {
    // Exempt and no FICA withheld — everything is correct
    resultHtml = `
      <div class="p-6 rounded-celebrate border-2 border-primary bg-primary-light mb-6">
        <div class="flex items-center gap-3 mb-3">
          <i data-lucide="check-circle" class="w-7 h-7 text-primary"></i>
          <h2 class="text-h2 text-text">${t('fica.exempt')}</h2>
        </div>
        <p class="text-body text-text-secondary">${t('fica.exemptDesc').replace('{visa}', visa).replace('{year}', String(yearsUsed)).replace('{total}', String(STUDENT_EXEMPT_YEARS))}</p>
        <p class="text-body text-text-secondary mt-2">${t('fica.employerCorrect')}</p>
      </div>
      <p class="text-caption text-text-muted">${t('fica.ircSection')}</p>
    `;
  } else {
    // Not exempt — FICA applies normally
    resultHtml = `
      <div class="p-6 rounded-celebrate border-2 border-border bg-surface mb-6">
        <div class="flex items-center gap-3 mb-3">
          <i data-lucide="info" class="w-7 h-7 text-text-secondary"></i>
          <h2 class="text-h2 text-text">${t('fica.notExempt')}</h2>
        </div>
        <p class="text-body text-text-secondary">${t('fica.notExemptDesc')}</p>
        <p class="text-caption text-text-muted mt-3">${t('fica.rate')}</p>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="max-w-[640px] mx-auto px-4 sm:px-0 py-12">
      <div class="wizard-panel bg-surface rounded-sharp shadow-wizard p-6 sm:p-8">
        <div class="result-enter">
          ${resultHtml}
        </div>
        ${ctx.renderNav({ showBack: true, nextLabel: t('common.continue') })}
      </div>
      ${ctx.renderDisclaimer()}
    </div>
  `;

  container.querySelector('#btn-next')?.addEventListener('click', () => ctx.goToSection('year5'));
  container.querySelector('#btn-back')?.addEventListener('click', () => goSub(ctx, state.isEmployed ? 'paystub' : 'employed'));
  initIcons();
}
