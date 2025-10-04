import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PiggyBank, 
  CreditCard, 
  Calculator, 
  Building2, 
  TrendingUp, 
  Shield,
  Users,
  Award,
  ArrowRight,
  Star
} from 'lucide-react';
import { banks, savingsProducts, loanProducts } from '@/data/mockData';
import { formatCurrency, formatPercentage } from '@/utils/calculations';
import { QuickCalculator } from '@/components/QuickCalculator';
import { RecommendationEngine } from '@/components/RecommendationEngine';

const Index = () => {
  const topSavingsProducts = savingsProducts
    .sort((a, b) => b.interestRate - a.interestRate)
    .slice(0, 3);
  
  const topLoanProducts = loanProducts
    .sort((a, b) => a.interestRate.min - b.interestRate.min)
    .slice(0, 3);

  const features = [
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'All bank information is verified and updated regularly'
    },
    {
      icon: Users,
      title: 'User-Friendly',
      description: 'Simple comparison tools designed for everyone'
    },
    {
      icon: Award,
      title: 'Best Rates',
      description: 'Find the most competitive rates in Bangladesh'
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Advanced calculators and personalized recommendations'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-8">
            <Badge variant="secondary" className="mb-4">
              #1 Banking Comparison Platform in Bangladesh
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Compare Banks,
              <span className="text-primary"> Save Money</span>
            </h1>
            <p className="max-w-2xl text-xl text-muted-foreground">
              Find the best savings accounts, loans, and financial products from top banks in Bangladesh. 
              Make informed decisions with our comprehensive comparison tools.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/savings">
                  <PiggyBank className="mr-2 h-5 w-5" />
                  Compare Savings
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/loans">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Find Loans
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{banks.length}+</div>
              <div className="text-sm text-muted-foreground">Banks Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{savingsProducts.length}+</div>
              <div className="text-sm text-muted-foreground">Savings Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{loanProducts.length}+</div>
              <div className="text-sm text-muted-foreground">Loan Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Products Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Top Savings Products */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold">Best Savings Rates</h2>
                  <p className="text-muted-foreground">Top performing savings accounts this month</p>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/savings">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {topSavingsProducts.map((product) => {
                  const bank = banks.find(b => b.id === product.bankId);
                  return (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{product.productName}</h3>
                              <p className="text-sm text-muted-foreground">{bank?.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {formatPercentage(product.interestRate)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Min: {formatCurrency(product.minimumDeposit)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Top Loan Products */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold">Best Loan Rates</h2>
                  <p className="text-muted-foreground">Lowest interest rates available</p>
                </div>
                <Button variant="outline" asChild>
                  <Link to="/loans">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {topLoanProducts.map((product) => {
                  const bank = banks.find(b => b.id === product.bankId);
                  return (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <CreditCard className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{product.productName}</h3>
                              <p className="text-sm text-muted-foreground">{bank?.name}</p>
                              <Badge variant="secondary" className="mt-1 capitalize">
                                {product.loanType}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {formatPercentage(product.interestRate.min)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Up to {formatCurrency(product.loanAmount.max)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose BankCompare BD?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide the most comprehensive banking comparison platform in Bangladesh
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Calculator Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Quick Financial Tools</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Calculate EMI and ROI instantly to make informed decisions
            </p>
          </div>
          <QuickCalculator />
        </div>
      </section>

      {/* Recommendation Engine Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Personalized Recommendations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions to get tailored banking product suggestions
            </p>
          </div>
          <RecommendationEngine />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Perfect Bank?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Use our advanced calculators and comparison tools to make the best financial decisions
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button size="lg" asChild>
                <Link to="/calculators">
                  <Calculator className="mr-2 h-5 w-5" />
                  Try Calculators
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/banks">
                  <Building2 className="mr-2 h-5 w-5" />
                  Browse Banks
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;