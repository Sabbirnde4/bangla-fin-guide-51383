import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, TrendingUp, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Bank {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  established?: number;
  rating?: number;
  total_branches?: number;
}

interface LoanProduct {
  id: string;
  product_name: string;
  loan_type: string;
  interest_rate_min: number;
  interest_rate_max: number;
  loan_amount_min?: number;
  loan_amount_max?: number;
  tenure_min?: number;
  tenure_max?: number;
  banks: { name: string };
}

interface UserFavorite {
  id: string;
  banks?: Bank;
  loan_products?: LoanProduct;
}

export default function DashboardPage() {
  const { user, profile, userRole, loading } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [stats, setStats] = useState({
    totalFavorites: 0,
    avgInterestRate: 0,
    totalBanks: 0,
    totalProducts: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchStats();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          banks (id, name, logo, website, established, rating, total_branches),
          loan_products (id, product_name, loan_type, interest_rate_min, interest_rate_max, loan_amount_min, loan_amount_max, tenure_min, tenure_max, banks (name))
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [banksResponse, productsResponse] = await Promise.all([
        supabase.from('banks').select('*', { count: 'exact' }),
        supabase.from('loan_products').select('interest_rate_min, interest_rate_max', { count: 'exact' })
      ]);

      const avgProductRate = productsResponse.data?.reduce((sum, product) => sum + ((product.interest_rate_min + product.interest_rate_max) / 2), 0) / (productsResponse.data?.length || 1) || 0;

      setStats({
        totalFavorites: favorites.length,
        avgInterestRate: avgProductRate,
        totalBanks: banksResponse.count || 0,
        totalProducts: productsResponse.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites.",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from favorites.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!user) {
    return <div className="container mx-auto p-6">Please sign in to view your dashboard.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.first_name || user.email}!
        </h1>
        <p className="text-muted-foreground">
          Here's your personalized financial dashboard
        </p>
        {userRole === 'admin' && (
          <Badge variant="secondary" className="mt-2">
            Admin User
          </Badge>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFavorites}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Interest Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgInterestRate.toFixed(2)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Banks</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBanks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loan Products</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Favorites Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Favorites</CardTitle>
          <CardDescription>
            Banks and loan products you've marked as favorites
          </CardDescription>
        </CardHeader>
        <CardContent>
          {favorites.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No favorites yet. Start exploring banks and loan products to add them here!
            </p>
          ) : (
            <div className="space-y-4">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    {favorite.banks && (
                      <div>
                        <h3 className="font-semibold">{favorite.banks.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Rating: {favorite.banks.rating}/5 | 
                          Established: {favorite.banks.established}
                        </p>
                        <Badge variant="outline">Bank</Badge>
                      </div>
                    )}
                    {favorite.loan_products && (
                      <div>
                        <h3 className="font-semibold">{favorite.loan_products.product_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {favorite.loan_products.loan_type} | Rate: {favorite.loan_products.interest_rate_min}%-{favorite.loan_products.interest_rate_max}% | 
                          Bank: {favorite.loan_products.banks.name}
                        </p>
                        <Badge variant="outline">Loan Product</Badge>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFavorite(favorite.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}