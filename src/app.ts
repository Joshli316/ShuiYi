// ShuiYi 税易 — Main Application Controller
import { t, getLang, setLang, initLang, onLangChange } from './i18n';
import { loadState, saveState, clearState, WizardState } from './utils/storage';
import { renderStatusWizard } from './wizard/status';
import { renderForm8843Wizard } from './wizard/form8843';
import { renderTreatyWizard } from './wizard/treaty';
import { renderFICAWizard } from './wizard/fica';
import { renderYear5 } from './wizard/year5';
import { renderImmigration } from './wizard/immigration';
import { STATES } from './data/states';
import { TREATY_DATA } from './data/treaties';
import { TAX_YEAR } from './data/constants';
import { initIcons } from './utils/icons';

// Wizard context passed to each module
export interface WizardContext {
  container: HTMLElement;
  state: WizardState;
  updateState: (updates: Partial<WizardState>) => WizardState;
  goToSection: (section: string) => void;
  renderProgressBar: (step: number, total: number, subtitle?: string) => string;
  renderNav: (opts: { showBack?: boolean; nextLabel?: string; nextId?: string; backId?: string }) => string;
  renderDisclaimer: () => string;
  renderOptionCard: (id: string, label: string, selected: boolean, icon?: string) => string;
}

// Section definitions
type SectionRenderer = (ctx: WizardContext) => void;

const sections: Record<string, SectionRenderer> = {
  landing: renderLanding,
  status: renderStatusWizard,
  form8843: renderForm8843Wizard,
  treaty: renderTreatyWizard,
  fica: renderFICAWizard,
  year5: renderYear5,
  immigration: renderImmigration,
  state: renderStateTax,
  summary: renderSummary,
};

// Section flow for NRA path
const NRA_FLOW = ['status', 'form8843', 'treaty', 'fica', 'year5', 'immigration', 'state', 'summary'];
const NRA_NO_INCOME_FLOW = ['status', 'form8843', 'year5', 'immigration', 'state', 'summary'];
const RA_FLOW = ['status', 'immigration', 'state', 'summary'];

function getFlow(state: WizardState): string[] {
  if (state.taxStatus === 'RA') return RA_FLOW;
  if (state.hasIncome === false) return NRA_NO_INCOME_FLOW;
  return NRA_FLOW;
}

function getNextSection(current: string, state: WizardState): string | null {
  const flow = getFlow(state);
  const idx = flow.indexOf(current);
  if (idx === -1 || idx >= flow.length - 1) return null;
  return flow[idx + 1];
}

function getPrevSection(current: string, state: WizardState): string | null {
  const flow = getFlow(state);
  const idx = flow.indexOf(current);
  if (idx <= 0) return null;
  return flow[idx - 1];
}

// App initialization
function init(): void {
  // Register lang change listener BEFORE initLang so it fires on initial load
  onLangChange(() => {
    updateLangToggle();
    updateFooter();
    const s = loadState();
    goToSection(s.currentSection || 'landing');
  });

  initLang();
  setupLangToggle();
  setupDarkMode();
  setupLogoClick();

  // Render initial section + update footer for current lang
  updateFooter();
  const state = loadState();
  const section = state.currentSection || 'landing';
  goToSection(section);

  initIcons();
}

function setupLogoClick(): void {
  const logo = document.getElementById('header-logo');
  logo?.addEventListener('click', (e) => {
    e.preventDefault();
    goToSection('landing');
  });
}

function setupLangToggle(): void {
  const btn = document.getElementById('lang-toggle');
  btn?.addEventListener('click', () => {
    setLang(getLang() === 'en' ? 'zh' : 'en');
  });
  updateLangToggle();
}

function updateLangToggle(): void {
  const label = document.getElementById('lang-label');
  if (label) label.textContent = t('lang.toggle');
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.setAttribute('aria-label', getLang() === 'en' ? 'Switch to Chinese (中文)' : '切换到英文 (English)');
}

function setupDarkMode(): void {
  const btn = document.getElementById('dark-toggle');
  const state = loadState();
  if (state.darkMode) {
    document.documentElement.classList.add('dark');
  }
  btn?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    saveState({ darkMode: isDark });
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('aria-pressed', String(isDark));
    // Update icon
    const icon = btn.querySelector('[data-lucide]');
    if (icon) {
      icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
      initIcons();
    }
  });
}

function updateFooter(): void {
  const disclaimer = document.getElementById('footer-disclaimer');
  if (disclaimer) disclaimer.textContent = t('disclaimer.text');
  const free = document.getElementById('footer-free');
  if (free) free.textContent = getLang() === 'zh' ? '免费开源。' : 'Free and open source.';
  const sources = document.getElementById('footer-sources');
  if (sources) {
    const label = t('footer.sources');
    sources.innerHTML = `${label} <a href="https://www.irs.gov/individuals/international-taxpayers" class="text-primary hover:underline" target="_blank" rel="noopener">IRS.gov</a> &middot; <a href="https://www.irs.gov/publications/p901" class="text-primary hover:underline" target="_blank" rel="noopener">Publication 901</a> &middot; <a href="https://www.irs.gov/publications/p519" class="text-primary hover:underline" target="_blank" rel="noopener">Publication 519</a>`;
  }
}

function goToSection(sectionId: string): void {
  const container = document.getElementById('app');
  if (!container) return;

  saveState({ currentSection: sectionId });
  const state = loadState();

  const ctx: WizardContext = {
    container,
    state,
    updateState: (updates) => {
      const merged = saveState(updates);
      ctx.state = merged;
      return merged;
    },
    goToSection,
    renderProgressBar,
    renderNav,
    renderDisclaimer,
    renderOptionCard,
  };

  const renderer = sections[sectionId];
  if (renderer) {
    renderer(ctx);
    initIcons();
    // Add Space key support to all option cards
    container.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === ' ') { e.preventDefault(); (card as HTMLElement).click(); }
      });
    });
    // Focus first interactive element for keyboard/screen reader users
    setTimeout(() => {
      const target = container.querySelector('input, select, [role="button"], button:not([id="dark-toggle"]):not([id="lang-toggle"])') as HTMLElement;
      if (target) target.focus({ preventScroll: true });
    }, 320);
  }
}

// Shared rendering helpers
function renderProgressBar(step: number, total: number, subtitle?: string): string {
  const pct = Math.round((step / total) * 100);
  const lang = getLang();
  const stepLabel = lang === 'zh'
    ? `${t('progress.step')}${step}${t('progress.of')}${total}${t('progress.ofSuffix')}`
    : `${t('progress.step')} ${step} ${t('progress.of')} ${total}`;

  let encouragement = '';
  if (!subtitle) {
    if (step === 1) encouragement = t('progress.greatStart');
    else if (step === total) encouragement = t('progress.almostThere');
    else if (step >= total / 2) encouragement = t('progress.halfway');
    else encouragement = t('progress.keepGoing');
  }

  return `
    <div class="progress-bar-container mb-6">
      <div class="flex justify-between items-center mb-2">
        <span class="text-caption text-text-secondary">${stepLabel}</span>
      </div>
      <div class="w-full h-1.5 bg-border rounded-pill overflow-hidden" role="progressbar" aria-valuenow="${step}" aria-valuemin="0" aria-valuemax="${total}" aria-label="${stepLabel}">
        <div class="progress-fill h-full bg-primary rounded-pill" style="width: ${pct}%"></div>
      </div>
      <p class="text-caption text-text-secondary italic mt-1">${subtitle || encouragement}</p>
    </div>
  `;
}

function renderNav(opts: { showBack?: boolean; nextLabel?: string; nextId?: string; backId?: string }): string {
  const { showBack = true, nextLabel, nextId = 'btn-next', backId = 'btn-back' } = opts;
  return `
    <div class="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mt-8 pt-6 border-t border-border">
      ${showBack ? `
        <button id="${backId}" class="btn-ghost w-full sm:w-auto px-8 py-3 rounded-pill border-[1.5px] border-primary text-primary text-btn font-semibold">
          ${t('common.back')}
        </button>
      ` : '<div></div>'}
      <button id="${nextId}" class="btn-primary w-full sm:w-auto px-8 py-3 rounded-pill bg-primary text-white text-btn font-semibold">
        ${nextLabel || t('common.next')}
      </button>
    </div>
  `;
}

function renderDisclaimer(): string {
  return `
    <div class="disclaimer-banner bg-[#F9FAFB] border-l-[3px] border-text-muted p-4 rounded-r-medium mt-8">
      <div class="flex items-start gap-2">
        <i data-lucide="info" class="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0"></i>
        <p class="text-caption text-text-muted">${t('disclaimer.text')}</p>
      </div>
    </div>
  `;
}

