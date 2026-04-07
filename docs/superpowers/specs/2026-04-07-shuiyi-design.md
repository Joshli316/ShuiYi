# ShuiYi 税易 — Design Document

**Date:** 2026-04-07
**Status:** Approved, ready for build
**Research:** 18 reports in `~/Desktop/Projects/Research/2026-04-07-international-student-taxes/`

---

## 1. Problem Statement

1.2 million international students in the US are legally required to file taxes, but the system offers them no accessible on-ramp. Mainstream software (TurboTax, H&R Block) excludes them, the IRS provides no targeted guidance, universities disclaim expertise, and employers don't know the rules. The result: hundreds of thousands of students each year don't file, file the wrong form, miss treaty benefits worth $500-$3,000 annually, or overpay FICA — errors that compound into immigration risk when they surface during green card applications years later.

The core failure is not complexity — the rules are knowable. The core failure is that every institution in the chain has rational reasons to exclude NRA students from their default workflows, creating a gap no one owns and the student alone must bridge.

---

## 2. Target Users

### Primary: Chinese international students (~266K)
- Highest language barrier (English-only IRS forms, technical tax vocabulary)
- No self-filing culture in China (employers handle everything)
- WeChat is primary information channel — misinformation spreads fast
- Article 20 treaty: $5,000 wage exemption + scholarship exemption (often unclaimed)
- More undergrad, more parental-support + part-time work income profiles

### Secondary: Indian international students (~363K)
- Better English proficiency but US tax jargon is still a barrier
- Heavily TA/RA funded (stipend taxation surprises many)
- Article 21 treaty: standard deduction (~$15,750) — structurally more valuable than China's $5K cap
- 15-20+ year green card backlog = decades of tax records scrutinized
- v1 serves them in English; future versions could add Hindi

### Combined: ~53% of all international students in the US.

---

## 3. Root Causes Addressed

| Root Cause | How ShuiYi Addresses It |
|------------|------------------------|
| No onboarding pathway for NRA filers | Entry point is "Are you an international student?" — not "Choose your filing form" |
| Mainstream software excludes NRAs | Automated status determination from visa type + entry date. No 1040/1040-NR choice needed. |
| Treaty benefits are opt-in and invisible | Proactive calculator: enter country → see dollar savings → get claim instructions |
| FICA exemption is employer-dependent | Checker tells student if they're exempt + provides employer letter citing IRC 3121(b)(19) |
| Year-5 transition is invisible | Countdown from entry date with 12-month advance warning |
| Immigration anxiety exceeds actual risk | Fact vs myth explainer, cited from USCIS policy and immigration attorneys |
| Peer misinformation fills the vacuum | Authoritative, free, bilingual — designed to be the resource shared in WeChat groups |
| Cost is a barrier ($50-100 for Sprintax) | 100% free. No paywall. No "premium tier." |

---

## 4. What ShuiYi Is (and Is Not)

### IS:
- A **tax guidance and education tool** — helps students understand their obligations
- A **status determination wizard** — answers "Am I NRA or RA?"
- A **Form 8843 generator** — fills the real IRS PDF, student downloads and mails
- A **treaty benefit calculator** — shows dollar savings by country
- A **FICA exemption checker** — tells students if they're exempt and how to get a refund
- A **bilingual resource** (EN/ZH) — designed for the largest student populations

### IS NOT:
- A **tax preparer** — does not generate 1040-NR, does not file returns, does not provide tax advice
- An **e-filing platform** — no IRS authorization (EFIN), no server-side processing
- A **paid product** — no payments, no accounts, no premium features
- An **AI chatbot** — deterministic wizard beats probabilistic chat for tax accuracy

### Regulatory Position
Per Report 16 (Regulatory Landscape):
- Client-side, free, educational = zero IRS authorization required
- Form 8843 is an "informational statement," not a tax return — generating pre-filled PDFs is legally safe
- Tax calculators (like NerdWallet, SmartAsset) operate with disclaimers only
- Every output includes: "For informational purposes only. This is not tax advice."
- Uses "approximately," "may," "based on your inputs" — never "you owe exactly $X"

