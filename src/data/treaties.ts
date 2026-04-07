// Treaty data sourced from IRS Publication 901
// Last verified: 2025 tax year

export interface TreatyInfo {
  country: string;
  countryZh: string;
  hasTreaty: boolean;
  article?: string;
  wageExemption?: number | null; // dollar amount, null = no wage exemption
  wageExemptionType?: 'cap' | 'threshold'; // cap = first $X exempt, threshold = all-or-nothing
  scholarshipExempt?: boolean;
  scholarshipNote?: string;
  durationYears?: number | null; // null = "reasonable period"
  standardDeductionAllowed?: boolean; // special: India, South Korea
  survivesRA?: boolean; // China: treaty survives transition to RA
  notes?: string[];
  claimForms?: string[];
}

export const TREATY_DATA: Record<string, TreatyInfo> = {
  CN: {
    country: 'China',
    countryZh: '中国',
    hasTreaty: true,
    article: 'Article 20(c)',
    wageExemption: 5000,
    wageExemptionType: 'cap',
    scholarshipExempt: true,
    scholarshipNote: 'Scholarships from abroad only; US-source scholarships/assistantships are NOT exempt',
    durationYears: null,
    standardDeductionAllowed: false,
    survivesRA: true,
    notes: [
      'Most generous student treaty provision among top sending countries',
      'Survives transition to resident alien status (unique)',
      'Per calendar year across all employers combined',
      'OPT wages qualify while on student visa',
    ],
    claimForms: ['Form 8233', 'Schedule OI, Item L'],
  },
  IN: {
    country: 'India',
    countryZh: '印度',
    hasTreaty: true,
    article: 'Article 21',
    wageExemption: null,
    scholarshipExempt: true,
    scholarshipNote: 'Scholarships from outside US only',
    durationYears: null,
    standardDeductionAllowed: true,
    survivesRA: false,
    notes: [
      'No wage exemption, but can claim US standard deduction as NRA (~$15,700)',
      'Standard deduction benefit structurally more valuable than many wage exemptions',
      'Applies during OPT as long as NRA status maintained',
    ],
    claimForms: ['Form 8833', 'Form 1040-NR', 'Schedule OI'],
  },
  KR: {
    country: 'South Korea',
    countryZh: '韩国',
    hasTreaty: true,
    article: 'Article 21(1)',
    wageExemption: 2000,
    wageExemptionType: 'cap',
    scholarshipExempt: true,
    scholarshipNote: 'Scholarships from abroad',
    durationYears: 5,
    standardDeductionAllowed: true,
    survivesRA: false,
    notes: [
      '5-year clock starts from first US entry',
      'Dollar cap — first $2,000 always exempt',
    ],
    claimForms: ['Form 8233', 'Schedule OI, Item L'],
  },
  JP: {
    country: 'Japan',
    countryZh: '日本',
    hasTreaty: true,
    article: 'Article 20',
    wageExemption: null,
    scholarshipExempt: true,
    scholarshipNote: 'Grants from qualifying organizations only',
    durationYears: 5,
    standardDeductionAllowed: false,
    survivesRA: false,
    notes: [
      'No wage exemption (differs from China despite same article number)',
    ],
    claimForms: ['Form W-8BEN', 'Schedule OI'],
  },
  BD: {
    country: 'Bangladesh',
    countryZh: '孟加拉国',
    hasTreaty: true,
    article: 'Article 21(2)',
    wageExemption: 8000,
    wageExemptionType: 'cap',
    scholarshipExempt: true,
    scholarshipNote: 'Scholarships from abroad + grants',
    durationYears: null,
    standardDeductionAllowed: false,
    survivesRA: false,
    notes: [
      'One of the most generous wage exemptions among all US tax treaties',
    ],
    claimForms: ['Form 8233', 'Form 8833', 'Schedule OI, Item L'],
  },
  CA: {
    country: 'Canada',
    countryZh: '加拿大',
    hasTreaty: true,
    article: 'Article XV(2)',
    wageExemption: 10000,
    wageExemptionType: 'threshold',
    scholarshipExempt: false,
    durationYears: null,
    standardDeductionAllowed: false,
    survivesRA: false,
    notes: [
      'ALL-OR-NOTHING: $10,000 or less = entire amount exempt; over $10,000 = entire amount taxable',
      'Based on general employment article, not student-specific',
      'No separate scholarship exemption',
    ],
    claimForms: ['Form 8233', 'Schedule OI, Item L'],
  },
  MX: {
    country: 'Mexico',
    countryZh: '墨西哥',
    hasTreaty: true,
    article: 'Article 21',
    wageExemption: null,
    scholarshipExempt: true,
    scholarshipNote: 'Scholarships from outside US only',
    durationYears: null,
    standardDeductionAllowed: false,
    survivesRA: false,
    notes: ['No wage exemption; only applies to payments from Mexican sources'],
    claimForms: ['Form W-8BEN', 'Schedule OI'],
  },
  DE: {
    country: 'Germany',
    countryZh: '德国',
    hasTreaty: true,
    article: 'Article 20(4)',
    wageExemption: 9000,
    wageExemptionType: 'cap',
    scholarshipExempt: true,
    durationYears: 4,
    standardDeductionAllowed: false,
    survivesRA: false,
    claimForms: ['Form 8233', 'Schedule OI, Item L'],
  },
  FR: {
    country: 'France',
    countryZh: '法国',
    hasTreaty: true,
    article: 'Article 21(1)',
    wageExemption: 5000,
    wageExemptionType: 'cap',
    scholarshipExempt: true,
    durationYears: null,
    standardDeductionAllowed: false,
    survivesRA: false,
    claimForms: ['Form 8233', 'Schedule OI, Item L'],
  },
  PK: {
    country: 'Pakistan',
    countryZh: '巴基斯坦',
    hasTreaty: true,
    article: 'Article 12',
    wageExemption: 5000,
    wageExemptionType: 'cap',
    scholarshipExempt: true,
    durationYears: null,
    standardDeductionAllowed: false,
    survivesRA: false,
    claimForms: ['Form 8233', 'Schedule OI, Item L'],
  },
  TH: {
    country: 'Thailand',
    countryZh: '泰国',
    hasTreaty: true,
    article: 'Article 22',
    wageExemption: 3000,
    wageExemptionType: 'cap',
    scholarshipExempt: true,
    durationYears: null,
    standardDeductionAllowed: false,
    survivesRA: false,
    claimForms: ['Form 8233', 'Schedule OI, Item L'],
  },
  GB: {
    country: 'United Kingdom',
    countryZh: '英国',
    hasTreaty: true,
    article: 'Article 20',
    wageExemption: null,
    scholarshipExempt: true,
    scholarshipNote: 'Maintenance payments from abroad',
    durationYears: null,
    standardDeductionAllowed: false,
    survivesRA: false,
    claimForms: ['Form W-8BEN', 'Schedule OI'],
  },
  PH: {
    country: 'Philippines',
    countryZh: '菲律宾',
    hasTreaty: true,
    article: 'Article 22',
    wageExemption: null,
    scholarshipExempt: true,
    durationYears: null,
    standardDeductionAllowed: false,
    survivesRA: false,
    claimForms: ['Form W-8BEN', 'Schedule OI'],
  },
  EG: {
    country: 'Egypt',
    countryZh: '埃及',
    hasTreaty: true,
    article: 'Article 23',
    wageExemption: 3000,
    wageExemptionType: 'cap',
    scholarshipExempt: true,
    durationYears: null,
    standardDeductionAllowed: false,
    survivesRA: false,
    claimForms: ['Form 8233', 'Schedule OI, Item L'],
  },
};

