import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Home,
  Car,
  Building,
  Search, 
  Filter, 
  Star,
  ExternalLink,
  CheckCircle,
  Clock
} from 'lucide-react';
import { loanProducts, banks, getBankById, LoanProduct } from '@/data/mockData';
import { formatCurrency, formatPercentage } from '@/utils/calculations';
import { ProductComparison } from '@/components/ProductComparison';

const LoansPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('interestRate');
  const [filterBank, setFilterBank] = useState('all');
  const [maxAmount, setMaxAmount] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const loanTypeIcons = {
    personal: CreditCard,
    home: Home,
    car: Car,
    business: Building,
    student: CreditCard,
    startup: Building
  };

  const filteredAndSortedProducts = useMemo(() => {
    let products = loanProducts.filter(product => {
      const bank = getBankById(product.bankId);
      const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bank?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBank = filterBank === 'all' || product.bankId === filterBank;
      const matchesAmount = !maxAmount || product.loanAmount.max >= parseInt(maxAmount);
      const matchesType = activeTab === 'all' || product.loanType === activeTab;
      
      return matchesSearch && matchesBank && matchesAmount && matchesType;
    });

    products.sort((a, b) => {
      switch (sortBy) {
        case 'interestRate':
          return a.interestRate.min - b.interestRate.min;
        case 'maxAmount':
          return b.loanAmount.max - a.loanAmount.max;
        case 'bankName':
          const bankA = getBankById(a.bankId)?.name || '';
          const bankB = getBankById(b.bankId)?.name || '';
          return bankA.localeCompare(bankB);
        default:
          return 0;
      }
    });

    return products;
  }, [searchTerm, sortBy, filterBank, maxAmount, activeTab]);

  const loanTypes = [
    { id: 'all', name: 'All Loans', icon: CreditCard },
    { id: 'personal', name: 'Personal', icon: CreditCard },
    { id: 'home', name: 'Home', icon: Home },
    { id: 'car', name: 'Car', icon: Car },
    { id: 'business', name: 'Business', icon: Building },
    { id: 'student', name: 'Student', icon: CreditCard },
    { id: 'startup', name: 'Startup', icon: Building }
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Loan Comparison</h1>
        <p className="text-xl text-muted-foreground">
          Compare loan products from top banks in Bangladesh and find the best rates for your needs
        </p>
      </div>

      {/* Loan Types Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-7">
          {loanTypes.map(type => {
            const Icon = type.icon;
            return (
              <TabsTrigger key={type.id} value={type.id} className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{type.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Loans</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Loan or bank name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interestRate">Interest Rate</SelectItem>
                  <SelectItem value="maxAmount">Maximum Amount</SelectItem>
                  <SelectItem value="bankName">Bank Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bank</Label>
              <Select value={filterBank} onValueChange={setFilterBank}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banks</SelectItem>
                  {banks.map(bank => (
                    <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Min Loan Amount</Label>
              <Input
                id="maxAmount"
                type="number"
                placeholder="Amount in BDT"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Product Comparison */}
      <ProductComparison type="loans" products={filteredAndSortedProducts} />

      {filteredAndSortedProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No loans found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LoansPage;