import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  Plus, Edit, Trash2, Users, Building, CreditCard, Search, 
  TrendingUp, Activity, Shield, Database, Eye, Settings,
  UserCheck, UserX, AlertTriangle, CheckCircle
} from 'lucide-react';
import DataUpload from '@/components/admin/DataUpload';

interface Bank {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  established?: number;
  rating?: number;
  total_branches?: number;
  created_at?: string;
}

interface LoanProduct {
  id: string;
  bank_id: string;
  product_name: string;
  loan_type: string;
  interest_rate_min: number;
  interest_rate_max: number;
  loan_amount_min?: number;
  loan_amount_max?: number;
  tenure_min?: number;
  tenure_max?: number;
  processing_fee?: number;
  processing_time?: string;
  eligibility?: string[];
  required_documents?: string[];
  features?: string[];
  banks: { name: string };
  created_at?: string;
}

interface User {
  id: string;
  email: string;
  user_roles: { role: 'admin' | 'user' }[];
  profiles: { first_name?: string; last_name?: string; created_at?: string }[];
  created_at?: string;
}

interface AdminStats {
  totalBanks: number;
  totalLoanProducts: number;
  totalUsers: number;
  totalAdmins: number;
  avgInterestRate: number;
  recentSignups: number;
  totalFavorites: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function AdminPage() {
  const { userRole, loading } = useAuth();
  const { toast } = useToast();
  
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalBanks: 0,
    totalLoanProducts: 0,
    totalUsers: 0,
    totalAdmins: 0,
    avgInterestRate: 0,
    recentSignups: 0,
    totalFavorites: 0
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchData();
    }
  }, [userRole]);

  const fetchData = async () => {
    try {
      const [banksResponse, productsResponse, usersResponse, favoritesResponse] = await Promise.all([
        (supabase as any).from('banks').select('*').order('created_at', { ascending: false }),
        (supabase as any).from('loan_products').select('*, banks(name)').order('created_at', { ascending: false }),
        (supabase as any).from('profiles').select('user_id, first_name, last_name, created_at'),
        (supabase as any).from('user_favorites').select('id')
      ]);

      setBanks(banksResponse.data || []);
      setLoanProducts(productsResponse.data || []);
      
      // Get user roles separately
      const { data: rolesData } = await (supabase as any)
        .from('user_roles')
        .select('user_id, role');
      
      // Format users data
      const formattedUsers = (usersResponse.data || []).map(profile => {
        const userRoles = rolesData?.filter(role => role.user_id === profile.user_id) || [];
        return {
          id: profile.user_id,
          email: '', // Will show user ID since we can't access auth.users
          user_roles: userRoles.map(r => ({ role: r.role as 'admin' | 'user' })),
          profiles: [{ 
            first_name: profile.first_name, 
            last_name: profile.last_name,
            created_at: profile.created_at 
          }],
          created_at: profile.created_at
        };
      });
      setUsers(formattedUsers);

      // Calculate stats
      const totalBanks = banksResponse.data?.length || 0;
      const totalLoanProducts = productsResponse.data?.length || 0;
      const totalUsers = formattedUsers.length;
      const totalAdmins = formattedUsers.filter(user => 
        user.user_roles.some(role => role.role === 'admin')
      ).length;
      
      const avgInterestRate = productsResponse.data?.length > 0 
        ? productsResponse.data.reduce((sum, product) => sum + ((product.interest_rate_min + product.interest_rate_max) / 2), 0) / productsResponse.data.length
        : 0;

      // Recent signups (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentSignups = formattedUsers.filter(user => 
        user.created_at && new Date(user.created_at) > sevenDaysAgo
      ).length;

      setStats({
        totalBanks,
        totalLoanProducts,
        totalUsers,
        totalAdmins,
        avgInterestRate,
        recentSignups,
        totalFavorites: favoritesResponse.data?.length || 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data.",
        variant: "destructive",
      });
    }
  };

  const handleSaveBank = async (bankData: Partial<Bank>) => {
    try {
      if (editingItem) {
        const { error } = await (supabase as any)
          .from('banks')
          .update(bankData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from('banks')
          .insert([bankData]);
        if (error) throw error;
      }
      
      fetchData();
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({
        title: editingItem ? "Bank updated" : "Bank created",
        description: "Bank has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving bank:', error);
      toast({
        title: "Error",
        description: "Failed to save bank.",
        variant: "destructive",
      });
    }
  };

  const handleSaveLoanProduct = async (productData: Partial<LoanProduct>) => {
    try {
      if (editingItem) {
        const { error } = await (supabase as any)
          .from('loan_products')
          .update(productData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from('loan_products')
          .insert([productData]);
        if (error) throw error;
      }
      
      fetchData();
      setIsDialogOpen(false);
      setEditingItem(null);
      toast({
        title: editingItem ? "Product updated" : "Product created",
        description: "Loan product has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving loan product:', error);
      toast({
        title: "Error",
        description: "Failed to save loan product.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (table: 'banks' | 'loan_products', id: string) => {
    try {
      const { error } = await (supabase as any)
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      fetchData();
      toast({
        title: "Item deleted",
        description: "Item has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item.",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const { error } = await (supabase as any)
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      fetchData();
      setIsRoleDialogOpen(false);
      setSelectedUserForRole(null);
      toast({
        title: "Role updated",
        description: `User role has been changed to ${newRole}.`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const chartData = [
    { name: 'Banks', value: stats.totalBanks },
    { name: 'Loan Products', value: stats.totalLoanProducts },
    { name: 'Users', value: stats.totalUsers },
    { name: 'Favorites', value: stats.totalFavorites },
  ];

  const roleDistribution = [
    { name: 'Users', value: stats.totalUsers - stats.totalAdmins },
    { name: 'Admins', value: stats.totalAdmins },
  ];

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = loanProducts.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.banks.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    (user.profiles[0]?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.profiles[0]?.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-muted-foreground">
                This page is only available to administrators.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive management and analytics for your platform
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Administrator
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="banks" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Banks
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Banks</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBanks}</div>
                <p className="text-xs text-muted-foreground">
                  Financial institutions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loan Products</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLoanProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Available products
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.recentSignups} this week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Interest Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgInterestRate.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">
                  Across all banks
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Data Seeding System</CardTitle>
                    <CardDescription>Populate database with mock data for testing</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>40+ Banks from Bangladesh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>30+ NBFIs (Non-Bank Financial Institutions)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>10+ NGOs with microfinance programs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>100+ Savings products with detailed information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>60+ Loan products across multiple categories</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    This will add all mock data to your database. Existing records with the same IDs will be updated (upserted).
                  </p>
                </div>

                <Button 
                  onClick={async () => {
                    try {
                      toast({
                        title: "Seeding database...",
                        description: "Importing mock data. This may take a few moments.",
                      });

                      const { data, error } = await supabase.functions.invoke('populate-database', {
                        method: 'POST'
                      });

                      if (error) throw error;
                      
                      fetchData();
                      toast({
                        title: "✅ Database seeded successfully!",
                        description: `Added ${data.stats?.banks || 0} banks, ${data.stats?.nbfis || 0} NBFIs, ${data.stats?.ngos || 0} NGOs, ${data.stats?.savingsProducts || 0} savings products, and ${data.stats?.loanProducts || 0} loan products.`,
                      });
                    } catch (error) {
                      console.error('Error seeding database:', error);
                      toast({
                        title: "Error",
                        description: "Failed to seed database. Please try again.",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="w-full"
                  size="lg"
                >
                  <Database className="mr-2 h-4 w-4" />
                  Seed Database with Mock Data
                </Button>
              </CardContent>
            </Card>

            <DataUpload />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Current platform statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Roles Distribution</CardTitle>
                <CardDescription>Admin vs regular users</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {roleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Healthy</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAdmins}</div>
                <p className="text-xs text-muted-foreground">
                  Administrator accounts
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Favorites</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFavorites}</div>
                <p className="text-xs text-muted-foreground">
                  Total saved items
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Banks Tab */}
        <TabsContent value="banks" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Bank Management</h2>
              <p className="text-muted-foreground">Manage financial institutions and their details</p>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search banks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingItem(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bank
                  </Button>
                </DialogTrigger>
                <BankDialog
                  bank={editingItem}
                  onSave={handleSaveBank}
                  onClose={() => setIsDialogOpen(false)}
                />
              </Dialog>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBanks.map((bank) => (
              <Card key={bank.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{bank.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(bank);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete('banks', bank.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Established:</span>
                      <span className="font-medium">{bank.established || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-medium">{bank.rating || 0}/5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Branches:</span>
                      <span className="font-medium">{bank.total_branches || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Loan Products</h2>
              <p className="text-muted-foreground">Manage loan products and their terms</p>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingItem(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <LoanProductDialog
                  product={editingItem}
                  banks={banks}
                  onSave={handleSaveLoanProduct}
                  onClose={() => setIsDialogOpen(false)}
                />
              </Dialog>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{product.product_name}</CardTitle>
                      <CardDescription>{product.banks.name}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(product);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete('loan_products', product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium">{product.loan_type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rate:</span>
                      <p className="font-medium">{product.interest_rate_min}% - {product.interest_rate_max}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <p className="font-medium">${product.loan_amount_min} - ${product.loan_amount_max}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Term:</span>
                      <p className="font-medium">{product.tenure_min}-{product.tenure_max} months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">User Management</h2>
              <p className="text-muted-foreground">Manage user accounts and permissions</p>
            </div>
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {user.profiles[0]?.first_name && user.profiles[0]?.last_name
                          ? `${user.profiles[0].first_name} ${user.profiles[0].last_name}`
                          : 'Unknown User'}
                      </CardTitle>
                      <CardDescription className="font-mono text-xs">
                        {user.id.substring(0, 8)}...
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUserForRole(user);
                        setIsRoleDialogOpen(true);
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {user.user_roles.map((roleObj, index) => (
                        <Badge 
                          key={index} 
                          variant={roleObj.role === 'admin' ? 'default' : 'secondary'}
                          className="flex items-center gap-1"
                        >
                          {roleObj.role === 'admin' ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <Users className="h-3 w-3" />
                          )}
                          {roleObj.role}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Joined:</span>
                      <p className="font-medium">
                        {user.created_at 
                          ? new Date(user.created_at).toLocaleDateString()
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Analytics & Insights</h2>
            <p className="text-muted-foreground">Detailed analytics and trends</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Interest Rate Trends</CardTitle>
                <CardDescription>Average rates across all banks</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={banks.map(bank => ({ 
                    name: bank.name.substring(0, 10), 
                    rating: bank.rating || 0 
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rating" stroke="hsl(var(--primary))" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Types Distribution</CardTitle>
                <CardDescription>Breakdown by loan product types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(
                        loanProducts.reduce((acc, product) => {
                          acc[product.loan_type] = (acc[product.loan_type] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([type, count]) => ({ name: type, value: count }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.keys(loanProducts.reduce((acc, product) => {
                        acc[product.loan_type] = (acc[product.loan_type] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentication</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Services</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Running</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Highest Rating</span>
                    <span className="font-medium">
                      {banks.length > 0 ? Math.max(...banks.map(b => b.rating || 0)).toFixed(1) : '0'}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lowest Rating</span>
                    <span className="font-medium">
                      {banks.length > 0 ? Math.min(...banks.filter(b => b.rating).map(b => b.rating || 0)).toFixed(1) : '0'}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Branches</span>
                    <span className="font-medium">
                      {banks.reduce((sum, b) => sum + (b.total_branches || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    <span className="text-sm">System startup</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Admin login</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Data refresh</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Role Change Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUserForRole?.profiles[0]?.first_name} {selectedUserForRole?.profiles[0]?.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Current Role:</span>
              <Badge className="ml-2">
                {selectedUserForRole?.user_roles[0]?.role || 'user'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedUserForRole?.user_roles[0]?.role === 'user' ? 'default' : 'outline'}
                onClick={() => {
                  if (selectedUserForRole) {
                    handleRoleChange(selectedUserForRole.id, 'user');
                  }
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                User
              </Button>
              <Button
                variant={selectedUserForRole?.user_roles[0]?.role === 'admin' ? 'default' : 'outline'}
                onClick={() => {
                  if (selectedUserForRole) {
                    handleRoleChange(selectedUserForRole.id, 'admin');
                  }
                }}
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BankDialog({ bank, onSave, onClose }: { bank?: Bank; onSave: (data: Partial<Bank>) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    id: bank?.id || '',
    name: bank?.name || '',
    logo: bank?.logo || '',
    website: bank?.website || '',
    established: bank?.established || new Date().getFullYear(),
    rating: bank?.rating || 0,
    total_branches: bank?.total_branches || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{bank ? 'Edit Bank' : 'Add New Bank'}</DialogTitle>
        <DialogDescription>
          {bank ? 'Update bank information' : 'Create a new bank entry'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!bank && (
          <div>
            <Label htmlFor="id">Bank ID *</Label>
            <Input
              id="id"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="e.g., city-bank"
              required
            />
          </div>
        )}
        <div>
          <Label htmlFor="name">Bank Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="established">Established</Label>
            <Input
              id="established"
              type="number"
              value={formData.established}
              onChange={(e) => setFormData({ ...formData, established: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="rating">Rating</Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="total_branches">Total Branches</Label>
          <Input
            id="total_branches"
            type="number"
            value={formData.total_branches}
            onChange={(e) => setFormData({ ...formData, total_branches: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="website">Website URL</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {bank ? 'Update Bank' : 'Create Bank'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function LoanProductDialog({ 
  product, 
  banks, 
  onSave, 
  onClose 
}: { 
  product?: LoanProduct; 
  banks: Bank[];
  onSave: (data: Partial<LoanProduct>) => void; 
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    bank_id: product?.bank_id || '',
    product_name: product?.product_name || '',
    loan_type: product?.loan_type || '',
    interest_rate_min: product?.interest_rate_min || 0,
    interest_rate_max: product?.interest_rate_max || 0,
    loan_amount_min: product?.loan_amount_min || 0,
    loan_amount_max: product?.loan_amount_max || 0,
    tenure_min: product?.tenure_min || 0,
    tenure_max: product?.tenure_max || 0,
    processing_fee: product?.processing_fee || 0,
    processing_time: product?.processing_time || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{product ? 'Edit Loan Product' : 'Add New Loan Product'}</DialogTitle>
        <DialogDescription>
          {product ? 'Update loan product information' : 'Create a new loan product'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="bank_id">Bank *</Label>
          <Select value={formData.bank_id} onValueChange={(value) => setFormData({ ...formData, bank_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a bank" />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank.id} value={bank.id}>
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="product_name">Product Name *</Label>
          <Input
            id="product_name"
            value={formData.product_name}
            onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="loan_type">Type *</Label>
            <Select value={formData.loan_type} onValueChange={(value) => setFormData({ ...formData, loan_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal Loan</SelectItem>
                <SelectItem value="home">Home Loan</SelectItem>
                <SelectItem value="car">Car Loan</SelectItem>
                <SelectItem value="business">Business Loan</SelectItem>
                <SelectItem value="student">Student Loan</SelectItem>
                <SelectItem value="startup">Startup Loan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="processing_fee">Processing Fee ($)</Label>
            <Input
              id="processing_fee"
              type="number"
              step="0.01"
              value={formData.processing_fee}
              onChange={(e) => setFormData({ ...formData, processing_fee: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="interest_rate_min">Min Interest Rate (%) *</Label>
            <Input
              id="interest_rate_min"
              type="number"
              step="0.01"
              value={formData.interest_rate_min}
              onChange={(e) => setFormData({ ...formData, interest_rate_min: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div>
            <Label htmlFor="interest_rate_max">Max Interest Rate (%) *</Label>
            <Input
              id="interest_rate_max"
              type="number"
              step="0.01"
              value={formData.interest_rate_max}
              onChange={(e) => setFormData({ ...formData, interest_rate_max: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="loan_amount_min">Min Amount ($)</Label>
            <Input
              id="loan_amount_min"
              type="number"
              value={formData.loan_amount_min}
              onChange={(e) => setFormData({ ...formData, loan_amount_min: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="loan_amount_max">Max Amount ($)</Label>
            <Input
              id="loan_amount_max"
              type="number"
              value={formData.loan_amount_max}
              onChange={(e) => setFormData({ ...formData, loan_amount_max: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tenure_min">Min Term (Months)</Label>
            <Input
              id="tenure_min"
              type="number"
              value={formData.tenure_min}
              onChange={(e) => setFormData({ ...formData, tenure_min: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="tenure_max">Max Term (Months)</Label>
            <Input
              id="tenure_max"
              type="number"
              value={formData.tenure_max}
              onChange={(e) => setFormData({ ...formData, tenure_max: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="processing_time">Processing Time</Label>
          <Input
            id="processing_time"
            value={formData.processing_time}
            onChange={(e) => setFormData({ ...formData, processing_time: e.target.value })}
            placeholder="e.g., 2-3 days"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}