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

  // Dark mode toggle
  'dark.switchLight': { en: 'Switch to light mode', zh: '切换到浅色模式' },
  'dark.switchDark': { en: 'Switch to dark mode', zh: '切换到深色模式' },

  // Disclaimer
  'disclaimer.text': { en: 'For informational purposes only. This is not tax advice. Consult a qualified tax professional for your specific situation.', zh: '仅供参考，不构成税务建议。请咨询专业税务人员了解你的具体情况。' },
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
  'landing.value1Desc': { en: 'NRA or RA? Answer a few questions and find out.', zh: 'NRA还是RA？回答几个问题就知道了。' },
  'landing.value2Title': { en: 'Get your forms', zh: '获取你的税表' },
  'landing.value2Desc': { en: 'Get a pre-filled Form 8843 PDF. Print it, sign it, mail it.', zh: '获取预填好的8843表PDF。打印、签名、邮寄。' },
  'landing.value3Title': { en: 'Calculate treaty savings', zh: '计算条约节省' },
  'landing.value3Desc': { en: 'Check if your country\'s treaty can save you $500-$3,000 per year.', zh: '查看条约是否能帮你每年省$500-$3,000。' },
  'landing.socialProof': { en: 'Designed for the 1.2M international students in the US. Based on IRS publications and tax treaty data.', zh: '为120万在美国际学生设计。基于IRS出版物和税务条约数据。' },
  'landing.stats1': { en: '14 treaty countries covered', zh: '覆盖14个条约国家' },
  'landing.stats2': { en: '$0 cost', zh: '完全免费' },
  'landing.stats3': { en: '5-minute guide', zh: '5分钟指南' },
  'landing.taxSeason': { en: 'Tax season doesn\'t have to be scary.', zh: '报税不用慌。' },

  // Landing FAQ
  'landing.faqTitle': { en: 'Common questions', zh: '常见问题' },
  'landing.faq1q': { en: 'Do F-1 students need to file US taxes?', zh: 'F-1学生需要报美国税吗？' },
  'landing.faq1a': { en: 'Yes. Every F-1 student must file Form 8843, even with zero income. If you earned money, you also file Form 1040-NR.', zh: '是的。每个F-1学生都必须提交8843表，即使没有收入。如果你有收入，还需要提交1040-NR。' },
  'landing.faq2q': { en: 'What is Form 8843?', zh: '什么是8843表？' },
  'landing.faq2a': { en: 'A one-page IRS form that tells the government you\'re an exempt individual (student/scholar). It keeps your days from counting toward the Substantial Presence Test.', zh: '一页的IRS表格，告诉政府你是豁免个人（学生/学者）。它防止你的在美天数被计入实质性存在测试。' },
  'landing.faq3q': { en: 'Can I get a FICA refund as an international student?', zh: '国际学生可以申请FICA退款吗？' },
  'landing.faq3a': { en: 'If your employer withheld Social Security and Medicare taxes during your first 5 years on an F-1, J-1, M-1, or Q-1 visa, you\'re owed that money back. ShuiYi shows you how to claim it.', zh: '如果你的雇主在你持F-1、J-1、M-1或Q-1签证的前5年扣缴了社会保障和医疗保险税，这笔钱应该退给你。税易教你怎么申请。' },
  'landing.faq4q': { en: 'What\'s the difference between NRA and RA?', zh: 'NRA和RA有什么区别？' },
  'landing.faq4a': { en: 'Nonresident Aliens (NRA) only pay tax on US income and file 1040-NR. Resident Aliens (RA) pay tax on worldwide income and file 1040 like US citizens. Most students are NRA for their first 5 years.', zh: '非居民外国人（NRA）只对美国收入交税，用1040-NR报税。居民外国人（RA）对全球收入交税，像美国公民一样用1040报税。大多数学生前5年是NRA。' },
  'landing.faq5q': { en: 'Does my country have a tax treaty with the US?', zh: '我的国家和美国有税务条约吗？' },
  'landing.faq5a': { en: 'China, India, South Korea, Japan, and 10 other countries have student tax treaties. Chinese students can exempt $5,000/year. ShuiYi calculates your specific savings.', zh: '中国、印度、韩国、日本等14个国家有学生税务条约。中国学生每年可免税$5,000。税易为你计算具体节省金额。' },

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
  'status.title': { en: 'What\'s your tax status?', zh: '你的税务身份是什么？' },
  'status.q1': { en: 'What visa are you on?', zh: '你持什么签证？' },
  'status.q1Help': { en: 'Select the visa type shown on your I-20 or DS-2019. If you\'re on OPT, you\'re still on F-1.', zh: '选择你的I-20或DS-2019上的签证类型。如果你在OPT期间，你仍然是F-1。' },
  'status.f1': { en: 'F-1 (Student)', zh: 'F-1（学生）' },
  'status.f1opt': { en: 'F-1 OPT (still F-1)', zh: 'F-1 OPT（仍为F-1）' },
  'status.j1': { en: 'J-1 (Exchange Visitor)', zh: 'J-1（交流访问者）' },
  'status.m1': { en: 'M-1 (Vocational Student)', zh: 'M-1（职业学生）' },
  'status.q1visa': { en: 'Q-1 (Cultural Exchange)', zh: 'Q-1（文化交流）' },
  'status.h1b': { en: 'H-1B (Work Visa)', zh: 'H-1B（工作签证）' },
  'status.other': { en: 'Other', zh: '其他' },

  'status.j1type': { en: 'Are you a student or a teacher/researcher?', zh: '你是学生还是教师/研究员？' },
  'status.j1typeHelp': { en: 'J-1 students get 5 exempt years. Teachers and researchers get 2.', zh: 'J-1学生有5年豁免期。教师和研究员有2年。' },
  'status.j1student': { en: 'Student', zh: '学生' },
  'status.j1researcher': { en: 'Teacher / Researcher', zh: '教师/研究员' },

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
  'status.nraMeaning': { en: 'You file Form 1040-NR (not the regular 1040) and only pay tax on US income. You also need to file Form 8843.', zh: '你需要填1040-NR表（不是普通的1040），只对美国收入交税。你还需要交8843表。' },
  'status.raMeaning': { en: 'You file the same Form 1040 as US citizens and pay tax on worldwide income. You get the standard deduction and credits.', zh: '你和美国公民一样填1040表，需对全球收入交税。可以用标准扣除和税收抵免。' },
  'status.exemptYears': { en: 'Exempt years used: {used} of {total}', zh: '已使用豁免年数：{used}/{total}' },
  'status.yearsRemaining': { en: '{years} exempt years remaining', zh: '剩余{years}年豁免期' },
  'status.nraNext': { en: 'Next up: your Form 8843 and treaty benefits.', zh: '接下来：你的8843表格和条约优惠。' },
  'status.raNext': { en: 'You file like a US resident. Here\'s what changes:', zh: '你按美国居民方式报税。以下是变化：' },
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
  'form8843.title': { en: 'Fill out your Form 8843', zh: '填写你的8843表格' },
  'form8843.subtitle': { en: 'All international students file this — even with no income.', zh: '所有国际学生都要交这个表——即使没有收入。' },
  'form8843.name': { en: 'Full legal name (as on passport)', zh: '法定全名（护照上的姓名）' },
  'form8843.address': { en: 'US address', zh: '美国地址' },
  'form8843.ssn': { en: 'SSN or ITIN (optional)', zh: 'SSN或ITIN（选填）' },
  'form8843.ssnHelp': { en: 'If you have one, enter it. Most students don\'t — that\'s fine.', zh: '有的话就填。大多数学生没有——没事。' },
  'form8843.citizenship': { en: 'Country of citizenship', zh: '国籍' },
  'form8843.taxResidence': { en: 'Country of tax residence', zh: '税务居住国' },
  'form8843.daysPresent': { en: 'Days present in the US during {year}', zh: '{year}年在美天数' },
  'form8843.daysHelp': { en: 'Count every day you were physically in the US, including partial days.', zh: '计算你在美国实际存在的每一天，包括部分天数。' },
  'form8843.school': { en: 'Academic institution name', zh: '学校名称' },
  'form8843.schoolAddress': { en: 'Academic institution address', zh: '学校地址' },
  'form8843.compliant': { en: 'Did you follow your visa rules this year?', zh: '你今年遵守签证规定了吗？' },
  'form8843.compliantHelp': { en: 'If you kept your student status and didn\'t violate any visa terms, select Yes.', zh: '如果你保持了学生身份且没有违反签证条款，选"是"。' },

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
  'treaty.title': { en: 'Does your country have a tax treaty?', zh: '你的国家有税务条约吗？' },
  'treaty.subtitle': { en: 'Some countries have deals with the US that reduce how much tax students pay.', zh: '一些国家与美国有协议，可以减少学生需要缴的税。' },
  'treaty.country': { en: 'What is your country of citizenship?', zh: '你的国籍是什么？' },
  'treaty.selectCountry': { en: 'Select your country', zh: '选择你的国家' },
  'treaty.income': { en: 'Approximately how much US income did you earn this year?', zh: '你今年大约有多少美国收入？' },
  'treaty.incomeHelp': { en: 'Include wages, stipends, and taxable scholarships. Round to the nearest $100.', zh: '包括工资、津贴和应税奖学金。四舍五入到最接近的$100。' },

  // Treaty results
  'treaty.savings': { en: 'Estimated savings', zh: '预估节省' },
  'treaty.perYear': { en: 'per year, based on your inputs', zh: '每年，基于你的输入' },
  'treaty.based': { en: 'Based on the US-{country} tax treaty ({article})', zh: '基于美国与{country}的税务条约（{article}）' },
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
  'fica.title': { en: 'Are you paying FICA taxes you don\'t owe?', zh: '你是否在缴纳不该交的FICA税？' },
  'fica.subtitle': { en: 'Students on F-1, J-1, M-1, or Q-1 visas usually don\'t owe Social Security or Medicare taxes.', zh: 'F-1、J-1、M-1或Q-1签证学生通常不需要缴纳社会保障或医疗保险税。' },
  'fica.employed': { en: 'Do you have a job right now?', zh: '你现在有工作吗？' },
  'fica.employedHelp': { en: 'On-campus jobs, OPT, CPT, and any other paid work all count.', zh: '校内工作、OPT、CPT和其他任何有薪工作都算。' },
  'fica.payStub': { en: 'Check your most recent pay stub: do you see deductions for Social Security or Medicare?', zh: '查看你最近的工资单：是否有社会保障（Social Security）或医疗保险（Medicare）扣款？' },
  'fica.payStubHelp': { en: 'Look for line items labeled "FICA," "Social Security," "SS," "Medicare," or "Med."', zh: '查找标注"FICA"、"Social Security"、"SS"、"Medicare"或"Med"的项目。' },

  // FICA results
  'fica.exempt': { en: 'You don\'t owe FICA', zh: '你不需要缴FICA' },
  'fica.exemptDesc': { en: 'On a {visa} visa in year {year} of {total}, your employer should NOT take out Social Security or Medicare from your paycheck.', zh: '持{visa}签证，在{total}年豁免期的第{year}年，你的雇主不应从你的工资中扣除社会保障或医疗保险。' },
  'fica.notExempt': { en: 'You owe FICA — that\'s normal', zh: '你需要缴FICA——这很正常' },
  'fica.notExemptDesc': { en: 'Your 5-year exemption period is over, or your visa type requires FICA. Nothing to worry about.', zh: '你的5年豁免期已过，或者你的签证类型要求缴纳FICA。不用担心。' },
  'fica.refundTitle': { en: 'You could get this money back', zh: '你可以把这笔钱要回来' },
  'fica.refundAmount': { en: 'About ${amount} in FICA was taken from your paycheck when it shouldn\'t have been.', zh: '大约${amount}的FICA被从你的工资中错误扣除了。' },
  'fica.refundStep1': { en: 'Ask your employer to fix it and refund the FICA — cite IRC Section 3121(b)(19)', zh: '要求雇主更正并退还FICA——引用IRC Section 3121(b)(19)' },
  'fica.refundStep2': { en: 'If they won\'t, file Form 843 + Form 8316 with the IRS yourself', zh: '如果雇主不配合，自己向IRS提交843表和8316表' },
  'fica.refundStep3': { en: 'Attach your W-2, proof of visa status (I-20), and employment authorization', zh: '附上你的W-2、签证身份证明（I-20）和工作授权文件' },
  'fica.refundDeadline': { en: 'Deadline: 3 years from the date you filed the return for that year', zh: '截止日期：从当年报税日起3年内' },
  'fica.employerLetter': { en: 'Download employer notification letter', zh: '下载雇主通知信' },
  'fica.ircSection': { en: 'Legal basis: IRC Section 3121(b)(19) — FICA exemption for nonresident alien students', zh: '法律依据：IRC Section 3121(b)(19) — 非居民外国学生的FICA豁免' },
  'fica.rate': { en: 'FICA rate: 7.65% (6.2% Social Security + 1.45% Medicare)', zh: 'FICA税率：7.65%（6.2%社会保障 + 1.45%医疗保险）' },

  // === YEAR-5 COUNTDOWN ===
  'year5.title': { en: 'Your 5-Year Exemption Timeline', zh: '你的5年豁免时间线' },
  'year5.subtitle': { en: 'After 5 calendar years in the US, your tax rules change.', zh: '在美国满5个日历年后，你的税务规则会变。' },
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
  'immigration.title': { en: 'Will taxes affect my visa?', zh: '税务会影响我的签证吗？' },
  'immigration.subtitle': { en: 'Short answer: probably not. Here are the details.', zh: '简短回答：大概率不会。以下是具体情况。' },
  'immigration.riskLow': { en: 'Low risk', zh: '低风险' },
  'immigration.riskModerate': { en: 'Moderate', zh: '中等风险' },
  'immigration.riskHigh': { en: 'Important', zh: '重要' },
  'immigration.mythVsReality': { en: 'Myth vs Reality', zh: '误解与事实' },
  'immigration.myth': { en: 'Myth', zh: '误解' },
  'immigration.reality': { en: 'Reality', zh: '事实' },
  'immigration.calmNote': { en: 'Tax mistakes happen. You can file an amendment — that actually shows good faith.', zh: '税务错误很常见。你可以提交修正申报——这反而体现了你的诚意。' },

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
  'state.subtitle': { en: 'Your state may have its own income tax — and not all states honor federal treaties.', zh: '你的州可能有自己的所得税——而且不是所有州都承认联邦条约。' },
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
  'summary.subtitle': { en: 'Here\'s your to-do list for this tax season.', zh: '这是你这个报税季的待办事项。' },
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
  'summary.consultCPA': { en: 'Talk to a tax professional if your situation is complex', zh: '如果情况复杂，找专业税务人员聊聊' },
  'summary.shareText': { en: 'Send this to a classmate', zh: '发给同学' },
  'summary.done': { en: 'That\'s it! You\'ve got this.', zh: '就这些！你可以的。' },
  'summary.confirmRestart': { en: 'Start over? Your answers will be cleared.', zh: '重新开始？你的回答将被清除。' },

  // Form 8843 states
  'form8843.generating': { en: 'Generating...', zh: '生成中...' },
  'form8843.pdfError': { en: 'Error — try again', zh: '出错了——请重试' },
  'form8843.downloaded': { en: 'Downloaded! Click to download again', zh: '已下载！点击重新下载' },

  // FICA inline strings
  'fica.notEmployedDesc': { en: 'FICA doesn\'t apply — you\'re not currently employed. If you start working, come back to check.', zh: 'FICA不适用——你目前没有工作。如果你开始工作，记得回来检查。' },
  'fica.employerCorrect': { en: 'Your employer handled withholding correctly. No action needed.', zh: '你的雇主正确处理了扣税。无需任何操作。' },
  'fica.howToGetRefund': { en: 'How to get your refund', zh: '如何获得退款' },

  // Year-5 inline strings
  'year5.whatChanges': { en: 'What changes after year 5', zh: '第5年后会有什么变化' },
  'year5.yearLabel': { en: 'years', zh: '年' },
  'year5.transition': { en: 'change', zh: '过渡' },
  'year5.checklistTransitioned1': { en: 'File Form 1040 (not 1040-NR)', zh: '使用1040表报税（不再使用1040-NR）' },
  'year5.checklistTransitioned2': { en: 'Report worldwide income', zh: '申报全球收入' },
  'year5.checklistTransitioned3': { en: 'Claim standard deduction and credits', zh: '可以申请标准扣除和税收抵免' },
  'year5.checklistTransitioned4': { en: 'Consider consulting a tax professional', zh: '考虑咨询税务专业人员' },
  'year5.checklistSoon1': { en: 'Understand what changes after year 5', zh: '了解第5年之后会发生什么变化' },
  'year5.checklistSoon2': { en: 'Start tracking worldwide income', zh: '开始记录全球收入' },
  'year5.checklistSoon3': { en: 'Consider consulting a tax professional early', zh: '考虑提前咨询税务专业人员' },
  'year5.checklistSoon4': { en: 'Mark your calendar: {year} is your transition year', zh: '标记日历：{year}年是过渡年' },
  'year5.checklistNRA1': { en: 'Continue filing as an NRA', zh: '继续以NRA身份报税' },
  'year5.checklistNRA2': { en: 'File Form 8843 each year', zh: '每年提交8843表' },
  'year5.checklistNRA3': { en: 'Take advantage of treaty benefits (if applicable)', zh: '利用条约优惠（如适用）' },
  'year5.checklistNRA4': { en: 'Come back to check your countdown later', zh: '以后记得回来查看倒计时' },

  // Footer
  'footer.sources': { en: 'Sources:', zh: '来源：' },

  // Privacy
  'landing.privacy': { en: 'Your data never leaves your browser. No accounts. No tracking.', zh: '你的数据不会离开浏览器。无需注册。无追踪。' },

  // Treaty terminated guidance
  'treaty.terminatedGuidance': { en: 'File as if no treaty exists. Standard NRA tax rates apply to your US income.', zh: '按无条约情况报税。标准NRA税率适用于你的美国收入。' },
};

export default strings;
