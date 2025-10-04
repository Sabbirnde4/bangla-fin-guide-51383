import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb, Star, TrendingUp, Building2, ArrowRight } from 'lucide-react';
import { savingsProducts, loanProducts, getBankById } from '@/data/mockData';
import { formatCurrency, formatPercentage } from '@/utils/calculations';

interface UserProfile {
  monthlyIncome: number;
  savingsGoal: number;
  riskTolerance: 'low' | 'medium' | 'high';
  investmentHorizon: 'short' | 'medium' | 'long';
  loanPurpose: 'personal' | 'home' | 'car' | 'business' | 'none';
  loanAmount: number;
}

export const RecommendationEngine = () => {
  const [profile, setProfile] = useState<UserProfile>({
    monthlyIncome: 50000,
    savingsGoal: 500000,
    riskTolerance: 'medium',
    investmentHorizon: 'medium',
    loanPurpose: 'none',
    loanAmount: 1000000
  });

  const [showRecommendations, setShowRecommendations] = useState(false);

  const getSavingsRecommendations = () => {
    let recommendations = [...savingsProducts];

    // Filter based on minimum deposit and income
    const maxAffordableDeposit = profile.monthlyIncome * 3; // 3 months salary
    recommendations = recommendations.filter(
      product => product.minimumDeposit <= Math.min(maxAffordableDeposit, profile.savingsGoal)
    );

    // Sort by interest rate and risk tolerance
    if (profile.riskTolerance === 'high') {
      recommendations.sort((a, b) => b.interestRate - a.interestRate);
    } else if (profile.riskTolerance === 'low') {
      // Prefer banks with higher ratings for low risk tolerance
      recommendations.sort((a, b) => {
        const bankA = getBankById(a.bankId);
        const bankB = getBankById(b.bankId);
        return (bankB?.rating || 0) - (bankA?.rating || 0);
      });
    } else {
      // Medium risk: balance between rate and bank rating
      recommendations.sort((a, b) => {
        const bankA = getBankById(a.bankId);
        const bankB = getBankById(b.bankId);
        const scoreA = a.interestRate + (bankA?.rating || 0);
        const scoreB = b.interestRate + (bankB?.rating || 0);
        return scoreB - scoreA;
      });
    }

    return recommendations.slice(0, 3);
  };

  const getLoanRecommendations = () => {
    if (profile.loanPurpose === 'none') return [];

    let recommendations = loanProducts.filter(
      product => product.loanType === profile.loanPurpose &&
      product.loanAmount.min <= profile.loanAmount &&
      product.loanAmount.max >= profile.loanAmount
    );

    // Sort by interest rate (lowest first)
    recommendations.sort((a, b) => a.interestRate.min - b.interestRate.min);

    return recommendations.slice(0, 3);
  };

  const getPersonalizedTips = () => {
    const tips = [];

    if (profile.monthlyIncome < 30000) {
      tips.push("Consider starting with a low minimum deposit savings account");
    }

    if (profile.savingsGoal > profile.monthlyIncome * 10) {
      tips.push("Your savings goal is ambitious! Consider long-term fixed deposits for better returns");
    }

    if (profile.riskTolerance === 'high') {
      tips.push("Look for banks offering premium accounts with higher interest rates");
    }

    if (profile.investmentHorizon === 'long') {
      tips.push("Consider fixed deposits with longer tenure for maximum returns");
    }

    return tips;
  };

  const savingsRecommendations = getSavingsRecommendations();
  const loanRecommendations = getLoanRecommendations();
  const personalizedTips = getPersonalizedTips();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showRecommendations ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="income">Monthly Income (BDT)</Label>
                  <Input
                    id="income"
                    type="number"
                    value={profile.monthlyIncome}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      monthlyIncome: Number(e.target.value)
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="savings-goal">Savings Goal (BDT)</Label>
                  <Input
                    id="savings-goal"
                    type="number"
                    value={profile.savingsGoal}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      savingsGoal: Number(e.target.value)
                    }))}
                  />
                </div>
                <div>
                  <Label>Risk Tolerance</Label>
                  <Select 
                    value={profile.riskTolerance} 
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setProfile(prev => ({ ...prev, riskTolerance: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Safety First)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="high">High (Maximum Returns)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Investment Horizon</Label>
                  <Select 
                    value={profile.investmentHorizon} 
                    onValueChange={(value: 'short' | 'medium' | 'long') => 
                      setProfile(prev => ({ ...prev, investmentHorizon: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (1-2 years)</SelectItem>
                      <SelectItem value="medium">Medium (2-5 years)</SelectItem>
                      <SelectItem value="long">Long (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Loan Purpose (Optional)</Label>
                  <Select 
                    value={profile.loanPurpose} 
                    onValueChange={(value: UserProfile['loanPurpose']) => 
                      setProfile(prev => ({ ...prev, loanPurpose: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Loan Needed</SelectItem>
                      <SelectItem value="personal">Personal Loan</SelectItem>
                      <SelectItem value="home">Home Loan</SelectItem>
                      <SelectItem value="car">Car Loan</SelectItem>
                      <SelectItem value="business">Business Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {profile.loanPurpose !== 'none' && (
                  <div>
                    <Label htmlFor="loan-amount">Loan Amount (BDT)</Label>
                    <Input
                      id="loan-amount"
                      type="number"
                      value={profile.loanAmount}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        loanAmount: Number(e.target.value)
                      }))}
                    />
                  </div>
                )}
              </div>
              <Button onClick={() => setShowRecommendations(true)} className="w-full">
                Get Personalized Recommendations
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Your Recommendations</h3>
                <Button variant="outline" onClick={() => setShowRecommendations(false)}>
                  Update Profile
                </Button>
              </div>

              {/* Personalized Tips */}
              {personalizedTips.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center text-blue-800">
                      <Lightbulb className="h-5 w-5 mr-2" />
                      Personalized Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {personalizedTips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <Star className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                          <span className="text-blue-800">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Savings Recommendations */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Recommended Savings Products</h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {savingsRecommendations.map((product, index) => {
                    const bank = getBankById(product.bankId);
                    return (
                      <Card key={product.id} className="relative">
                        {index === 0 && (
                          <Badge className="absolute -top-2 -right-2">
                            Best Match
                          </Badge>
                        )}
                        <CardHeader>
                          <CardTitle className="text-base">{product.productName}</CardTitle>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{bank?.name}</span>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span className="text-sm">{bank?.rating}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-primary">
                              {formatPercentage(product.interestRate)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Min: {formatCurrency(product.minimumDeposit)}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {product.features.slice(0, 2).map((feature, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Loan Recommendations */}
              {loanRecommendations.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-4">Recommended Loan Products</h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {loanRecommendations.map((product, index) => {
                      const bank = getBankById(product.bankId);
                      return (
                        <Card key={product.id} className="relative">
                          {index === 0 && (
                            <Badge className="absolute -top-2 -right-2">
                              Best Rate
                            </Badge>
                          )}
                          <CardHeader>
                            <CardTitle className="text-base">{product.productName}</CardTitle>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">{bank?.name}</span>
                              <Badge variant="secondary" className="capitalize">
                                {product.loanType}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="text-2xl font-bold text-primary">
                                {formatPercentage(product.interestRate.min)}+
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Up to {formatCurrency(product.loanAmount.max)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Processing: {product.processingTime}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};