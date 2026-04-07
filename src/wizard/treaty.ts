// Treaty Benefit Calculator
import { t, getLang } from '../i18n';
import { calculateTax, STANDARD_DEDUCTION_RA } from '../data/constants';
import { ALL_COUNTRIES, TREATY_DATA, getTreatyInfo, calculateTreatySavings, TERMINATED_TREATIES } from '../data/treaties';
import { initIcons } from '../utils/icons';
import type { WizardContext } from '../app';

type SubStep = 'country' | 'income' | 'result';
let currentSubStep: SubStep = 'country';

export function renderTreatyWizard(ctx: WizardContext): void {
  currentSubStep = ctx.state.citizenship ? 'income' : 'country';
  renderSubStep(ctx);
}

function renderSubStep(ctx: WizardContext): void {
  const renderers: Record<SubStep, () => void> = {
    country: () => renderCountryStep(ctx),
    income: () => renderIncomeStep(ctx),
    result: () => renderResultStep(ctx),
  };
  renderers[currentSubStep]();
}

function goSub(ctx: WizardContext, step: SubStep): void {
  currentSubStep = step;
  renderSubStep(ctx);
}

function shell(ctx: WizardContext, step: number, total: number, content: string): string {
  return `
    <div class="max-w-[640px] mx-auto px-4 sm:px-0 py-12">
      <div class="wizard-panel bg-surface rounded-sharp shadow-wizard p-6 sm:p-8">
        ${ctx.renderProgressBar(step, total)}
        <div class="flex items-center gap-2 mb-1">
          <i data-lucide="calculator" class="w-5 h-5 text-primary"></i>
          <span class="text-caption text-primary font-semibold">${t('nav.treaty')}</span>
        </div>
        <div class="wizard-step-enter">
          ${content}
        </div>
      </div>
    </div>
  `;
}

function renderCountryStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const lang = getLang();
  const content = `
    <h3 class="text-h3 text-text mb-1">${t('treaty.title')}</h3>
    <p class="text-body text-text-secondary mb-6">${t('treaty.subtitle')}</p>
    <label class="text-body-sm text-text-secondary block mb-2">${t('treaty.country')}</label>
    <select id="treaty-country" class="w-full border-[1.5px] border-border rounded-medium p-3 text-body text-text bg-surface" aria-label="${t('treaty.country')}">
      <option value="">${t('treaty.selectCountry')}</option>
      ${ALL_COUNTRIES.filter(c => c.code !== 'OTHER').map(c =>
        `<option value="${c.code}" ${state.citizenship === c.code ? 'selected' : ''}>${lang === 'zh' ? c.nameZh : c.name}</option>`
      ).join('')}
    </select>
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = shell(ctx, 1, 2, content);

  container.querySelector('#btn-next')?.addEventListener('click', () => {
    const code = (container.querySelector('#treaty-country') as HTMLSelectElement).value;
    if (!code) return;
    ctx.updateState({ citizenship: code });
    const treaty = getTreatyInfo(code);
    if (!treaty || !treaty.hasTreaty || !treaty.wageExemption) {
      // No treaty or no wage exemption — show result directly
      goSub(ctx, 'result');
    } else {
      goSub(ctx, 'income');
    }
  });
  container.querySelector('#btn-back')?.addEventListener('click', () => ctx.goToSection('form8843'));
  initIcons();
}

function renderIncomeStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const content = `
    <h3 class="text-h3 text-text mb-1">${t('treaty.income')}</h3>
    <p class="text-caption text-text-muted mb-4 flex items-center gap-1">
      <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> ${t('treaty.incomeHelp')}
    </p>
    <div class="relative">
      <span class="absolute left-3 top-3 text-body text-text-muted">$</span>
      <input id="treaty-income" type="number" min="0" step="100" class="w-full border-[1.5px] border-border rounded-medium p-3 pl-8 text-body text-text bg-surface" value="${state.incomeAmount || ''}" placeholder="15000" aria-label="${t('treaty.income')}">
    </div>
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = shell(ctx, 2, 2, content);

  container.querySelector('#btn-next')?.addEventListener('click', () => {
    const incomeInput = container.querySelector('#treaty-income') as HTMLInputElement;
    const income = parseFloat(incomeInput.value);
    if (isNaN(income) || income < 0) { incomeInput.classList.add('input-error', 'shake'); incomeInput.focus(); setTimeout(() => incomeInput.classList.remove('shake'), 300); return; }
    incomeInput.classList.remove('input-error');
    ctx.updateState({ incomeAmount: income });
    goSub(ctx, 'result');
  });
  container.querySelector('#btn-back')?.addEventListener('click', () => goSub(ctx, 'country'));
  initIcons();
}

function renderResultStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const lang = getLang();
  const countryCode = state.citizenship || '';
  const treaty = getTreatyInfo(countryCode);
  const income = state.incomeAmount || 0;

  // Check terminated treaties
  const terminated = TERMINATED_TREATIES[countryCode];

  let resultHtml = '';

  if (terminated) {
    // Terminated treaty
    const countryName = lang === 'zh' ? terminated.countryZh : terminated.country;
    const statusText = terminated.status === 'TERMINATED'
      ? (lang === 'zh' ? '终止' : 'terminated')
      : (lang === 'zh' ? '暂停' : 'suspended');
    resultHtml = `
      <div class="p-6 rounded-celebrate border-2 border-warning bg-[#FFF7ED] mb-6">
        <div class="flex items-center gap-3 mb-3">
          <i data-lucide="alert-triangle" class="w-7 h-7 text-warning"></i>
          <h2 class="text-h2 text-text">${t('treaty.terminated')}</h2>
        </div>
        <p class="text-body text-text-secondary">${t('treaty.terminatedDesc').replace('{country}', countryName).replace('{status}', statusText).replace('{date}', terminated.date)}</p>
        <p class="text-body text-text-secondary mt-3">${t('treaty.terminatedGuidance')}</p>
      </div>
    `;
  } else if (!treaty || !treaty.hasTreaty) {
    // No treaty
    resultHtml = `
      <div class="p-6 rounded-celebrate border-2 border-border bg-surface mb-6">
        <div class="flex items-center gap-3 mb-3">
          <i data-lucide="info" class="w-7 h-7 text-text-secondary"></i>
          <h2 class="text-h2 text-text">${t('treaty.noTreaty')}</h2>
        </div>
        <p class="text-body text-text-secondary mb-2">${t('treaty.noTreatyDesc')}</p>
        <p class="text-body text-text-secondary">${t('treaty.noTreatyStillFile')}</p>
      </div>
    `;
    ctx.updateState({ treatySavings: 0 });
  } else {
    // Has treaty — calculate savings
    const result = calculateTreatySavings(countryCode, income, calculateTax);
    const savings = result?.savings || 0;
    ctx.updateState({ treatySavings: savings });

    const countryName = lang === 'zh' ? treaty.countryZh : treaty.country;
    const savingsDisplay = savings > 0 ? `$${savings.toLocaleString()}` : '$0';

    // Special warnings
    let specialWarning = '';
    if (countryCode === 'CA' && income > 10000) {
      specialWarning = `<div class="flex items-start gap-2 p-3 bg-[#FFF7ED] rounded-medium mt-4"><i data-lucide="alert-triangle" class="w-4 h-4 text-warning mt-0.5 flex-shrink-0"></i><p class="text-caption text-warning">${t('treaty.canadaWarning')}</p></div>`;
    }
    if (countryCode === 'IN') {
      specialWarning = `<div class="flex items-start gap-2 p-3 bg-primary-light rounded-medium mt-4"><i data-lucide="info" class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"></i><p class="text-caption text-primary">${t('treaty.indiaStdDeduction').replace('{amount}', String(STANDARD_DEDUCTION_RA))}</p></div>`;
    }
    if (countryCode === 'CN') {
      specialWarning += `<div class="flex items-start gap-2 p-3 bg-primary-light rounded-medium mt-4"><i data-lucide="info" class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"></i><p class="text-caption text-primary">${t('treaty.chinaSurvivesRA')}</p></div>`;
    }

    resultHtml = `
      <div class="result-card-bg p-6 rounded-celebrate border-2 border-primary bg-gradient-to-br from-primary-light to-surface mb-6">
        <div class="flex items-center gap-2 mb-2">
          <i data-lucide="sparkles" class="w-6 h-6 text-accent"></i>
          <span class="text-body text-text-secondary">${t('treaty.savings')}</span>
        </div>
        <div class="count-up text-h1 text-primary font-extrabold mb-2" id="savings-number" aria-label="${savingsDisplay}">${savingsDisplay}</div>
        <p class="text-body text-text-secondary">${t('treaty.perYear')}</p>
        <p class="text-caption text-text-muted mt-2">${t('treaty.based').replace('{country}', countryName).replace('{article}', treaty.article || '')}</p>
      </div>

      ${result ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div class="p-4 border-[1.5px] border-border rounded-soft text-center">
            <p class="text-caption text-text-muted mb-1">${t('treaty.withTreaty')}</p>
            <p class="text-h2 text-primary font-bold">$${result.taxWithTreaty.toLocaleString()}</p>
          </div>
          <div class="p-4 border-[1.5px] border-border rounded-soft text-center">
            <p class="text-caption text-text-muted mb-1">${t('treaty.withoutTreaty')}</p>
            <p class="text-h2 text-text-secondary font-bold">$${result.taxWithout.toLocaleString()}</p>
          </div>
        </div>

        <div class="mb-6">
          <p class="text-body-sm text-text-secondary mb-1">${t('treaty.exemptAmount').replace('{amount}', result.exemptAmount.toLocaleString())}</p>
        </div>
      ` : ''}

      ${specialWarning}

      <!-- How to claim -->
      <div class="mt-6 space-y-3">
        <h3 class="text-body-sm font-semibold text-text">${t('treaty.howToClaim')}</h3>
        ${[t('treaty.claimStep1'), t('treaty.claimStep2'), t('treaty.claimStep3')].map((step, i) => `
          <div class="flex items-start gap-3 text-body text-text-secondary">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary-light text-primary text-sm font-semibold flex items-center justify-center">${i + 1}</span>
            <span>${step}</span>
          </div>
        `).join('')}
      </div>

      <a href="https://www.irs.gov/publications/p901" target="_blank" rel="noopener" class="text-caption text-primary hover:underline flex items-center gap-1 mt-4">
        <i data-lucide="external-link" class="w-3.5 h-3.5"></i> ${t('treaty.pub901')}
      </a>
    `;

    // Count-up animation
    if (savings > 0) {
      setTimeout(() => {
        const el = document.getElementById('savings-number');
        if (el) animateCountUp(el, savings, 800);
      }, 100);
    }
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

  container.querySelector('#btn-next')?.addEventListener('click', () => ctx.goToSection('fica'));
  container.querySelector('#btn-back')?.addEventListener('click', () => {
    const info = getTreatyInfo(countryCode);
    goSub(ctx, info && info.hasTreaty && info.wageExemption ? 'income' : 'country');
  });
  initIcons();
}

function animateCountUp(el: HTMLElement, target: number, duration: number): void {
  const start = performance.now();
  function update(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out
    const current = Math.round(target * eased);
    el.textContent = `$${current.toLocaleString()}`;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