---

## 5. User Journey

```
Student hears "you need to file taxes"
    ↓
Finds ShuiYi via WeChat group / university ISO / Reddit / Google
    ↓
Landing page: "Tax season doesn't have to be scary. 报税不用慌。"
    ↓
[Status Wizard] 4 questions → "You are a Nonresident Alien (NRA)"
    ↓
Branches based on income:
    ├── No income → [Form 8843 Generator] → Download PDF → "Mail to IRS by June 15"
    └── Has income → continues ↓
    ↓
[Treaty Calculator] Country → income → "You could save $X with treaty benefits"
    ↓
[FICA Checker] "Your employer should NOT be withholding FICA. Here's how to get $X back."
    ↓
[Year-5 Countdown] "You have 3 exempt years remaining. Here's what changes."
    ↓
[Immigration Explainer] "Will this affect my visa? Here's the truth."
    ↓
[Summary] Personalized checklist: what to file, when, how, and what to bring to a CPA
    ↓
[Share] "Share this tool with your classmates" → WeChat/WhatsApp card
```

---

## 6. Design Direction: Friendly Guide

**Vibe:** Warm, approachable, hand-holding. Duolingo meets financial literacy.

**Why this direction:** The #1 emotional barrier is anxiety. Students are scared, confused, and navigating in a second language. Clinical/authoritative designs (Stripe Docs) feel too cold. Bold/direct designs (Cash App) intimidate first-timers. The Friendly Guide says: "Don't worry, we'll walk you through this."

