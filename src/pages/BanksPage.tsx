import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Search, 
  ExternalLink,
  Star,
  MapPin,
  Calendar,
  Users,
  PiggyBank,
  CreditCard
} from 'lucide-react';

const BanksPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { data: banks, isLoading } = useQuery({
    queryKey: ['banks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banks')
        .select('*')
        .order('rating', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: allSavingsProducts } = useQuery({
    queryKey: ['savings_products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings_products')
        .select('*');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: allLoanProducts } = useQuery({
    queryKey: ['loan_products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loan_products')
        .select('*');
      if (error) throw error;
      return data || [];
    },
  });

  const filteredBanks = banks?.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Banks Directory</h1>
        <p className="text-xl text-muted-foreground">
          Explore all banks in Bangladesh and discover their products and services
        </p>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Banks</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Enter bank name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banks Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBanks.map((bank) => {
            const savingsProducts = allSavingsProducts?.filter(p => p.bank_id === bank.id) || [];
            const loanProducts = allLoanProducts?.filter(p => p.bank_id === bank.id) || [];
          
          return (
            <Card key={bank.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Bank Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-2">{bank.name}</h2>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {bank.established && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Established {bank.established}
                            </div>
                          )}
                          {bank.total_branches && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {bank.total_branches} branches
                            </div>
                          )}
                          {bank.rating && (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                              {bank.rating}/5.0
                            </div>
                          )}
                        </div>
                        <Button
                          variant="link"
                          className="p-0 h-auto mt-2"
                          asChild
                        >
                          <a href={bank.website} target="_blank" rel="noopener noreferrer">
                            Visit Website
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Products Summary */}
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center">
                          <PiggyBank className="h-4 w-4 mr-2" />
                          Savings Products ({savingsProducts.length})
                        </h3>
                        {savingsProducts.length > 0 ? (
                          <div className="space-y-2">
                            {savingsProducts.slice(0, 3).map((product) => (
                              <div key={product.id} className="flex items-center justify-between text-sm">
                                <span>{product.product_name}</span>
                                <Badge variant="secondary">
                                  {product.interest_rate}%
                                </Badge>
                              </div>
                            ))}
                            {savingsProducts.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{savingsProducts.length - 3} more products
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No savings products available</p>
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3 flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Loan Products ({loanProducts.length})
                        </h3>
                        {loanProducts.length > 0 ? (
                          <div className="space-y-2">
                            {loanProducts.slice(0, 3).map((product) => (
                              <div key={product.id} className="flex items-center justify-between text-sm">
                                <span>{product.product_name}</span>
                                <Badge variant="secondary" className="capitalize">
                                  {product.loan_type}
                                </Badge>
                              </div>
                            ))}
                            {loanProducts.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{loanProducts.length - 3} more products
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No loan products available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-center space-y-4">
                    <Button size="lg" className="w-full" onClick={() => navigate(`/banks/${bank.id}`)}>
                      View Bank Profile
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="lg" className="w-full">
                      Compare Products
                    </Button>
                    <Button variant="ghost" size="lg" className="w-full">
                      Contact Bank
                    </Button>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Quick Status</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Best Savings Rate:</span>
                          <Badge variant="secondary" className="text-xs">
                            {savingsProducts.length > 0 
                              ? Math.max(...savingsProducts.map(p => p.interest_rate)).toFixed(1) + '%'
                              : 'N/A'
                            }
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lowest Loan Rate:</span>
                          <Badge variant="secondary" className="text-xs">
                            {loanProducts.length > 0 
                              ? Math.min(...loanProducts.map(p => p.interest_rate_min)).toFixed(1) + '%'
                              : 'N/A'
                            }
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Products:</span>
                          <Badge variant="outline" className="text-xs">
                            {savingsProducts.length + loanProducts.length}
                          </Badge>
                        </div>
                        {bank.total_branches && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ATM Network:</span>
                            <Badge variant="outline" className="text-xs">
                              {bank.total_branches * 2}+ ATMs
                            </Badge>
                          </div>
                        )}
                        {bank.rating && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Digital Banking:</span>
                              <Badge variant={bank.rating >= 4.0 ? "default" : "secondary"} className="text-xs">
                                {bank.rating >= 4.0 ? "Advanced" : "Standard"}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Customer Service:</span>
                              <Badge variant={bank.rating >= 4.5 ? "default" : bank.rating >= 4.0 ? "secondary" : "outline"} className="text-xs">
                                {bank.rating >= 4.5 ? "Excellent" : bank.rating >= 4.0 ? "Good" : "Average"}
                              </Badge>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
          })}
        </div>
      )}

      {filteredBanks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No banks found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search term
            </p>
          </CardContent>
        </Card>
      )}

      {/* Banking Stats */}
      {banks && banks.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Banking Landscape</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="text-center">
                <Building2 className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>{banks.length}</CardTitle>
                <CardDescription>Total Banks</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>
                  {banks.reduce((sum, bank) => sum + (bank.total_branches || 0), 0)}
                </CardTitle>
                <CardDescription>Total Branches</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>
                  {(banks.reduce((sum, bank) => sum + (bank.rating || 0), 0) / banks.length).toFixed(1)}
                </CardTitle>
                <CardDescription>Average Rating</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>10M+</CardTitle>
                <CardDescription>Bank Customers</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanksPage;