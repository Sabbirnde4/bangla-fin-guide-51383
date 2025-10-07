import { Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertList } from '@/components/alerts/AlertList';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AlertsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['alerts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('alerts' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as any[];
    },
    enabled: !!user,
  });

  const toggleAlertMutation = useMutation({
    mutationFn: async ({ alertId, isActive }: { alertId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('alerts' as any)
        .update({ is_active: isActive })
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast({
        title: 'Alert updated',
        description: 'Your alert has been updated.',
      });
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('alerts' as any)
        .delete()
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast({
        title: 'Alert deleted',
        description: 'Your alert has been removed.',
      });
    },
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notifications' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sign in Required</h3>
            <p className="text-muted-foreground mb-4">
              Sign in to manage your rate alerts
            </p>
            <Button onClick={() => navigate('/auth')}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rate Alerts</h1>
        <p className="text-muted-foreground">
          Manage your interest rate alerts and notifications
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                Monitor interest rate changes on your selected products and banks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading alerts...
                </div>
              ) : (
                <AlertList
                  alerts={alerts}
                  onToggle={(alertId, isActive) => 
                    toggleAlertMutation.mutate({ alertId, isActive })
                  }
                  onDelete={(alertId) => deleteAlertMutation.mutate(alertId)}
                  isLoading={toggleAlertMutation.isPending || deleteAlertMutation.isPending}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No new notifications
                </p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification: any) => (
                    <div
                      key={notification.id}
                      className="p-3 rounded-lg bg-muted/50 space-y-1"
                    >
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How Alerts Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Set alerts on any product or bank to track interest rate changes.
              </p>
              <p>
                Choose to be notified when rates go above or below a threshold, or whenever they change.
              </p>
              <p>
                You'll receive notifications here and can manage all your alerts in one place.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
