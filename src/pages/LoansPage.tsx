import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CreditCard, 
  Home,
  Car,
  Building,
  Search, 
  Filter
} from 'lucide-react';
import { ProductComparison } from '@/components/ProductComparison';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 20;

const LoansPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('interestRate');
  const [filterBank, setFilterBank] = useState('all');
  const [maxAmount, setMaxAmount] = useState('');
  const [maxTenure, setMaxTenure] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch loan products from Supabase
  const { data: loanProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['loan_products'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('loan_products')
        .select('*')
        .order('interest_rate_min', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch banks from Supabase
  const { data: banks, isLoading: isLoadingBanks } = useQuery({
    queryKey: ['banks'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('banks')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const isLoading = isLoadingProducts || isLoadingBanks;

  // Helper function to get bank by ID
  const getBankById = (bankId: string) => {
    return banks?.find(bank => bank.id === bankId);
  };

  // Transform products to match expected format for ProductComparison
  const transformedProducts = useMemo(() => {
    if (!loanProducts) return [];
    
    return loanProducts.map(product => ({
      id: product.id,
      bankId: product.bank_id,
      productName: product.product_name,
      loanType: product.loan_type,
      interestRate: {
        min: product.interest_rate_min,
        max: product.interest_rate_max
      },
      loanAmount: {
        min: product.loan_amount_min,
        max: product.loan_amount_max
      },
      tenure: {
        min: product.tenure_min,
        max: product.tenure_max
      },
      processingFee: product.processing_fee,
      processingTime: product.processing_time || '3-5 business days',
      features: product.features || [],
      eligibility: product.eligibility || [],
      requiredDocuments: product.required_documents || []
    }));
  }, [loanProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    let products = transformedProducts.filter(product => {
      const bank = getBankById(product.bankId);
      const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bank?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBank = filterBank === 'all' || product.bankId === filterBank;
      const matchesAmount = !maxAmount || product.loanAmount.max >= parseInt(maxAmount);
      const matchesTenure = !maxTenure || product.tenure.max <= parseInt(maxTenure);
      const matchesType = activeTab === 'all' || product.loanType === activeTab;
      
      return matchesSearch && matchesBank && matchesAmount && matchesTenure && matchesType;
    });

    products.sort((a, b) => {
      switch (sortBy) {
        case 'interestRate':
          return a.interestRate.min - b.interestRate.min;
        case 'maxAmount':
          return b.loanAmount.max - a.loanAmount.max;
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
  }, [transformedProducts, searchTerm, sortBy, filterBank, maxAmount, maxTenure, activeTab, banks]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, filterBank, maxAmount, maxTenure, activeTab]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

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
          <div className="grid gap-4 md:grid-cols-5">
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
                  <SelectItem value="interestRate">Interest Rate (Low to High)</SelectItem>
                  <SelectItem value="maxAmount">Maximum Amount (High to Low)</SelectItem>
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
                  {banks?.map(bank => (
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

      {/* Results count */}
      {!isLoading && filteredAndSortedProducts.length > 0 && (
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Product Comparison */}
          <ProductComparison type="loans" products={paginatedProducts} />

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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoansPage;
