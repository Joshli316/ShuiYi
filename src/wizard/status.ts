// NRA vs RA Status Determination Wizard
import { t, getLang } from '../i18n';
import { calculateSPT } from '../utils/spt';
import { TAX_YEAR, STUDENT_EXEMPT_YEARS } from '../data/constants';
import { initIcons } from '../utils/icons';
import { showValidationError, clearValidationError } from './shared';
import type { WizardContext } from '../app';

type SubStep = 'visa' | 'j1type' | 'entry' | 'confirm' | 'priorj1' | 'income' | 'result';

let currentSubStep: SubStep = 'visa';

export function renderStatusWizard(ctx: WizardContext): void {
  currentSubStep = 'visa';
  renderSubStep(ctx);
}

function renderSubStep(ctx: WizardContext): void {
  const renderers: Record<SubStep, () => void> = {
    visa: () => renderVisaStep(ctx),
    j1type: () => renderJ1TypeStep(ctx),
    entry: () => renderEntryStep(ctx),
    confirm: () => renderConfirmStep(ctx),
    priorj1: () => renderPriorJ1Step(ctx),
    income: () => renderIncomeStep(ctx),
    result: () => renderResultStep(ctx),
  };
  renderers[currentSubStep]();
}

function goSub(ctx: WizardContext, step: SubStep): void {
  currentSubStep = step;
  renderSubStep(ctx);
}

/** Run SPT calculation from current state and save results. j1IsStudent defaults to true when unset. */
function computeAndSaveSPT(ctx: WizardContext): ReturnType<typeof calculateSPT> {
  const s = ctx.state;
  const result = calculateSPT(s.visaType || 'F-1', s.entryYear || TAX_YEAR, s.hadPriorJ1 || false, s.j1IsStudent !== false);
  ctx.updateState({
    taxStatus: result.status,
    exemptYearsUsed: result.exemptYearsUsed,
    exemptYearsRemaining: result.exemptYearsRemaining,
    transitionYear: result.transitionYear,
  });
  return result;
}

function wizardShell(ctx: WizardContext, step: number, total: number, content?: string, subtitle?: string): string {
  return `
    <div class="max-w-[640px] mx-auto px-4 sm:px-0 py-12">
      <div class="wizard-panel bg-surface rounded-sharp shadow-wizard p-6 sm:p-8">
        ${ctx.renderProgressBar(step, total, subtitle)}
        <div class="wizard-step-enter">
          ${content}
        </div>
      </div>
    </div>
  `;
}

function renderVisaStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const visas = [
    { id: 'F-1', label: t('status.f1'), icon: 'graduation-cap' },
    { id: 'F-1-OPT', label: t('status.f1opt'), icon: 'briefcase' },
    { id: 'J-1', label: t('status.j1'), icon: 'users' },
    { id: 'M-1', label: t('status.m1'), icon: 'wrench' },
    { id: 'Q-1', label: t('status.q1visa'), icon: 'globe' },
    { id: 'H-1B', label: t('status.h1b'), icon: 'building-2' },
    { id: 'OTHER', label: t('status.other'), icon: 'help-circle' },
  ];

  const selected = state.visaType || '';
  // F-1-OPT maps to F-1
  const content = `
    <h3 class="text-h3 text-text mb-1">${t('status.q1')}</h3>
    <p class="text-caption text-text-muted mb-4 flex items-center gap-1">
      <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> ${t('status.q1Help')}
    </p>
    <div class="space-y-3">
      ${visas.map(v => ctx.renderOptionCard(v.id, v.label, selected === v.id, v.icon)).join('')}
    </div>
    ${ctx.renderNav({ showBack: false, nextLabel: t('common.next') })}
  `;

  container.innerHTML = wizardShell(ctx, 1, 5);
  const panel = container.querySelector('.wizard-step-enter');
  if (panel) panel.innerHTML = content;

  // Option card selection
  container.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const optionId = (card as HTMLElement).dataset.option || '';
      ctx.updateState({ visaType: optionId === 'F-1-OPT' ? 'F-1' : optionId });
      renderVisaStep(ctx); // re-render with selection
    });
    card.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') { e.preventDefault(); (card as HTMLElement).click(); }
    });
  });

  container.querySelector('#btn-next')?.addEventListener('click', () => {
    const s = ctx.updateState({});
    if (!s.visaType) return;
    if (s.visaType === 'OTHER' || s.visaType === 'H-1B') {
      // Non-exempt: skip to result, H-1B always has income
      const result = calculateSPT(s.visaType, s.entryYear || TAX_YEAR, false);
      ctx.updateState({ taxStatus: result.status, exemptYearsUsed: 0, exemptYearsRemaining: 0, hasIncome: s.visaType === 'H-1B' ? true : s.hasIncome });
      goSub(ctx, 'result');
    } else if (s.visaType === 'J-1') {
      goSub(ctx, 'j1type');
    } else {
      goSub(ctx, 'entry');
    }
  });

  initIcons();
}

