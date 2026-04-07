// Substantial Presence Test calculator
// Determines NRA vs RA status for international students

import { STUDENT_EXEMPT_YEARS, TEACHER_RESEARCHER_EXEMPT_YEARS, SPT_DAY_THRESHOLD, TAX_YEAR } from '../data/constants';

export interface SPTResult {
  status: 'NRA' | 'RA';
  exemptYearsUsed: number;
  exemptYearsRemaining: number;
  transitionYear: number;
  reason: string;
  reasonZh: string;
}

// Student visa types that get 5-year exemption
const STUDENT_VISAS = ['F-1', 'M-1', 'Q-1'];
const J1_VISA = 'J-1';

export function calculateSPT(
  visaType: string,
  entryYear: number,
  hadPriorJ1: boolean = false,
  j1IsStudent: boolean = true
): SPTResult {
  const currentYear = TAX_YEAR;

  // Determine exempt years based on visa type
  let maxExemptYears: number;
  if (STUDENT_VISAS.includes(visaType)) {
    maxExemptYears = STUDENT_EXEMPT_YEARS;
  } else if (visaType === J1_VISA) {
    maxExemptYears = j1IsStudent ? STUDENT_EXEMPT_YEARS : TEACHER_RESEARCHER_EXEMPT_YEARS;
  } else {
    // Non-exempt visa types (H-1B, etc.)
    return {
      status: 'RA',
      exemptYearsUsed: 0,
      exemptYearsRemaining: 0,
      transitionYear: entryYear,
      reason: `${visaType} visa holders are not exempt individuals. Days in the US count toward the Substantial Presence Test from day one.`,
      reasonZh: `${visaType}签证持有者不是豁免个人。在美国的每一天都计入实质性存在测试。`,
    };
  }

  // If they had a prior J-1, those years count toward the 5-year cap
  // J-1 teacher/researcher: 2-year exemption
  let priorExemptYears = 0;
  if (hadPriorJ1 && visaType !== J1_VISA) {
    priorExemptYears = TEACHER_RESEARCHER_EXEMPT_YEARS;
  }

  // Calendar years present: any part of a year counts as a full year
  const calendarYearsPresent = currentYear - entryYear + 1;

  // Total exempt years = min(years present, max allowed - prior used)
  const effectiveMaxExempt = maxExemptYears - priorExemptYears;
  const exemptYearsUsed = Math.min(calendarYearsPresent, effectiveMaxExempt);
  const exemptYearsRemaining = Math.max(0, effectiveMaxExempt - calendarYearsPresent);

  // Transition year: when exempt status ends
  const transitionYear = entryYear + effectiveMaxExempt;

  if (calendarYearsPresent <= effectiveMaxExempt) {
    // Still within exempt period → NRA
    return {
      status: 'NRA',
      exemptYearsUsed,
      exemptYearsRemaining,
      transitionYear,
      reason: `As a ${visaType} visa holder who entered in ${entryYear}, you are in year ${calendarYearsPresent} of your ${effectiveMaxExempt}-year exempt period. Your days do NOT count toward the Substantial Presence Test. You are a Nonresident Alien (NRA) for tax purposes.`,
      reasonZh: `作为${visaType}签证持有者，你于${entryYear}年入境美国，目前处于${effectiveMaxExempt}年豁免期的第${calendarYearsPresent}年。你的在美天数不计入实质性存在测试。你的税务身份为非居民外国人（NRA）。`,
    };
  } else {
    // Past exempt period → likely RA (SPT would apply)
    return {
      status: 'RA',
      exemptYearsUsed: effectiveMaxExempt,
      exemptYearsRemaining: 0,
      transitionYear,
      reason: `As a ${visaType} visa holder who entered in ${entryYear}, you have exceeded the ${effectiveMaxExempt}-year exempt period. Starting in ${transitionYear}, your days count toward the Substantial Presence Test. With ${calendarYearsPresent} calendar years in the US, you likely meet the ${SPT_DAY_THRESHOLD}-day threshold and are a Resident Alien (RA) for tax purposes.`,
      reasonZh: `作为${visaType}签证持有者，你于${entryYear}年入境美国，已超过${effectiveMaxExempt}年豁免期。从${transitionYear}年起，你的在美天数计入实质性存在测试。在美${calendarYearsPresent}个日历年后，你很可能达到${SPT_DAY_THRESHOLD}天的门槛，税务身份为居民外国人（RA）。`,
    };
  }
}
