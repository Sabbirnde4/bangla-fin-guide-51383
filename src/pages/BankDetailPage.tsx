import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  ExternalLink,
  Star,
  MapPin,
  Calendar,
  PiggyBank,
  CreditCard,
  ArrowLeft,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/calculations';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewStats } from '@/components/reviews/ReviewStats';
import { AlertForm } from '@/components/alerts/AlertForm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function BankDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bank, isLoading: bankLoading } = useQuery({
    queryKey: ['bank', id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('banks')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: savingsProducts, isLoading: savingsLoading } = useQuery({
    queryKey: ['savings_products', id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('savings_products')
        .select('*')
        .eq('bank_id', id);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: loanProducts, isLoading: loansLoading } = useQuery({
    queryKey: ['loan_products', id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('loan_products')
        .select('*')
        .eq('bank_id', id);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch bank reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['bank-reviews', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bank_reviews' as any)
        .select('*, profiles(first_name, last_name)')
        .eq('bank_id', id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  // Check if user has already reviewed
  const { data: userReview } = useQuery({
    queryKey: ['user-bank-review', id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('bank_reviews' as any)
        .select('*')
        .eq('bank_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
    enabled: !!user,
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment: string }) => {
      if (!user) throw new Error('Must be logged in');
      
      const reviewData = {
        user_id: user.id,
        bank_id: id,
        rating,
        comment,
      };

      if (userReview) {
        const { error } = await supabase
          .from('bank_reviews' as any)
          .update({ rating, comment })
          .eq('id', userReview.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bank_reviews' as any)
          .insert(reviewData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['user-bank-review', id, user?.id] });
      toast({
        title: 'Success',
        description: userReview ? 'Review updated successfully' : 'Review submitted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('bank_reviews' as any)
        .delete()
        .eq('id', reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['user-bank-review', id, user?.id] });
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
    },
  });

  // Alert management
  const createAlertMutation = useMutation({
    mutationFn: async (alert: { condition_type: string; threshold_value: number | null }) => {
      if (!user) throw new Error('Must be logged in');
      
      // Calculate average rate from bank's products
      const avgRate = bank && savingsProducts && savingsProducts.length > 0
        ? savingsProducts.reduce((sum, p) => sum + p.interest_rate, 0) / savingsProducts.length
        : 0;
      
      const { error } = await supabase
        .from('alerts' as any)
        .insert({
          user_id: user.id,
          alert_type: 'bank',
          target_id: id,
          target_name: bank?.name || '',
          condition_type: alert.condition_type,
          threshold_value: alert.threshold_value,
          current_value: avgRate,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Alert created',
        description: 'You will be notified when rates change.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create alert',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Calculate review stats
  const reviewStats = reviews.reduce(
    (acc, review) => {
      acc.total++;
      acc.sum += review.rating;
      acc.distribution[review.rating as keyof typeof acc.distribution]++;
      return acc;
    },
    {
      total: 0,
      sum: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }
  );

  const averageRating = reviewStats.total > 0 ? reviewStats.sum / reviewStats.total : 0;

  if (bankLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!bank) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Bank Not Found</h3>
            <p className="text-muted-foreground mb-4">The bank you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/banks">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Banks
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/banks">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Banks
        </Link>
      </Button>

      {/* Bank Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{bank.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Established {bank.established}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {bank.total_branches} branches nationwide
                </div>
                {bank.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                    {bank.rating}/5.0 rating
                  </div>
                )}
              </div>
              {bank.website && (
                <Button variant="outline" asChild>
                  <a href={bank.website} target="_blank" rel="noopener noreferrer">
                    Visit Official Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Tabs */}
      <Tabs defaultValue="savings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="savings" className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4" />
            Savings Products ({savingsProducts?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="loans" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Loan Products ({loanProducts?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Savings Products */}
        <TabsContent value="savings" className="space-y-4">
          {savingsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : savingsProducts && savingsProducts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {savingsProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{product.product_name}</CardTitle>
                        <Badge variant="secondary" className="text-lg">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {product.interest_rate}% p.a.
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {product.minimum_deposit && (
                        <div>
                          <p className="text-muted-foreground">Min. Deposit</p>
                          <p className="font-semibold">{formatCurrency(product.minimum_deposit)}</p>
                        </div>
                      )}
                      {product.maximum_deposit && (
                        <div>
                          <p className="text-muted-foreground">Max. Deposit</p>
                          <p className="font-semibold">{formatCurrency(product.maximum_deposit)}</p>
                        </div>
                      )}
                      {product.tenure_min && product.tenure_max && (
                        <div>
                          <p className="text-muted-foreground">Tenure</p>
                          <p className="font-semibold">{product.tenure_min}-{product.tenure_max} months</p>
                        </div>
                      )}
                      {product.compounding_frequency && (
                        <div>
                          <p className="text-muted-foreground">Compounding</p>
                          <p className="font-semibold capitalize">{product.compounding_frequency}</p>
                        </div>
                      )}
                    </div>
                    {product.features && product.features.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm font-semibold mb-2">Features:</p>
                          <ul className="text-sm space-y-1">
                            {product.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="text-muted-foreground">• {feature}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                    <Button className="w-full" asChild>
                      <Link to={`/savings/${product.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <PiggyBank className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No savings products available from this bank.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Loan Products */}
        <TabsContent value="loans" className="space-y-4">
          {loansLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : loanProducts && loanProducts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {loanProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{product.product_name}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="capitalize">{product.loan_type}</Badge>
                          <Badge variant="secondary">
                            {product.interest_rate_min}%
                            {product.interest_rate_max && ` - ${product.interest_rate_max}%`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {product.loan_amount_min && product.loan_amount_max && (
                        <div>
                          <p className="text-muted-foreground">Loan Amount</p>
                          <p className="font-semibold">{formatCurrency(product.loan_amount_min)} - {formatCurrency(product.loan_amount_max)}</p>
                        </div>
                      )}
                      {product.tenure_min && product.tenure_max && (
                        <div>
                          <p className="text-muted-foreground">Tenure</p>
                          <p className="font-semibold">{product.tenure_min}-{product.tenure_max} months</p>
                        </div>
                      )}
                      {product.processing_fee && (
                        <div>
                          <p className="text-muted-foreground">Processing Fee</p>
                          <p className="font-semibold">{formatPercentage(product.processing_fee)}</p>
                        </div>
                      )}
                      {product.processing_time && (
                        <div>
                          <p className="text-muted-foreground">Processing Time</p>
                          <p className="font-semibold">{product.processing_time}</p>
                        </div>
                      )}
                    </div>
                    {product.features && product.features.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm font-semibold mb-2">Features:</p>
                          <ul className="text-sm space-y-1">
                            {product.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="text-muted-foreground">• {feature}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                    <Button className="w-full" asChild>
                      <Link to={`/loans/${product.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No loan products available from this bank.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Rate Alerts Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Rate Alerts</h2>
        <AlertForm
          alertType="bank"
          targetId={id!}
          targetName={bank.name}
          currentRate={
            savingsProducts && savingsProducts.length > 0
              ? savingsProducts.reduce((sum, p) => sum + p.interest_rate, 0) / savingsProducts.length
              : 0
          }
          onSubmit={(alert) => createAlertMutation.mutate(alert)}
          isSubmitting={createAlertMutation.isPending}
        />
      </div>

      {/* Reviews Section */}
      <div className="mt-12 space-y-8">
        <h2 className="text-3xl font-bold">Bank Reviews & Ratings</h2>
        
        {reviewStats.total > 0 && (
          <ReviewStats
            averageRating={averageRating}
            totalReviews={reviewStats.total}
            ratingDistribution={reviewStats.distribution}
          />
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <ReviewForm
              onSubmit={(rating, comment) =>
                submitReviewMutation.mutate({ rating, comment })
              }
              isSubmitting={submitReviewMutation.isPending}
              existingReview={userReview ? {
                rating: userReview.rating,
                comment: userReview.comment,
              } : undefined}
              title={userReview ? 'Update Your Review' : 'Write a Review'}
            />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
            {reviewsLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ReviewList
                reviews={reviews}
                onDeleteReview={(reviewId) => deleteReviewMutation.mutate(reviewId)}
                isDeleting={deleteReviewMutation.isPending}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