function renderJ1TypeStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const content = `
    <h3 class="text-h3 text-text mb-1">${t('status.j1type')}</h3>
    <p class="text-caption text-text-muted mb-4 flex items-center gap-1">
      <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> ${t('status.j1typeHelp')}
    </p>
    <div class="space-y-3">
      ${ctx.renderOptionCard('student', t('status.j1student'), state.j1IsStudent === true, 'graduation-cap')}
      ${ctx.renderOptionCard('researcher', t('status.j1researcher'), state.j1IsStudent === false, 'briefcase')}
    </div>
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = wizardShell(ctx, 1, 5);
  const panel = container.querySelector('.wizard-step-enter');
  if (panel) panel.innerHTML = content;

  container.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const opt = (card as HTMLElement).dataset.option;
      ctx.updateState({ j1IsStudent: opt === 'student' });
      goSub(ctx, 'entry');
    });
  });

  container.querySelector('#btn-back')?.addEventListener('click', () => goSub(ctx, 'visa'));
  initIcons();
}

function renderEntryStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const months = getLang() === 'zh'
    ? ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
    : ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const currentYear = TAX_YEAR;
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i);

  const content = `
    <h3 class="text-h3 text-text mb-1">${t('status.q2')}</h3>
    <p class="text-caption text-text-muted mb-6 flex items-center gap-1">
      <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> ${t('status.q2Help')}
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="text-body-sm text-text-secondary block mb-2">${t('status.month')}</label>
        <select id="entry-month" class="w-full border-[1.5px] border-border rounded-medium p-3 text-body text-text bg-surface" aria-label="${t('status.month')}">
          <option value="">—</option>
          ${months.map((m, i) => `<option value="${i + 1}" ${state.entryMonth === i + 1 ? 'selected' : ''}>${m}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="text-body-sm text-text-secondary block mb-2">${t('status.year')}</label>
        <select id="entry-year" class="w-full border-[1.5px] border-border rounded-medium p-3 text-body text-text bg-surface" aria-label="${t('status.year')}">
          <option value="">—</option>
          ${years.map(y => `<option value="${y}" ${state.entryYear === y ? 'selected' : ''}>${y}</option>`).join('')}
        </select>
      </div>
    </div>
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = wizardShell(ctx, 2, 5);
  const panel = container.querySelector('.wizard-step-enter');
  if (panel) panel.innerHTML = content;

  container.querySelector('#btn-next')?.addEventListener('click', () => {
    const monthSelect = container.querySelector('#entry-month') as HTMLSelectElement;
    const yearSelect = container.querySelector('#entry-year') as HTMLSelectElement;
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);
    if (!month) { showValidationError(monthSelect); return; }
    if (!year) { showValidationError(yearSelect); return; }
    clearValidationError(monthSelect); clearValidationError(yearSelect);
    const calendarYears = currentYear - year + 1;
    ctx.updateState({ entryMonth: month, entryYear: year, calendarYears });
    goSub(ctx, 'confirm');
  });

  container.querySelector('#btn-back')?.addEventListener('click', () => goSub(ctx, state.visaType === 'J-1' ? 'j1type' : 'visa'));
  initIcons();
}

function renderConfirmStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const years = state.calendarYears || 1;

  const content = `
    <h3 class="text-h3 text-text mb-4">${t('status.q3').replace('{years}', String(years)).replace('calendar years', years === 1 ? 'calendar year' : 'calendar years')}</h3>
    <div class="space-y-3">
      ${ctx.renderOptionCard('yes', t('status.q3Confirm'), false, 'check')}
      ${ctx.renderOptionCard('no', t('status.q3Wrong'), false, 'edit')}
    </div>
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = wizardShell(ctx, 3, 5);
  const panel = container.querySelector('.wizard-step-enter');
  if (panel) panel.innerHTML = content;

  container.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const opt = (card as HTMLElement).dataset.option;
      if (opt === 'no') {
        goSub(ctx, 'entry');
      } else {
        // Check if we need prior J-1 question
        const visa = ctx.updateState({}).visaType || '';
        if (['F-1', 'M-1', 'Q-1'].includes(visa)) {
          goSub(ctx, 'priorj1');
        } else {
          // J-1 doesn't need prior J-1 question
          goSub(ctx, 'income');
        }
      }
    });
  });

  container.querySelector('#btn-back')?.addEventListener('click', () => goSub(ctx, 'entry'));
  initIcons();
}

