import { describe, it, expect } from 'vitest';
import { calculateSPT } from '../utils/spt';
import { calculateTreatySavings } from '../data/treaties';
import { calculateTax, calculateFICA, TAX_YEAR } from '../data/constants';

// ---------------------------------------------------------------------------
// calculateSPT
// ---------------------------------------------------------------------------
describe('calculateSPT', () => {
  it('F-1 in year 1 (2025 entry) → NRA, 4 years remaining', () => {
    const result = calculateSPT('F-1', 2025);
    expect(result.status).toBe('NRA');
    expect(result.exemptYearsUsed).toBe(1);
    expect(result.exemptYearsRemaining).toBe(4);
    expect(result.transitionYear).toBe(2030);
  });

  it('F-1 in year 3 (2023 entry) → NRA, 2 years remaining', () => {
    const result = calculateSPT('F-1', 2023);
    expect(result.status).toBe('NRA');
    expect(result.exemptYearsUsed).toBe(3);
    expect(result.exemptYearsRemaining).toBe(2);
    expect(result.transitionYear).toBe(2028);
  });

  it('F-1 in year 6 (2020 entry) → RA, 0 years remaining', () => {
    const result = calculateSPT('F-1', 2020);
    expect(result.status).toBe('RA');
    expect(result.exemptYearsUsed).toBe(5);
    expect(result.exemptYearsRemaining).toBe(0);
    expect(result.transitionYear).toBe(2025);
  });

  it('J-1 student follows same 5-year rule', () => {
    const result = calculateSPT('J-1', 2024);
    expect(result.status).toBe('NRA');
    expect(result.exemptYearsUsed).toBe(2);
    expect(result.exemptYearsRemaining).toBe(3);
    expect(result.transitionYear).toBe(2029);
  });

  it('H-1B → always RA (no exempt period)', () => {
    const result = calculateSPT('H-1B', 2024);
    expect(result.status).toBe('RA');
    expect(result.exemptYearsUsed).toBe(0);
    expect(result.exemptYearsRemaining).toBe(0);
    expect(result.transitionYear).toBe(2024);
    expect(result.reason).toContain('not exempt individuals');
  });

  it('F-1 with prior J-1 → reduced exempt years (5 - 2 = 3)', () => {
    // entry 2023 → calendarYears = 3, effectiveMaxExempt = 3 → NRA, 0 remaining
    const result = calculateSPT('F-1', 2023, true);
    expect(result.status).toBe('NRA');
    expect(result.exemptYearsUsed).toBe(3);
    expect(result.exemptYearsRemaining).toBe(0);
    expect(result.transitionYear).toBe(2026);
  });

  it('F-1 with prior J-1 who exceeded reduced exemption → RA', () => {
    // entry 2022 → calendarYears = 4, effectiveMaxExempt = 3 → RA
    const result = calculateSPT('F-1', 2022, true);
    expect(result.status).toBe('RA');
    expect(result.exemptYearsUsed).toBe(3);
    expect(result.exemptYearsRemaining).toBe(0);
    expect(result.transitionYear).toBe(2025);
  });

  it('edge case: entry year = TAX_YEAR → year 1', () => {
    const result = calculateSPT('F-1', TAX_YEAR);
    expect(result.status).toBe('NRA');
    expect(result.exemptYearsUsed).toBe(1);
    expect(result.exemptYearsRemaining).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// calculateTreatySavings
// ---------------------------------------------------------------------------
describe('calculateTreatySavings', () => {
  it('China, $15,000 income → savings based on $5,000 cap', () => {
    const result = calculateTreatySavings('CN', 15_000, calculateTax);
    expect(result).not.toBeNull();
    expect(result!.exemptAmount).toBe(5_000);
    // taxWithout = calculateTax(15000) = 1192.50 + 369 = 1561.50
    expect(result!.taxWithout).toBeCloseTo(1561.50, 2);
    // taxWithTreaty = calculateTax(10000) = 1000
    expect(result!.taxWithTreaty).toBeCloseTo(1000, 2);
    // savings = 561.50
    expect(result!.savings).toBeCloseTo(561.50, 2);
  });

  it('India, $15,000 income → savings based on standard deduction ($15,700)', () => {
    const result = calculateTreatySavings('IN', 15_000, calculateTax);
    expect(result).not.toBeNull();
    // India: standardDeductionAllowed=true, wageExemption=null → exemptAmount=15700
    expect(result!.exemptAmount).toBe(15_700);
    // taxableIncome = max(0, 15000-15700) = 0
    expect(result!.taxWithTreaty).toBe(0);
    // savings = full tax amount
    expect(result!.savings).toBeCloseTo(1561.50, 2);
  });

  it('Canada, $9,000 income → fully exempt (under $10K threshold)', () => {
    const result = calculateTreatySavings('CA', 9_000, calculateTax);
    expect(result).not.toBeNull();
    // threshold: income <= 10000 → entire amount exempt
    expect(result!.exemptAmount).toBe(9_000);
    expect(result!.taxWithTreaty).toBe(0);
    // taxWithout = 9000 * 0.10 = 900
    expect(result!.savings).toBeCloseTo(900, 2);
  });

  it('Canada, $11,000 income → $0 savings (over threshold, all-or-nothing)', () => {
    const result = calculateTreatySavings('CA', 11_000, calculateTax);
    expect(result).not.toBeNull();
    // threshold: income > 10000 → exemptAmount = 0
    expect(result!.exemptAmount).toBe(0);
    expect(result!.savings).toBe(0);
  });

  it('Vietnam (no treaty) → null', () => {
    const result = calculateTreatySavings('VN', 15_000, calculateTax);
    expect(result).toBeNull();
  });

  it('unknown country code → null', () => {
    const result = calculateTreatySavings('XX', 15_000, calculateTax);
    expect(result).toBeNull();
  });

  it('zero income → $0 savings', () => {
    const result = calculateTreatySavings('CN', 0, calculateTax);
    expect(result).not.toBeNull();
    expect(result!.exemptAmount).toBe(0);
    expect(result!.taxWithout).toBe(0);
    expect(result!.taxWithTreaty).toBe(0);
    expect(result!.savings).toBe(0);
  });

  it('China, income below cap → full income is exempt amount', () => {
    const result = calculateTreatySavings('CN', 3_000, calculateTax);
    expect(result).not.toBeNull();
    expect(result!.exemptAmount).toBe(3_000);
    expect(result!.taxWithTreaty).toBe(0);
    // taxWithout = 3000 * 0.10 = 300
    expect(result!.savings).toBeCloseTo(300, 2);
  });
});

// ---------------------------------------------------------------------------
// calculateTax
// ---------------------------------------------------------------------------
describe('calculateTax', () => {
  it('$0 income → $0 tax', () => {
    expect(calculateTax(0)).toBe(0);
  });

  it('$10,000 income → 10% bracket only', () => {
    // 10000 * 0.10 = 1000
    expect(calculateTax(10_000)).toBe(1000);
  });

  it('$50,000 income → crosses into 22% bracket', () => {
    // 11925 * 0.10 = 1192.50
    // (48475 - 11925) * 0.12 = 36550 * 0.12 = 4386
    // (50000 - 48475) * 0.22 = 1525 * 0.22 = 335.50
    // total = 5914
    expect(calculateTax(50_000)).toBe(5914);
  });

  it('$100,000 income → progressive calculation through 22% bracket', () => {
    // 11925 * 0.10 = 1192.50
    // (48475 - 11925) * 0.12 = 4386
    // (100000 - 48475) * 0.22 = 51525 * 0.22 = 11335.50
    // total = 16914
    expect(calculateTax(100_000)).toBe(16914);
  });

  it('income at exact bracket boundary ($11,925)', () => {
    // 11925 * 0.10 = 1192.50
    expect(calculateTax(11_925)).toBe(1192.50);
  });

  it('negative income → $0 tax', () => {
    expect(calculateTax(-100)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calculateFICA
// ---------------------------------------------------------------------------
describe('calculateFICA', () => {
  it('$20,000 income → 7.65%', () => {
    // SS: 20000 * 0.062 = 1240
    // MC: 20000 * 0.0145 = 290
    // total = 1530
    expect(calculateFICA(20_000)).toBe(1530);
  });

  it('$0 income → $0', () => {
    expect(calculateFICA(0)).toBe(0);
  });

  it('income above Social Security wage base → SS capped', () => {
    // SS: 176100 * 0.062 = 10918.20
    // MC: 200000 * 0.0145 = 2900
    // total = 13818.20
    expect(calculateFICA(200_000)).toBe(13818.20);
  });
});
