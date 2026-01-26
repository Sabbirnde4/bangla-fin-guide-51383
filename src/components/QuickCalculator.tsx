import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, PiggyBank, CreditCard, TrendingUp } from 'lucide-react';
import { calculateEMI, calculateROI, formatCurrency, formatPercentage } from '@/utils/calculations';
import { TermLabel, FinancialTermTooltip } from '@/components/FinancialTermTooltip';

export const QuickCalculator = () => {
  const [emiInputs, setEmiInputs] = useState({
    principal: 1000000,
    rate: 12,
    tenure: 36
  });

  const [roiInputs, setRoiInputs] = useState({
    principal: 100000,
    rate: 6.5,
    tenure: 24
  });

  const emiResult = calculateEMI(emiInputs.principal, emiInputs.rate, emiInputs.tenure);
  const roiResult = calculateROI(roiInputs.principal, roiInputs.rate, roiInputs.tenure);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Quick Calculators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="emi" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="emi" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              EMI
            </TabsTrigger>
            <TabsTrigger value="roi" className="flex items-center">
              <PiggyBank className="h-4 w-4 mr-2" />
              ROI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emi" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <TermLabel term="principalAmount" label="Loan Amount (BDT)" />
                  <Input
                    id="emi-principal"
                    type="number"
                    value={emiInputs.principal}
                    onChange={(e) => setEmiInputs(prev => ({
                      ...prev,
                      principal: Number(e.target.value)
                    }))}
                  />
                </div>
                <div>
                  <TermLabel term="interestRate" label="Interest Rate (%)" />
                  <Input
                    id="emi-rate"
                    type="number"
                    step="0.1"
                    value={emiInputs.rate}
                    onChange={(e) => setEmiInputs(prev => ({
                      ...prev,
                      rate: Number(e.target.value)
                    }))}
                  />
                </div>
                <div>
                  <TermLabel term="tenure" label="Tenure (Months)" />
                  <Input
                    id="emi-tenure"
                    type="number"
                    value={emiInputs.tenure}
                    onChange={(e) => setEmiInputs(prev => ({
                      ...prev,
                      tenure: Number(e.target.value)
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">
                    <FinancialTermTooltip term="emi">EMI Calculation Result</FinancialTermTooltip>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <TermLabel term="emi" label="Monthly EMI:" showIcon={false} />
                      <span className="font-bold text-primary">
                        {formatCurrency(emiResult.monthlyEMI)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <TermLabel term="totalInterest" label="Total Interest:" showIcon={false} />
                      <span className="font-medium">
                        {formatCurrency(emiResult.totalInterest)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-medium">
                        {formatCurrency(emiResult.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline" className="justify-center py-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {formatPercentage((emiResult.totalInterest / emiInputs.principal) * 100)}
                  </Badge>
                  <Badge variant="secondary" className="justify-center py-2">
                    {Math.round(emiInputs.tenure / 12)} years
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="roi" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <TermLabel term="principalAmount" label="Investment Amount (BDT)" />
                  <Input
                    id="roi-principal"
                    type="number"
                    value={roiInputs.principal}
                    onChange={(e) => setRoiInputs(prev => ({
                      ...prev,
                      principal: Number(e.target.value)
                    }))}
                  />
                </div>
                <div>
                  <TermLabel term="interestRate" label="Interest Rate (%)" />
                  <Input
                    id="roi-rate"
                    type="number"
                    step="0.1"
                    value={roiInputs.rate}
                    onChange={(e) => setRoiInputs(prev => ({
                      ...prev,
                      rate: Number(e.target.value)
                    }))}
                  />
                </div>
                <div>
                  <TermLabel term="tenure" label="Tenure (Months)" />
                  <Input
                    id="roi-tenure"
                    type="number"
                    value={roiInputs.tenure}
                    onChange={(e) => setRoiInputs(prev => ({
                      ...prev,
                      tenure: Number(e.target.value)
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">
                    <FinancialTermTooltip term="roi">ROI Calculation Result</FinancialTermTooltip>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <TermLabel term="maturityAmount" label="Maturity Amount:" showIcon={false} />
                      <span className="font-bold text-primary">
                        {formatCurrency(roiResult.maturityAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <TermLabel term="totalInterest" label="Total Interest:" showIcon={false} />
                      <span className="font-medium">
                        {formatCurrency(roiResult.totalInterest)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <TermLabel term="principalAmount" label="Principal:" showIcon={false} />
                      <span className="font-medium">
                        {formatCurrency(roiInputs.principal)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline" className="justify-center py-2">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {formatPercentage((roiResult.totalInterest / roiInputs.principal) * 100)}
                  </Badge>
                  <Badge variant="secondary" className="justify-center py-2">
                    {Math.round(roiInputs.tenure / 12)} years
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};