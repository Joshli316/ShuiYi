// Bilingual string system (EN/ZH)
// All user-facing strings go here. No hardcoded English in UI code.

export type Lang = 'en' | 'zh';

interface StringPair { en: string; zh: string; }

let currentLang: Lang = 'en';
const listeners: Array<() => void> = [];

export function getLang(): Lang { return currentLang; }

export function setLang(lang: Lang): void {
  currentLang = lang;
  document.documentElement.lang = lang;
  if (lang === 'zh') {
    document.documentElement.style.setProperty('--line-height-body', '1.8');
  } else {
    document.documentElement.style.setProperty('--line-height-body', '1.6');
  }
  try { sessionStorage.setItem('shuiyi_lang', lang); } catch {}
  listeners.forEach(fn => fn());
}

export function initLang(): void {
  try {
    const saved = sessionStorage.getItem('shuiyi_lang') as Lang | null;
    if (saved) { setLang(saved); return; }
  } catch {}
  const nav = navigator.language || '';
  setLang(nav.startsWith('zh') ? 'zh' : 'en');
}

export function onLangChange(fn: () => void): void { listeners.push(fn); }

export function t(key: string): string {
  const pair = strings[key];
  if (!pair) return key;
  return pair[currentLang];
}

// All strings organized by section
const strings: Record<string, StringPair> = {
  // === COMMON ===
  'common.next': { en: 'Next', zh: '下一步' },
  'common.back': { en: 'Back', zh: '返回' },
  'common.getStarted': { en: 'Get Started', zh: '开始使用' },
  'common.download': { en: 'Download PDF', zh: '下载PDF' },
  'common.startOver': { en: 'Start Over', zh: '重新开始' },
  'common.continue': { en: 'Continue', zh: '继续' },
  'common.yes': { en: 'Yes', zh: '是' },
  'common.no': { en: 'No', zh: '否' },
  'common.notSure': { en: 'Not sure', zh: '不确定' },
  'common.skip': { en: 'Skip for now', zh: '暂时跳过' },
  'common.learnMore': { en: 'Learn more', zh: '了解更多' },
  'common.copy': { en: 'Copy', zh: '复制' },
  'common.copied': { en: 'Copied!', zh: '已复制！' },
  'common.share': { en: 'Share this tool', zh: '分享这个工具' },
  'common.print': { en: 'Print', zh: '打印' },
  'common.close': { en: 'Close', zh: '关闭' },

  // Language toggle
  'lang.toggle': { en: '中文', zh: 'EN' },

  // Disclaimer
  'disclaimer.text': { en: 'For informational purposes only. This is not tax advice. Consult a qualified tax professional for your specific situation.', zh: '仅供参考，不构成税务建议。请咨询专业税务人员了解您的具体情况。' },
  'disclaimer.reviewFields': { en: 'Review all fields before signing and mailing.', zh: '签名和邮寄前请核实所有信息。' },

  // Progress bar
  'progress.step': { en: 'Step', zh: '第' },
  'progress.of': { en: 'of', zh: '步，共' },
  'progress.ofSuffix': { en: '', zh: '步' },
  'progress.almostThere': { en: 'Almost there!', zh: '快完成了！' },
  'progress.greatStart': { en: 'Great start!', zh: '好的开始！' },
  'progress.keepGoing': { en: 'You\'re doing great!', zh: '做得好！' },
  'progress.halfway': { en: 'Halfway there!', zh: '已完成一半！' },

  // === LANDING PAGE ===
  'landing.heroQuestion': { en: 'Do you need to file US taxes?', zh: '你需要报税吗？' },
  'landing.heroSubtext': { en: 'Find out in 5 minutes. Free. No account needed.', zh: '5分钟搞定。完全免费。无需注册。' },
  'landing.cta': { en: 'Find out now', zh: '立即查询' },
  'landing.value1Title': { en: 'Know your status', zh: '了解你的税务身份' },
  'landing.value1Desc': { en: 'Are you a Nonresident Alien or Resident Alien? We\'ll figure it out together.', zh: '你是非居民外国人还是居民外国人？我们帮你搞清楚。' },
  'landing.value2Title': { en: 'Get your forms', zh: '获取你的税表' },
  'landing.value2Desc': { en: 'Generate a pre-filled Form 8843 PDF ready to print and mail.', zh: '生成预填好的8843表格PDF，可直接打印邮寄。' },
  'landing.value3Title': { en: 'Save money', zh: '省钱' },
  'landing.value3Desc': { en: 'Calculate your tax treaty benefits. Students save $500-$3,000 per year on average.', zh: '计算你的税务条约优惠。学生平均每年可节省$500-$3,000。' },
  'landing.socialProof': { en: 'Built from 18 research reports analyzing 1.2M international students\' needs', zh: '基于18份研究报告，分析120万国际学生的需求' },
  'landing.stats1': { en: '1.2M international students', zh: '120万国际学生' },
  'landing.stats2': { en: '$0 cost', zh: '完全免费' },
  'landing.stats3': { en: '5 minutes', zh: '5分钟完成' },
  'landing.taxSeason': { en: 'Tax season doesn\'t have to be scary.', zh: '报税不用慌。' },

  // === SECTION NAVIGATION ===
  'nav.status': { en: 'Tax Status', zh: '税务身份' },
  'nav.form8843': { en: 'Form 8843', zh: '8843表格' },
  'nav.treaty': { en: 'Treaty Benefits', zh: '条约优惠' },
  'nav.fica': { en: 'FICA Check', zh: 'FICA检查' },
  'nav.year5': { en: 'Year-5 Countdown', zh: '第5年倒计时' },
  'nav.immigration': { en: 'Immigration & Taxes', zh: '移民与税务' },
  'nav.state': { en: 'State Taxes', zh: '州税' },
  'nav.summary': { en: 'Your Checklist', zh: '你的清单' },

  // === STATUS WIZARD ===
  'status.title': { en: 'Let\'s determine your tax status', zh: '让我们确认你的税务身份' },
  'status.q1': { en: 'What visa are you on?', zh: '你持什么签证？' },
  'status.q1Help': { en: 'Select the visa type shown on your I-20 or DS-2019. If you\'re on OPT, you\'re still on F-1.', zh: '选择你的I-20或DS-2019上的签证类型。如果你在OPT期间，你仍然是F-1。' },
  'status.f1': { en: 'F-1 (Student)', zh: 'F-1（学生）' },
  'status.f1opt': { en: 'F-1 OPT (still F-1)', zh: 'F-1 OPT（仍为F-1）' },
  'status.j1': { en: 'J-1 (Exchange Visitor)', zh: 'J-1（交流访问者）' },
  'status.m1': { en: 'M-1 (Vocational Student)', zh: 'M-1（职业学生）' },
  'status.q1visa': { en: 'Q-1 (Cultural Exchange)', zh: 'Q-1（文化交流）' },
  'status.h1b': { en: 'H-1B (Work Visa)', zh: 'H-1B（工作签证）' },
  'status.other': { en: 'Other', zh: '其他' },

  'status.q2': { en: 'When did you first enter the US on this visa?', zh: '你何时首次持此签证入境美国？' },
  'status.q2Help': { en: 'Check your I-94 arrival record. Any part of a calendar year counts as a full year.', zh: '查看你的I-94入境记录。日历年中的任何时间都算一整年。' },
  'status.month': { en: 'Month', zh: '月份' },
  'status.year': { en: 'Year', zh: '年份' },

  'status.q3': { en: 'That means you\'ve been in the US for {years} calendar years. Does that sound right?', zh: '这意味着你已在美国{years}个日历年。对吗？' },
  'status.q3Confirm': { en: 'Yes, that\'s correct', zh: '是的，没错' },
  'status.q3Wrong': { en: 'No, let me adjust', zh: '不对，让我调整' },

  'status.q4': { en: 'Were you on a J-1 visa before your current visa?', zh: '在当前签证之前，你是否持有过J-1签证？' },
  'status.q4Help': { en: 'Prior J-1 time counts toward your 5-year exempt period.', zh: '之前的J-1时间会计入你的5年豁免期。' },

  // Status result
  'status.resultNRA': { en: 'You are a Nonresident Alien (NRA)', zh: '你是非居民外国人（NRA）' },
  'status.resultRA': { en: 'You are likely a Resident Alien (RA)', zh: '你可能是居民外国人（RA）' },
  'status.nraMeaning': { en: 'As an NRA, you file Form 1040-NR (not 1040) and are only taxed on US-source income. You must also file Form 8843.', zh: '作为NRA，你需要填报1040-NR表（不是1040表），只需对美国来源的收入纳税。你还必须填报8843表。' },
  'status.raMeaning': { en: 'As an RA, you file like a US citizen using Form 1040 and are taxed on worldwide income. Standard deduction and credits apply.', zh: '作为RA，你像美国公民一样使用1040表报税，需对全球收入纳税。可享受标准扣除和税收抵免。' },
  'status.exemptYears': { en: 'Exempt years used: {used} of {total}', zh: '已使用豁免年数：{used}/{total}' },
  'status.yearsRemaining': { en: '{years} exempt years remaining', zh: '剩余{years}年豁免期' },
  'status.nraNext': { en: 'Let\'s get your Form 8843 ready and check for money-saving treaty benefits.', zh: '接下来帮你准备8843表格，并查看是否有省钱的条约优惠。' },
  'status.raNext': { en: 'You file like a US resident. Here\'s what that means for you:', zh: '你需要按美国居民方式报税。以下是对你的具体影响：' },
  'status.irsSource': { en: 'Source: IRS Publication 519', zh: '来源：IRS Publication 519' },
  'status.continueToForm': { en: 'Continue to Form 8843', zh: '继续填写8843表格' },
  'status.continueToImmigration': { en: 'Continue to Immigration FAQ', zh: '继续查看移民常见问题' },
  'status.raGuidance1': { en: 'File Form 1040 (the same form US citizens use) — not Form 1040-NR.', zh: '使用1040表报税（和美国公民一样）——不是1040-NR。' },
  'status.raGuidance2': { en: 'You can claim the standard deduction ($15,700 for 2025). Most NRAs cannot, but you can.', zh: '你可以使用标准扣除额（2025年为$15,700）。大多数NRA不能，但你可以。' },
  'status.raGuidance3': { en: 'Worldwide income is now taxable — including income from your home country, not just US sources.', zh: '全球收入都需要纳税——包括来自母国的收入，不仅仅是美国来源。' },
  'status.raGuidance4': { en: 'FICA taxes apply (7.65% of wages for Social Security + Medicare). No more exemption.', zh: 'FICA税适用（工资的7.65%用于社会保障+医疗保险）。不再有豁免。' },
  'status.raGuidance5': { en: 'Good news: you can use TurboTax, H&R Block, or FreeTaxUSA — mainstream software works for RAs.', zh: '好消息：你可以使用TurboTax、H&R Block或FreeTaxUSA等主流报税软件——它们对RA适用。' },

  'status.hasIncome': { en: 'Did you earn any income in the US this year?', zh: '你今年在美国有任何收入吗？' },
  'status.hasIncomeHelp': { en: 'Include wages, stipends, scholarships beyond tuition, or any other US-source income.', zh: '包括工资、津贴、超出学费的奖学金或任何其他美国来源收入。' },
  'status.noIncome': { en: 'No income — I\'ll just need Form 8843', zh: '没有收入——我只需要8843表' },
  'status.yesIncome': { en: 'Yes, I earned income', zh: '是的，我有收入' },

  // === FORM 8843 ===
  'form8843.title': { en: 'Let\'s fill out your Form 8843', zh: '让我们填写你的8843表格' },
  'form8843.subtitle': { en: 'Every international student must file this form, even with no income.', zh: '每个国际学生都必须提交此表格，即使没有收入。' },
  'form8843.name': { en: 'Full legal name (as on passport)', zh: '法定全名（护照上的姓名）' },
  'form8843.address': { en: 'US address', zh: '美国地址' },
  'form8843.ssn': { en: 'SSN or ITIN (optional)', zh: 'SSN或ITIN（选填）' },
  'form8843.ssnHelp': { en: 'Enter if you have one. Many students don\'t — that\'s OK.', zh: '如果有的话请填写。很多学生没有——没关系。' },
  'form8843.citizenship': { en: 'Country of citizenship', zh: '国籍' },
  'form8843.taxResidence': { en: 'Country of tax residence', zh: '税务居住国' },
  'form8843.daysPresent': { en: 'Days present in the US during {year}', zh: '{year}年在美天数' },
  'form8843.daysHelp': { en: 'Count every day you were physically in the US, including partial days.', zh: '计算你在美国实际存在的每一天，包括部分天数。' },
  'form8843.school': { en: 'Academic institution name', zh: '学校名称' },
  'form8843.schoolAddress': { en: 'Academic institution address', zh: '学校地址' },
  'form8843.compliant': { en: 'Did you substantially comply with your visa requirements?', zh: '你是否实质性遵守了签证要求？' },
  'form8843.compliantHelp': { en: 'If you maintained your student status and followed visa rules, select Yes.', zh: '如果你保持了学生身份并遵守签证规定，请选择"是"。' },

  // Form 8843 result
  'form8843.ready': { en: 'Your Form 8843 is ready!', zh: '你的8843表格已准备好！' },
  'form8843.readySubtext': { en: 'Download, review, sign, and mail it to the IRS.', zh: '下载、核对、签名，然后邮寄给IRS。' },
  'form8843.mailTo': { en: 'Mail to:', zh: '邮寄至：' },
  'form8843.deadline': { en: 'Deadline: June 15, {year}', zh: '截止日期：{year}年6月15日' },
  'form8843.deadlineWithWages': { en: 'If you had wages: April 15, {year} (file with your 1040-NR)', zh: '如果有工资收入：{year}年4月15日（随1040-NR一起提交）' },
  'form8843.whatNext': { en: 'What to do next', zh: '下一步' },
  'form8843.step1': { en: 'Download and review the form', zh: '下载并核对表格' },
  'form8843.step2': { en: 'Sign and date at the bottom', zh: '在底部签名并填写日期' },
  'form8843.step3': { en: 'Mail to the IRS address above', zh: '邮寄到上述IRS地址' },
  'form8843.step4': { en: 'Keep a copy for your records', zh: '保留一份副本' },
  'form8843.continueToTreaty': { en: 'Check treaty benefits', zh: '查看条约优惠' },
  'form8843.skipToTreaty': { en: 'Skip to treaty benefits', zh: '跳到条约优惠' },

  // === TREATY CALCULATOR ===
  'treaty.title': { en: 'Check your tax treaty benefits', zh: '查看你的税务条约优惠' },
  'treaty.subtitle': { en: 'Many countries have tax treaties with the US that can save students money.', zh: '许多国家与美国签有税务条约，可以帮学生省钱。' },
  'treaty.country': { en: 'What is your country of citizenship?', zh: '你的国籍是什么？' },
  'treaty.selectCountry': { en: 'Select your country', zh: '选择你的国家' },
  'treaty.income': { en: 'Approximately how much US income did you earn this year?', zh: '你今年大约有多少美国收入？' },
  'treaty.incomeHelp': { en: 'Include wages, stipends, and taxable scholarships. Round to the nearest $100.', zh: '包括工资、津贴和应税奖学金。四舍五入到最接近的$100。' },

  // Treaty results
  'treaty.savings': { en: 'You could save approximately', zh: '你大约可以节省' },
  'treaty.perYear': { en: 'per year in potential tax savings', zh: '每年的潜在税务节省' },
  'treaty.based': { en: 'Based on the US-{country} tax treaty ({article})', zh: '基于美中税务条约（{article}）' },
  'treaty.exemptAmount': { en: 'Treaty exemption amount: ${amount}', zh: '条约豁免金额：${amount}' },
  'treaty.withTreaty': { en: 'Tax with treaty', zh: '使用条约后的税额' },
  'treaty.withoutTreaty': { en: 'Tax without treaty', zh: '不使用条约的税额' },
  'treaty.howToClaim': { en: 'How to claim this benefit', zh: '如何申请此优惠' },
  'treaty.claimStep1': { en: 'File Form 8233 with your employer (stops withholding before it happens)', zh: '向雇主提交8233表（在扣税前生效）' },
  'treaty.claimStep2': { en: 'Or claim on Schedule OI when filing your 1040-NR', zh: '或在提交1040-NR时在Schedule OI上申请' },
  'treaty.claimStep3': { en: 'Attach Form 8833 (Treaty-Based Return Position Disclosure) to your return', zh: '在税表上附上8833表（基于条约的纳税申报）' },
  'treaty.pub901': { en: 'Source: IRS Publication 901 — U.S. Tax Treaties', zh: '来源：IRS Publication 901 — 美国税务条约' },

  // No treaty
  'treaty.noTreaty': { en: 'No tax treaty available', zh: '无税务条约' },
  'treaty.noTreatyDesc': { en: 'Your country does not have a student tax treaty with the US. You\'ll pay standard NRA tax rates on your US income.', zh: '你的国家与美国没有学生税务条约。你需按标准NRA税率对美国收入纳税。' },
  'treaty.noTreatyStillFile': { en: 'You still need to file Form 8843 and, if you have income, Form 1040-NR.', zh: '你仍然需要提交8843表，如果有收入，还需要提交1040-NR。' },

  // Treaty terminated
  'treaty.terminated': { en: 'Treaty terminated or suspended', zh: '条约已终止或暂停' },
  'treaty.terminatedDesc': { en: 'The US tax treaty with {country} has been {status} as of {date}. Student treaty benefits are no longer available.', zh: '美国与{country}的税务条约已于{date}{status}。学生条约优惠不再适用。' },

  // Special cases
  'treaty.canadaWarning': { en: 'Important: Canada\'s treaty is all-or-nothing. If you earned over $10,000, the ENTIRE amount is taxable — not just the excess.', zh: '重要提示：加拿大条约是"全有或全无"的。如果收入超过$10,000，全部金额都要纳税——不仅仅是超出部分。' },
  'treaty.indiaStdDeduction': { en: 'India treaty benefit: You can claim the US standard deduction (${amount}) as an NRA — most NRAs cannot.', zh: '印度条约优惠：你可以作为NRA申请美国标准扣除（${amount}）——大多数NRA不能。' },
  'treaty.chinaSurvivesRA': { en: 'Note: China\'s treaty benefit survives transition to Resident Alien status — even after year 5, you may still claim the $5,000 exemption.', zh: '注意：中国的条约优惠在转为居民外国人后仍然有效——即使超过第5年，你仍可申请$5,000免税额。' },

  // === FICA ===
  'fica.title': { en: 'Check your FICA exemption', zh: '检查你的FICA豁免' },
  'fica.subtitle': { en: 'International students on certain visas are exempt from Social Security and Medicare taxes.', zh: '持特定签证的国际学生可免缴社会保障和医疗保险税。' },
  'fica.employed': { en: 'Are you currently employed?', zh: '你目前有工作吗？' },
  'fica.employedHelp': { en: 'Include on-campus jobs, OPT, CPT, or any other authorized employment.', zh: '包括校内工作、OPT、CPT或其他经授权的工作。' },
  'fica.payStub': { en: 'Check your most recent pay stub: do you see deductions for Social Security or Medicare?', zh: '查看你最近的工资单：是否有社会保障（Social Security）或医疗保险（Medicare）扣款？' },
  'fica.payStubHelp': { en: 'Look for line items labeled "FICA," "Social Security," "SS," "Medicare," or "Med."', zh: '查找标注"FICA"、"Social Security"、"SS"、"Medicare"或"Med"的项目。' },

  // FICA results
  'fica.exempt': { en: 'You are FICA exempt!', zh: '你可以免缴FICA！' },
  'fica.exemptDesc': { en: 'As a {visa} visa holder in year {year} of {total}, your employer should NOT withhold Social Security or Medicare taxes.', zh: '作为{visa}签证持有者，在{total}年豁免期的第{year}年，你的雇主不应扣缴社会保障或医疗保险税。' },
  'fica.notExempt': { en: 'FICA applies to your wages', zh: 'FICA适用于你的工资' },
  'fica.notExemptDesc': { en: 'You\'ve exceeded the 5-year exempt period or your visa type requires FICA. This is normal.', zh: '你已超过5年豁免期或你的签证类型需要缴纳FICA。这是正常的。' },
  'fica.refundTitle': { en: 'You may be entitled to a refund', zh: '你可能有权获得退款' },
  'fica.refundAmount': { en: 'Approximately ${amount} in FICA was withheld when it shouldn\'t have been.', zh: '大约${amount}的FICA被错误扣缴了。' },
  'fica.refundStep1': { en: 'First, ask your employer to correct the withholding and refund the FICA taxes (IRC Section 3121(b)(19))', zh: '首先，要求雇主更正扣税并退还FICA税款（IRC Section 3121(b)(19)）' },
  'fica.refundStep2': { en: 'If your employer refuses, file Form 843 (Claim for Refund) with Form 8316', zh: '如果雇主拒绝，提交843表（退款申请）和8316表' },
  'fica.refundStep3': { en: 'Attach your W-2, proof of visa status (I-20), and employment authorization', zh: '附上你的W-2、签证身份证明（I-20）和工作授权文件' },
  'fica.refundDeadline': { en: 'Deadline: 3 years from the date you filed the return for that year', zh: '截止日期：从当年报税日起3年内' },
  'fica.employerLetter': { en: 'Download employer notification letter', zh: '下载雇主通知信' },
  'fica.ircSection': { en: 'Legal basis: IRC Section 3121(b)(19) — FICA exemption for nonresident alien students', zh: '法律依据：IRC Section 3121(b)(19) — 非居民外国学生的FICA豁免' },
  'fica.rate': { en: 'FICA rate: 7.65% (6.2% Social Security + 1.45% Medicare)', zh: 'FICA税率：7.65%（6.2%社会保障 + 1.45%医疗保险）' },

  // === YEAR-5 COUNTDOWN ===
  'year5.title': { en: 'Year-5 Transition Countdown', zh: '第5年过渡倒计时' },
  'year5.subtitle': { en: 'Your tax obligations change after 5 calendar years in the US.', zh: '在美国超过5个日历年后，你的税务义务会发生变化。' },
  'year5.remaining': { en: 'You have {years} exempt years remaining', zh: '你还有{years}年豁免期' },
  'year5.current': { en: 'You are in year {current} of {total}', zh: '你处于{total}年豁免期的第{current}年' },
  'year5.transitionIn': { en: 'Your status will change in {year}', zh: '你的身份将在{year}年变更' },
  'year5.alreadyTransitioned': { en: 'You\'ve transitioned to Resident Alien status', zh: '你已经转为居民外国人身份' },
  'year5.alreadyTransitionedDesc': { en: 'Your 5-year exempt period ended. Here\'s what that means for your taxes.', zh: '你的5年豁免期已结束。以下是对你税务的影响。' },

  // Year-5 changes
  'year5.change1Title': { en: 'FICA exemption expires', zh: 'FICA豁免到期' },
  'year5.change1Desc': { en: 'You\'ll pay 7.65% in Social Security and Medicare taxes on your wages.', zh: '你需要对工资缴纳7.65%的社会保障和医疗保险税。' },
  'year5.change2Title': { en: 'Worldwide income becomes taxable', zh: '全球收入需纳税' },
  'year5.change2Desc': { en: 'Not just US-source income — income from your home country and elsewhere is now taxable.', zh: '不仅是美国来源的收入——来自母国和其他地方的收入也需纳税。' },
  'year5.change3Title': { en: 'Filing form changes', zh: '报税表格变更' },
  'year5.change3Desc': { en: 'You\'ll file Form 1040 instead of 1040-NR. Standard deduction and credits become available.', zh: '你将使用1040表而非1040-NR报税。可享受标准扣除和税收抵免。' },
  'year5.checklist': { en: 'What to do now', zh: '现在该做什么' },

  // === IMMIGRATION ===
  'immigration.title': { en: 'Immigration & Tax FAQ', zh: '移民与税务常见问题' },
  'immigration.subtitle': { en: 'Common questions about how taxes affect your immigration status. Most tax errors are fixable.', zh: '关于税务如何影响移民身份的常见问题。大多数税务错误都是可以补救的。' },
  'immigration.riskLow': { en: 'Low risk', zh: '低风险' },
  'immigration.riskModerate': { en: 'Moderate', zh: '中等风险' },
  'immigration.riskHigh': { en: 'Important', zh: '重要' },
  'immigration.mythVsReality': { en: 'Myth vs Reality', zh: '误解与事实' },
  'immigration.myth': { en: 'Myth', zh: '误解' },
  'immigration.reality': { en: 'Reality', zh: '事实' },
  'immigration.calmNote': { en: 'Most tax errors are fixable. Filing an amendment shows good faith.', zh: '大多数税务错误都可以补救。提交修正申报表体现了你的诚意。' },

  // Immigration FAQs
  'immigration.q1': { en: 'Will a tax mistake affect my F-1/J-1 visa renewal?', zh: '税务错误会影响我的F-1/J-1签证续签吗？' },
  'immigration.a1': { en: 'US consulates do not systematically request or review tax returns for F-1 or J-1 visa renewals. The DS-160 application does not ask about tax filing history. A consular officer could theoretically ask about finances, but this is rare for standard student visa renewals.', zh: '美国领事馆不会系统性地要求或审查F-1或J-1签证续签的税务申报。DS-160申请表不会询问税务记录。领事官员理论上可以询问财务状况，但在标准学生签证续签中很少发生。' },

  'immigration.q2': { en: 'Are there tax requirements for OPT/STEM OPT?', zh: 'OPT/STEM OPT有税务要求吗？' },
  'immigration.a2': { en: 'The I-765 application for OPT does not ask about tax filing history. However, a January 2026 USCIS policy update ties tax compliance to "evidence of maintenance of status." While USCIS won\'t routinely pull your tax records for OPT, they could request tax documents in a Request for Evidence (RFE).', zh: 'I-765 OPT申请不要求税务记录。但2026年1月USCIS政策更新将税务合规与"维持身份证据"挂钩。虽然USCIS通常不会为OPT调取你的税务记录，但可能在补件通知（RFE）中要求提供税务文件。' },

  'immigration.q3': { en: 'Does H-1B sponsorship require tax history?', zh: 'H-1B申请需要税务记录吗？' },
  'immigration.a3': { en: 'The H-1B petition (Form I-129) does not require your personal tax returns. USCIS focuses on your employer\'s ability to pay the prevailing wage. The real exposure comes later when using H-1B as a springboard to a green card.', zh: 'H-1B申请（I-129表）不要求你的个人税务申报表。USCIS关注的是雇主是否能支付现行工资。真正的风险在后续——当你从H-1B转为申请绿卡时。' },

  'immigration.q4': { en: 'What about green card (I-485) applications?', zh: '绿卡（I-485）申请呢？' },
  'immigration.a4': { en: 'THIS IS WHERE IT MATTERS. Form I-485 Part 8, Question 61 directly asks about tax compliance. USCIS typically reviews 3 years of tax returns. They check for: consistent filing status (1040-NR vs 1040), no filing gaps, and correct worldwide income reporting after becoming RA.', zh: '这是最重要的环节。I-485表格第8部分第61题直接询问税务合规情况。USCIS通常审查3年的税务申报。他们检查：报税身份是否一致（1040-NR vs 1040）、是否有未申报年份、以及成为RA后是否正确申报全球收入。' },

  'immigration.q5': { en: 'I filed the wrong form — what do I do?', zh: '我报错了税表——怎么办？' },
  'immigration.a5': { en: 'File an amended return using Form 1040-X. You have 3 years from the original filing date. Bring the original return, the 1040-X, and a brief explanation to your immigration interview. Immigration attorneys consistently say amendments demonstrate good faith.', zh: '使用1040-X表格提交修正申报。你有3年时间从原始报税日期算起。面试时带上原始税表、1040-X和简要说明。移民律师一致认为修正申报体现了诚意。' },

  'immigration.q6': { en: 'I never filed Form 8843 — am I in trouble?', zh: '我从未提交过8843表——会有麻烦吗？' },
  'immigration.a6': { en: 'There is no direct IRS penalty for not filing Form 8843. But without it, the IRS may count your days toward the Substantial Presence Test, potentially reclassifying you as a resident alien. File late for prior years — the IRS accepts late 8843 forms. Many students do this without penalty.', zh: '未提交8843表没有直接的IRS罚款。但如果不提交，IRS可能会将你的在美天数计入实质性存在测试，可能将你重新归类为居民外国人。补交往年的8843表——IRS接受延迟提交。许多学生这样做都没有受到处罚。' },

  'immigration.q7': { en: 'Will the IRS share my tax info with immigration?', zh: 'IRS会与移民局分享我的税务信息吗？' },
  'immigration.a7': { en: 'The 2025 IRS-ICE data sharing agreement only applies to people with final deportation orders or under criminal investigation. Lawful visa holders applying for benefits are not affected. USCIS access to your tax info typically requires your signed consent.', zh: '2025年IRS-ICE数据共享协议仅适用于有最终驱逐令或正在接受刑事调查的人。合法签证持有者申请福利不受影响。USCIS获取你的税务信息通常需要你的签署同意。' },

  // Myth vs Reality table
  'immigration.myth1': { en: 'A tax mistake will get me deported', zh: '税务错误会导致我被驱逐出境' },
  'immigration.reality1': { en: 'Tax errors alone do not trigger deportation. USCIS evaluates the totality of circumstances.', zh: '税务错误本身不会触发驱逐程序。USCIS会评估总体情况。' },
  'immigration.myth2': { en: 'Amended returns look suspicious to USCIS', zh: '修正申报表会让USCIS怀疑' },
  'immigration.reality2': { en: 'Attorneys consistently say amendments demonstrate good faith and compliance.', zh: '律师一致认为修正申报表体现了诚意和合规意愿。' },
  'immigration.myth3': { en: 'Not filing Form 8843 has no consequences', zh: '不提交8843表没有后果' },
  'immigration.reality3': { en: 'No direct penalty, but it can trigger the Substantial Presence trap and reclassify your tax status.', zh: '没有直接罚款，但可能触发实质性存在测试陷阱，重新归类你的税务身份。' },
  'immigration.myth4': { en: 'USCIS can see all my IRS records automatically', zh: 'USCIS可以自动看到我所有的IRS记录' },
  'immigration.reality4': { en: 'USCIS generally needs your signed consent to access tax transcripts. They don\'t have automatic access.', zh: 'USCIS通常需要你的签字同意才能获取税务记录。他们没有自动访问权限。' },

  // === STATE TAX ===
  'state.title': { en: 'State Tax Check', zh: '州税检查' },
  'state.subtitle': { en: 'Some states have their own income tax rules for international students.', zh: '一些州对国际学生有自己的所得税规定。' },
  'state.select': { en: 'What state do you live in?', zh: '你住在哪个州？' },
  'state.selectPlaceholder': { en: 'Select your state', zh: '选择你的州' },
  'state.noTax': { en: 'No state income tax', zh: '无州所得税' },
  'state.noTaxDesc': { en: '{state} has no state income tax. You only need to file your federal return.', zh: '{state}没有州所得税。你只需提交联邦税表。' },
  'state.hasTax': { en: 'State income tax applies', zh: '需缴纳州所得税' },
  'state.honorsTreaties': { en: 'Honors federal tax treaties', zh: '承认联邦税务条约' },
  'state.honorsDesc': { en: 'Your federal treaty benefits also apply at the state level.', zh: '你的联邦条约优惠在州级别也适用。' },
  'state.noTreaty': { en: 'Does NOT honor federal tax treaties', zh: '不承认联邦税务条约' },
  'state.noTreatyDesc': { en: 'Your {savings} federal treaty benefit does NOT apply to state taxes. You\'ll pay state income tax on the full amount.', zh: '你的{savings}联邦条约优惠不适用于州税。你需要对全部金额缴纳州所得税。' },
  'state.form': { en: 'State form to file:', zh: '需提交的州税表：' },
  'state.warning': { en: 'Warning', zh: '注意' },

  // === SUMMARY ===
  'summary.title': { en: 'Your Personalized Tax Checklist', zh: '你的个人税务清单' },
  'summary.subtitle': { en: 'Based on your answers, here\'s what you need to do.', zh: '根据你的回答，以下是你需要做的事情。' },
  'summary.status': { en: 'Your tax status: {status}', zh: '你的税务身份：{status}' },
  'summary.fileForm8843': { en: 'File Form 8843 (even with no income)', zh: '提交8843表（即使没有收入）' },
  'summary.file1040NR': { en: 'File Form 1040-NR (nonresident income tax return)', zh: '提交1040-NR（非居民所得税申报表）' },
  'summary.file1040': { en: 'File Form 1040 (same form US citizens use)', zh: '提交1040表（和美国公民一样的税表）' },
  'summary.standardDeduction': { en: 'Claim the standard deduction ($15,700 for 2025)', zh: '使用标准扣除额（2025年为$15,700）' },
  'summary.worldwideIncome': { en: 'Report worldwide income (not just US sources)', zh: '申报全球收入（不仅是美国来源）' },
  'summary.raSoftware': { en: 'Use mainstream tax software (TurboTax, H&R Block, FreeTaxUSA all work)', zh: '可使用主流报税软件（TurboTax、H&R Block、FreeTaxUSA均适用）' },
  'summary.claimTreaty': { en: 'Claim ${amount} in treaty benefits ({article})', zh: '申请${amount}的条约优惠（{article}）' },
  'summary.ficaRefund': { en: 'Request FICA refund of approximately ${amount}', zh: '申请约${amount}的FICA退款' },
  'summary.stateReturn': { en: 'File {state} state tax return ({form})', zh: '提交{state}州税表（{form}）' },
  'summary.deadlineApril': { en: 'Federal deadline: April 15, {year}', zh: '联邦截止日期：{year}年4月15日' },
  'summary.deadlineJune': { en: 'Form 8843 deadline: June 15, {year}', zh: '8843表截止日期：{year}年6月15日' },
  'summary.consultCPA': { en: 'Consider consulting a tax professional for your specific situation', zh: '建议咨询专业税务人员了解你的具体情况' },
  'summary.shareText': { en: 'Share ShuiYi with classmates who might need help', zh: '分享税易给可能需要帮助的同学' },
  'summary.done': { en: 'That\'s it! You\'ve got this.', zh: '就这些！你可以的。' },
};

export default strings;