function renderOptionCard(id: string, label: string, selected: boolean, icon?: string): string {
  return `
    <div class="option-card ${selected ? 'selected' : ''} border-[1.5px] border-border rounded-soft p-4 flex items-center gap-3 min-h-[48px]" data-option="${id}" role="button" tabindex="0" aria-pressed="${selected}">
      ${icon ? `<i data-lucide="${icon}" class="w-5 h-5 text-text-secondary flex-shrink-0"></i>` : ''}
      <span class="flex-1 text-body text-text">${label}</span>
      ${selected ? '<i data-lucide="check-circle" class="w-5 h-5 text-primary check-bounce flex-shrink-0"></i>' : '<div class="w-5 h-5 flex-shrink-0"></div>'}
    </div>
  `;
}

// === LANDING PAGE ===
function renderLanding(ctx: WizardContext): void {
  const { container } = ctx;
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="landing-hero bg-gradient-to-br from-primary-light to-bg py-12 sm:py-24 px-4">
      <div class="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div class="flex-1 text-left">
          <h1 class="text-h1 sm:text-display text-text mb-4 leading-tight">${t('landing.heroQuestion')}</h1>
          <p class="text-body text-text-secondary mb-8 max-w-lg">${t('landing.heroSubtext')}</p>
          <button id="cta-start" class="btn-primary px-10 py-4 rounded-pill bg-primary text-white text-btn font-semibold text-lg">
            ${t('landing.cta')}
          </button>
          <p class="text-caption text-text-muted mt-4 flex items-center gap-1.5">
            <i data-lucide="lock" class="w-3.5 h-3.5"></i> ${t('landing.privacy')}
          </p>
        </div>
        <div class="flex-1 hidden lg:flex justify-center">
          <div class="wizard-panel bg-surface rounded-sharp shadow-wizard p-8 w-full max-w-sm opacity-80">
            <div class="flex items-center gap-2 mb-4">
              <i data-lucide="badge-check" class="w-5 h-5 text-primary"></i>
              <span class="text-h3 text-text">${t('nav.status')}</span>
            </div>
            <div class="space-y-3">
              <div class="h-3 bg-primary-light rounded w-3/4"></div>
              <div class="h-3 bg-border rounded w-full"></div>
              <div class="h-3 bg-border rounded w-5/6"></div>
            </div>
            <div class="mt-6 h-1.5 bg-border rounded-pill">
              <div class="h-full bg-primary rounded-pill w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Value Props -->
    <section class="py-16 px-4">
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-soft bg-primary-light flex-shrink-0">
            <i data-lucide="badge-check" class="w-6 h-6 text-primary"></i>
          </div>
          <div>
            <h3 class="text-h3 text-text mb-1">${t('landing.value1Title')}</h3>
            <p class="text-body text-text-secondary">${t('landing.value1Desc')}</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-soft bg-primary-light flex-shrink-0">
            <i data-lucide="file-text" class="w-6 h-6 text-primary"></i>
          </div>
          <div>
            <h3 class="text-h3 text-text mb-1">${t('landing.value2Title')}</h3>
            <p class="text-body text-text-secondary">${t('landing.value2Desc')}</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-soft bg-primary-light flex-shrink-0">
            <i data-lucide="calculator" class="w-6 h-6 text-primary"></i>
          </div>
          <div>
            <h3 class="text-h3 text-text mb-1">${t('landing.value3Title')}</h3>
            <p class="text-body text-text-secondary">${t('landing.value3Desc')}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Proof -->
    <section class="py-12 px-4 bg-surface border-y border-border">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-body text-text-secondary mb-6">${t('landing.socialProof')}</p>
        <div class="flex flex-wrap justify-center gap-8 text-h3 font-semibold text-primary">
          <span>${t('landing.stats1')}</span>
          <span class="text-accent">${t('landing.stats2')}</span>
          <span>${t('landing.stats3')}</span>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16 px-4">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-h2 text-text mb-8 text-left">${t('landing.faqTitle')}</h2>
        <div class="space-y-4" id="landing-faq">
          ${['1','2','3','4','5'].map(n => `
            <div class="border-[1.5px] border-border rounded-soft overflow-hidden">
              <button class="landing-faq-trigger w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-[#F9FAFB] transition-colors min-h-[48px]" aria-expanded="false" aria-controls="lfaq-${n}">
                <span class="text-body-sm font-semibold text-text">${t('landing.faq' + n + 'q')}</span>
                <i data-lucide="chevron-down" class="w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200"></i>
              </button>
              <div id="lfaq-${n}" class="accordion-content">
                <div class="px-4 pb-4 pt-1 border-t border-border">
                  <p class="text-body text-text-secondary">${t('landing.faq' + n + 'a')}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Encouragement -->
    <section class="py-12 px-4">
      <div class="max-w-2xl mx-auto text-center">
        <p class="text-h2 text-text mb-6">${t('landing.taxSeason')}</p>
        <button id="cta-start-2" class="btn-primary px-10 py-4 rounded-pill bg-primary text-white text-btn font-semibold text-lg">
          ${t('landing.cta')}
        </button>
      </div>
    </section>
  `;

  // Event listeners
  const start1 = container.querySelector('#cta-start');
  const start2 = container.querySelector('#cta-start-2');
  const handler = () => {
    const { darkMode } = loadState();
    clearState();
    if (darkMode) saveState({ darkMode });
    goToSection('status');
  };
  start1?.addEventListener('click', handler);
  start2?.addEventListener('click', handler);

  // FAQ accordion
  container.querySelectorAll('.landing-faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = document.getElementById(trigger.getAttribute('aria-controls') || '');
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const chevron = trigger.querySelector('[data-lucide="chevron-down"]');

      // Close all others
      container.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
      container.querySelectorAll('.landing-faq-trigger').forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        const ch = t.querySelector('[data-lucide="chevron-down"]');
        if (ch) (ch as HTMLElement).style.transform = '';
      });

      if (!expanded && content) {
        content.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        if (chevron) (chevron as HTMLElement).style.transform = 'rotate(180deg)';
      }
    });
  });
}

