export interface Bank {
  id: string;
  name: string;
  logo: string;
  established: number;
  rating: number;
  totalBranches: number;
  website: string;
}

export interface NBFI {
  id: string;
  name: string;
  logo: string;
  established: number;
  rating: number;
  totalBranches: number;
  website: string;
  type: 'lease' | 'investment' | 'merchant' | 'housing';
}

export interface NGO {
  id: string;
  name: string;
  logo: string;
  established: number;
  rating: number;
  totalBranches: number;
  website: string;
  focus: string[];
}

export interface SavingsProduct {
  id: string;
  bankId: string;
  productName: string;
  interestRate: number;
  minimumDeposit: number;
  maximumDeposit: number;
  tenure: {
    min: number;
    max: number;
  };
  compoundingFrequency: 'monthly' | 'quarterly' | 'yearly';
  fees: {
    accountOpening: number;
    maintenance: number;
    withdrawal: number;
  };
  features: string[];
  eligibility: string[];
}

export interface LoanProduct {
  id: string;
  bankId: string;
  productName: string;
  loanType: 'personal' | 'home' | 'car' | 'business' | 'student' | 'startup';
  interestRate: {
    min: number;
    max: number;
  };
  loanAmount: {
    min: number;
    max: number;
  };
  tenure: {
    min: number;
    max: number;
  };
  processingFee: number;
  processingTime: string;
  eligibility: string[];
  requiredDocuments: string[];
  features: string[];
}

export const banks: Bank[] = [
  // State-Owned Commercial Banks
  {
    id: 'bb',
    name: 'Bangladesh Bank',
    logo: '/placeholder.svg',
    established: 1972,
    rating: 4.2,
    totalBranches: 250,
    website: 'https://bb.org.bd'
  },
  {
    id: 'sonali',
    name: 'Sonali Bank Limited',
    logo: '/placeholder.svg',
    established: 1972,
    rating: 3.8,
    totalBranches: 1219,
    website: 'https://sonalibank.com.bd'
  },
  {
    id: 'janata',
    name: 'Janata Bank Limited',
    logo: '/placeholder.svg',
    established: 1972,
    rating: 3.7,
    totalBranches: 915,
    website: 'https://jb.com.bd'
  },
  {
    id: 'agrani',
    name: 'Agrani Bank Limited',
    logo: '/placeholder.svg',
    established: 1972,
    rating: 3.6,
    totalBranches: 943,
    website: 'https://agranibank.org'
  },
  {
    id: 'rupali',
    name: 'Rupali Bank Limited',
    logo: '/placeholder.svg',
    established: 1972,
    rating: 3.5,
    totalBranches: 503,
    website: 'https://rupalibank.org'
  },
  {
    id: 'basic',
    name: 'Bangladesh Shilpa Bank Limited',
    logo: '/placeholder.svg',
    established: 1972,
    rating: 3.4,
    totalBranches: 42,
    website: 'https://bsbl.com.bd'
  },
  {
    id: 'bkb',
    name: 'Bangladesh Krishi Bank',
    logo: '/placeholder.svg',
    established: 1973,
    rating: 3.5,
    totalBranches: 1018,
    website: 'https://bkb.gov.bd'
  },
  {
    id: 'rajshahi',
    name: 'Rajshahi Krishi Unnayan Bank',
    logo: '/placeholder.svg',
    established: 1987,
    rating: 3.3,
    totalBranches: 377,
    website: 'https://rakub.org.bd'
  },
  {
    id: 'bdbl',
    name: 'Bangladesh Development Bank Limited',
    logo: '/placeholder.svg',
    established: 2010,
    rating: 3.4,
    totalBranches: 18,
    website: 'https://bdbl.com.bd'
  },
  // Private Commercial Banks
  {
    id: 'islami',
    name: 'Islami Bank Bangladesh Limited',
    logo: '/placeholder.svg',
    established: 1983,
    rating: 4.5,
    totalBranches: 371,
    website: 'https://islamibankbd.com'
  },
  {
    id: 'dutch-bangla',
    name: 'Dutch-Bangla Bank Limited',
    logo: '/placeholder.svg',
    established: 1996,
    rating: 4.4,
    totalBranches: 195,
    website: 'https://dutchbanglabank.com'
  },
  {
    id: 'brac',
    name: 'BRAC Bank Limited',
    logo: '/placeholder.svg',
    established: 2001,
    rating: 4.3,
    totalBranches: 187,
    website: 'https://bracbank.com'
  },
  {
    id: 'eastern',
    name: 'Eastern Bank Limited',
    logo: '/placeholder.svg',
    established: 1992,
    rating: 4.1,
    totalBranches: 156,
    website: 'https://ebl.com.bd'
  },
  {
    id: 'city',
    name: 'City Bank Limited',
    logo: '/placeholder.svg',
    established: 1983,
    rating: 4.0,
    totalBranches: 129,
    website: 'https://thecitybank.com'
  },
  {
    id: 'ab',
    name: 'AB Bank Limited',
    logo: '/placeholder.svg',
    established: 1981,
    rating: 3.9,
    totalBranches: 104,
    website: 'https://abbl.com'
  },
  {
    id: 'ucb',
    name: 'United Commercial Bank Limited',
    logo: '/placeholder.svg',
    established: 1983,
    rating: 3.8,
    totalBranches: 148,
    website: 'https://ucb.com.bd'
  },
  {
    id: 'uttara',
    name: 'Uttara Bank Limited',
    logo: '/placeholder.svg',
    established: 1965,
    rating: 3.7,
    totalBranches: 179,
    website: 'https://uttarabank-bd.com'
  },
  {
    id: 'pubali',
    name: 'Pubali Bank Limited',
    logo: '/placeholder.svg',
    established: 1959,
    rating: 3.8,
    totalBranches: 449,
    website: 'https://pubalibangla.com'
  },
  {
    id: 'standard',
    name: 'Standard Bank Limited',
    logo: '/placeholder.svg',
    established: 1999,
    rating: 4.0,
    totalBranches: 120,
    website: 'https://standardbankbd.com'
  },
  {
    id: 'southeast',
    name: 'Southeast Bank Limited',
    logo: '/placeholder.svg',
    established: 1995,
    rating: 4.1,
    totalBranches: 149,
    website: 'https://southeastbank.com.bd'
  },
  {
    id: 'dhaka',
    name: 'Dhaka Bank Limited',
    logo: '/placeholder.svg',
    established: 1995,
    rating: 3.9,
    totalBranches: 100,
    website: 'https://dhakabank.com.bd'
  },
  {
    id: 'prime',
    name: 'Prime Bank Limited',
    logo: '/placeholder.svg',
    established: 1995,
    rating: 4.2,
    totalBranches: 145,
    website: 'https://primebank.com.bd'
  },
  {
    id: 'trust',
    name: 'Trust Bank Limited',
    logo: '/placeholder.svg',
    established: 1999,
    rating: 3.8,
    totalBranches: 89,
    website: 'https://trustbank.com.bd'
  },
  {
    id: 'bank-asia',
    name: 'Bank Asia Limited',
    logo: '/placeholder.svg',
    established: 1999,
    rating: 4.0,
    totalBranches: 150,
    website: 'https://bankasia-bd.com'
  },
  {
    id: 'ncc',
    name: 'NCC Bank Limited',
    logo: '/placeholder.svg',
    established: 1993,
    rating: 3.7,
    totalBranches: 113,
    website: 'https://nccbank.com.bd'
  },
  {
    id: 'mtb',
    name: 'Mutual Trust Bank Limited',
    logo: '/placeholder.svg',
    established: 1999,
    rating: 3.9,
    totalBranches: 85,
    website: 'https://mutualtrustbank.com'
  },
  {
    id: 'first-security',
    name: 'First Security Islami Bank Limited',
    logo: '/placeholder.svg',
    established: 1999,
    rating: 3.6,
    totalBranches: 149,
    website: 'https://fsiblbd.com'
  },
  {
    id: 'social-islami',
    name: 'Social Islami Bank Limited',
    logo: '/placeholder.svg',
    established: 1995,
    rating: 3.5,
    totalBranches: 150,
    website: 'https://siblbd.com'
  },
  {
    id: 'al-arafah',
    name: 'Al-Arafah Islami Bank Limited',
    logo: '/placeholder.svg',
    established: 1995,
    rating: 3.4,
    totalBranches: 149,
    website: 'https://al-arafahbank.com'
  },
  {
    id: 'shahjalal',
    name: 'Shahjalal Islami Bank Limited',
    logo: '/placeholder.svg',
    established: 2001,
    rating: 3.6,
    totalBranches: 143,
    website: 'https://sjiblbd.com'
  },
  {
    id: 'exim',
    name: 'Export Import Bank of Bangladesh Limited',
    logo: '/placeholder.svg',
    established: 1999,
    rating: 3.7,
    totalBranches: 138,
    website: 'https://eximbankbd.com'
  },
  {
    id: 'mercantile',
    name: 'Mercantile Bank Limited',
    logo: '/placeholder.svg',
    established: 1999,
    rating: 3.8,
    totalBranches: 146,
    website: 'https://mblbd.com'
  },
  {
    id: 'ific',
    name: 'IFIC Bank Limited',
    logo: '/placeholder.svg',
    established: 1976,
    rating: 3.7,
    totalBranches: 139,
    website: 'https://ificbank.com.bd'
  },
  {
    id: 'jamuna',
    name: 'Jamuna Bank Limited',
    logo: '/placeholder.svg',
    established: 2001,
    rating: 3.5,
    totalBranches: 143,
    website: 'https://jamunabank.com.bd'
  },
  {
    id: 'one',
    name: 'One Bank Limited',
    logo: '/placeholder.svg',
    established: 1999,
    rating: 3.6,
    totalBranches: 128,
    website: 'https://onebank.com.bd'
  },
  {
    id: 'premier',
    name: 'Premier Bank Limited',
    logo: '/placeholder.svg',
    established: 1999,
    rating: 3.9,
    totalBranches: 148,
    website: 'https://premierbank.com.bd'
  },
  {
    id: 'south-bangla',
    name: 'South Bangla Agriculture & Commerce Bank Limited',
    logo: '/placeholder.svg',
    established: 2008,
    rating: 3.4,
    totalBranches: 100,
    website: 'https://southbanglabank.com'
  },
  {
    id: 'modhumoti',
    name: 'Modhumoti Bank Limited',
    logo: '/placeholder.svg',
    established: 2013,
    rating: 3.5,
    totalBranches: 62,
    website: 'https://modhumotibank.com'
  },
  {
    id: 'meghna',
    name: 'Meghna Bank Limited',
    logo: '/placeholder.svg',
    established: 2013,
    rating: 3.3,
    totalBranches: 55,
    website: 'https://meghnabank.com.bd'
  },
  {
    id: 'community',
    name: 'Community Bank Bangladesh Limited',
    logo: '/placeholder.svg',
    established: 2013,
    rating: 3.2,
    totalBranches: 50,
    website: 'https://communitybankbd.com'
  },
  {
    id: 'midland',
    name: 'Midland Bank Limited',
    logo: '/placeholder.svg',
    established: 2013,
    rating: 3.4,
    totalBranches: 58,
    website: 'https://midlandbankbd.com'
  },
  {
    id: 'union',
    name: 'Union Bank Limited',
    logo: '/placeholder.svg',
    established: 2013,
    rating: 3.3,
    totalBranches: 60,
    website: 'https://unionbank.com.bd'
  },
  {
    id: 'bengal',
    name: 'Bengal Commercial Bank Limited',
    logo: '/placeholder.svg',
    established: 2020,
    rating: 3.5,
    totalBranches: 25,
    website: 'https://bcblbd.com'
  },
  // Foreign Commercial Banks
  {
    id: 'standard-chartered',
    name: 'Standard Chartered Bank',
    logo: '/placeholder.svg',
    established: 1947,
    rating: 4.6,
    totalBranches: 9,
    website: 'https://sc.com/bd'
  },
  {
    id: 'hsbc',
    name: 'HSBC Limited',
    logo: '/placeholder.svg',
    established: 1996,
    rating: 4.5,
    totalBranches: 7,
    website: 'https://hsbc.com.bd'
  },
  {
    id: 'citibank',
    name: 'Citibank N.A.',
    logo: '/placeholder.svg',
    established: 1987,
    rating: 4.4,
    totalBranches: 3,
    website: 'https://citibank.com.bd'
  },
  {
    id: 'commercial-bank-ceylon',
    name: 'Commercial Bank of Ceylon PLC',
    logo: '/placeholder.svg',
    established: 2002,
    rating: 4.0,
    totalBranches: 19,
    website: 'https://combank.lk'
  },
  {
    id: 'state-bank-india',
    name: 'State Bank of India',
    logo: '/placeholder.svg',
    established: 1974,
    rating: 3.8,
    totalBranches: 8,
    website: 'https://sbi.co.in'
  },
  {
    id: 'national-bank-pakistan',
    name: 'National Bank of Pakistan',
    logo: '/placeholder.svg',
    established: 1973,
    rating: 3.6,
    totalBranches: 9,
    website: 'https://nbp.com.pk'
  },
  {
    id: 'habib',
    name: 'Habib Bank Limited',
    logo: '/placeholder.svg',
    established: 1976,
    rating: 3.7,
    totalBranches: 17,
    website: 'https://hbl.com'
  },
  // Specialized Banks
  {
    id: 'bangladesh-house',
    name: 'Bangladesh House Building Finance Corporation',
    logo: '/placeholder.svg',
    established: 1973,
    rating: 3.2,
    totalBranches: 25,
    website: 'https://bhbfc.gov.bd'
  },
  {
    id: 'ansar-vdp',
    name: 'Ansar VDP Unnayan Bank',
    logo: '/placeholder.svg',
    established: 2010,
    rating: 3.1,
    totalBranches: 142,
    website: 'https://avub.gov.bd'
  },
  {
    id: 'grameen',
    name: 'Grameen Bank',
    logo: '/placeholder.svg',
    established: 1983,
    rating: 4.0,
    totalBranches: 2568,
    website: 'https://grameenbank.org.bd'
  },
  {
    id: 'pksf',
    name: 'Palli Karma-Sahayak Foundation',
    logo: '/placeholder.svg',
    established: 1990,
    rating: 3.8,
    totalBranches: 15,
    website: 'https://pksf.gov.bd'
  },
  {
    id: 'karmasangsthan',
    name: 'Karmasangsthan Bank',
    logo: '/placeholder.svg',
    established: 2010,
    rating: 3.0,
    totalBranches: 139,
    website: 'https://ksb.gov.bd'
  },
  {
    id: 'probashi',
    name: 'Probashi Kallyan Bank',
    logo: '/placeholder.svg',
    established: 2010,
    rating: 3.2,
    totalBranches: 23,
    website: 'https://pkb.gov.bd'
  },
  // Recent Banks
  {
    id: 'padma',
    name: 'Padma Bank Limited',
    logo: '/placeholder.svg',
    established: 2013,
    rating: 3.6,
    totalBranches: 72,
    website: 'https://padmabank.com'
  },
  {
    id: 'citizens',
    name: 'Citizens Bank PLC',
    logo: '/placeholder.svg',
    established: 2013,
    rating: 3.4,
    totalBranches: 45,
    website: 'https://citizensbankbd.com'
  },
  {
    id: 'global-islami',
    name: 'Global Islami Bank Limited',
    logo: '/placeholder.svg',
    established: 2013,
    rating: 3.3,
    totalBranches: 42,
    website: 'https://globalislami.com'
  },
  {
    id: 'bangladesh-commerce',
    name: 'Bangladesh Commerce Bank Limited',
    logo: '/placeholder.svg',
    established: 2013,
    rating: 3.2,
    totalBranches: 65,
    website: 'https://bcbl.com.bd'
  }
];

