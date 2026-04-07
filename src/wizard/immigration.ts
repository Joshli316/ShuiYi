// Immigration Risk Explainer — FAQ accordion format
import { t, getLang } from '../i18n';
import { loadState } from '../utils/storage';
import { initIcons } from '../utils/icons';
import type { WizardContext } from '../app';

interface FAQ {
  questionKey: string;
  answerKey: string;
  risk: 'low' | 'moderate' | 'high';
  icon: string;
}

const faqs: FAQ[] = [
  { questionKey: 'immigration.q1', answerKey: 'immigration.a1', risk: 'low', icon: 'stamp' },
  { questionKey: 'immigration.q2', answerKey: 'immigration.a2', risk: 'moderate', icon: 'briefcase' },
  { questionKey: 'immigration.q3', answerKey: 'immigration.a3', risk: 'low', icon: 'building-2' },
  { questionKey: 'immigration.q4', answerKey: 'immigration.a4', risk: 'high', icon: 'shield-check' },
  { questionKey: 'immigration.q5', answerKey: 'immigration.a5', risk: 'low', icon: 'edit' },
  { questionKey: 'immigration.q6', answerKey: 'immigration.a6', risk: 'moderate', icon: 'file-text' },
  { questionKey: 'immigration.q7', answerKey: 'immigration.a7', risk: 'low', icon: 'lock' },
];

const myths = [
  { mythKey: 'immigration.myth1', realityKey: 'immigration.reality1' },
  { mythKey: 'immigration.myth2', realityKey: 'immigration.reality2' },
  { mythKey: 'immigration.myth3', realityKey: 'immigration.reality3' },
  { mythKey: 'immigration.myth4', realityKey: 'immigration.reality4' },
];

export function renderImmigration(ctx: WizardContext): void {
  const { container } = ctx;
  const lang = getLang();

  const riskBadge = (risk: 'low' | 'moderate' | 'high') => {
    const colors = { low: 'bg-primary-light text-primary', moderate: 'bg-[#FFF7ED] text-warning', high: 'bg-red-50 text-error' };
    const label = risk === 'low' ? t('immigration.riskLow') : risk === 'moderate' ? t('immigration.riskModerate') : t('immigration.riskHigh');
    return `<span class="text-[11px] font-semibold px-2 py-0.5 rounded-pill ${colors[risk]}">${label}</span>`;
  };

  container.innerHTML = `
    <div class="max-w-[640px] mx-auto px-4 sm:px-0 py-12">
      <div class="wizard-panel bg-surface rounded-sharp shadow-wizard p-6 sm:p-8">
        <div class="flex items-center gap-2 mb-1">
          <i data-lucide="shield-check" class="w-5 h-5 text-primary"></i>
          <span class="text-caption text-primary font-semibold">${t('nav.immigration')}</span>
        </div>
        <h2 class="text-h2 text-text mb-1">${t('immigration.title')}</h2>
        <p class="text-body text-text-secondary mb-6">${t('immigration.subtitle')}</p>

        <!-- Calm reassurance -->
        <div class="flex items-start gap-2 p-4 bg-primary-light rounded-soft mb-8">
          <i data-lucide="heart" class="w-5 h-5 text-primary mt-0.5 flex-shrink-0"></i>
          <p class="text-body text-primary">${t('immigration.calmNote')}</p>
        </div>

        <!-- FAQ Accordion -->
        <div class="space-y-3 mb-8" id="faq-list">
          ${faqs.map((faq, i) => `
            <div class="border-[1.5px] border-border rounded-soft overflow-hidden" data-faq="${i}">
              <button id="faq-trigger-${i}" class="faq-trigger w-full text-left p-4 flex items-center gap-3 hover:bg-[#F9FAFB] transition-colors min-h-[48px]" aria-expanded="false" aria-controls="faq-${i}">
                <i data-lucide="${faq.icon}" class="w-5 h-5 text-text-secondary flex-shrink-0"></i>
                <span class="flex-1 text-body-sm font-semibold text-text">${t(faq.questionKey)}</span>
                ${riskBadge(faq.risk)}
                <i data-lucide="chevron-down" class="w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200"></i>
              </button>
              <div id="faq-${i}" class="accordion-content" role="region" aria-labelledby="faq-trigger-${i}">
                <div class="px-4 pb-4 pt-1 ml-8 border-t border-border">
                  <p class="text-body text-text-secondary">${t(faq.answerKey)}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Myth vs Reality -->
        <div class="mb-8">
          <h3 class="text-h3 text-text mb-4">${t('immigration.mythVsReality')}</h3>
          <div class="border-[1.5px] border-border rounded-soft overflow-hidden">
            <table class="w-full text-sm">
              <caption class="sr-only">${t('immigration.mythVsReality')}</caption>
              <thead>
                <tr class="bg-[#F9FAFB]">
                  <th class="text-left p-3 text-body-sm text-error font-semibold">${t('immigration.myth')}</th>
                  <th class="text-left p-3 text-body-sm text-success font-semibold">${t('immigration.reality')}</th>
                </tr>
              </thead>
              <tbody>
                ${myths.map(m => `
                  <tr class="border-t border-border">
                    <td class="p-3 text-caption text-text-secondary align-top">${t(m.mythKey)}</td>
                    <td class="p-3 text-caption text-text align-top">${t(m.realityKey)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        ${ctx.renderNav({ showBack: true, nextLabel: t('common.continue') })}
      </div>
      ${ctx.renderDisclaimer()}
    </div>
  `;

  // Accordion behavior
  container.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.closest('[data-faq]');
      if (!parent) return;
      const i = parent.getAttribute('data-faq');
      const content = document.getElementById(`faq-${i}`);
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const chevron = trigger.querySelector('[data-lucide="chevron-down"]');

      // Close all others
      container.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
      container.querySelectorAll('.faq-trigger').forEach(t => {
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

  container.querySelector('#btn-next')?.addEventListener('click', () => ctx.goToSection('state'));
  container.querySelector('#btn-back')?.addEventListener('click', () => {
    const s = loadState();
    // RA users come from status; NRA users come from year5
    ctx.goToSection(s.taxStatus === 'RA' ? 'status' : 'year5');
  });
  initIcons();
}
