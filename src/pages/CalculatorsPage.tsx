import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator, 
  PiggyBank, 
  CreditCard,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { 
  calculateEMI, 
  calculateROI, 
  formatCurrency, 
  formatPercentage,
  formatNumber,
  EMICalculationResult,
  ROICalculationResult
} from '@/utils/calculations';

const CalculatorsPage = () => {
  // EMI Calculator State
  const [emiLoanAmount, setEmiLoanAmount] = useState('500000');
  const [emiInterestRate, setEmiInterestRate] = useState('12');
  const [emiTenure, setEmiTenure] = useState('60');
  const [emiResult, setEmiResult] = useState<EMICalculationResult | null>(null);

  // ROI Calculator State
  const [roiPrincipal, setRoiPrincipal] = useState('100000');
  const [roiInterestRate, setRoiInterestRate] = useState('8');
  const [roiTenure, setRoiTenure] = useState('36');
  const [roiCompounding, setRoiCompounding] = useState<'monthly' | 'quarterly' | 'yearly'>('quarterly');
  const [roiResult, setRoiResult] = useState<ROICalculationResult | null>(null);

  const handleEMICalculation = () => {
    const principal = parseFloat(emiLoanAmount);
    const rate = parseFloat(emiInterestRate);
    const tenure = parseInt(emiTenure);

    if (principal > 0 && rate > 0 && tenure > 0) {
      const result = calculateEMI(principal, rate, tenure);
      setEmiResult(result);
    }
  };

  const handleROICalculation = () => {
    const principal = parseFloat(roiPrincipal);
    const rate = parseFloat(roiInterestRate);
    const tenure = parseInt(roiTenure);

    if (principal > 0 && rate > 0 && tenure > 0) {
      const result = calculateROI(principal, rate, tenure, roiCompounding);
      setRoiResult(result);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Financial Calculators</h1>
        <p className="text-xl text-muted-foreground">
          Use our advanced calculators to plan your finances and make informed decisions
        </p>
      </div>

      <Tabs defaultValue="emi" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="emi" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>EMI Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="roi" className="flex items-center space-x-2">
            <PiggyBank className="h-4 w-4" />
            <span>ROI Calculator</span>
          </TabsTrigger>
        </TabsList>

        {/* EMI Calculator */}
        <TabsContent value="emi">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  EMI Calculator
                </CardTitle>
                <CardDescription>
                  Calculate your monthly EMI for loans and plan your budget accordingly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="emi-loan-amount">Loan Amount (BDT)</Label>
                  <Input
                    id="emi-loan-amount"
                    type="number"
                    value={emiLoanAmount}
                    onChange={(e) => setEmiLoanAmount(e.target.value)}
                    placeholder="Enter loan amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emi-interest-rate">Annual Interest Rate (%)</Label>
                  <Input
                    id="emi-interest-rate"
                    type="number"
                    step="0.1"
                    value={emiInterestRate}
                    onChange={(e) => setEmiInterestRate(e.target.value)}
                    placeholder="Enter interest rate"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emi-tenure">Loan Tenure (Months)</Label>
                  <Input
                    id="emi-tenure"
                    type="number"
                    value={emiTenure}
                    onChange={(e) => setEmiTenure(e.target.value)}
                    placeholder="Enter tenure in months"
                  />
                </div>
                <Button onClick={handleEMICalculation} className="w-full" size="lg">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate EMI
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>EMI Calculation Results</CardTitle>
              </CardHeader>
              <CardContent>
                {emiResult ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Monthly EMI</div>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(emiResult.monthlyEMI)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Total Interest</div>
                          <div className="text-lg font-semibold">
                            {formatCurrency(emiResult.totalInterest)}
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Total Amount</div>
                          <div className="text-lg font-semibold">
                            {formatCurrency(emiResult.totalAmount)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-4">Yearly Breakdown</h4>
                      <div className="space-y-2">
                        {emiResult.yearlyBreakdown.map((year) => (
                          <div key={year.year} className="grid grid-cols-4 gap-2 text-sm">
                            <div className="font-medium">Year {year.year}</div>
                            <div>Principal: {formatCurrency(year.principalPaid)}</div>
                            <div>Interest: {formatCurrency(year.interestPaid)}</div>
                            <div>Balance: {formatCurrency(year.remainingBalance)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Enter loan details and click calculate to see results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ROI Calculator */}
        <TabsContent value="roi">
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PiggyBank className="mr-2 h-5 w-5" />
                  ROI Calculator
                </CardTitle>
                <CardDescription>
                  Calculate returns on your savings and investment plans
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="roi-principal">Principal Amount (BDT)</Label>
                  <Input
                    id="roi-principal"
                    type="number"
                    value={roiPrincipal}
                    onChange={(e) => setRoiPrincipal(e.target.value)}
                    placeholder="Enter principal amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roi-interest-rate">Annual Interest Rate (%)</Label>
                  <Input
                    id="roi-interest-rate"
                    type="number"
                    step="0.1"
                    value={roiInterestRate}
                    onChange={(e) => setRoiInterestRate(e.target.value)}
                    placeholder="Enter interest rate"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roi-tenure">Investment Period (Months)</Label>
                  <Input
                    id="roi-tenure"
                    type="number"
                    value={roiTenure}
                    onChange={(e) => setRoiTenure(e.target.value)}
                    placeholder="Enter period in months"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Compounding Frequency</Label>
                  <Select value={roiCompounding} onValueChange={(value: 'monthly' | 'quarterly' | 'yearly') => setRoiCompounding(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleROICalculation} className="w-full" size="lg">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate ROI
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Calculation Results</CardTitle>
              </CardHeader>
              <CardContent>
                {roiResult ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Maturity Amount</div>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(roiResult.maturityAmount)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Total Interest</div>
                          <div className="text-lg font-semibold">
                            {formatCurrency(roiResult.totalInterest)}
                          </div>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground">Interest Rate</div>
                          <div className="text-lg font-semibold">
                            {formatPercentage(
                              (roiResult.totalInterest / parseFloat(roiPrincipal)) * 100 * (12 / parseInt(roiTenure))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-4">Yearly Growth</h4>
                      <div className="space-y-2">
                        {roiResult.yearlyBreakdown.map((year) => (
                          <div key={year.year} className="grid grid-cols-3 gap-2 text-sm">
                            <div className="font-medium">Year {year.year}</div>
                            <div>Interest: {formatCurrency(year.interest)}</div>
                            <div>Total: {formatCurrency(year.total)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Enter investment details and click calculate to see returns
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Calculator Features */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Calculator Features</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="text-center">
              <Calculator className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Accurate Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Get precise EMI and ROI calculations using standard banking formulas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Detailed Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                View year-wise breakdown of payments and returns for better planning
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Multiple Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Compare different loan amounts, rates, and tenures to find the best option
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalculatorsPage;