import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff, Search, Eye, Trash2, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface Alert {
  id: string;
  user_id: string;
  target_id: string;
  target_name: string;
  alert_type: string;
  condition_type: string;
  threshold_value: number | null;
  current_value: number;
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
}

interface Notification {
  id: string;
  user_id: string;
  alert_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface AlertStats {
  totalAlerts: number;
  activeAlerts: number;
  triggeredAlerts: number;
  savingsAlerts: number;
  loanAlerts: number;
  unreadNotifications: number;
}

export default function AdminAlertsTab() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<AlertStats>({
    totalAlerts: 0,
    activeAlerts: 0,
    triggeredAlerts: 0,
    savingsAlerts: 0,
    loanAlerts: 0,
    unreadNotifications: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'alerts' | 'notifications'>('alerts');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [alertsRes, notificationsRes] = await Promise.all([
        supabase.from('alerts').select('*').order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }),
      ]);

      const alertsData = alertsRes.data || [];
      const notificationsData = notificationsRes.data || [];

      setAlerts(alertsData);
      setNotifications(notificationsData);

      // Calculate stats
      setStats({
        totalAlerts: alertsData.length,
        activeAlerts: alertsData.filter(a => a.is_active).length,
        triggeredAlerts: alertsData.filter(a => a.last_triggered_at).length,
        savingsAlerts: alertsData.filter(a => a.alert_type === 'savings').length,
        loanAlerts: alertsData.filter(a => a.alert_type === 'loan').length,
        unreadNotifications: notificationsData.filter(n => !n.is_read).length,
      });
    } catch (error) {
      console.error('Error fetching alerts data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch alerts data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'above':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'below':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'above':
        return 'Rate Above';
      case 'below':
        return 'Rate Below';
      case 'any_change':
        return 'Any Change';
      default:
        return condition;
    }
  };

  const filteredAlerts = alerts.filter(
    a => a.target_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         a.alert_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotifications = notifications.filter(
    n => n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         n.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h2 className="text-2xl font-semibold mb-2">Alert Management</h2>
        <p className="text-muted-foreground">Monitor all user alerts and notifications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAlerts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeAlerts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Triggered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.triggeredAlerts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savingsAlerts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.loanAlerts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.unreadNotifications}</div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeView === 'alerts' ? 'default' : 'outline'}
          onClick={() => setActiveView('alerts')}
        >
          <Bell className="h-4 w-4 mr-2" />
          Alerts ({alerts.length})
        </Button>
        <Button
          variant={activeView === 'notifications' ? 'default' : 'outline'}
          onClick={() => setActiveView('notifications')}
        >
          <Bell className="h-4 w-4 mr-2" />
          Notifications ({notifications.length})
          {stats.unreadNotifications > 0 && (
            <Badge variant="destructive" className="ml-2">
              {stats.unreadNotifications}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${activeView}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-sm"
        />
      </div>

      {/* Alerts Table */}
      {activeView === 'alerts' && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Target</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Triggered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.target_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{alert.alert_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getConditionIcon(alert.condition_type)}
                        <span>{getConditionLabel(alert.condition_type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {alert.threshold_value ? `${alert.threshold_value}%` : '-'}
                    </TableCell>
                    <TableCell>{alert.current_value}%</TableCell>
                    <TableCell>
                      {alert.is_active ? (
                        <Badge className="bg-green-500">
                          <Bell className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <BellOff className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {alert.last_triggered_at
                        ? format(new Date(alert.last_triggered_at), 'MMM d, yyyy')
                        : 'Never'}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAlerts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No alerts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Notifications Table */}
      {activeView === 'notifications' && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell className="font-medium">{notification.title}</TableCell>
                    <TableCell className="max-w-md truncate">{notification.message}</TableCell>
                    <TableCell>
                      {notification.is_read ? (
                        <Badge variant="secondary">Read</Badge>
                      ) : (
                        <Badge variant="default">Unread</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(notification.created_at), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredNotifications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No notifications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