// Countries with NO US tax treaty (common for international students)
export const NO_TREATY_COUNTRIES: Record<string, { country: string; countryZh: string }> = {
  VN: { country: 'Vietnam', countryZh: '越南' },
  TW: { country: 'Taiwan', countryZh: '台湾' },
  BR: { country: 'Brazil', countryZh: '巴西' },
  SA: { country: 'Saudi Arabia', countryZh: '沙特阿拉伯' },
  NG: { country: 'Nigeria', countryZh: '尼日利亚' },
  NP: { country: 'Nepal', countryZh: '尼泊尔' },
  ID: { country: 'Indonesia', countryZh: '印度尼西亚' },
  MM: { country: 'Myanmar', countryZh: '缅甸' },
  CO: { country: 'Colombia', countryZh: '哥伦比亚' },
  IR: { country: 'Iran', countryZh: '伊朗' },
  KE: { country: 'Kenya', countryZh: '肯尼亚' },
  GH: { country: 'Ghana', countryZh: '加纳' },
  ET: { country: 'Ethiopia', countryZh: '埃塞俄比亚' },
};

// Terminated/suspended treaties
export const TERMINATED_TREATIES: Record<string, { country: string; countryZh: string; status: string; date: string }> = {
  HU: { country: 'Hungary', countryZh: '匈牙利', status: 'TERMINATED', date: 'January 1, 2024' },
  RU: { country: 'Russia', countryZh: '俄罗斯', status: 'SUSPENDED', date: 'August 16, 2024' },
};

