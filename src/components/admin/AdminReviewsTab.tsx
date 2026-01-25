import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Star, Trash2, Search, Eye, MessageSquare, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface ProductReview {
  id: string;
  product_id: string;
  product_type: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface BankReview {
  id: string;
  bank_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewStats {
  totalProductReviews: number;
  totalBankReviews: number;
  avgProductRating: number;
  avgBankRating: number;
  recentReviews: number;
}

export default function AdminReviewsTab() {
  const { toast } = useToast();
  const [productReviews, setProductReviews] = useState<ProductReview[]>([]);
  const [bankReviews, setBankReviews] = useState<BankReview[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalProductReviews: 0,
    totalBankReviews: 0,
    avgProductRating: 0,
    avgBankRating: 0,
    recentReviews: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingReview, setViewingReview] = useState<ProductReview | BankReview | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'product' | 'bank'; id: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'product' | 'bank'>('product');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const [productRes, bankRes] = await Promise.all([
        supabase.from('product_reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('bank_reviews').select('*').order('created_at', { ascending: false }),
      ]);

      const productData = productRes.data || [];
      const bankData = bankRes.data || [];

      setProductReviews(productData);
      setBankReviews(bankData);

      // Calculate stats
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const avgProductRating = productData.length > 0
        ? productData.reduce((sum, r) => sum + r.rating, 0) / productData.length
        : 0;
      const avgBankRating = bankData.length > 0
        ? bankData.reduce((sum, r) => sum + r.rating, 0) / bankData.length
        : 0;

      const recentReviews = [...productData, ...bankData].filter(
        r => new Date(r.created_at) > sevenDaysAgo
      ).length;

      setStats({
        totalProductReviews: productData.length,
        totalBankReviews: bankData.length,
        avgProductRating,
        avgBankRating,
        recentReviews,
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (type: 'product' | 'bank', id: string) => {
    try {
      const table = type === 'product' ? 'product_reviews' : 'bank_reviews';
      const { error } = await supabase.from(table).delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Review deleted',
        description: 'The review has been removed.',
      });

      fetchReviews();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review.',
        variant: 'destructive',
      });
    }
  };

  const filteredProductReviews = productReviews.filter(
    r => r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
         r.product_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBankReviews = bankReviews.filter(
    r => r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
         r.bank_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Review Management</h2>
        <p className="text-muted-foreground">Monitor and moderate user reviews</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Product Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProductReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bank Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBankReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Product Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProductRating.toFixed(1)}/5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Bank Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgBankRating.toFixed(1)}/5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">+{stats.recentReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Review Type Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === 'product' ? 'default' : 'outline'}
          onClick={() => setActiveTab('product')}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Product Reviews ({productReviews.length})
        </Button>
        <Button
          variant={activeTab === 'bank' ? 'default' : 'outline'}
          onClick={() => setActiveTab('bank')}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Bank Reviews ({bankReviews.length})
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      {/* Reviews Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{activeTab === 'product' ? 'Product' : 'Bank'}</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(activeTab === 'product' ? filteredProductReviews : filteredBankReviews).map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">
                    {'product_id' in review ? review.product_id : review.bank_id}
                    {'product_type' in review && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {(review as ProductReview).product_type}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{renderStars(review.rating)}</TableCell>
                  <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(review.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingReview(review)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirm({ type: activeTab, id: review.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(activeTab === 'product' ? filteredProductReviews : filteredBankReviews).length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No reviews found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Review Dialog */}
      <Dialog open={!!viewingReview} onOpenChange={() => setViewingReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {viewingReview && (
            <div className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">
                  {'product_id' in viewingReview ? 'Product' : 'Bank'}:
                </span>
                <p className="font-medium">
                  {'product_id' in viewingReview ? viewingReview.product_id : viewingReview.bank_id}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Rating:</span>
                <div className="mt-1">{renderStars(viewingReview.rating)}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Comment:</span>
                <p className="mt-1 p-3 bg-muted rounded-lg">{viewingReview.comment}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Date:</span>
                <p>{format(new Date(viewingReview.created_at), 'MMMM d, yyyy h:mm a')}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">User ID:</span>
                <p className="font-mono text-xs">{viewingReview.user_id}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingReview(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Review
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDeleteReview(deleteConfirm.type, deleteConfirm.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
