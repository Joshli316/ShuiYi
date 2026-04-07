export interface StateInfo {
  code: string;
  name: string;
  nameZh: string;
  hasIncomeTax: boolean;
  honorsTreaties: boolean;
  nraForm?: string;
  notes?: string;
  notesZh?: string;
  topState?: boolean;
}

export const STATES: StateInfo[] = [
  // Top 6 priority states
  { code: 'CA', name: 'California', nameZh: '加利福尼亚', hasIncomeTax: true, honorsTreaties: false, nraForm: 'Form 540NR + Schedule CA', topState: true, notes: 'Does NOT honor federal tax treaties. Rate: 1-13.3%. Largest international student population.', notesZh: '不承认联邦税务条约。税率：1-13.3%。国际学生人数最多的州。' },
  { code: 'NY', name: 'New York', nameZh: '纽约', hasIncomeTax: true, honorsTreaties: true, nraForm: 'Form IT-203', topState: true, notes: 'Honors most treaties. 183-day rule can trigger resident status. NYC adds 3-3.9% city tax.', notesZh: '承认大多数条约。183天规则可能触发居民身份。纽约市额外征收3-3.9%市税。' },
  { code: 'TX', name: 'Texas', nameZh: '德克萨斯', hasIncomeTax: false, honorsTreaties: true, topState: true, notes: 'No state income tax. No state forms needed. Federal return only.', notesZh: '无州所得税。无需州税表。只需联邦税表。' },
  { code: 'MA', name: 'Massachusetts', nameZh: '马萨诸塞', hasIncomeTax: true, honorsTreaties: true, nraForm: 'Form 1-NR/PY', topState: true, notes: 'Honors China treaty but NOT India treaty. Flat 5%. 183-day statutory residency rule.', notesZh: '承认中国条约但不承认印度条约。统一税率5%。183天法定居民规则。' },
  { code: 'IL', name: 'Illinois', nameZh: '伊利诺伊', hasIncomeTax: true, honorsTreaties: true, nraForm: 'IL-1040 + Schedule NR', topState: true, notes: 'Honors most treaties. Flat 4.95%. No city income tax. Relatively simple filing.', notesZh: '承认大多数条约。统一税率4.95%。无市所得税。报税较简单。' },
  { code: 'PA', name: 'Pennsylvania', nameZh: '宾夕法尼亚', hasIncomeTax: true, honorsTreaties: false, nraForm: 'PA-40 + Schedule NRH', topState: true, notes: 'Does NOT honor federal tax treaties. Flat 3.07%. Philadelphia city wage tax ~3.75%.', notesZh: '不承认联邦税务条约。统一税率3.07%。费城市工资税约3.75%。' },

  // No income tax states
  { code: 'AK', name: 'Alaska', nameZh: '阿拉斯加', hasIncomeTax: false, honorsTreaties: true },
  { code: 'FL', name: 'Florida', nameZh: '佛罗里达', hasIncomeTax: false, honorsTreaties: true },
  { code: 'NV', name: 'Nevada', nameZh: '内华达', hasIncomeTax: false, honorsTreaties: true },
  { code: 'NH', name: 'New Hampshire', nameZh: '新罕布什尔', hasIncomeTax: false, honorsTreaties: true },
  { code: 'SD', name: 'South Dakota', nameZh: '南达科他', hasIncomeTax: false, honorsTreaties: true },
  { code: 'TN', name: 'Tennessee', nameZh: '田纳西', hasIncomeTax: false, honorsTreaties: true },
  { code: 'WA', name: 'Washington', nameZh: '华盛顿', hasIncomeTax: false, honorsTreaties: true, notes: 'No wage income tax. 7% tax on long-term capital gains above $250K.', notesZh: '无工资所得税。长期资本利得超过$250K征收7%税。' },
  { code: 'WY', name: 'Wyoming', nameZh: '怀俄明', hasIncomeTax: false, honorsTreaties: true },

  // Non-treaty states (do NOT honor federal treaties)
  { code: 'AL', name: 'Alabama', nameZh: '阿拉巴马', hasIncomeTax: true, honorsTreaties: false },
  { code: 'AR', name: 'Arkansas', nameZh: '阿肯色', hasIncomeTax: true, honorsTreaties: false },
  { code: 'CT', name: 'Connecticut', nameZh: '康涅狄格', hasIncomeTax: true, honorsTreaties: false, nraForm: 'CT-1040NR/PY' },
  { code: 'HI', name: 'Hawaii', nameZh: '夏威夷', hasIncomeTax: true, honorsTreaties: false },
  { code: 'KS', name: 'Kansas', nameZh: '堪萨斯', hasIncomeTax: true, honorsTreaties: false },
  { code: 'KY', name: 'Kentucky', nameZh: '肯塔基', hasIncomeTax: true, honorsTreaties: false },
  { code: 'MD', name: 'Maryland', nameZh: '马里兰', hasIncomeTax: true, honorsTreaties: false, nraForm: 'Form 505' },
  { code: 'MS', name: 'Mississippi', nameZh: '密西西比', hasIncomeTax: true, honorsTreaties: false },
  { code: 'MT', name: 'Montana', nameZh: '蒙大拿', hasIncomeTax: true, honorsTreaties: false },
  { code: 'NJ', name: 'New Jersey', nameZh: '新泽西', hasIncomeTax: true, honorsTreaties: false, nraForm: 'NJ-1040NR', notes: 'Does not honor treaties. Rate up to 10.75%.', notesZh: '不承认条约。税率最高10.75%。' },
  { code: 'ND', name: 'North Dakota', nameZh: '北达科他', hasIncomeTax: true, honorsTreaties: false },

  // Treaty-honoring states with income tax
  { code: 'AZ', name: 'Arizona', nameZh: '亚利桑那', hasIncomeTax: true, honorsTreaties: true, notes: 'Flat 2.5%.', notesZh: '统一税率2.5%。' },
  { code: 'CO', name: 'Colorado', nameZh: '科罗拉多', hasIncomeTax: true, honorsTreaties: true },
  { code: 'DC', name: 'District of Columbia', nameZh: '华盛顿特区', hasIncomeTax: true, honorsTreaties: true },
  { code: 'DE', name: 'Delaware', nameZh: '特拉华', hasIncomeTax: true, honorsTreaties: true },
  { code: 'GA', name: 'Georgia', nameZh: '乔治亚', hasIncomeTax: true, honorsTreaties: true },
  { code: 'ID', name: 'Idaho', nameZh: '爱达荷', hasIncomeTax: true, honorsTreaties: true },
  { code: 'IN', name: 'Indiana', nameZh: '印第安纳', hasIncomeTax: true, honorsTreaties: true },
  { code: 'IA', name: 'Iowa', nameZh: '爱荷华', hasIncomeTax: true, honorsTreaties: true },
  { code: 'LA', name: 'Louisiana', nameZh: '路易斯安那', hasIncomeTax: true, honorsTreaties: true },
  { code: 'ME', name: 'Maine', nameZh: '缅因', hasIncomeTax: true, honorsTreaties: true },
  { code: 'MI', name: 'Michigan', nameZh: '密歇根', hasIncomeTax: true, honorsTreaties: true },
  { code: 'MN', name: 'Minnesota', nameZh: '明尼苏达', hasIncomeTax: true, honorsTreaties: true },
  { code: 'MO', name: 'Missouri', nameZh: '密苏里', hasIncomeTax: true, honorsTreaties: true },
  { code: 'NE', name: 'Nebraska', nameZh: '内布拉斯加', hasIncomeTax: true, honorsTreaties: true },
  { code: 'NM', name: 'New Mexico', nameZh: '新墨西哥', hasIncomeTax: true, honorsTreaties: true },
  { code: 'NC', name: 'North Carolina', nameZh: '北卡罗来纳', hasIncomeTax: true, honorsTreaties: true },
  { code: 'OH', name: 'Ohio', nameZh: '俄亥俄', hasIncomeTax: true, honorsTreaties: true },
  { code: 'OK', name: 'Oklahoma', nameZh: '俄克拉荷马', hasIncomeTax: true, honorsTreaties: true },
  { code: 'OR', name: 'Oregon', nameZh: '俄勒冈', hasIncomeTax: true, honorsTreaties: true },
  { code: 'RI', name: 'Rhode Island', nameZh: '罗德岛', hasIncomeTax: true, honorsTreaties: true },
  { code: 'SC', name: 'South Carolina', nameZh: '南卡罗来纳', hasIncomeTax: true, honorsTreaties: true },
  { code: 'UT', name: 'Utah', nameZh: '犹他', hasIncomeTax: true, honorsTreaties: true },
  { code: 'VT', name: 'Vermont', nameZh: '佛蒙特', hasIncomeTax: true, honorsTreaties: true },
  { code: 'VA', name: 'Virginia', nameZh: '弗吉尼亚', hasIncomeTax: true, honorsTreaties: true },
  { code: 'WV', name: 'West Virginia', nameZh: '西弗吉尼亚', hasIncomeTax: true, honorsTreaties: true },
  { code: 'WI', name: 'Wisconsin', nameZh: '威斯康星', hasIncomeTax: true, honorsTreaties: true },
];

export function getStateInfo(code: string): StateInfo | undefined {
  return STATES.find(s => s.code === code);
}

export function getNoIncomeTaxStates(): StateInfo[] {
  return STATES.filter(s => !s.hasIncomeTax);
}

export function getNonTreatyStates(): StateInfo[] {
  return STATES.filter(s => s.hasIncomeTax && !s.honorsTreaties);
}