export const savingsProducts: SavingsProduct[] = [
  {
    id: 'bb-savings-1',
    bankId: 'bb',
    productName: 'Premium Savings Account',
    interestRate: 6.5,
    minimumDeposit: 10000,
    maximumDeposit: 10000000,
    tenure: { min: 12, max: 60 },
    compoundingFrequency: 'quarterly',
    fees: {
      accountOpening: 500,
      maintenance: 200,
      withdrawal: 50
    },
    features: [
      'Free SMS alerts',
      'Online banking',
      'Debit card included',
      'Mobile banking'
    ],
    eligibility: [
      'Minimum age 18 years',
      'Valid NID',
      'Minimum initial deposit'
    ]
  },
  {
    id: 'islami-savings-1',
    bankId: 'islami',
    productName: 'Mudaraba Savings Account',
    interestRate: 7.0,
    minimumDeposit: 5000,
    maximumDeposit: 50000000,
    tenure: { min: 6, max: 120 },
    compoundingFrequency: 'monthly',
    fees: {
      accountOpening: 300,
      maintenance: 150,
      withdrawal: 30
    },
    features: [
      'Shariah compliant',
      'Profit sharing',
      'Mobile banking',
      'ATM access'
    ],
    eligibility: [
      'Muslim only',
      'Age 18-65 years',
      'Valid documents'
    ]
  },
  {
    id: 'dutch-bangla-savings-1',
    bankId: 'dutch-bangla',
    productName: 'Smart Saver Account',
    interestRate: 6.8,
    minimumDeposit: 3000,
    maximumDeposit: 25000000,
    tenure: { min: 12, max: 84 },
    compoundingFrequency: 'quarterly',
    fees: {
      accountOpening: 400,
      maintenance: 100,
      withdrawal: 25
    },
    features: [
      'Digital banking',
      'Auto sweep facility',
      'High interest rate',
      'Free transactions'
    ],
    eligibility: [
      'Minimum age 18',
      'Proof of income',
      'Address verification'
    ]
  },
  {
    id: 'brac-savings-1',
    bankId: 'brac',
    productName: 'Apurbo Savings',
    interestRate: 6.2,
    minimumDeposit: 2000,
    maximumDeposit: 15000000,
    tenure: { min: 6, max: 72 },
    compoundingFrequency: 'monthly',
    fees: {
      accountOpening: 250,
      maintenance: 120,
      withdrawal: 20
    },
    features: [
      'Low minimum balance',
      'Quick account opening',
      'Branch network',
      'Customer support'
    ],
    eligibility: [
      'Age 18+',
      'Valid ID proof',
      'Initial deposit'
    ]
  }
];

