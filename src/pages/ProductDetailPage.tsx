import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  TrendingUp,
  AlertCircle,
  Building2,
  CheckCircle,
  FileText,
  Calendar,
  Percent,
  DollarSign
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/calculations';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewStats } from '@/components/reviews/ReviewStats';
import { AlertForm } from '@/components/alerts/AlertForm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumbs } from '@/components/Breadcrumbs';

type ProductType = 'savings' | 'loans';

export default function ProductDetailPage() {
  const { type, id } = useParams<{ type: ProductType; id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isSavings = type === 'savings';
  const tableName = isSavings ? 'savings_products' : 'loan_products';

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: [tableName, id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(tableName)
        .select('*, banks(name, website, rating, total_branches)')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Fetch reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['product-reviews', id, type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews' as any)
        .select('*, profiles(first_name, last_name)')
        .eq('product_id', id)
        .eq('product_type', type)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  // Check if user has already reviewed
  const { data: userReview } = useQuery({
    queryKey: ['user-product-review', id, type, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('product_reviews' as any)
        .select('*')
        .eq('product_id', id)
        .eq('product_type', type)
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
        product_id: id,
        product_type: type,
        rating,
        comment,
      };

      if (userReview) {
        const { error } = await supabase
          .from('product_reviews' as any)
          .update({ rating, comment })
          .eq('id', userReview.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('product_reviews' as any)
          .insert(reviewData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', id, type] });
      queryClient.invalidateQueries({ queryKey: ['user-product-review', id, type, user?.id] });
      toast({
        title: 'Success',
        description: userReview ? 'Review updated successfully' : 'Review submitted successfully',
      });
    },
    onError: (error) => {
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
        .from('product_reviews' as any)
        .delete()
        .eq('id', reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', id, type] });
      queryClient.invalidateQueries({ queryKey: ['user-product-review', id, type, user?.id] });
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
      
      const { error } = await supabase
        .from('alerts' as any)
        .insert({
          user_id: user.id,
          alert_type: 'product',
          target_id: id,
          target_name: `${product?.product_name} - ${product?.banks?.name}`,
          condition_type: alert.condition_type,
          threshold_value: alert.threshold_value,
          current_value: isSavings ? (product as any)?.interest_rate || 0 : (product as any)?.interest_rate_min || 0,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Alert created',
        description: 'You will be notified when the rate changes.',
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

  if (productLoading) {
    return (
      <div className="container mx-auto py-8 max-w-5xl">
        <Skeleton className="h-6 w-64 mb-6" />
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-40" />
              </div>
              <Skeleton className="h-10 w-28" />
            </div>
          </CardHeader>
        </Card>
        <div className="grid gap-6 md:grid-cols-2">
          <Card><CardContent className="p-6"><Skeleton className="h-40" /></CardContent></Card>
          <Card><CardContent className="p-6"><Skeleton className="h-40" /></CardContent></Card>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Product Not Found</h3>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to={`/${type}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {isSavings ? 'Savings' : 'Loans'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: isSavings ? 'Savings' : 'Loans', href: `/${type}` },
    { label: product.product_name },
  ];

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />

      {/* Product Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{product.product_name}</CardTitle>
              <CardDescription className="text-lg">
                Offered by{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-lg"
                  onClick={() => navigate(`/banks/${product.bank_id}`)}
                >
                  {product.banks?.name}
                </Button>
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-xl px-4 py-2">
              <TrendingUp className="h-5 w-5 mr-2" />
              {isSavings
                ? `${(product as any).interest_rate}% p.a.`
                : `${(product as any).interest_rate_min}${(product as any).interest_rate_max ? ` - ${(product as any).interest_rate_max}` : ''}%`}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Key Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Key Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSavings ? (
              <>
                {(product as any).minimum_deposit && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Minimum Deposit</span>
                    <span className="font-semibold">{formatCurrency((product as any).minimum_deposit)}</span>
                  </div>
                )}
                {(product as any).maximum_deposit && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Maximum Deposit</span>
                    <span className="font-semibold">{formatCurrency((product as any).maximum_deposit)}</span>
                  </div>
                )}
                {(product as any).tenure_min && (product as any).tenure_max && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tenure Period</span>
                    <span className="font-semibold">{(product as any).tenure_min} - {(product as any).tenure_max} months</span>
                  </div>
                )}
                {(product as any).compounding_frequency && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Compounding Frequency</span>
                    <span className="font-semibold capitalize">{(product as any).compounding_frequency}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                {(product as any).loan_type && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Loan Type</span>
                    <Badge variant="outline" className="capitalize">{(product as any).loan_type}</Badge>
                  </div>
                )}
                {(product as any).loan_amount_min && (product as any).loan_amount_max && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Loan Amount</span>
                    <span className="font-semibold">
                      {formatCurrency((product as any).loan_amount_min)} - {formatCurrency((product as any).loan_amount_max)}
                    </span>
                  </div>
                )}
                {(product as any).tenure_min && (product as any).tenure_max && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tenure Period</span>
                    <span className="font-semibold">{(product as any).tenure_min} - {(product as any).tenure_max} months</span>
                  </div>
                )}
                {(product as any).processing_fee && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span className="font-semibold">{formatPercentage((product as any).processing_fee)}</span>
                  </div>
                )}
                {(product as any).processing_time && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Processing Time</span>
                    <span className="font-semibold">{(product as any).processing_time}</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Fees (for Savings) */}
        {isSavings && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="h-5 w-5 mr-2" />
                Fees & Charges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(product as any).account_opening_fee !== null && (product as any).account_opening_fee !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Account Opening Fee</span>
                  <span className="font-semibold">{formatCurrency((product as any).account_opening_fee)}</span>
                </div>
              )}
              {(product as any).maintenance_fee !== null && (product as any).maintenance_fee !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Monthly Maintenance</span>
                  <span className="font-semibold">{formatCurrency((product as any).maintenance_fee)}</span>
                </div>
              )}
              {(product as any).withdrawal_fee !== null && (product as any).withdrawal_fee !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Withdrawal Fee</span>
                  <span className="font-semibold">{formatCurrency((product as any).withdrawal_fee)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Bank Info */}
        {product.banks && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Bank Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bank Name</span>
                <span className="font-semibold">{product.banks.name}</span>
              </div>
              {product.banks.rating && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-semibold">{product.banks.rating}/5.0</span>
                </div>
              )}
              {product.banks.total_branches && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Branches</span>
                  <span className="font-semibold">{product.banks.total_branches}</span>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/banks/${product.bank_id}`)}
              >
                View Bank Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Features & Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 md:grid-cols-2">
              {product.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Eligibility */}
      {product.eligibility && product.eligibility.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Eligibility Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {product.eligibility.map((criterion: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Required Documents (for Loans) */}
      {!isSavings && (product as any).required_documents && (product as any).required_documents.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 md:grid-cols-2">
              {(product as any).required_documents.map((doc: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0 mt-1" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <Card className="mt-6 bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Interested in this product?</h3>
              <p className="text-muted-foreground">
                Visit the bank's website or contact them directly to apply
              </p>
            </div>
            {product.banks?.website && (
              <Button size="lg" asChild>
                <a href={product.banks.website} target="_blank" rel="noopener noreferrer">
                  Apply Now
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rate Alerts Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Rate Alerts</h2>
        <AlertForm
          alertType="product"
          targetId={id!}
          targetName={`${product.product_name} - ${product.banks?.name}`}
          currentRate={isSavings ? (product as any).interest_rate : (product as any).interest_rate_min}
          onSubmit={(alert) => createAlertMutation.mutate(alert)}
          isSubmitting={createAlertMutation.isPending}
        />
      </div>

      {/* Reviews Section */}
      <div className="mt-12 space-y-8">
        <h2 className="text-3xl font-bold">Reviews & Ratings</h2>
        
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
            <h3 className="text-xl font-semibold mb-4">User Reviews</h3>
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