function renderPriorJ1Step(ctx: WizardContext): void {
  const { container, state } = ctx;

  const content = `
    <h3 class="text-h3 text-text mb-1">${t('status.q4')}</h3>
    <p class="text-caption text-text-muted mb-4 flex items-center gap-1">
      <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> ${t('status.q4Help')}
    </p>
    <div class="space-y-3">
      ${ctx.renderOptionCard('yes', t('common.yes'), state.hadPriorJ1 === true)}
      ${ctx.renderOptionCard('no', t('common.no'), state.hadPriorJ1 === false)}
    </div>
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = wizardShell(ctx, 4, 5);
  const panel = container.querySelector('.wizard-step-enter');
  if (panel) panel.innerHTML = content;

  container.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const opt = (card as HTMLElement).dataset.option;
      ctx.updateState({ hadPriorJ1: opt === 'yes' });
      const result = computeAndSaveSPT(ctx);
      if (result.status === 'NRA') {
        goSub(ctx, 'income');
      } else {
        goSub(ctx, 'result');
      }
    });
  });

  container.querySelector('#btn-back')?.addEventListener('click', () => goSub(ctx, 'confirm'));
  initIcons();
}

function renderIncomeStep(ctx: WizardContext): void {
  const { container, state } = ctx;

  // Ensure SPT is calculated
  if (!state.taxStatus) {
    computeAndSaveSPT(ctx);
  }

  const content = `
    <h3 class="text-h3 text-text mb-1">${t('status.hasIncome')}</h3>
    <p class="text-caption text-text-muted mb-4 flex items-center gap-1">
      <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> ${t('status.hasIncomeHelp')}
    </p>
    <div class="space-y-3">
      ${ctx.renderOptionCard('yes', t('status.yesIncome'), state.hasIncome === true, 'briefcase')}
      ${ctx.renderOptionCard('no', t('status.noIncome'), state.hasIncome === false, 'file-text')}
    </div>
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = wizardShell(ctx, 5, 5, '', t('progress.almostThere'));
  const panel = container.querySelector('.wizard-step-enter');
  if (panel) panel.innerHTML = content;

  container.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const opt = (card as HTMLElement).dataset.option;
      ctx.updateState({ hasIncome: opt === 'yes' });
      goSub(ctx, 'result');
    });
  });

  container.querySelector('#btn-back')?.addEventListener('click', () => {
    const visa = state.visaType || '';
    if (['F-1', 'M-1', 'Q-1'].includes(visa)) goSub(ctx, 'priorj1');
    else goSub(ctx, 'confirm');
  });
  initIcons();
}

function renderResultStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const lang = getLang();
  const isNRA = state.taxStatus === 'NRA';

  const result = computeAndSaveSPT(ctx);

  const statusTitle = isNRA ? t('status.resultNRA') : t('status.resultRA');
  const statusMeaning = isNRA ? t('status.nraMeaning') : t('status.raMeaning');
  const statusColor = isNRA ? 'primary' : 'warning';
  const statusIcon = isNRA ? 'badge-check' : 'alert-triangle';

  const exemptInfo = isNRA ? `
    <div class="flex items-center gap-2 mt-4 text-body-sm text-text-secondary">
      <i data-lucide="calendar-clock" class="w-4 h-4"></i>
      <span>${t('status.exemptYears').replace('{used}', String(result.exemptYearsUsed)).replace('{total}', String(STUDENT_EXEMPT_YEARS))}</span>
    </div>
    <div class="flex items-center gap-2 mt-1 text-body-sm text-success">
      <i data-lucide="check-circle" class="w-4 h-4"></i>
      <span>${t('status.yearsRemaining').replace('{years}', String(result.exemptYearsRemaining))}</span>
    </div>
  ` : '';

  const nextStepText = isNRA ? t('status.nraNext') : t('status.raNext');
  const nextLabel = isNRA ? t('status.continueToForm') : t('status.continueToImmigration');

  // RA-specific guidance section
  const raGuidance = !isNRA ? `
    <div class="mt-6 space-y-3">
      <div class="flex items-start gap-3">
        <i data-lucide="file-text" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"></i>
        <p class="text-body text-text">${t('status.raGuidance1')}</p>
      </div>
      <div class="flex items-start gap-3">
        <i data-lucide="receipt" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"></i>
        <p class="text-body text-text">${t('status.raGuidance2')}</p>
      </div>
      <div class="flex items-start gap-3">
        <i data-lucide="globe" class="w-5 h-5 text-warning mt-0.5 flex-shrink-0"></i>
        <p class="text-body text-text">${t('status.raGuidance3')}</p>
      </div>
      <div class="flex items-start gap-3">
        <i data-lucide="wallet" class="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0"></i>
        <p class="text-body text-text">${t('status.raGuidance4')}</p>
      </div>
      <div class="flex items-start gap-3">
        <i data-lucide="monitor" class="w-5 h-5 text-success mt-0.5 flex-shrink-0"></i>
        <p class="text-body text-text">${t('status.raGuidance5')}</p>
      </div>
    </div>
  ` : '';

  container.innerHTML = `
    <div class="max-w-[640px] mx-auto px-4 sm:px-0 py-12">
      <div class="wizard-panel bg-surface rounded-sharp shadow-wizard p-6 sm:p-8">
        <div class="result-enter">
          <div class="p-6 rounded-celebrate border-2 border-${statusColor} bg-${statusColor === 'primary' ? 'primary-light' : '[#FFF7ED]'} mb-6">
            <div class="flex items-center gap-3 mb-3">
              <i data-lucide="${statusIcon}" class="w-7 h-7 text-${statusColor}"></i>
              <h2 class="text-h1 text-text">${statusTitle}</h2>
            </div>
            <p class="text-body text-text-secondary">${statusMeaning}</p>
            ${exemptInfo}
          </div>

          <p class="text-body text-text-secondary mb-2">${lang === 'zh' ? result.reasonZh : result.reason}</p>

          <a href="https://www.irs.gov/publications/p519" target="_blank" rel="noopener" class="text-caption text-primary hover:underline flex items-center gap-1 mb-6">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i> ${t('status.irsSource')}
          </a>

          <p class="text-body text-text mb-4">${nextStepText}</p>
          ${raGuidance}
        </div>

        ${ctx.renderNav({ showBack: true, nextLabel })}
      </div>
      ${ctx.renderDisclaimer()}
    </div>
  `;

  container.querySelector('#btn-next')?.addEventListener('click', () => {
    const s = ctx.updateState({});
    if (s.taxStatus === 'RA') {
      ctx.goToSection('immigration');
    } else {
      ctx.goToSection('form8843');
    }
  });
  container.querySelector('#btn-back')?.addEventListener('click', () => goSub(ctx, 'income'));
  initIcons();
}