### Visual Identity
- **Colors:** Warm green (#2D9F6F) as primary — growth, money, safety. Amber (#F5A623) for highlights and "show me the money" moments. Warm off-white (#FAFAF8) background.
- **Typography:** Inter (English) + Noto Sans SC (Chinese) — clean, modern, free. Body at 18px for readability.
- **Tone:** Conversational. "Let's figure this out together." 6th-8th grade reading level. Max 20 words per sentence.
- **Progress:** Green progress bar with reassuring subtitles. "Step 3 of 7 — You're doing great!"
- **Celebrations:** Count-up animation for dollar amounts saved. Green checkmarks with bounce on completed steps.

### UX Principles
1. **One question per screen.** Wizard flow, not dashboard. Confused users need hand-holding.
2. **Show the money early.** Treaty savings amount is the hook that keeps students engaged.
3. **Cite everything.** Every fact links to IRS.gov. "Don't trust us — trust the IRS."
4. **No dead ends.** Every screen has a clear next action. Error states explain what to do.
5. **Bilingual is native, not translated.** Chinese copy uses terms students actually search (报税, 非居民) — not formal/literary Chinese.

---

## 7. Competitive Positioning

| | Sprintax | Glacier Tax Prep | ShuiYi |
|---|---------|-----------------|--------|
| **Price** | $50+ federal, $25-50/state | Free via universities | Free |
| **Form 8843** | Free | Yes | Yes (PDF generator) |
| **Status determination** | Manual (student must know) | Interview-based | Automated from visa + date |
| **Treaty calculator** | Built into filing | Basic | Standalone with dollar preview |
| **FICA checker** | No | No | Yes + employer letter |
| **Year-5 warning** | No | No | Yes with countdown |
| **Immigration guidance** | No | No | Yes (fact vs myth) |
| **Bilingual** | Partial (Chinese blog posts) | English only | Full EN/ZH toggle |
| **E-filing** | Yes (federal) | No (paper only) | No (educational tool) |
| **1040-NR preparation** | Yes | Yes | No (out of scope) |

**ShuiYi complements, not replaces, Sprintax.** We handle the "before Sprintax" problem: students who don't know what they need, what forms to file, or what benefits they're missing. The natural flow is: ShuiYi tells you what to do → Sprintax/CPA helps you file.

---

## 8. Technical Architecture

- **Platform:** HTML/TypeScript SPA on Cloudflare Pages
- **Styling:** Tailwind CSS via CDN with custom theme
- **PDF:** pdf-lib (client-side, fill official IRS Form 8843 template)
- **State:** sessionStorage (cleared on tab close, no persistence, no server)
- **i18n:** Single i18n.ts file with {en, zh} string objects; toggle switches all text
- **PWA:** manifest.json + basic service worker for installability
- **Analytics:** Cloudflare Web Analytics (no cookies)
- **Privacy:** Zero server-side storage. No cookies. No user accounts. No tracking. Privacy by architecture.

---

## 9. Feature Prioritization (MoSCoW)

### Must Have (Sprint 1 — MVP)
1. NRA vs RA status wizard (4 questions → answer)
2. Form 8843 PDF generator (pdf-lib, official template)
3. Bilingual toggle (EN/ZH, instant switch)
4. Wizard flow with progress bar (one question per screen)
5. Legal disclaimers on every output
6. Mobile-responsive design (375px, 768px, 1024px)

### Should Have (Sprint 2 — Value Add)
7. Treaty benefit calculator (China, India, Korea, Japan, Bangladesh, Canada + no-treaty countries)
8. FICA exemption checker + employer letter
9. Year-5 transition countdown
10. Immigration risk explainer (FAQ format)
11. State tax awareness (50 states, flag non-treaty states)
12. Source citations inline, reassuring microcopy, analytics

### Could Have (Sprint 3 — Polish)
13. PWA manifest + service worker
14. Landing page with SEO
15. Share cards for WeChat/WhatsApp
16. Dark mode
17. Print-friendly CSS

### Won't Have
- Tax filing / e-filing (regulated)
- 1040-NR generation (regulatory risk)
- User accounts / server storage
- Payments / premium features
- Native mobile apps
- AI chatbot

---

## 10. Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Wizard completion rate | >60% | Cloudflare Analytics (step-by-step events) |
| Form 8843 downloads | Track monthly | Client-side event counter |
| Language toggle usage | Track % Chinese | Analytics |
| Treaty calculator engagement | >40% of users who reach it | Analytics |
| University ISO adoption | 5+ universities share the link in year 1 | Manual tracking |
| WeChat/Reddit mentions | Organic sharing | Search monitoring |

---

## 11. Distribution Strategy

| Tier | Channel | Timing |
|------|---------|--------|
| **Tier 1** | University ISO offices, WeChat CSSA groups | August orientation + January tax season |
| **Tier 2** | Reddit (r/f1visa, r/immigration), student orgs | January-April |
| **Tier 3** | Google Ads ("F1 student taxes"), TikTok, Xiaohongshu | February-April (seasonal) |

Key insight: August orientation is the BEST time to reach students before they make mistakes. January-April is when they're already panicking.

---

## 12. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Tax law changes (treaty modifications, new forms) | Medium | High | Treaty data and constants in separate data files; easy to update annually |
| Regulatory challenge ("is this tax preparation?") | Low | High | Client-side only, free, disclaimers everywhere, no 1040-NR generation |
| Student data privacy concern | Low | Medium | Zero server storage, sessionStorage only, no cookies |
| IRS Form 8843 template changes | Medium | Medium | Download latest template annually; pdf-lib field mapping in one file |
| International student enrollment decline | Medium | Medium | OPT segment still growing; tool is free so no revenue risk |
| Incorrect treaty data | Low | High | All treaty data sourced from IRS Publication 901; include "verify with IRS" links |

---

## Sources

This design synthesizes findings from 18 research reports:
- Reports 01-04: Tax law overview, income types, treaties, common mistakes
- Report 05: Detailed IRC sections and penalty structure
- Report 06: State tax deep dive (13 non-treaty states)
- Report 07: Student pain points (20+ real quotes)
- Report 08: Competitive landscape ($67-113M TAM)
- Report 09: Tax treaties by country (14 detailed + 25 bonus)
- Report 10: Immigration consequences (fact vs myth)
- Reports 11-13: Chinese student focus, Indian student focus, head-to-head comparison
- Report 14: Root cause analysis (5 Whys, design implications)
- Reports 15-17: Product opportunities, regulatory landscape, student behavior
- Report 18: Must-have features (MoSCoW), app vs web, UX patterns
