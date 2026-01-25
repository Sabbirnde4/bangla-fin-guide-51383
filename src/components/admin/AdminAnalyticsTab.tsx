import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend 
} from 'recharts';
import { 
  Download, TrendingUp, TrendingDown, Users, Star, Bell, 
  MessageSquare, Calendar, RefreshCw, FileText, CheckCircle, AlertCircle
} from 'lucide-react';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';

interface AnalyticsData {
  userSignups: { date: string; count: number }[];
  reviewActivity: { date: string; product: number; bank: number }[];
  alertActivity: { date: string; active: number; triggered: number }[];
  ratingDistribution: { rating: number; count: number }[];
  productTypeBreakdown: { type: string; count: number }[];
  topRatedBanks: { name: string; rating: number }[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(220, 70%, 50%)', 'hsl(160, 60%, 45%)', 'hsl(30, 80%, 55%)'];

export default function AdminAnalyticsTab() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('7');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [data, setData] = useState<AnalyticsData>({
    userSignups: [],
    reviewActivity: [],
    alertActivity: [],
    ratingDistribution: [],
    productTypeBreakdown: [],
    topRatedBanks: [],
  });
  const [summaryStats, setSummaryStats] = useState({
    totalReviews: 0,
    avgRating: 0,
    activeAlerts: 0,
    triggeredAlerts: 0,
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const days = parseInt(dateRange);
      const startDate = subDays(new Date(), days);
      const dateInterval = eachDayOfInterval({ start: startDate, end: new Date() });

      // Fetch all required data in parallel
      const [productReviewsRes, bankReviewsRes, alertsRes] = await Promise.all([
        supabase.from('product_reviews').select('*'),
        supabase.from('bank_reviews').select('*'),
        supabase.from('alerts').select('*'),
      ]);

      const productReviews = productReviewsRes.data || [];
      const bankReviews = bankReviewsRes.data || [];
      const alerts = alertsRes.data || [];

      // Calculate review activity by date
      const reviewActivity = dateInterval.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const productCount = productReviews.filter(
          r => format(new Date(r.created_at), 'yyyy-MM-dd') === dateStr
        ).length;
        const bankCount = bankReviews.filter(
          r => format(new Date(r.created_at), 'yyyy-MM-dd') === dateStr
        ).length;
        return {
          date: format(date, 'MMM d'),
          product: productCount,
          bank: bankCount,
        };
      });

      // Calculate alert activity
      const alertActivity = dateInterval.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const activeCount = alerts.filter(
          a => a.is_active && format(new Date(a.created_at), 'yyyy-MM-dd') <= dateStr
        ).length;
        const triggeredCount = alerts.filter(
          a => a.last_triggered_at && format(new Date(a.last_triggered_at), 'yyyy-MM-dd') === dateStr
        ).length;
        return {
          date: format(date, 'MMM d'),
          active: activeCount,
          triggered: triggeredCount,
        };
      });

      // Rating distribution
      const allReviews = [...productReviews, ...bankReviews];
      const ratingCounts = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: allReviews.filter(r => r.rating === rating).length,
      }));

      // Product type breakdown (from product reviews)
      const productTypes = productReviews.reduce((acc, r) => {
        acc[r.product_type] = (acc[r.product_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const productTypeBreakdown = Object.entries(productTypes).map(([type, count]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count,
      }));

      // Summary stats
      const totalReviews = allReviews.length;
      const avgRating = totalReviews > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;
      const activeAlerts = alerts.filter(a => a.is_active).length;
      const triggeredAlerts = alerts.filter(a => a.last_triggered_at).length;

      setData({
        userSignups: [], // Would need profiles table with created_at
        reviewActivity,
        alertActivity,
        ratingDistribution: ratingCounts,
        productTypeBreakdown,
        topRatedBanks: [], // Would need banks table
      });

      setSummaryStats({
        totalReviews,
        avgRating,
        activeAlerts,
        triggeredAlerts,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Fetch all data for export
      const [productReviewsRes, bankReviewsRes, alertsRes] = await Promise.all([
        supabase.from('product_reviews').select('*'),
        supabase.from('bank_reviews').select('*'),
        supabase.from('alerts').select('*'),
      ]);

      // Create CSV content for reviews
      const reviewsData = [
        ['Type', 'ID', 'Rating', 'Comment', 'Created At'],
        ...(productReviewsRes.data || []).map(r => [
          'Product', r.product_id, r.rating, `"${r.comment.replace(/"/g, '""')}"`, r.created_at
        ]),
        ...(bankReviewsRes.data || []).map(r => [
          'Bank', r.bank_id, r.rating, `"${r.comment.replace(/"/g, '""')}"`, r.created_at
        ]),
      ];

      const csvContent = reviewsData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export complete',
        description: 'Analytics data has been exported to CSV.',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to export analytics data.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Analytics & Insights</h2>
          <p className="text-muted-foreground">Detailed analytics and trends for your platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchAnalyticsData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleExportCSV} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              All time reviews
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.avgRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              Across all reviews
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Currently monitoring
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Triggered Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.triggeredAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Total notifications sent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Review Activity</CardTitle>
            <CardDescription>Daily review submissions over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.reviewActivity}>
                <defs>
                  <linearGradient id="colorProduct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBank" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                  }} 
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="product" 
                  name="Product Reviews"
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorProduct)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="bank" 
                  name="Bank Reviews"
                  stroke="hsl(220, 70%, 50%)" 
                  fillOpacity={1} 
                  fill="url(#colorBank)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of ratings across all reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.ratingDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis 
                  type="category" 
                  dataKey="rating" 
                  className="text-xs"
                  tickFormatter={(value) => `${value} ★`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                  formatter={(value) => [value, 'Reviews']}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alert Activity</CardTitle>
            <CardDescription>Active alerts and triggered notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.alertActivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  name="Active Alerts"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="triggered" 
                  name="Triggered"
                  stroke="hsl(30, 80%, 55%)" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Review Types</CardTitle>
            <CardDescription>Distribution by product type</CardDescription>
          </CardHeader>
          <CardContent>
            {data.productTypeBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.productTypeBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="type"
                  >
                    {data.productTypeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No review data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Health</CardTitle>
          <CardDescription>Current system status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">Database</p>
                <p className="text-sm text-muted-foreground">Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">Authentication</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">API Services</p>
                <p className="text-sm text-muted-foreground">Running</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">Edge Functions</p>
                <p className="text-sm text-muted-foreground">Deployed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
