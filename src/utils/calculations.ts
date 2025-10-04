export interface EMICalculationResult {
  monthlyEMI: number;
  totalInterest: number;
  totalAmount: number;
  yearlyBreakdown: Array<{
    year: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }>;
}

export interface ROICalculationResult {
  maturityAmount: number;
  totalInterest: number;
  yearlyBreakdown: Array<{
    year: number;
    principal: number;
    interest: number;
    total: number;
  }>;
}

export const calculateEMI = (
  principal: number,
  annualRate: number,
  tenureMonths: number
): EMICalculationResult => {
  const monthlyRate = annualRate / 100 / 12;
  
  // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  
  const totalAmount = emi * tenureMonths;
  const totalInterest = totalAmount - principal;
  
  // Calculate yearly breakdown
  const yearlyBreakdown = [];
  let remainingBalance = principal;
  
  for (let year = 1; year <= Math.ceil(tenureMonths / 12); year++) {
    const monthsInYear = Math.min(12, tenureMonths - (year - 1) * 12);
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    
    for (let month = 1; month <= monthsInYear; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = emi - interestPayment;
      
      yearlyPrincipal += principalPayment;
      yearlyInterest += interestPayment;
      remainingBalance -= principalPayment;
    }
    
    yearlyBreakdown.push({
      year,
      principalPaid: yearlyPrincipal,
      interestPaid: yearlyInterest,
      remainingBalance: Math.max(0, remainingBalance)
    });
  }
  
  return {
    monthlyEMI: emi,
    totalInterest,
    totalAmount,
    yearlyBreakdown
  };
};

export const calculateROI = (
  principal: number,
  annualRate: number,
  tenureMonths: number,
  compoundingFrequency: 'monthly' | 'quarterly' | 'yearly' = 'quarterly'
): ROICalculationResult => {
  const compoundingPerYear = {
    monthly: 12,
    quarterly: 4,
    yearly: 1
  }[compoundingFrequency];
  
  const rate = annualRate / 100;
  const years = tenureMonths / 12;
  
  // Compound interest formula: A = P(1 + r/n)^(nt)
  const maturityAmount = principal * Math.pow(1 + rate / compoundingPerYear, compoundingPerYear * years);
  const totalInterest = maturityAmount - principal;
  
  // Calculate yearly breakdown
  const yearlyBreakdown = [];
  let currentAmount = principal;
  
  for (let year = 1; year <= Math.ceil(years); year++) {
    const yearFraction = Math.min(1, years - (year - 1));
    const newAmount = currentAmount * Math.pow(1 + rate / compoundingPerYear, compoundingPerYear * yearFraction);
    const yearlyInterest = newAmount - currentAmount;
    
    yearlyBreakdown.push({
      year,
      principal: currentAmount,
      interest: yearlyInterest,
      total: newAmount
    });
    
    currentAmount = newAmount;
  }
  
  return {
    maturityAmount,
    totalInterest,
    yearlyBreakdown
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-BD').format(num);
};

export const formatPercentage = (rate: number): string => {
  return `${rate.toFixed(2)}%`;
};