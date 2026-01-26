import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Financial term definitions for the Bangladesh market
export const financialTerms = {
  interestRate: {
    title: 'Interest Rate',
    description: 'The percentage of the principal amount charged or earned over a period. For loans, it\'s the cost of borrowing. For savings, it\'s your earnings.',
  },
  apr: {
    title: 'APR (Annual Percentage Rate)',
    description: 'The yearly interest rate including all fees and costs. It provides a complete picture of the true cost of borrowing or returns on savings.',
  },
  compoundingFrequency: {
    title: 'Compounding Frequency',
    description: 'How often interest is calculated and added to the principal. More frequent compounding (e.g., monthly vs. yearly) results in higher effective returns.',
  },
  tenure: {
    title: 'Tenure',
    description: 'The duration or time period of a loan or fixed deposit, typically measured in months. Longer tenure often means lower EMI but higher total interest.',
  },
  minimumDeposit: {
    title: 'Minimum Deposit',
    description: 'The lowest amount required to open or maintain a savings account or fixed deposit.',
  },
  processingFee: {
    title: 'Processing Fee',
    description: 'A one-time charge (usually a percentage of the loan amount) that banks charge for processing your loan application.',
  },
  emi: {
    title: 'EMI (Equated Monthly Installment)',
    description: 'The fixed amount you pay each month to repay your loan. It includes both principal and interest portions.',
  },
  roi: {
    title: 'ROI (Return on Investment)',
    description: 'The percentage gain or loss on an investment relative to its cost. Higher ROI means better returns on your savings.',
  },
  principalAmount: {
    title: 'Principal Amount',
    description: 'The original sum of money borrowed in a loan or invested in a deposit, excluding interest.',
  },
  maturityAmount: {
    title: 'Maturity Amount',
    description: 'The total amount you receive at the end of your investment period, including principal and accumulated interest.',
  },
  totalInterest: {
    title: 'Total Interest',
    description: 'The cumulative interest paid on a loan or earned on a deposit over the entire tenure.',
  },
  maintenanceFee: {
    title: 'Maintenance Fee',
    description: 'A recurring charge (usually monthly or quarterly) for maintaining your account. Some accounts waive this if you maintain a minimum balance.',
  },
  withdrawalFee: {
    title: 'Withdrawal Fee',
    description: 'A charge applied when you withdraw funds before the maturity date of a fixed deposit or beyond allowed free transactions.',
  },
} as const;

export type FinancialTermKey = keyof typeof financialTerms;

interface FinancialTermTooltipProps {
  term: FinancialTermKey;
  children: React.ReactNode;
  showIcon?: boolean;
  className?: string;
}

export function FinancialTermTooltip({ 
  term, 
  children, 
  showIcon = true,
  className = ''
}: FinancialTermTooltipProps) {
  const termData = financialTerms[term];
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center gap-1 cursor-help ${className}`}>
            {children}
            {showIcon && <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[280px] p-3">
          <div className="space-y-1">
            <p className="font-semibold text-sm">{termData.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {termData.description}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Simple inline tooltip for labels
interface TermLabelProps {
  term: FinancialTermKey;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export function TermLabel({ term, label, className = '', showIcon = true }: TermLabelProps) {
  const displayLabel = label || financialTerms[term].title;
  
  return (
    <FinancialTermTooltip term={term} showIcon={showIcon} className={className}>
      {displayLabel}
    </FinancialTermTooltip>
  );
}