// Full country list for the dropdown (sorted by common usage)
export const ALL_COUNTRIES = [
  { code: 'CN', name: 'China', nameZh: '中国' },
  { code: 'IN', name: 'India', nameZh: '印度' },
  { code: 'KR', name: 'South Korea', nameZh: '韩国' },
  { code: 'CA', name: 'Canada', nameZh: '加拿大' },
  { code: 'VN', name: 'Vietnam', nameZh: '越南' },
  { code: 'TW', name: 'Taiwan', nameZh: '台湾' },
  { code: 'SA', name: 'Saudi Arabia', nameZh: '沙特阿拉伯' },
  { code: 'JP', name: 'Japan', nameZh: '日本' },
  { code: 'BR', name: 'Brazil', nameZh: '巴西' },
  { code: 'NG', name: 'Nigeria', nameZh: '尼日利亚' },
  { code: 'NP', name: 'Nepal', nameZh: '尼泊尔' },
  { code: 'BD', name: 'Bangladesh', nameZh: '孟加拉国' },
  { code: 'MX', name: 'Mexico', nameZh: '墨西哥' },
  { code: 'PK', name: 'Pakistan', nameZh: '巴基斯坦' },
  { code: 'DE', name: 'Germany', nameZh: '德国' },
  { code: 'FR', name: 'France', nameZh: '法国' },
  { code: 'GB', name: 'United Kingdom', nameZh: '英国' },
  { code: 'TH', name: 'Thailand', nameZh: '泰国' },
  { code: 'PH', name: 'Philippines', nameZh: '菲律宾' },
  { code: 'EG', name: 'Egypt', nameZh: '埃及' },
  { code: 'ID', name: 'Indonesia', nameZh: '印度尼西亚' },
  { code: 'CO', name: 'Colombia', nameZh: '哥伦比亚' },
  { code: 'IR', name: 'Iran', nameZh: '伊朗' },
  { code: 'KE', name: 'Kenya', nameZh: '肯尼亚' },
  { code: 'GH', name: 'Ghana', nameZh: '加纳' },
  { code: 'ET', name: 'Ethiopia', nameZh: '埃塞俄比亚' },
  { code: 'MM', name: 'Myanmar', nameZh: '缅甸' },
  { code: 'HU', name: 'Hungary', nameZh: '匈牙利' },
  { code: 'RU', name: 'Russia', nameZh: '俄罗斯' },
  { code: 'OTHER', name: 'Other', nameZh: '其他' },
];

export function getTreatyInfo(countryCode: string): TreatyInfo | null {
  if (TREATY_DATA[countryCode]) return TREATY_DATA[countryCode];
  if (NO_TREATY_COUNTRIES[countryCode]) {
    const c = NO_TREATY_COUNTRIES[countryCode];
    return { country: c.country, countryZh: c.countryZh, hasTreaty: false };
  }
  if (TERMINATED_TREATIES[countryCode]) {
    const c = TERMINATED_TREATIES[countryCode];
    return { country: c.country, countryZh: c.countryZh, hasTreaty: false, notes: [`Treaty ${c.status.toLowerCase()} as of ${c.date}`] };
  }
  return null;
}

export function calculateTreatySavings(
  countryCode: string,
  income: number,
  taxCalculator: (income: number) => number
): { savings: number; exemptAmount: number; taxWithTreaty: number; taxWithout: number } | null {
  const treaty = TREATY_DATA[countryCode];
  if (!treaty || !treaty.hasTreaty) return null;

  const taxWithout = taxCalculator(income);

  let exemptAmount = 0;
  if (treaty.wageExemption) {
    if (treaty.wageExemptionType === 'threshold') {
      // All-or-nothing (Canada): if income <= threshold, all exempt; else all taxable
      exemptAmount = income <= treaty.wageExemption ? income : 0;
    } else {
      // Cap: first $X exempt
      exemptAmount = Math.min(income, treaty.wageExemption);
    }
  }

  // India/South Korea: standard deduction benefit
  if (treaty.standardDeductionAllowed && !treaty.wageExemption) {
    exemptAmount = 15700; // standard deduction amount
  }

  const taxableIncome = Math.max(0, income - exemptAmount);
  const taxWithTreaty = taxCalculator(taxableIncome);
  const savings = Math.round((taxWithout - taxWithTreaty) * 100) / 100;

  return { savings, exemptAmount, taxWithTreaty, taxWithout };
}
