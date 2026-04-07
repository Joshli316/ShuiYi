// Tax constants for 2025 tax year (filing in 2026)

export const TAX_YEAR = 2025;

// NRA tax brackets (same as single filer graduated rates for ECI)
export const NRA_TAX_BRACKETS = [
  { min: 0, max: 11925, rate: 0.10 },
  { min: 11925, max: 48475, rate: 0.12 },
  { min: 48475, max: 103350, rate: 0.22 },
  { min: 103350, max: 197300, rate: 0.24 },
  { min: 197300, max: 250525, rate: 0.32 },
  { min: 250525, max: 626350, rate: 0.35 },
  { min: 626350, max: Infinity, rate: 0.37 },
];

// Standard deduction - NRAs generally cannot claim
export const STANDARD_DEDUCTION_RA = 15700; // 2025 single filer
export const STANDARD_DEDUCTION_NRA = 0; // NRAs cannot claim (exceptions: India, South Korea treaty)

// FICA rates
export const FICA_SOCIAL_SECURITY_RATE = 0.062;
export const FICA_MEDICARE_RATE = 0.0145;
export const FICA_TOTAL_RATE = 0.0765;
export const SOCIAL_SECURITY_WAGE_BASE = 176100; // 2025

// Exempt individual rules
export const STUDENT_EXEMPT_YEARS = 5; // F, J (student), M, Q
export const TEACHER_RESEARCHER_EXEMPT_YEARS = 2; // J (non-student)

// Visa categories
export const EXEMPT_VISA_TYPES = ['F-1', 'F-2', 'J-1', 'J-2', 'M-1', 'M-2', 'Q-1', 'Q-2'];
export const FICA_EXEMPT_VISA_TYPES = ['F-1', 'J-1', 'M-1', 'Q-1'];
export const STUDENT_VISA_TYPES = ['F-1', 'J-1', 'M-1', 'Q-1'];

// SPT threshold
export const SPT_DAY_THRESHOLD = 183;
export const SPT_MIN_CURRENT_YEAR_DAYS = 31;

// Filing deadlines
export const FORM_8843_DEADLINE = 'June 15';
export const FORM_1040NR_DEADLINE_WAGES = 'April 15';
export const FORM_1040NR_DEADLINE_NO_WAGES = 'June 15';

// IRS mailing address for Form 8843
export const IRS_MAILING_ADDRESS = {
  name: 'Department of the Treasury',
  line1: 'Internal Revenue Service Center',
  city: 'Austin',
  state: 'TX',
  zip: '73301-0215',
  country: 'USA',
};

// Scholarship withholding rates
export const SCHOLARSHIP_WITHHOLDING_FMJQ = 0.14; // 14% for F/J/M/Q
export const FDAP_WITHHOLDING_DEFAULT = 0.30; // 30% default

// FICA refund deadline
export const FICA_REFUND_YEARS = 3;

export function calculateTax(income: number, brackets = NRA_TAX_BRACKETS): number {
  let tax = 0;
  for (const bracket of brackets) {
    if (income <= bracket.min) break;
    const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }
  return Math.round(tax * 100) / 100;
}

export function calculateFICA(income: number): number {
  const ss = Math.min(income, SOCIAL_SECURITY_WAGE_BASE) * FICA_SOCIAL_SECURITY_RATE;
  const mc = income * FICA_MEDICARE_RATE;
  return Math.round((ss + mc) * 100) / 100;
}