export const loanProducts: LoanProduct[] = [
  {
    id: 'bb-personal-1',
    bankId: 'bb',
    productName: 'Personal Loan Premium',
    loanType: 'personal',
    interestRate: { min: 12.5, max: 16.0 },
    loanAmount: { min: 50000, max: 2000000 },
    tenure: { min: 12, max: 60 },
    processingFee: 2.0,
    processingTime: '7-10 working days',
    eligibility: [
      'Age 21-60 years',
      'Minimum salary 25,000 BDT',
      'Service length 2+ years'
    ],
    requiredDocuments: [
      'NID copy',
      'Salary certificate',
      'Bank statements',
      'Employment letter'
    ],
    features: [
      'No collateral required',
      'Flexible repayment',
      'Quick processing',
      'Competitive rates'
    ]
  },
  {
    id: 'islami-home-1',
    bankId: 'islami',
    productName: 'Home Finance (Diminishing Musharaka)',
    loanType: 'home',
    interestRate: { min: 9.5, max: 12.0 },
    loanAmount: { min: 500000, max: 50000000 },
    tenure: { min: 60, max: 300 },
    processingFee: 1.5,
    processingTime: '15-20 working days',
    eligibility: [
      'Age 25-65 years',
      'Minimum income 50,000 BDT',
      'Property documents'
    ],
    requiredDocuments: [
      'Property papers',
      'Income proof',
      'NID',
      'Valuation report'
    ],
    features: [
      'Shariah compliant',
      'Up to 85% financing',
      'Long tenure options',
      'Prepayment allowed'
    ]
  },
  {
    id: 'dutch-bangla-car-1',
    bankId: 'dutch-bangla',
    productName: 'Auto Loan Express',
    loanType: 'car',
    interestRate: { min: 10.5, max: 14.0 },
    loanAmount: { min: 200000, max: 8000000 },
    tenure: { min: 12, max: 84 },
    processingFee: 1.0,
    processingTime: '3-5 working days',
    eligibility: [
      'Age 23-65 years',
      'Minimum income 35,000 BDT',
      'Valid driving license'
    ],
    requiredDocuments: [
      'Driving license',
      'Income certificate',
      'NID',
      'Vehicle quotation'
    ],
    features: [
      'Fast approval',
      'New & used cars',
      'Insurance included',
      'Doorstep service'
    ]
  },
  {
    id: 'brac-business-1',
    bankId: 'brac',
    productName: 'SME Business Loan',
    loanType: 'business',
    interestRate: { min: 11.0, max: 15.5 },
    loanAmount: { min: 100000, max: 10000000 },
    tenure: { min: 12, max: 120 },
    processingFee: 2.5,
    processingTime: '10-15 working days',
    eligibility: [
      'Business age 2+ years',
      'Annual turnover 500,000+',
      'Valid trade license'
    ],
    requiredDocuments: [
      'Trade license',
      'Financial statements',
      'Bank statements',
      'Business plan'
    ],
    features: [
      'Working capital support',
      'Flexible repayment',
      'Business advisory',
      'Multiple loan types'
    ]
  },
  {
    id: 'bb-student-1',
    bankId: 'bb',
    productName: 'Education Loan Scheme',
    loanType: 'student',
    interestRate: { min: 4.0, max: 6.0 },
    loanAmount: { min: 25000, max: 1500000 },
    tenure: { min: 60, max: 180 },
    processingFee: 0.5,
    processingTime: '15-20 working days',
    eligibility: [
      'Admitted to recognized institution',
      'Age 18-35 years',
      'Guardian as co-applicant'
    ],
    requiredDocuments: [
      'Admission letter',
      'Mark sheets',
      'Guardian income proof',
      'Course fee structure'
    ],
    features: [
      'Subsidized interest rate',
      'Moratorium period',
      'No collateral up to 4 lakh',
      'Covers tuition & living expenses'
    ]
  },
  {
    id: 'islami-student-1',
    bankId: 'islami',
    productName: 'Islami Education Finance',
    loanType: 'student',
    interestRate: { min: 5.0, max: 7.0 },
    loanAmount: { min: 50000, max: 2000000 },
    tenure: { min: 72, max: 240 },
    processingFee: 1.0,
    processingTime: '10-15 working days',
    eligibility: [
      'Muslim students only',
      'Age 18-40 years',
      'Good academic record'
    ],
    requiredDocuments: [
      'Admission confirmation',
      'Academic transcripts',
      'Guardian documents',
      'Institution approval'
    ],
    features: [
      'Shariah compliant',
      'Profit sharing basis',
      'Grace period available',
      'Study abroad option'
    ]
  },
  {
    id: 'dutch-bangla-student-1',
    bankId: 'dutch-bangla',
    productName: 'Student Plus Loan',
    loanType: 'student',
    interestRate: { min: 6.0, max: 8.0 },
    loanAmount: { min: 30000, max: 1000000 },
    tenure: { min: 48, max: 144 },
    processingFee: 0.75,
    processingTime: '7-10 working days',
    eligibility: [
      'Enrolled in approved courses',
      'Age 18-30 years',
      'Co-applicant required'
    ],
    requiredDocuments: [
      'University admission',
      'Previous certificates',
      'Income certificate',
      'Course details'
    ],
    features: [
      'Digital processing',
      'Quick approval',
      'Flexible repayment',
      'Online monitoring'
    ]
  },
  {
    id: 'brac-student-1',
    bankId: 'brac',
    productName: 'Agrosor Education Loan',
    loanType: 'student',
    interestRate: { min: 5.5, max: 7.5 },
    loanAmount: { min: 20000, max: 800000 },
    tenure: { min: 36, max: 120 },
    processingFee: 1.0,
    processingTime: '5-10 working days',
    eligibility: [
      'HSC/Equivalent passed',
      'Age 17-35 years',
      'Family income criteria'
    ],
    requiredDocuments: [
      'Educational certificates',
      'Admission letter',
      'Guardian ID',
      'Income proof'
    ],
    features: [
      'Low interest rate',
      'Easy documentation',
      'Quick processing',
      'Support for all levels'
    ]
  },
  {
    id: 'eastern-student-1',
    bankId: 'eastern',
    productName: 'EBL Education Loan',
    loanType: 'student',
    interestRate: { min: 6.5, max: 8.5 },
    loanAmount: { min: 40000, max: 1200000 },
    tenure: { min: 60, max: 180 },
    processingFee: 1.25,
    processingTime: '12-18 working days',
    eligibility: [
      'Admitted to reputed institution',
      'Age 18-32 years',
      'Guarantor required'
    ],
    requiredDocuments: [
      'Admission confirmation',
      'Academic records',
      'Guardian documents',
      'Fee structure'
    ],
    features: [
      'Competitive rates',
      'Study loan counseling',
      'Repayment flexibility',
      'International study support'
    ]
  },
  {
    id: 'prime-student-1',
    bankId: 'prime',
    productName: 'Prime Education Finance',
    loanType: 'student',
    interestRate: { min: 5.0, max: 7.0 },
    loanAmount: { min: 35000, max: 1800000 },
    tenure: { min: 48, max: 200 },
    processingFee: 0.8,
    processingTime: '8-12 working days',
    eligibility: [
      'Good academic standing',
      'Age 18-38 years',
      'Co-signer required'
    ],
    requiredDocuments: [
      'University letter',
      'Mark sheets',
      'Guardian income',
      'Course curriculum'
    ],
    features: [
      'Prime student benefits',
      'Grace period options',
      'Career guidance',
      'Alumni network access'
    ]
  }
];