// === STATE TAX ===
function renderStateTax(ctx: WizardContext): void {
  const { container, state, updateState } = ctx;
  const lang = getLang();

  container.innerHTML = `
    <div class="max-w-[640px] mx-auto px-4 sm:px-0 py-12">
      <div class="wizard-panel bg-surface rounded-sharp shadow-wizard p-6 sm:p-8">
        <div class="flex items-center gap-2 mb-2">
          <i data-lucide="map-pin" class="w-5 h-5 text-primary"></i>
          <h2 class="text-h2 text-text">${t('state.title')}</h2>
        </div>
        <p class="text-body text-text-secondary mb-6">${t('state.subtitle')}</p>

        <label class="text-body-sm text-text-secondary block mb-2">${t('state.select')}</label>
        <select id="state-select" class="w-full border-[1.5px] border-border rounded-medium p-3 text-body text-text bg-surface">
          <option value="">${t('state.selectPlaceholder')}</option>
          ${[...STATES].sort((a, b) => a.name.localeCompare(b.name)).map(s =>
            `<option value="${s.code}" ${state.stateCode === s.code ? 'selected' : ''}>${lang === 'zh' ? s.nameZh : s.name}</option>`
          ).join('')}
        <\/select>

        <div id="state-result" class="mt-6"></div>

        ${ctx.renderNav({ showBack: true, nextLabel: t('common.continue'), nextId: 'btn-next' })}
      </div>
      ${ctx.renderDisclaimer()}
    </div>
  `;

  const select = container.querySelector('#state-select') as HTMLSelectElement;
  const result = container.querySelector('#state-result') as HTMLElement;

  function showResult(code: string) {
    const stateInfo = STATES.find(s => s.code === code);
    if (!stateInfo) { result.innerHTML = ''; return; }

    updateState({ stateCode: code });

    if (!stateInfo.hasIncomeTax) {
      result.innerHTML = `
        <div class="result-enter bg-primary-light border-2 border-primary rounded-celebrate p-6">
          <div class="flex items-center gap-2 mb-2">
            <i data-lucide="check-circle" class="w-5 h-5 text-success"></i>
            <h3 class="text-h3 text-text">${t('state.noTax')}</h3>
          </div>
          <p class="text-body text-text-secondary">${t('state.noTaxDesc').replace('{state}', lang === 'zh' ? stateInfo.nameZh : stateInfo.name)}</p>
        </div>
      `;
    } else {
      const treatyHtml = stateInfo.honorsTreaties
        ? `<div class="flex items-center gap-2 text-success"><i data-lucide="check-circle" class="w-4 h-4"></i><span class="text-body-sm">${t('state.honorsTreaties')}</span></div>
           <p class="text-caption text-text-secondary mt-1">${t('state.honorsDesc')}</p>`
        : `<div class="flex items-center gap-2 text-warning"><i data-lucide="alert-triangle" class="w-4 h-4"></i><span class="text-body-sm font-semibold">${t('state.noTreaty')}</span></div>
           <p class="text-caption text-text-secondary mt-1">${t('state.noTreatyDesc').replace('{savings}', state.treatySavings ? `$${state.treatySavings}` : '')}</p>`;

      const notes = stateInfo.notes ? `<p class="text-caption text-text-secondary mt-3">${lang === 'zh' ? (stateInfo.notesZh || stateInfo.notes) : stateInfo.notes}</p>` : '';
      const form = stateInfo.nraForm ? `<p class="text-body-sm text-text mt-3"><strong>${t('state.form')}</strong> ${stateInfo.nraForm}</p>` : '';

      result.innerHTML = `
        <div class="result-enter border-[1.5px] border-border rounded-soft p-6">
          <div class="flex items-center gap-2 mb-3">
            <i data-lucide="building-2" class="w-5 h-5 text-text-secondary"></i>
            <h3 class="text-h3 text-text">${t('state.hasTax')}</h3>
          </div>
          ${treatyHtml}
          ${form}
          ${notes}
        </div>
      `;
    }
    initIcons();
  }

  if (state.stateCode) showResult(state.stateCode);

  select.addEventListener('change', () => showResult(select.value));

  container.querySelector('#btn-next')?.addEventListener('click', () => {
    goToSection(getNextSection('state', loadState()) || 'summary');
  });
  container.querySelector('#btn-back')?.addEventListener('click', () => {
    goToSection(getPrevSection('state', loadState()) || 'immigration');
  });
}

