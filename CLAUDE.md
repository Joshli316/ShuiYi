# ShuiYi 税易

Free, bilingual (EN/ZH) tax guidance web app for international students in the US. Helps students determine their tax status, generate Form 8843, calculate treaty benefits, check FICA exemption, and understand immigration implications — without being a tax preparer.

## Tech Stack
- HTML/TypeScript single-page app
- Tailwind CSS (CDN)
- pdf-lib for Form 8843 PDF generation (client-side)
- Cloudflare Pages deployment
- PWA manifest for installability
- No server, no database, no user accounts — 100% client-side

## Structure
```
ShuiYi/
├── index.html          # Entry point, app shell, wizard container
├── plan.md             # Implementation plan
├── CLAUDE.md           # This file
├── manifest.json       # PWA manifest
├── src/
│   ├── app.ts          # Main app logic, wizard controller, router
│   ├── i18n.ts         # Bilingual strings (EN/ZH), toggle logic
│   ├── wizard/
│   │   ├── status.ts   # NRA vs RA status determination wizard
│   │   ├── form8843.ts # Form 8843 data collection + PDF generation
│   │   ├── treaty.ts   # Treaty benefit calculator by country
│   │   ├── fica.ts     # FICA exemption checker + employer letter
│   │   ├── year5.ts    # Year-5 transition countdown
│   │   └── immigration.ts  # Immigration risk explainer
│   ├── data/
│   │   ├── treaties.ts # Treaty data by country (article, amount, duration)
│   │   ├── states.ts   # State tax info (income tax, treaty conformity)
│   │   └── constants.ts # Tax brackets, standard deduction, FICA rates
│   ├── utils/
│   │   ├── pdf.ts      # pdf-lib wrapper for Form 8843 generation
│   │   ├── spt.ts      # Substantial Presence Test calculator
│   │   └── storage.ts  # sessionStorage wrapper for wizard state
│   └── styles/
│       └── print.css   # Print-friendly stylesheet
├── assets/
│   ├── form8843-blank.pdf  # Official IRS Form 8843 template
│   └── icons/          # PWA icons (192x192, 512x512)
└── dist/               # Build output for deployment
```

## Entry Point
index.html

## Deployment
`wrangler pages deploy dist/`

## Conventions
- **Bilingual:** All user-facing strings go in i18n.ts. Keys are English, values are {en, zh} objects. Toggle switches ALL visible text.
- **Wizard flow:** One question per screen. Linear with branching. Progress bar on every step.
- **Disclaimers:** Every output screen includes "For informational purposes only. This is not tax advice. Consult a qualified tax professional."
- **Tone:** Friendly, conversational, reassuring. "Let's figure this out together" not "Determine your filing status." 6th-8th grade reading level.
- **Sources:** Every factual claim links to IRS.gov or treaty text. Inline citations, not footnotes.
- **Privacy:** Zero server-side storage. sessionStorage for wizard state (cleared on tab close). No cookies. No analytics cookies.
- **Accessibility:** WCAG AA contrast, keyboard navigation, ARIA labels, 44px touch targets, lang attribute switches on toggle.
- **No tax preparation:** We determine status, calculate estimates, generate Form 8843, and educate. We do NOT generate 1040-NR, file returns, or provide tax advice.
- **Estimates language:** Always use "approximately," "may," "based on your inputs" — never "you owe exactly $X."
