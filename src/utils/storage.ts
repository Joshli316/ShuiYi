// sessionStorage wrapper for wizard state
// Data is cleared when the tab closes — no persistent storage

const STORAGE_KEY = 'shuiyi_wizard';

export interface WizardState {
  // Status wizard
  visaType?: string;
  entryMonth?: number;
  entryYear?: number;
  calendarYears?: number;
  hadPriorJ1?: boolean;
  taxStatus?: 'NRA' | 'RA' | 'DUAL';
  exemptYearsUsed?: number;
  exemptYearsRemaining?: number;
  transitionYear?: number;

  // Form 8843
  fullName?: string;
  usAddress?: string;
  ssn?: string;
  citizenship?: string; // country code
  taxResidence?: string; // country code
  daysPresent?: number;
  schoolName?: string;
  schoolAddress?: string;
  visaCompliant?: boolean;

  // Treaty calculator
  hasIncome?: boolean;
  incomeAmount?: number;
  treatySavings?: number;

  // FICA
  isEmployed?: boolean;
  ficaWithheld?: boolean;
  ficaExempt?: boolean;
  ficaRefundAmount?: number;

  // State
  stateCode?: string;

  // Language
  lang?: 'en' | 'zh';

  // Dark mode
  darkMode?: boolean;

  // Navigation
  currentSection?: string;
  currentStep?: number;
}

export function loadState(): WizardState {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveState(updates: Partial<WizardState>): WizardState {
  const current = loadState();
  const merged = { ...current, ...updates };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // sessionStorage full or unavailable
  }
  return merged;
}

export function getState<K extends keyof WizardState>(key: K): WizardState[K] {
  return loadState()[key];
}

export function clearState(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
