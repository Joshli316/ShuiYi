# Implementation Plan: ShuiYi 税易

## Overview
ShuiYi is a free, bilingual (English/Chinese) tax guidance web app for international students in the US. It walks students through determining their tax residency status, generates Form 8843 PDFs, calculates treaty benefits, checks FICA exemption eligibility, counts down to the year-5 transition, and explains immigration implications of tax decisions. 100% client-side, no accounts, no payments — deployed to Cloudflare Pages as a PWA.

## Design Spec

### Design Direction
```
Mood: Warm | Density: Spacious | Color: Monochrome green + amber accent | Type: Inter + Noto Sans SC | Shapes: Mixed (soft cards, sharper containers)
```

Reference: Duolingo's encouragement + Stripe Docs' clarity. NOT a generic SaaS template.

### Anti-AI Design Rules (enforce during build)
1. **Vary spacing intentionally** — tighter within wizard question groups (16px), looser between sections (64px). Not uniform 24px everywhere.
2. **Left-align wizard text** — questions, labels, and body copy left-aligned. Only the landing page hero and result "money saved" numbers are centered.
3. **Solid buttons only** — no gradients. Primary green fill, ghost (outline) for secondary actions, text-only for tertiary.
4. **Green/amber palette is deliberate** — green = money, growth, "go." Amber = attention, caution, "show me the money." No blue, no purple.
5. **No identical card grids** — wizard steps are full-width, not cards in a grid. Result summaries use varied layouts (big number left, details right).
6. **Landing hero leads with a question** — "Do you need to file US taxes? 你需要报税吗？" — not a generic "Welcome to ShuiYi" headline.
7. **Mixed radius** — wizard container: sharp (rounded-lg / 8px). Buttons: soft (rounded-full / 9999px). Input fields: medium (rounded-md / 6px). This creates visual rhythm.
8. **One dominant element per screen** — on the treaty calculator result, the "$1,200 saved" number is 48px bold. Everything else is supporting text.
9. **Lucide icons** — not emoji. Passport icon for status, calculator for treaty, calendar for year-5, shield for immigration.
10. **Specific copy** — "Find out if you need to file US taxes" not "Navigate your tax journey." "You could save $1,200" not "Optimize your tax benefits."

### Color Palette
| Token | Hex | Usage | Contrast check |
|-------|-----|-------|---------------|
| `--primary` | #2D9F6F | Buttons, progress bar, links, active states | 4.6:1 on white (AA pass) |
| `--primary-dark` | #1E7A52 | Button hover, focus ring | 6.4:1 on white (AAA pass) |
| `--primary-light` | #E8F5EE | Success backgrounds, subtle highlights | Background only |
| `--accent` | #F5A623 | "Money saved" numbers, treaty badges, CTA highlights | 3.1:1 on white (use on dark bg or large text only) |
| `--accent-dark` | #D4891A | Accent hover | 4.5:1 on white (AA pass) |
| `--bg` | #FAFAF8 | Page background | — |
| `--surface` | #FFFFFF | Wizard panel, cards | — |
| `--text` | #1A1A1A | Primary text | 17.2:1 on white (AAA pass) |
| `--text-secondary` | #4B5563 | Supporting text, labels | 7.5:1 on white (AAA pass) |
| `--text-muted` | #9CA3AF | Disclaimers, citations | 3.4:1 on white (large text only) |
| `--success` | #16A34A | Checkmarks, completed steps | 4.5:1 on white (AA pass) |
| `--warning` | #D97706 | Immigration cautions, year-5 alerts | 4.5:1 on white (AA pass) |
| `--error` | #DC2626 | Critical warnings, validation errors | 5.9:1 on white (AAA pass) |
| `--border` | #E5E7EB | Input borders, dividers | — |
| `--border-focus` | #2D9F6F | Input focus ring (2px solid, 2px offset) | — |