// === SUMMARY ===
function renderSummary(ctx: WizardContext): void {
  const { container, state } = ctx;
  const lang = getLang();
  const year = TAX_YEAR + 1;

  const items: string[] = [];

  // Status
  const statusLabel = state.taxStatus === 'NRA'
    ? (lang === 'zh' ? '非居民外国人 (NRA)' : 'Nonresident Alien (NRA)')
    : (lang === 'zh' ? '居民外国人 (RA)' : 'Resident Alien (RA)');
  items.push(`<li class="flex items-start gap-3"><i data-lucide="badge-check" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"></i><span>${t('summary.status').replace('{status}', statusLabel)}</span></li>`);

  // Form 8843 (NRA only)
  if (state.taxStatus === 'NRA') {
    items.push(`<li class="flex items-start gap-3"><i data-lucide="file-text" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"></i><span>${t('summary.fileForm8843')}</span></li>`);
  }

  // 1040-NR (NRA with income)
  if (state.taxStatus === 'NRA' && state.hasIncome) {
    items.push(`<li class="flex items-start gap-3"><i data-lucide="file-text" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"></i><span>${t('summary.file1040NR')}</span></li>`);
  }

  // RA-specific items
  if (state.taxStatus === 'RA') {
    items.push(`<li class="flex items-start gap-3"><i data-lucide="file-text" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"></i><span>${t('summary.file1040')}</span></li>`);
    items.push(`<li class="flex items-start gap-3"><i data-lucide="receipt" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"></i><span>${t('summary.standardDeduction')}</span></li>`);
    items.push(`<li class="flex items-start gap-3"><i data-lucide="globe" class="w-5 h-5 text-warning mt-0.5 flex-shrink-0"></i><span>${t('summary.worldwideIncome')}</span></li>`);
    items.push(`<li class="flex items-start gap-3"><i data-lucide="monitor" class="w-5 h-5 text-success mt-0.5 flex-shrink-0"></i><span>${t('summary.raSoftware')}</span></li>`);
  }

  // Treaty
  if (state.treatySavings && state.treatySavings > 0 && state.citizenship) {
    const treaty = TREATY_DATA[state.citizenship];
    const article = treaty?.article || '';
    items.push(`<li class="flex items-start gap-3"><i data-lucide="calculator" class="w-5 h-5 text-accent mt-0.5 flex-shrink-0"></i><span class="font-semibold text-primary">${t('summary.claimTreaty').replace('{amount}', state.treatySavings.toLocaleString()).replace('{article}', article)}</span></li>`);
  }

  // FICA refund
  if (state.ficaRefundAmount && state.ficaRefundAmount > 0) {
    items.push(`<li class="flex items-start gap-3"><i data-lucide="wallet" class="w-5 h-5 text-accent mt-0.5 flex-shrink-0"></i><span class="font-semibold text-primary">${t('summary.ficaRefund').replace('{amount}', state.ficaRefundAmount.toLocaleString())}</span></li>`);
  }

  // State return
  if (state.stateCode) {
    const si = STATES.find(s => s.code === state.stateCode);
    if (si && si.hasIncomeTax && si.nraForm) {
      items.push(`<li class="flex items-start gap-3"><i data-lucide="map-pin" class="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0"></i><span>${t('summary.stateReturn').replace('{state}', lang === 'zh' ? si.nameZh : si.name).replace('{form}', si.nraForm)}</span></li>`);
    }
  }

  // Deadlines
  if (state.hasIncome || state.taxStatus === 'RA') {
    items.push(`<li class="flex items-start gap-3"><i data-lucide="calendar-clock" class="w-5 h-5 text-warning mt-0.5 flex-shrink-0"></i><span class="font-semibold">${t('summary.deadlineApril').replace('{year}', String(year))}</span></li>`);
  }
  if (state.taxStatus === 'NRA') {
    items.push(`<li class="flex items-start gap-3"><i data-lucide="calendar-clock" class="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0"></i><span>${t('summary.deadlineJune').replace('{year}', String(year))}</span></li>`);
  }

  // CPA
  items.push(`<li class="flex items-start gap-3"><i data-lucide="user-check" class="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0"></i><span>${t('summary.consultCPA')}</span></li>`);

  container.innerHTML = `
    <div class="max-w-[640px] mx-auto px-4 sm:px-0 py-12">
      <div class="wizard-panel bg-surface rounded-sharp shadow-wizard p-6 sm:p-8">
        <div class="flex items-center gap-2 mb-2">
          <i data-lucide="check-circle" class="w-6 h-6 text-success"></i>
          <h2 class="text-h2 text-text">${t('summary.title')}</h2>
        </div>
        <p class="text-body text-text-secondary mb-6">${t('summary.subtitle')}</p>

        <ul class="space-y-4 text-body text-text">
          ${items.join('')}
        </ul>

        <div class="mt-8 p-6 bg-primary-light rounded-celebrate text-center result-enter">
          <p class="text-h2 text-primary mb-2">${t('summary.done')}</p>
          <button id="btn-share" class="btn-ghost px-6 py-3 rounded-pill border-[1.5px] border-primary text-primary text-btn font-semibold mt-2">
            <span class="flex items-center gap-2"><i data-lucide="share-2" class="w-4 h-4"></i> ${t('summary.shareText')}</span>
          </button>
        </div>

        <div class="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mt-8 pt-6 border-t border-border">
          <button id="btn-back" class="btn-ghost w-full sm:w-auto px-8 py-3 rounded-pill border-[1.5px] border-primary text-primary text-btn font-semibold">
            ${t('common.back')}
          </button>
          <button id="btn-restart" class="btn-primary w-full sm:w-auto px-8 py-3 rounded-pill bg-primary text-white text-btn font-semibold">
            ${t('common.startOver')}
          </button>
        </div>
      </div>
      ${ctx.renderDisclaimer()}
    </div>
  `;

  container.querySelector('#btn-back')?.addEventListener('click', () => {
    goToSection(getPrevSection('summary', loadState()) || 'state');
  });
  container.querySelector('#btn-restart')?.addEventListener('click', () => {
    if (!confirm(t('summary.confirmRestart'))) return;
    const { darkMode } = loadState();
    clearState();
    if (darkMode) saveState({ darkMode });
    goToSection('landing');
  });
  container.querySelector('#btn-share')?.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({ title: 'ShuiYi 税易', text: lang === 'zh' ? '我刚用税易5分钟搞清楚了报税，你也试试' : 'I just figured out my US taxes in 5 minutes with ShuiYi — you should try it', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      const btn = container.querySelector('#btn-share');
      if (btn) btn.innerHTML = `<span class="flex items-center gap-2"><i data-lucide="check" class="w-4 h-4"></i> ${t('common.copied')}</span>`;
    }
  });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const tag = (document.activeElement as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    const next = document.getElementById('btn-next');
    if (next && !next.hasAttribute('disabled')) next.click();
  }
});

// Start the app
document.addEventListener('DOMContentLoaded', init);
