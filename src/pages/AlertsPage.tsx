import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Mail, 
  Smartphone,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Plus,
  X
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'rate_change' | 'new_product' | 'promotion' | 'deadline';
  title: string;
  description: string;
  isActive: boolean;
  threshold?: number;
  productType?: 'savings' | 'loan';
  notificationMethod: 'email' | 'sms' | 'both';
  createdAt: Date;
}

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'rate_change',
      title: 'Savings Rate Alert',
      description: 'Notify when savings rates go above 7%',
      isActive: true,
      threshold: 7,
      productType: 'savings',
      notificationMethod: 'email',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      type: 'new_product',
      title: 'New Loan Products',
      description: 'Alert for new personal loan launches',
      isActive: true,
      productType: 'loan',
      notificationMethod: 'both',
      createdAt: new Date('2024-01-10')
    },
    {
      id: '3',
      type: 'promotion',
      title: 'Special Offers',
      description: 'Limited time promotions and offers',
      isActive: false,
      notificationMethod: 'sms',
      createdAt: new Date('2024-01-05')
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    type: 'rate_change' as const,
    title: '',
    description: '',
    threshold: '',
    productType: 'savings' as const,
    notificationMethod: 'email' as const
  });

  const [recentNotifications] = useState([
    {
      id: '1',
      type: 'rate_change',
      title: 'Dutch-Bangla Bank Rate Increase',
      message: 'Savings rate increased to 6.8% - matching your alert criteria',
      timestamp: new Date('2024-01-20T10:30:00'),
      isRead: false
    },
    {
      id: '2',
      type: 'new_product',
      title: 'New Home Loan at BRAC Bank',
      message: 'BRAC Bank launched new home loan with competitive rates starting from 9.5%',
      timestamp: new Date('2024-01-19T14:15:00'),
      isRead: true
    },
    {
      id: '3',
      type: 'promotion',
      title: 'Limited Time Offer',
      message: 'Islami Bank offering 0.5% bonus rate for new savings accounts this month',
      timestamp: new Date('2024-01-18T09:00:00'),
      isRead: true
    }
  ]);

  const toggleAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, isActive: !alert.isActive }
        : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const addAlert = () => {
    if (newAlert.title && newAlert.description) {
      const alert: Alert = {
        id: Date.now().toString(),
        type: newAlert.type,
        title: newAlert.title,
        description: newAlert.description,
        isActive: true,
        threshold: newAlert.threshold ? parseFloat(newAlert.threshold) : undefined,
        productType: newAlert.productType,
        notificationMethod: newAlert.notificationMethod,
        createdAt: new Date()
      };
      
      setAlerts([...alerts, alert]);
      setNewAlert({
        type: 'rate_change',
        title: '',
        description: '',
        threshold: '',
        productType: 'savings',
        notificationMethod: 'email'
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rate_change':
        return TrendingUp;
      case 'new_product':
        return Plus;
      case 'promotion':
        return AlertCircle;
      case 'deadline':
        return Bell;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rate_change':
        return 'text-blue-500';
      case 'new_product':
        return 'text-green-500';
      case 'promotion':
        return 'text-orange-500';
      case 'deadline':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Alerts & Notifications</h1>
        <p className="text-xl text-muted-foreground">
          Stay updated with the latest banking rates, new products, and special offers
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Alert Management */}
        <div className="lg:col-span-2 space-y-8">
          {/* Create New Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Create New Alert
              </CardTitle>
              <CardDescription>
                Set up custom alerts for rates, products, and promotions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Alert Type</Label>
                  <Select value={newAlert.type} onValueChange={(value: any) => setNewAlert({...newAlert, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rate_change">Rate Change</SelectItem>
                      <SelectItem value="new_product">New Product</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Product Type</Label>
                  <Select value={newAlert.productType} onValueChange={(value: any) => setNewAlert({...newAlert, productType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="loan">Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alert-title">Alert Title</Label>
                <Input
                  id="alert-title"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                  placeholder="Enter alert title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alert-description">Description</Label>
                <Input
                  id="alert-description"
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                  placeholder="Describe what you want to be alerted about"
                />
              </div>
              
              {newAlert.type === 'rate_change' && (
                <div className="space-y-2">
                  <Label htmlFor="threshold">Rate Threshold (%)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    step="0.1"
                    value={newAlert.threshold}
                    onChange={(e) => setNewAlert({...newAlert, threshold: e.target.value})}
                    placeholder="e.g., 7.5"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Notification Method</Label>
                <Select value={newAlert.notificationMethod} onValueChange={(value: any) => setNewAlert({...newAlert, notificationMethod: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Only</SelectItem>
                    <SelectItem value="sms">SMS Only</SelectItem>
                    <SelectItem value="both">Email & SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={addAlert} className="w-full">
                Create Alert
              </Button>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>My Alerts ({alerts.length})</CardTitle>
              <CardDescription>
                Manage your active alert preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => {
                  const TypeIcon = getTypeIcon(alert.type);
                  return (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <TypeIcon className={`h-5 w-5 mt-0.5 ${getTypeColor(alert.type)}`} />
                          <div className="flex-1">
                            <h4 className="font-semibold">{alert.title}</h4>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="secondary" className="capitalize">
                                {alert.type.replace('_', ' ')}
                              </Badge>
                              {alert.productType && (
                                <Badge variant="outline" className="capitalize">
                                  {alert.productType}
                                </Badge>
                              )}
                              {alert.threshold && (
                                <Badge variant="outline">
                                  {alert.threshold}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={alert.isActive}
                            onCheckedChange={() => toggleAlert(alert.id)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {alerts.length === 0 && (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No alerts created yet. Create your first alert above.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications & Settings */}
        <div className="space-y-8">
          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotifications.map((notification) => {
                  const TypeIcon = getTypeIcon(notification.type);
                  return (
                    <div key={notification.id} className={`border-l-4 pl-4 py-2 ${notification.isRead ? 'border-gray-200' : 'border-primary'}`}>
                      <div className="flex items-start space-x-2">
                        <TypeIcon className={`h-4 w-4 mt-0.5 ${getTypeColor(notification.type)}`} />
                        <div className="flex-1">
                          <h5 className={`text-sm font-medium ${!notification.isRead ? 'text-primary' : ''}`}>
                            {notification.title}
                          </h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.timestamp.toLocaleDateString()} at{' '}
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <Label>Email Notifications</Label>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <Label>SMS Notifications</Label>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  defaultValue="user@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+880 1XXXXXXXXX"
                  defaultValue="+880 1712345678"
                />
              </div>
              
              <Button className="w-full">
                Update Settings
              </Button>
            </CardContent>
          </Card>

          {/* Alert Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Alerts</span>
                  <span className="font-semibold">{alerts.filter(a => a.isActive).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Notifications</span>
                  <span className="font-semibold">{recentNotifications.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Unread</span>
                  <span className="font-semibold">{recentNotifications.filter(n => !n.isRead).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;