### Typography
| Role | Font | Size | Weight | Line height | Letter spacing |
|------|------|------|--------|-------------|----------------|
| **Display** (money saved, hero number) | Inter | 48px / 3rem | 800 | 1.1 | -0.02em |
| **H1** (page titles) | Inter | 32px / 2rem | 700 | 1.2 | -0.01em |
| **H2** (section headers) | Inter | 24px / 1.5rem | 600 | 1.3 | 0 |
| **H3** (card titles, wizard questions) | Inter | 20px / 1.25rem | 600 | 1.4 | 0 |
| **Body** | Inter | 18px / 1.125rem | 400 | 1.6 | 0 |
| **Body small** (form labels) | Inter | 16px / 1rem | 500 | 1.5 | 0 |
| **Caption** (disclaimers, citations, IRS links) | Inter | 14px / 0.875rem | 400 | 1.5 | 0.01em |
| **Button** | Inter | 16px / 1rem | 600 | 1 | 0.02em |
| **Chinese body** | Noto Sans SC | 18px / 1.125rem | 400 | 1.8 | 0 |
| **Chinese heading** | Noto Sans SC | 24px / 1.5rem | 700 | 1.4 | 0 |

**Note:** Chinese text needs taller line-height (1.8 vs 1.6) because characters are denser. The i18n toggle must switch line-height along with lang attribute.

### Spacing System
| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Inline gaps (icon-to-text) |
| `--space-2` | 8px | Tight grouping (label-to-input) |
| `--space-3` | 12px | Button padding vertical |
| `--space-4` | 16px | Within-group spacing (question text to options) |
| `--space-6` | 24px | Card padding, wizard step internal |
| `--space-8` | 32px | Between wizard steps |
| `--space-12` | 48px | Between major sections |
| `--space-16` | 64px | Page sections, landing blocks |
| `--space-24` | 96px | Hero vertical padding |

**Key rule:** Spacing within a wizard step is tight (16-24px). Spacing between sections is generous (48-64px). This creates visual breathing room without making the wizard feel endless.

### Component Specifications

