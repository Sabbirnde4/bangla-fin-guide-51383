import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Search, 
  Filter, 
  ArrowUpDown,
  Star,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { savingsProducts, banks, getBankById } from '@/data/mockData';
import { formatCurrency, formatPercentage } from '@/utils/calculations';
import { ProductComparison } from '@/components/ProductComparison';

const SavingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('interestRate');
  const [filterBank, setFilterBank] = useState('all');
  const [minDeposit, setMinDeposit] = useState('');
  const [maxTenure, setMaxTenure] = useState('');
  const filteredAndSortedProducts = useMemo(() => {
    let products = savingsProducts.filter(product => {
      const bank = getBankById(product.bankId);
      const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bank?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBank = filterBank === 'all' || product.bankId === filterBank;
      const matchesDeposit = !minDeposit || product.minimumDeposit <= parseInt(minDeposit);
      const matchesTenure = !maxTenure || product.tenure.max <= parseInt(maxTenure);
      
      return matchesSearch && matchesBank && matchesDeposit && matchesTenure;
    });

    products.sort((a, b) => {
      switch (sortBy) {
        case 'interestRate':
          return b.interestRate - a.interestRate;
        case 'minimumDeposit':
          return a.minimumDeposit - b.minimumDeposit;
        case 'tenure':
          return a.tenure.min - b.tenure.min;
        case 'bankName':
          const bankA = getBankById(a.bankId)?.name || '';
          const bankB = getBankById(b.bankId)?.name || '';
          return bankA.localeCompare(bankB);
        default:
          return 0;
      }
    });

    return products;
  }, [searchTerm, sortBy, filterBank, minDeposit, maxTenure]);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Savings Account Comparison</h1>
        <p className="text-xl text-muted-foreground">
          Compare savings accounts from top banks in Bangladesh and find the best interest rates
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Product or bank name..."
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
                  <SelectItem value="interestRate">Interest Rate (High to Low)</SelectItem>
                  <SelectItem value="minimumDeposit">Minimum Deposit (Low to High)</SelectItem>
                  <SelectItem value="tenure">Tenure (Short to Long)</SelectItem>
                  <SelectItem value="bankName">Bank Name (A-Z)</SelectItem>
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
              <Label htmlFor="minDeposit">Max Min. Deposit</Label>
              <Input
                id="minDeposit"
                type="number"
                placeholder="Amount in BDT"
                value={minDeposit}
                onChange={(e) => setMinDeposit(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxTenure">Max Tenure (months)</Label>
              <Input
                id="maxTenure"
                type="number"
                placeholder="Months"
                value={maxTenure}
                onChange={(e) => setMaxTenure(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Product Comparison */}
      <ProductComparison type="savings" products={filteredAndSortedProducts} />

      {filteredAndSortedProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SavingsPage;