export const nbfis: NBFI[] = [
  // Leasing Companies
  {
    id: 'idlc',
    name: 'IDLC Finance Limited',
    logo: '/placeholder.svg',
    established: 1985,
    rating: 4.2,
    totalBranches: 85,
    website: 'https://idlc.com',
    type: 'lease'
  },
  {
    id: 'lankabangla',
    name: 'LankaBangla Finance Limited',
    logo: '/placeholder.svg',
    established: 2001,
    rating: 4.0,
    totalBranches: 45,
    website: 'https://lankabangla.com',
    type: 'lease'
  },
  {
    id: 'phoenix',
    name: 'Phoenix Finance and Investments Limited',
    logo: '/placeholder.svg',
    established: 2000,
    rating: 3.8,
    totalBranches: 35,
    website: 'https://pfinance.com.bd',
    type: 'lease'
  },
  {
    id: 'bay-leasing',
    name: 'Bay Leasing & Investment Limited',
    logo: '/placeholder.svg',
    established: 2009,
    rating: 3.7,
    totalBranches: 25,
    website: 'https://bayleasing.com',
    type: 'lease'
  },
  {
    id: 'pd-finance',
    name: 'PD Finance Limited',
    logo: '/placeholder.svg',
    established: 2006,
    rating: 3.6,
    totalBranches: 18,
    website: 'https://pdfinance.com.bd',
    type: 'lease'
  },
  {
    id: 'industrial-leasing',
    name: 'Industrial and Infrastructure Development Finance Company Limited',
    logo: '/placeholder.svg',
    established: 2000,
    rating: 3.5,
    totalBranches: 15,
    website: 'https://iidfc.com',
    type: 'lease'
  },
  {
    id: 'peoples-leasing',
    name: 'Peoples Leasing & Financial Services Limited',
    logo: '/placeholder.svg',
    established: 2010,
    rating: 3.4,
    totalBranches: 20,
    website: 'https://peoplesleasing.com.bd',
    type: 'lease'
  },
  {
    id: 'union-capital',
    name: 'Union Capital Limited',
    logo: '/placeholder.svg',
    established: 2008,
    rating: 3.6,
    totalBranches: 22,
    website: 'https://unioncapital.com.bd',
    type: 'lease'
  },
  {
    id: 'bangladesh-industrial',
    name: 'Bangladesh Industrial Finance Company Limited',
    logo: '/placeholder.svg',
    established: 1993,
    rating: 3.8,
    totalBranches: 30,
    website: 'https://bifcl.com',
    type: 'lease'
  },
  {
    id: 'fareast-finance',
    name: 'Fareast Finance & Investment Limited',
    logo: '/placeholder.svg',
    established: 2006,
    rating: 3.5,
    totalBranches: 16,
    website: 'https://fareastfinance.com.bd',
    type: 'lease'
  },
  {
    id: 'first-lease',
    name: 'First Lease International Limited',
    logo: '/placeholder.svg',
    established: 2005,
    rating: 3.4,
    totalBranches: 14,
    website: 'https://firstlease.com.bd',
    type: 'lease'
  },
  {
    id: 'gspd-finance',
    name: 'GSPD Finance Company (Bangladesh) Limited',
    logo: '/placeholder.svg',
    established: 2007,
    rating: 3.3,
    totalBranches: 12,
    website: 'https://gspdfinance.com',
    type: 'lease'
  },
  {
    id: 'prime-finance',
    name: 'Prime Finance & Investment Limited',
    logo: '/placeholder.svg',
    established: 2009,
    rating: 3.7,
    totalBranches: 19,
    website: 'https://primefinance.com.bd',
    type: 'lease'
  },
  {
    id: 'national-finance',
    name: 'National Finance Limited',
    logo: '/placeholder.svg',
    established: 2003,
    rating: 3.5,
    totalBranches: 17,
    website: 'https://nfl.com.bd',
    type: 'lease'
  },
  {
    id: 'sa-paribahan',
    name: 'SA Paribahan Leasing & Financial Services Limited',
    logo: '/placeholder.svg',
    established: 2011,
    rating: 3.2,
    totalBranches: 10,
    website: 'https://saparibahan.com',
    type: 'lease'
  },
  {
    id: 'green-delta',
    name: 'Green Delta IDCOL Venture Capital Fund Limited',
    logo: '/placeholder.svg',
    established: 2012,
    rating: 3.8,
    totalBranches: 8,
    website: 'https://greendelta.com',
    type: 'investment'
  },
  {
    id: 'investment-corp',
    name: 'Investment Corporation of Bangladesh',
    logo: '/placeholder.svg',
    established: 1976,
    rating: 3.9,
    totalBranches: 15,
    website: 'https://icb.gov.bd',
    type: 'investment'
  },
  {
    id: 'venture-investment',
    name: 'Venture Investment Partners Limited',
    logo: '/placeholder.svg',
    established: 2008,
    rating: 3.6,
    totalBranches: 6,
    website: 'https://vip.com.bd',
    type: 'investment'
  },
  // Merchant Banks
  {
    id: 'race-merchant',
    name: 'Race Merchant Bank Limited',
    logo: '/placeholder.svg',
    established: 2010,
    rating: 3.5,
    totalBranches: 8,
    website: 'https://racemerchant.com',
    type: 'merchant'
  },
  {
    id: 'city-merchant',
    name: 'City Merchant Bank Limited',
    logo: '/placeholder.svg',
    established: 2009,
    rating: 3.4,
    totalBranches: 6,
    website: 'https://citymerchant.com.bd',
    type: 'merchant'
  },
  {
    id: 'standard-merchant',
    name: 'Standard Merchant Bank Limited',
    logo: '/placeholder.svg',
    established: 2011,
    rating: 3.3,
    totalBranches: 5,
    website: 'https://standardmerchant.com',
    type: 'merchant'
  },
  {
    id: 'prime-merchant',
    name: 'Prime Merchant Bank Limited',
    logo: '/placeholder.svg',
    established: 2012,
    rating: 3.6,
    totalBranches: 7,
    website: 'https://primemerchant.com.bd',
    type: 'merchant'
  },
  {
    id: 'brac-merchant',
    name: 'BRAC EPL Stock Brokerage Limited',
    logo: '/placeholder.svg',
    established: 2008,
    rating: 4.0,
    totalBranches: 12,
    website: 'https://bracepl.com',
    type: 'merchant'
  },
  {
    id: 'ucb-merchant',
    name: 'UCB Investment Limited',
    logo: '/placeholder.svg',
    established: 2007,
    rating: 3.7,
    totalBranches: 9,
    website: 'https://ucbinvestment.com',
    type: 'merchant'
  },
  {
    id: 'ebl-merchant',
    name: 'EBL Securities Limited',
    logo: '/placeholder.svg',
    established: 2005,
    rating: 3.8,
    totalBranches: 11,
    website: 'https://eblsecurities.com',
    type: 'merchant'
  },
  // Housing Finance
  {
    id: 'delta-life',
    name: 'Delta Life Insurance Company Limited',
    logo: '/placeholder.svg',
    established: 1986,
    rating: 4.1,
    totalBranches: 45,
    website: 'https://deltalife.com.bd',
    type: 'housing'
  },
  {
    id: 'national-housing',
    name: 'National Housing Finance and Investment Limited',
    logo: '/placeholder.svg',
    established: 2000,
    rating: 3.9,
    totalBranches: 25,
    website: 'https://nhfil.com',
    type: 'housing'
  },
  {
    id: 'home-finance',
    name: 'Home Finance Company Limited',
    logo: '/placeholder.svg',
    established: 1995,
    rating: 3.7,
    totalBranches: 18,
    website: 'https://homefinance.com.bd',
    type: 'housing'
  },
  {
    id: 'shelter-finance',
    name: 'Shelter Finance Limited',
    logo: '/placeholder.svg',
    established: 2005,
    rating: 3.6,
    totalBranches: 15,
    website: 'https://shelterfinance.com',
    type: 'housing'
  },
  {
    id: 'golden-jubilee',
    name: 'Golden Jubilee Finance Limited',
    logo: '/placeholder.svg',
    established: 2010,
    rating: 3.4,
    totalBranches: 12,
    website: 'https://goldenjubilee.com.bd',
    type: 'housing'
  },
  {
    id: 'trust-finance',
    name: 'Trust Finance Limited',
    logo: '/placeholder.svg',
    established: 2008,
    rating: 3.5,
    totalBranches: 14,
    website: 'https://trustfinance.com.bd',
    type: 'housing'
  },
  {
    id: 'uttara-finance',
    name: 'Uttara Finance & Investment Limited',
    logo: '/placeholder.svg',
    established: 1997,
    rating: 3.8,
    totalBranches: 22,
    website: 'https://ufl.com.bd',
    type: 'housing'
  },
  {
    id: 'premier-finance',
    name: 'Premier Finance Limited',
    logo: '/placeholder.svg',
    established: 2004,
    rating: 3.6,
    totalBranches: 16,
    website: 'https://premierfinance.com.bd',
    type: 'housing'
  },
  {
    id: 'asiatic-finance',
    name: 'Asiatic Finance Limited',
    logo: '/placeholder.svg',
    established: 2006,
    rating: 3.3,
    totalBranches: 10,
    website: 'https://asiaticfinance.com',
    type: 'housing'
  },
  {
    id: 'general-finance',
    name: 'General Finance Limited',
    logo: '/placeholder.svg',
    established: 2003,
    rating: 3.4,
    totalBranches: 13,
    website: 'https://generalfinance.com.bd',
    type: 'housing'
  }
];

