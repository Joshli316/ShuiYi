// Year-5 Transition Countdown
import { t, getLang } from '../i18n';
import { STUDENT_EXEMPT_YEARS, TAX_YEAR } from '../data/constants';
import { initIcons } from '../utils/icons';
import type { WizardContext } from '../app';

export function renderYear5(ctx: WizardContext): void {
  const { container, state } = ctx;
  const lang = getLang();
  const entryYear = state.entryYear || TAX_YEAR;
  const exemptYearsRemaining = state.exemptYearsRemaining ?? STUDENT_EXEMPT_YEARS;
  const exemptYearsUsed = state.exemptYearsUsed ?? 1;
  const transitionYear = state.transitionYear || (entryYear + STUDENT_EXEMPT_YEARS);
  const total = STUDENT_EXEMPT_YEARS;
  const current = exemptYearsUsed;
  const alreadyTransitioned = exemptYearsRemaining <= 0;

  // Circular progress indicator
  const pct = Math.min(current / total, 1);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference * (1 - pct);

  const changes = [
    { icon: 'wallet', title: t('year5.change1Title'), desc: t('year5.change1Desc'), color: 'warning' },
    { icon: 'globe', title: t('year5.change2Title'), desc: t('year5.change2Desc'), color: 'error' },
    { icon: 'file-text', title: t('year5.change3Title'), desc: t('year5.change3Desc'), color: 'primary' },
  ];

  const checklist = alreadyTransitioned ? [
    lang === 'zh' ? '使用1040表报税（不再使用1040-NR）' : 'File Form 1040 (not 1040-NR)',
    lang === 'zh' ? '申报全球收入' : 'Report worldwide income',
    lang === 'zh' ? '可以申请标准扣除和税收抵免' : 'Claim standard deduction and credits',
    lang === 'zh' ? '考虑咨询税务专业人员' : 'Consider consulting a tax professional',
  ] : exemptYearsRemaining <= 2 ? [
    lang === 'zh' ? '了解第5年之后会发生什么变化' : 'Understand what changes after year 5',
    lang === 'zh' ? '开始记录全球收入' : 'Start tracking worldwide income',
    lang === 'zh' ? '考虑提前咨询税务专业人员' : 'Consider consulting a tax professional early',
    lang === 'zh' ? `标记日历：${transitionYear}年是过渡年` : `Mark your calendar: ${transitionYear} is your transition year`,
  ] : [
    lang === 'zh' ? '继续以NRA身份报税' : 'Continue filing as an NRA',
    lang === 'zh' ? '每年提交8843表' : 'File Form 8843 each year',
    lang === 'zh' ? '利用条约优惠（如适用）' : 'Take advantage of treaty benefits (if applicable)',
    lang === 'zh' ? '以后记得回来查看倒计时' : 'Come back to check your countdown later',
  ];

  container.innerHTML = `
    <div class="max-w-[640px] mx-auto px-4 sm:px-0 py-12">
      <div class="wizard-panel bg-surface rounded-sharp shadow-wizard p-6 sm:p-8">
        <div class="flex items-center gap-2 mb-1">
          <i data-lucide="calendar-clock" class="w-5 h-5 text-primary"></i>
          <span class="text-caption text-primary font-semibold">${t('nav.year5')}</span>
        </div>
        <h2 class="text-h2 text-text mb-1">${t('year5.title')}</h2>
        <p class="text-body text-text-secondary mb-8">${t('year5.subtitle')}</p>

        <div class="result-enter">
          <!-- Circular countdown -->
          <div class="flex flex-col items-center mb-8">
            <div class="relative w-32 h-32 mb-4">
              <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" stroke-width="8"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="${alreadyTransitioned ? '#D97706' : '#2D9F6F'}" stroke-width="8" stroke-linecap="round"
                  stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                  style="transition: stroke-dashoffset 800ms ease-out"/>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-display ${alreadyTransitioned ? 'text-warning' : 'text-primary'}">${alreadyTransitioned ? '0' : exemptYearsRemaining}</span>
                <span class="text-caption text-text-muted">${lang === 'zh' ? '年' : 'years'}</span>
              </div>
            </div>

            ${alreadyTransitioned
              ? `<h3 class="text-h3 text-warning text-center">${t('year5.alreadyTransitioned')}</h3>
                 <p class="text-body text-text-secondary text-center mt-1">${t('year5.alreadyTransitionedDesc')}</p>`
              : `<h3 class="text-h3 text-primary text-center">${t('year5.remaining').replace('{years}', String(exemptYearsRemaining))}</h3>
                 <p class="text-body text-text-secondary text-center mt-1">${t('year5.current').replace('{current}', String(current)).replace('{total}', String(total))}</p>
                 <p class="text-body-sm text-text-muted text-center mt-1">${t('year5.transitionIn').replace('{year}', String(transitionYear))}</p>`
            }
          </div>

          <!-- Timeline -->
          <div class="flex items-center justify-between mb-8 px-4">
            ${Array.from({ length: total }, (_, i) => {
              const year = entryYear + i;
              const isCurrent = i + 1 === current;
              const isPast = i + 1 < current;
              const isTransition = i + 1 === total;
              return `
                <div class="flex flex-col items-center ${isCurrent ? 'scale-110' : ''}">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isPast ? 'bg-primary text-white' : isCurrent ? 'bg-primary text-white ring-4 ring-primary-light' : 'bg-border text-text-muted'}">
                    ${i + 1}
                  </div>
                  <span class="text-[10px] text-text-muted mt-1">${year}</span>
                  ${isTransition ? `<span class="text-[9px] text-warning font-semibold mt-0.5">${lang === 'zh' ? '过渡' : 'change'}</span>` : ''}
                </div>
                ${i < total - 1 ? `<div class="flex-1 h-0.5 ${isPast ? 'bg-primary' : 'bg-border'} mx-1"></div>` : ''}
              `;
            }).join('')}
          </div>

          <!-- What changes -->
          <div class="space-y-4 mb-8">
            <h3 class="text-body-sm font-semibold text-text">${lang === 'zh' ? '第5年后会有什么变化' : 'What changes after year 5'}</h3>
            ${changes.map(c => `
              <div class="flex items-start gap-3 p-3 border-[1.5px] border-border rounded-soft">
                <i data-lucide="${c.icon}" class="w-5 h-5 text-${c.color} mt-0.5 flex-shrink-0"></i>
                <div>
                  <p class="text-body-sm font-semibold text-text">${c.title}</p>
                  <p class="text-caption text-text-secondary">${c.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Checklist -->
          <div class="space-y-3">
            <h3 class="text-body-sm font-semibold text-text">${t('year5.checklist')}</h3>
            ${checklist.map(item => `
              <div class="flex items-start gap-3 text-body text-text-secondary">
                <i data-lucide="check-circle" class="w-4 h-4 text-primary mt-1 flex-shrink-0"></i>
                <span>${item}</span>
              </div>
            `).join('')}
          </div>
        </div>

        ${ctx.renderNav({ showBack: true, nextLabel: t('common.continue') })}
      </div>
      ${ctx.renderDisclaimer()}
    </div>
  `;

  container.querySelector('#btn-next')?.addEventListener('click', () => ctx.goToSection('immigration'));
  container.querySelector('#btn-back')?.addEventListener('click', () => {
    const s = ctx.updateState({});
    if (s.hasIncome) ctx.goToSection('fica');
    else ctx.goToSection('form8843');
  });
  initIcons();
}