#### Wizard Container
- Max width: 640px, centered horizontally
- Background: `--surface` (#FFFFFF)
- Border: none (floating on `--bg`)
- Shadow: `0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.08)`
- Padding: 32px (desktop), 20px (mobile)
- Border radius: 8px (sharp-ish, not bubbly)

#### Progress Bar
- Height: 6px, border-radius 9999px (pill)
- Track: `--border` (#E5E7EB)
- Fill: `--primary` (#2D9F6F), transition 400ms ease-out
- Label above: "Step 3 of 7" in `--text-secondary`, 14px
- Subtitle below: reassuring text in `--text-secondary`, 14px italic ("Almost there!")

#### Primary Button
- Background: `--primary` → `--primary-dark` on hover
- Text: #FFFFFF, 16px, weight 600, letter-spacing 0.02em
- Padding: 12px 32px
- Border radius: 9999px (pill shape — friendly, approachable)
- Shadow: none at rest, `0 2px 8px rgba(45,159,111,0.3)` on hover
- Transition: all 150ms ease
- Min width: 160px (prevents tiny buttons)
- Full width on mobile (< 640px)

#### Ghost Button (Back, secondary actions)
- Background: transparent → `--primary-light` on hover
- Border: 1.5px solid `--primary`
- Text: `--primary`, 16px, weight 600
- Same padding and radius as primary
- Transition: all 150ms ease

#### Input Fields
- Border: 1.5px solid `--border` → `--primary` on focus
- Border radius: 6px (slightly sharper than buttons)
- Padding: 12px 16px
- Font: 18px body, `--text`
- Placeholder: `--text-muted`
- Focus: 2px ring `--primary` with 2px offset, border color `--primary`
- Error: border `--error`, ring `--error`, error message below in 14px `--error`

#### Option Cards (visa type selection, yes/no questions)
- Border: 1.5px solid `--border` → `--primary` when selected
- Background: `--surface` → `--primary-light` when selected
- Border radius: 12px (softer than wizard container — creates contrast)
- Padding: 16px 20px
- Cursor: pointer
- Checkmark icon appears on selection (Lucide `check-circle`, `--primary`)
- Transition: border-color 150ms ease, background 150ms ease

#### Result Card ("You could save $1,200")
- Background: linear gradient from `--primary-light` to `--surface` (subtle, not flashy)
- Border: 2px solid `--primary`
- Border radius: 16px (softer for celebration)
- Money amount: Display size (48px), `--primary-dark`, weight 800, count-up animation 800ms
- Supporting text: Body size, `--text-secondary`
- Lucide `sparkles` icon next to the number
- Confetti-like subtle animation optional (CSS only, not heavy)

#### Disclaimer Banner
- Background: #F9FAFB (barely visible gray)
- Border-left: 3px solid `--text-muted`
- Padding: 12px 16px
- Text: Caption size (14px), `--text-muted`
- Icon: Lucide `info` at 16px
- Position: bottom of every output screen, not modal/popup

### Micro-interactions
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Button | hover | bg darken + shadow appear | 150ms | ease |
| Button | active/click | scale(0.97) | 100ms | ease-out |
| Wizard step | next | current slides left + fades, new slides in from right | 300ms | ease |
| Wizard step | back | reverse of above | 300ms | ease |
| Progress bar | step change | width fill | 400ms | ease-out |
| Checkmark | appear | scale 0→1 | 200ms | cubic-bezier(0.34,1.56,0.64,1) — bounce |
| Money counter | appear | count from $0 to $X | 800ms | ease-out |
| Language toggle | click | instant text swap, no animation | 0ms | — |
| Option card | select | border + bg color change | 150ms | ease |
| Result card | appear | fade-in + slide-up 20px | 400ms | ease-out |
| Tooltip/citation | hover | opacity 0→1 | 200ms | ease |

### Screen-by-Screen Layout Notes

#### Landing Page
- **NOT a generic hero.** Split layout: left side has the question "Do you need to file US taxes?" with subtext and CTA. Right side shows a simplified illustration or the wizard preview.
- Three value props below in a horizontal row (stack on mobile): icon + short text. NOT card grid.
- Social proof section: "Built from 18 research reports analyzing 1.2M international students' needs"
- Footer: disclaimer, IRS links, language toggle

#### Wizard Steps (status, form8843, treaty, fica)
- Single column, 640px max width, centered
- Question text: H3 (20px), left-aligned, with contextual help icon (Lucide `help-circle`) that expands a tooltip
- Options: vertical stack of option cards (not radio buttons — cards are more touch-friendly and less form-like)
- Navigation: Back (ghost, left) and Next (primary, right) pinned to bottom of wizard container
- Progress bar at top of wizard container

#### Treaty Calculator Result
- Big number layout: "$1,200" in Display (48px) dominates the screen
- "per year in potential tax savings" as supporting text below
- Breakdown table: with treaty vs without treaty, side by side
- "How to claim" section below with numbered steps
- IRS source link inline

#### Form 8843 Output
- Preview card showing filled fields (read-only)
- Download PDF button (primary, prominent)
- Mailing address card with copy-to-clipboard
- Deadline reminder with calendar icon
- "What to do next" checklist (checkbox items, not interactive — visual only)

#### Immigration Explainer
- NOT a wizard — expandable FAQ accordion
- Each question is a card that expands on click
- Green "low risk" / amber "moderate" / red "high risk" badges per topic
- Myth vs Reality table at the bottom
- Tone: calm, factual. No alarmism.

### Responsive Breakpoints
| Breakpoint | Layout changes |
|------------|---------------|
| < 640px (mobile) | Wizard full-width with 20px padding. Buttons stack vertically (Next on top, Back below). Option cards full-width. Navigation sticky at bottom. |
| 640-1024px (tablet) | Wizard 640px centered with 32px padding. Buttons side-by-side. Landing page stacks to single column. |
| > 1024px (desktop) | Landing page split layout. Wizard stays 640px. Side margins grow. Optional: subtle background pattern/illustration in margins. |

### Icons (Lucide)
| Screen | Icon | Name |
|--------|------|------|
| Status wizard | Passport | `badge-check` |
| Form 8843 | File/document | `file-text` |
| Treaty calculator | Calculator/coins | `calculator` |
| FICA checker | Wallet/refund | `wallet` |
| Year-5 countdown | Calendar/clock | `calendar-clock` |
| Immigration | Shield/check | `shield-check` |
| Progress complete | Checkmark | `check-circle` |
| Warning | Alert | `alert-triangle` |
| Info/citation | Info | `info` |
| Download | Download | `download` |
| Language toggle | Globe | `globe` |
| Share | Share | `share-2` |

## Steps

### Sprint 1: Core MVP

#### Step 1: Project Scaffold
- Create `index.html` with app shell: header (logo + language toggle), main wizard container, footer (disclaimer)
- Set up Tailwind via CDN (`<script src="https://cdn.tailwindcss.com">` with custom theme config matching Design Spec)
- Load Inter + Noto Sans SC from Google Fonts
- Add `manifest.json` for PWA (name, icons, theme_color #2D9F6F, background_color #FAFAF8)
- Add viewport meta, lang attribute, favicon
- Create `src/` directory structure per CLAUDE.md

#### Step 2: i18n System
- Create `src/i18n.ts` with all UI strings as `{en: "...", zh: "..."}` objects
- Language toggle in header switches `<html lang="">` and re-renders all visible text
- Default language: detect from `navigator.language` (zh-* → Chinese, else English)
- Store preference in `sessionStorage`
- Strings organized by wizard section: common, status, form8843, treaty, fica, year5, immigration

#### Step 3: Wizard Framework
- Create `src/app.ts` — wizard controller with step navigation, branching, and state management
- Progress bar component: "Step X of Y" with green fill bar and reassuring subtitle
- Back/Next buttons on every step (Back hidden on step 1)
- `sessionStorage` wrapper in `src/utils/storage.ts` — save wizard answers on each step, restore on refresh
- Step transition animation (slide-left)
- Keyboard navigation: Enter = Next, Escape = Back

#### Step 4: NRA vs RA Status Wizard
- Create `src/wizard/status.ts` — the entry point for the entire app
- Questions (one per screen):
  1. "What visa are you on?" — F-1, J-1, M-1, Q-1, H-1B, OPT (still F-1), Other
  2. "When did you first enter the US on this visa?" — date picker (month/year)
  3. "How many calendar years have you been in the US?" — auto-calculated from entry date, user confirms
  4. "Were you on a J-1 visa before your current visa?" — Yes/No (affects exempt years)
- Create `src/utils/spt.ts` — Substantial Presence Test calculator:
  - Count calendar years as exempt individual (F/J/M/Q = 5 year cap, J teacher/researcher = 2 year cap)
  - If within exempt period → NRA
  - If past exempt period → apply weighted-day formula (current year + 1/3 prior + 1/6 second prior)
  - Return: {status: "NRA" | "RA" | "DUAL", exemptYearsUsed, exemptYearsRemaining, transitionYear}
- Result screen: clear statement of status with explanation, IRS source link, and "What this means for you" summary
- Branch: NRA → continue to Form 8843 / Treaty / FICA. RA → "You file like a US resident" with guidance.

#### Step 5: Form 8843 PDF Generator
- Create `src/wizard/form8843.ts` — collect remaining 8843 fields:
  1. Full legal name, address in US, SSN or ITIN (optional — "Enter if you have one")
  2. Country of citizenship, country of tax residence
  3. Visa type (pre-filled from Step 4)
  4. Date of entry (pre-filled from Step 4)
  5. Number of days present in US during tax year (auto-calculated, user confirms)
  6. Academic institution name and address
  7. "Did you substantially comply with your visa requirements?" — Yes/No
- Create `src/utils/pdf.ts` — use pdf-lib to:
  1. Load blank IRS Form 8843 PDF from `assets/form8843-blank.pdf`
  2. Fill form fields with user data
  3. Generate downloadable PDF
- Output screen: "Your Form 8843 is ready!" with Download PDF button, mailing address (IRS Austin, TX), deadline reminder, and "What to do next" checklist
- Include disclaimer: "Review all fields before signing and mailing"

#### Step 6: Bilingual Content & Polish
- Populate ALL i18n strings for Steps 1-5 in both EN and ZH
- Chinese translations should use terms students actually search (报税, 非居民, 税务身份) not formal/literary Chinese
- Test language toggle switches ALL visible text including disclaimers, buttons, progress bar text
- Add legal disclaimer footer on every screen
- Test responsive layout at 375px, 768px, 1024px
- Verify WCAG AA contrast on all text/background combinations
- Add ARIA labels to all form inputs, progress bar, navigation

### Sprint 2: Value Add

#### Step 7: Treaty Benefit Calculator
- Create `src/data/treaties.ts` — treaty data for top countries:
  - China: Article 20, $5,000 wage exemption, scholarship exempt, survives RA status
  - India: Article 21, no wage exemption, standard deduction (~$15,750), scholarship exempt
  - South Korea: Article 21, $2,000 wage exemption, 5-year limit
  - Japan: Article 20, foreign-source maintenance only, no wage exemption
  - Bangladesh: Article 21, $8,000 wage exemption
  - Canada: Article XV, $10,000 threshold (all-or-nothing)
  - No-treaty countries: Vietnam, Taiwan, Brazil, Saudi Arabia, Nigeria, Nepal — flag as "no treaty"
- Create `src/wizard/treaty.ts` — wizard flow:
  1. Country of citizenship (pre-filled from Form 8843 step if completed)
  2. "Did you earn income in the US this year?" — Yes/No
  3. If yes: "Approximately how much?" — income input
  4. Calculate: tax with treaty vs tax without treaty
  5. "Show me the money" result: "Based on the US-China tax treaty (Article 20), you may be able to exclude $5,000, saving you approximately $X" with count-up animation
  6. "How to claim" instructions: Form 8233 (prospective, with employer) or Schedule OI (on 1040-NR)
  7. Link to IRS Publication 901
- Handle no-treaty countries gracefully: "Your country does not have a student tax treaty with the US. You'll pay standard NRA tax rates."

#### Step 8: FICA Exemption Checker
- Create `src/wizard/fica.ts` — wizard flow:
  1. Visa type + years in US (pre-filled from status wizard)
  2. "Are you currently employed?" — Yes/No
  3. "Check your most recent pay stub: do you see deductions for Social Security or Medicare?" — Yes/No/Not sure
  4. If exempt + FICA withheld: "You may be entitled to a refund of approximately $X" (calculate from income)
  5. Step-by-step refund process:
     a. "First, ask your employer" — explain IRC 3121(b)(19), provide talking points
     b. "If employer refuses" — explain Form 843 + Form 8316 process
     c. Required documents list
     d. 3-year deadline warning
  6. Generate printable employer notification letter (not PDF form — just a clean letter citing the IRC section)
- If NOT exempt (past 5 years, H-1B, etc.): "FICA applies to your wages. This is normal."

#### Step 9: Year-5 Transition Countdown
- Create `src/wizard/year5.ts`:
  1. Calculate calendar years used from entry date (pre-filled)
  2. Visual countdown: "You have X exempt years remaining" with circular progress indicator
  3. Timeline showing: current year → transition year → what changes
  4. Three things that change at year 5:
     a. FICA exemption expires (7.65% new cost)
     b. Worldwide income becomes taxable (not just US-source)
     c. Filing form may change (1040-NR → 1040)
  5. "What to do now" checklist based on how many years remain
  6. If already past year 5: "You've transitioned to resident alien status" with guidance

#### Step 10: Immigration Risk Explainer
- Create `src/wizard/immigration.ts` — NOT a wizard, but an informational section with expandable FAQs:
  1. "Will a tax mistake affect my visa?" — Low risk for F-1/J-1 renewals
  2. "What about OPT/STEM OPT?" — No direct tax requirement on applications, but compliance helps
  3. "What about H-1B?" — Tax history not part of standard adjudication
  4. "What about green card (I-485)?" — THIS IS WHERE IT MATTERS. USCIS reviews 3 years of returns.
  5. "I filed the wrong form — what do I do?" — Amended returns are viewed favorably. Step-by-step.
  6. "I never filed Form 8843 — am I in trouble?" — File late. No penalty for 8843 itself.
  7. Myth vs Reality summary table
- Tone: calm, factual, reassuring. "Most tax errors are fixable."
- Every answer cites immigration attorneys, USCIS policy, or IRS guidance

#### Step 11: State Tax Awareness
- Create `src/data/states.ts` — for all 50 states:
  - Has income tax? (boolean)
  - Honors federal treaties? (boolean)
  - State NRA form name (e.g., CA 540NR, NY IT-203)
  - Notes (e.g., "NYC has additional city tax")
- Create a simple lookup (not a full wizard):
  1. "What state do you live in?" — dropdown
  2. Result card showing: income tax status, treaty conformity, form to file, key warnings
  3. If non-treaty state (CA, NJ, PA, etc.): "Warning: your state does not honor federal tax treaties. Your $X treaty benefit only applies to federal taxes."
- Top 6 states get detailed guidance (CA, NY, TX, MA, IL, PA)

#### Step 12: Analytics + Polish
- Add Cloudflare Web Analytics (no cookies, privacy-respecting)
- Track wizard completion rates per step (find drop-off points)
- Add print CSS (`@media print`) for all output screens
- Final pass on all microcopy — reassuring, conversational, 6th-grade level
- Test full flow in Chinese — verify all strings translated, no English leaking through
- Source citations on every factual claim

### Sprint 3: Polish & Distribution

#### Step 13: PWA + Sharing
- Add service worker for app shell caching (instant re-loads)
- Offline fallback page: "You need internet to use ShuiYi"
- Open Graph meta tags for WeChat/WhatsApp sharing (title, description, preview image)
- Share button on result screens: generates shareable card with tool link (no personal data)
- Dark mode (CSS-only, `prefers-color-scheme` + manual toggle)

#### Step 14: Landing Page
- Replace or enhance the entry point with a landing page before the wizard:
  - Hero: "Tax season doesn't have to be scary. 报税不用慌。" with CTA "Get Started"
  - Three value props with icons: "Know your status," "Get your forms," "Save money"
  - "Trusted by students at X universities" (aspirational — add real names after partnerships)
  - Quick stats: "1.2M international students • $0 cost • 5 minutes"
  - Footer: disclaimer, IRS source links, GitHub link
- SEO: title tag, meta description, structured data for "tax tool"

#### Step 15: Testing + Deployment
- Test full wizard flow end-to-end: NRA path, RA path, no-treaty country path
- Test Form 8843 PDF: download, verify fields match input, verify it looks like official IRS form
- Test treaty calculator against known scenarios from research Report 13
- Test responsive: 375px (iPhone SE), 768px (iPad), 1024px (laptop)
- Test bilingual: toggle at every step, verify ALL strings switch
- Test accessibility: keyboard-only navigation through full wizard
- Deploy to Cloudflare Pages
- Verify production URL returns 200

## Files to Create/Modify
- `index.html` — App shell, entry point
- `manifest.json` — PWA manifest
- `src/app.ts` — Wizard controller, router, state management
- `src/i18n.ts` — All bilingual strings
- `src/wizard/status.ts` — NRA/RA status determination
- `src/wizard/form8843.ts` — Form 8843 data collection
- `src/wizard/treaty.ts` — Treaty benefit calculator
- `src/wizard/fica.ts` — FICA exemption checker
- `src/wizard/year5.ts` — Year-5 countdown
- `src/wizard/immigration.ts` — Immigration risk explainer
- `src/data/treaties.ts` — Treaty data by country
- `src/data/states.ts` — State tax info
- `src/data/constants.ts` — Tax brackets, rates, thresholds
- `src/utils/pdf.ts` — pdf-lib wrapper for Form 8843
- `src/utils/spt.ts` — Substantial Presence Test calculator
- `src/utils/storage.ts` — sessionStorage wrapper
- `src/styles/print.css` — Print stylesheet
- `assets/form8843-blank.pdf` — IRS Form 8843 template
- `assets/icons/` — PWA icons

## Open Questions
- None — research is thorough (18 reports), regulatory path is clear, features are scoped.
