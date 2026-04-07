// Form 8843 Data Collection + PDF Generation Wizard
import { t, getLang } from '../i18n';
import { TAX_YEAR, IRS_MAILING_ADDRESS } from '../data/constants';
import { ALL_COUNTRIES } from '../data/treaties';
import { generateForm8843PDF } from '../utils/pdf';
import { initIcons } from '../utils/icons';
import { escAttr } from '../utils/sanitize';
import { wizardShell, showValidationError, clearValidationError } from './shared';
import type { WizardContext } from '../app';

type SubStep = 'name' | 'citizenship' | 'school' | 'days' | 'compliant' | 'result';

let currentSubStep: SubStep = 'name';

export function renderForm8843Wizard(ctx: WizardContext): void {
  currentSubStep = 'name';
  renderSubStep(ctx);
}

function renderSubStep(ctx: WizardContext): void {
  const renderers: Record<SubStep, () => void> = {
    name: () => renderNameStep(ctx),
    citizenship: () => renderCitizenshipStep(ctx),
    school: () => renderSchoolStep(ctx),
    days: () => renderDaysStep(ctx),
    compliant: () => renderCompliantStep(ctx),
    result: () => renderResultStep(ctx),
  };
  renderers[currentSubStep]();
}

function goSub(ctx: WizardContext, step: SubStep): void {
  currentSubStep = step;
  renderSubStep(ctx);
}

function shell(ctx: WizardContext, step: number, total: number, content: string): string {
  return wizardShell(ctx, step, total, 'file-text', 'nav.form8843', content);
}

function renderNameStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const content = `
    <h3 class="text-h3 text-text mb-1">${t('form8843.title')}</h3>
    <p class="text-body text-text-secondary mb-6">${t('form8843.subtitle')}</p>
    <div class="space-y-4">
      <div>
        <label class="text-body-sm text-text-secondary block mb-2">${t('form8843.name')}</label>
        <input id="f-name" type="text" class="w-full border-[1.5px] border-border rounded-medium p-3 text-body text-text bg-surface" value="${escAttr(state.fullName || '')}" placeholder="John Smith" aria-label="${t('form8843.name')}">
      </div>
      <div>
        <label class="text-body-sm text-text-secondary block mb-2">${t('form8843.address')}</label>
        <input id="f-address" type="text" class="w-full border-[1.5px] border-border rounded-medium p-3 text-body text-text bg-surface" value="${escAttr(state.usAddress || '')}" placeholder="123 Main St, City, State ZIP" aria-label="${t('form8843.address')}">
      </div>
      <div>
        <label class="text-body-sm text-text-secondary block mb-2">${t('form8843.ssn')}</label>
        <p class="text-caption text-text-muted mb-1">${t('form8843.ssnHelp')}</p>
        <input id="f-ssn" type="text" class="w-full border-[1.5px] border-border rounded-medium p-3 text-body text-text bg-surface" value="${escAttr(state.ssn || '')}" placeholder="XXX-XX-XXXX" aria-label="${t('form8843.ssn')}">
      </div>
    </div>
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = shell(ctx, 1, 5, content);

  container.querySelector('#btn-next')?.addEventListener('click', () => {
    const nameInput = container.querySelector('#f-name') as HTMLInputElement;
    const name = nameInput.value.trim();
    const address = (container.querySelector('#f-address') as HTMLInputElement).value.trim();
    const ssn = (container.querySelector('#f-ssn') as HTMLInputElement).value.trim();
    if (!name) { showValidationError(nameInput); return; }
    clearValidationError(nameInput);
    ctx.updateState({ fullName: name, usAddress: address, ssn: ssn || undefined });
    goSub(ctx, 'citizenship');
  });
  container.querySelector('#btn-back')?.addEventListener('click', () => ctx.goToSection('status'));
  initIcons();
}

function renderCitizenshipStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const lang = getLang();
  const content = `
    <h3 class="text-h3 text-text mb-4">${t('form8843.citizenship')}</h3>
    <div class="space-y-4">
      <div>
        <label class="text-body-sm text-text-secondary block mb-2">${t('form8843.citizenship')}</label>
        <select id="f-citizen" class="w-full border-[1.5px] border-border rounded-medium p-3 text-body text-text bg-surface" aria-label="${t('form8843.citizenship')}">
          <option value="">${t('treaty.selectCountry')}</option>
          ${ALL_COUNTRIES.filter(c => c.code !== 'OTHER').map(c => `<option value="${c.code}" ${state.citizenship === c.code ? 'selected' : ''}>${lang === 'zh' ? c.nameZh : c.name}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="text-body-sm text-text-secondary block mb-2">${t('form8843.taxResidence')}</label>
        <select id="f-taxres" class="w-full border-[1.5px] border-border rounded-medium p-3 text-body text-text bg-surface" aria-label="${t('form8843.taxResidence')}">
          <option value="">${t('treaty.selectCountry')}</option>
          ${ALL_COUNTRIES.filter(c => c.code !== 'OTHER').map(c => `<option value="${c.code}" ${(state.taxResidence || state.citizenship) === c.code ? 'selected' : ''}>${lang === 'zh' ? c.nameZh : c.name}</option>`).join('')}
        </select>
      </div>
    </div>
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = shell(ctx, 2, 5, content);

  container.querySelector('#btn-next')?.addEventListener('click', () => {
    const citizenSelect = container.querySelector('#f-citizen') as HTMLSelectElement;
    const citizen = citizenSelect.value;
    const taxRes = (container.querySelector('#f-taxres') as HTMLSelectElement).value;
    if (!citizen) { showValidationError(citizenSelect); return; }
    clearValidationError(citizenSelect);
    ctx.updateState({ citizenship: citizen, taxResidence: taxRes || citizen });
    goSub(ctx, 'school');
  });
  container.querySelector('#btn-back')?.addEventListener('click', () => goSub(ctx, 'name'));
  initIcons();
}

function renderSchoolStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const content = `
    <h3 class="text-h3 text-text mb-4">${t('form8843.school')}</h3>
    <div class="space-y-4">
      <div>
        <label class="text-body-sm text-text-secondary block mb-2">${t('form8843.school')}</label>
        <input id="f-school" type="text" class="w-full border-[1.5px] border-border rounded-medium p-3 text-body text-text bg-surface" value="${escAttr(state.schoolName || '')}" placeholder="University of California, Los Angeles" aria-label="${t('form8843.school')}">
      </div>
      <div>
        <label class="text-body-sm text-text-secondary block mb-2">${t('form8843.schoolAddress')}</label>
        <input id="f-school-addr" type="text" class="w-full border-[1.5px] border-border rounded-medium p-3 text-body text-text bg-surface" value="${escAttr(state.schoolAddress || '')}" placeholder="405 Hilgard Ave, Los Angeles, CA 90095" aria-label="${t('form8843.schoolAddress')}">
      </div>
    </div>
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = shell(ctx, 3, 5, content);

  container.querySelector('#btn-next')?.addEventListener('click', () => {
    const schoolInput = container.querySelector('#f-school') as HTMLInputElement;
    const school = schoolInput.value.trim();
    const addr = (container.querySelector('#f-school-addr') as HTMLInputElement).value.trim();
    if (!school) { showValidationError(schoolInput); return; }
    clearValidationError(schoolInput);
    ctx.updateState({ schoolName: school, schoolAddress: addr });
    goSub(ctx, 'days');
  });
  container.querySelector('#btn-back')?.addEventListener('click', () => goSub(ctx, 'citizenship'));
  initIcons();
}

function renderDaysStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  // Auto-calculate days based on entry date
  let defaultDays = 365;
  if (state.entryYear === TAX_YEAR && state.entryMonth) {
    const entryDate = new Date(TAX_YEAR, state.entryMonth - 1, 1);
    const endOfYear = new Date(TAX_YEAR, 11, 31);
    defaultDays = Math.ceil((endOfYear.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
  }
  const days = state.daysPresent || defaultDays;

  const content = `
    <h3 class="text-h3 text-text mb-1">${t('form8843.daysPresent').replace('{year}', String(TAX_YEAR))}</h3>
    <p class="text-caption text-text-muted mb-4 flex items-center gap-1">
      <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> ${t('form8843.daysHelp')}
    </p>
    <input id="f-days" type="number" min="1" max="366" class="w-full border-[1.5px] border-border rounded-medium p-3 text-body text-text bg-surface" value="${days}" aria-label="${t('form8843.daysPresent').replace('{year}', String(TAX_YEAR))}">
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = shell(ctx, 4, 5, content);

  container.querySelector('#btn-next')?.addEventListener('click', () => {
    const daysInput = container.querySelector('#f-days') as HTMLInputElement;
    const d = parseInt(daysInput.value);
    if (!d || d < 1 || d > 366) { showValidationError(daysInput); return; }
    clearValidationError(daysInput);
    ctx.updateState({ daysPresent: d });
    goSub(ctx, 'compliant');
  });
  container.querySelector('#btn-back')?.addEventListener('click', () => goSub(ctx, 'school'));
  initIcons();
}

function renderCompliantStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const content = `
    <h3 class="text-h3 text-text mb-1">${t('form8843.compliant')}</h3>
    <p class="text-caption text-text-muted mb-4 flex items-center gap-1">
      <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> ${t('form8843.compliantHelp')}
    </p>
    <div class="space-y-3">
      ${ctx.renderOptionCard('yes', t('common.yes'), state.visaCompliant === true, 'check')}
      ${ctx.renderOptionCard('no', t('common.no'), state.visaCompliant === false, 'x')}
    </div>
    ${ctx.renderNav({ showBack: true })}
  `;

  container.innerHTML = shell(ctx, 5, 5, content);

  container.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const opt = (card as HTMLElement).dataset.option;
      ctx.updateState({ visaCompliant: opt === 'yes' });
      goSub(ctx, 'result');
    });
  });

  container.querySelector('#btn-back')?.addEventListener('click', () => goSub(ctx, 'days'));
  initIcons();
}

function renderResultStep(ctx: WizardContext): void {
  const { container, state } = ctx;
  const lang = getLang();
  const year = TAX_YEAR + 1;
  const addr = IRS_MAILING_ADDRESS;
  const addrStr = `${addr.name}\n${addr.line1}\n${addr.city}, ${addr.state} ${addr.zip}`;
  const hasIncome = state.hasIncome;

  container.innerHTML = `
    <div class="max-w-[640px] mx-auto px-4 sm:px-0 py-12">
      <div class="wizard-panel bg-surface rounded-sharp shadow-wizard p-6 sm:p-8">
        <div class="result-enter">
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-4">
              <i data-lucide="check-circle" class="w-8 h-8 text-primary check-bounce"></i>
            </div>
            <h2 class="text-h1 text-text">${t('form8843.ready')}</h2>
            <p class="text-body text-text-secondary">${t('form8843.readySubtext')}</p>
          </div>

          <!-- Download button -->
          <button id="btn-download" class="btn-primary w-full px-8 py-4 rounded-pill bg-primary text-white text-btn font-semibold flex items-center justify-center gap-2 mb-6">
            <i data-lucide="download" class="w-5 h-5"></i> ${t('common.download')}
          </button>

          <!-- Mail address -->
          <div class="border-[1.5px] border-border rounded-soft p-4 mb-6">
            <h3 class="text-body-sm font-semibold text-text mb-2 flex items-center gap-2">
              <i data-lucide="mail" class="w-4 h-4 text-text-secondary"></i> ${t('form8843.mailTo')}
            </h3>
            <pre class="text-body text-text font-mono text-sm whitespace-pre-line">${addrStr}</pre>
            <button id="btn-copy-addr" class="mt-2 text-caption text-primary hover:underline flex items-center gap-1">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i> ${t('common.copy')}
            </button>
          </div>

          <!-- Deadline -->
          <div class="flex items-center gap-2 mb-1 text-body-sm text-warning font-semibold">
            <i data-lucide="calendar-clock" class="w-4 h-4"></i>
            ${t('form8843.deadline').replace('{year}', String(year))}
          </div>
          ${hasIncome ? `<p class="text-caption text-text-muted ml-6">${t('form8843.deadlineWithWages').replace('{year}', String(year))}</p>` : ''}

          <!-- Checklist -->
          <div class="mt-6 space-y-3">
            <h3 class="text-body-sm font-semibold text-text">${t('form8843.whatNext')}</h3>
            ${[t('form8843.step1'), t('form8843.step2'), t('form8843.step3'), t('form8843.step4')].map((step, i) => `
              <div class="flex items-start gap-3 text-body text-text-secondary">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-primary-light text-primary text-sm font-semibold flex items-center justify-center">${i + 1}</span>
                <span>${step}</span>
              </div>
            `).join('')}
          </div>
        </div>

        ${ctx.renderNav({ showBack: true, nextLabel: hasIncome ? t('form8843.continueToTreaty') : t('common.continue') })}
      </div>
      ${ctx.renderDisclaimer()}
    </div>
  `;

  // Download PDF
  container.querySelector('#btn-download')?.addEventListener('click', async () => {
    const btn = container.querySelector('#btn-download') as HTMLButtonElement;
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-pulse">${t('form8843.generating')}</span>`;
    try {
      await generateForm8843PDF(state);
      btn.disabled = false;
      btn.innerHTML = `<span class="flex items-center gap-2"><i data-lucide="check-circle" class="w-5 h-5"></i> ${t('form8843.downloaded')}</span>`;
      initIcons();
    } catch (err) {
      console.error('PDF generation failed:', err);
      btn.innerHTML = `<span class="text-error">${t('form8843.pdfError')}</span>`;
      btn.disabled = false;
    }
  });

  // Copy address
  container.querySelector('#btn-copy-addr')?.addEventListener('click', () => {
    navigator.clipboard.writeText(addrStr.replace(/\n/g, ', '));
    const btn = container.querySelector('#btn-copy-addr');
    if (btn) btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i> ${t('common.copied')}`;
  });

  // Navigation
  container.querySelector('#btn-next')?.addEventListener('click', () => {
    const s = ctx.updateState({});
    if (s.hasIncome) {
      ctx.goToSection('treaty');
    } else {
      ctx.goToSection('year5');
    }
  });
  container.querySelector('#btn-back')?.addEventListener('click', () => goSub(ctx, 'compliant'));
  initIcons();
}