export const ngos: NGO[] = [
  {
    id: 'brac-ngo',
    name: 'BRAC',
    logo: '/placeholder.svg',
    established: 1972,
    rating: 4.8,
    totalBranches: 2500,
    website: 'https://brac.net',
    focus: ['Microfinance', 'Education', 'Healthcare', 'Agriculture']
  },
  {
    id: 'grameen-foundation',
    name: 'Grameen Foundation',
    logo: '/placeholder.svg',
    established: 1976,
    rating: 4.7,
    totalBranches: 2568,
    website: 'https://grameenfoundation.org',
    focus: ['Microfinance', 'Poverty Alleviation', 'Women Empowerment']
  },
  {
    id: 'asa',
    name: 'ASA (Association for Social Advancement)',
    logo: '/placeholder.svg',
    established: 1978,
    rating: 4.5,
    totalBranches: 3500,
    website: 'https://asa.org.bd',
    focus: ['Microfinance', 'Rural Development', 'Financial Inclusion']
  },
  {
    id: 'proshika',
    name: 'Proshika Manobik Unnayan Kendra',
    logo: '/placeholder.svg',
    established: 1976,
    rating: 4.3,
    totalBranches: 1200,
    website: 'https://proshika.org',
    focus: ['Human Development', 'Training', 'Microfinance']
  },
  {
    id: 'shakti',
    name: 'Shakti Foundation for Disadvantaged Women',
    logo: '/placeholder.svg',
    established: 1992,
    rating: 4.2,
    totalBranches: 800,
    website: 'https://shaktifoundation.org',
    focus: ['Women Empowerment', 'Microfinance', 'Skills Development']
  },
  {
    id: 'tmss',
    name: 'Thengamara Mohila Sabuj Sangha (TMSS)',
    logo: '/placeholder.svg',
    established: 1980,
    rating: 4.1,
    totalBranches: 1500,
    website: 'https://tmss-bd.org',
    focus: ['Women Development', 'Microfinance', 'Healthcare']
  },
  {
    id: 'jagorani',
    name: 'Jagorani Chakra Foundation',
    logo: '/placeholder.svg',
    established: 1985,
    rating: 4.0,
    totalBranches: 600,
    website: 'https://jcf.org.bd',
    focus: ['Rural Development', 'Microfinance', 'Education']
  },
  {
    id: 'caritas',
    name: 'Caritas Bangladesh',
    logo: '/placeholder.svg',
    established: 1967,
    rating: 4.4,
    totalBranches: 200,
    website: 'https://caritasbd.org',
    focus: ['Social Development', 'Emergency Response', 'Healthcare']
  },
  {
    id: 'ccdb',
    name: 'Christian Commission for Development in Bangladesh',
    logo: '/placeholder.svg',
    established: 1973,
    rating: 4.2,
    totalBranches: 150,
    website: 'https://ccdb.org.bd',
    focus: ['Community Development', 'Disaster Management', 'Advocacy']
  },
  {
    id: 'rdrs',
    name: 'Rangpur Dinajpur Rural Service (RDRS)',
    logo: '/placeholder.svg',
    established: 1972,
    rating: 4.0,
    totalBranches: 180,
    website: 'https://rdrs.org.bd',
    focus: ['Rural Development', 'Agriculture', 'Water & Sanitation']
  },
  {
    id: 'coast',
    name: 'Coastal Association for Social Transformation Trust',
    logo: '/placeholder.svg',
    established: 1998,
    rating: 3.9,
    totalBranches: 120,
    website: 'https://coastbd.net',
    focus: ['Coastal Development', 'Climate Change', 'Livelihood']
  },
  {
    id: 'wave',
    name: 'Wave Foundation',
    logo: '/placeholder.svg',
    established: 1993,
    rating: 3.8,
    totalBranches: 85,
    website: 'https://wavefoundation.org.bd',
    focus: ['Disability Rights', 'Education', 'Advocacy']
  },
  {
    id: 'sus',
    name: 'Society for Underprivileged Families (SUS)',
    logo: '/placeholder.svg',
    established: 1988,
    rating: 3.7,
    totalBranches: 95,
    website: 'https://sus.org.bd',
    focus: ['Poverty Reduction', 'Healthcare', 'Education']
  },
  {
    id: 'bees',
    name: 'Bangladesh Extension Education Services (BEES)',
    logo: '/placeholder.svg',
    established: 1984,
    rating: 3.6,
    totalBranches: 75,
    website: 'https://bees.net.bd',
    focus: ['Agricultural Extension', 'Rural Development', 'Training']
  },
  {
    id: 'bks',
    name: 'Bangladesh Krishok Sramik Awami League (BKS)',
    logo: '/placeholder.svg',
    established: 1976,
    rating: 3.5,
    totalBranches: 110,
    website: 'https://bks.org.bd',
    focus: ['Farmers Rights', 'Agricultural Development', 'Cooperatives']
  }
];
